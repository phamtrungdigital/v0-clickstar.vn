'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Post, PostStatus } from '@/lib/cms/posts'
import { cleanSeoText, ogUrlError } from '@/lib/seo/admin-seo'

export type PostUpdate = {
  slug: string
  title: { vi: string; en: string }
  excerpt: { vi: string; en: string }
  content: { vi: string; en: string }
  cover_image: string | null
  tags: string[]
  status: PostStatus
  seo_title: { vi: string; en: string } | null
  seo_description: { vi: string; en: string } | null
  og_image: string | null
}

/**
 * Phần SEO người dùng đã SỬA trong trình sửa bài (chỉ các ô khác với lúc mở bài). Máy chủ gộp từng ô vào giá trị
 * hiện tại trong DB, nên sửa bài không ghi đè SEO vừa sửa ở màn SEO cho những ô người dùng không đụng tới.
 */
export type SeoPatch = {
  title_vi?: string
  title_en?: string
  desc_vi?: string
  desc_en?: string
  og?: string
}

/** Dữ liệu gửi lên khi lưu bài (SEO đi riêng qua `seo_patch`, xem SeoPatch). */
export type PostSave = Omit<PostUpdate, 'seo_title' | 'seo_description' | 'og_image'> & { seo_patch?: SeoPatch }

type I18nCol = { vi?: string; en?: string }
type CurrentRow = {
  status: string | null
  published_at: string | null
  seo_title: I18nCol | null
  seo_description: I18nCol | null
}

export async function savePost(id: string | 'new', input: PostSave) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  // Validate slug unique
  if (!input.slug) return { error: 'Slug không được trống' }
  if (!input.title.vi) return { error: 'Tiêu đề VI không được trống' }

  // Đọc bản hiện tại một lần (khi sửa bài có sẵn) để giữ ngày đăng và gộp phần SEO.
  let current = null as CurrentRow | null
  if (id !== 'new') {
    const { data, error: readError } = await supabase
      .from('posts')
      .select('status, published_at, seo_title, seo_description')
      .eq('id', id)
      .maybeSingle()
    if (readError) return { error: readError.message }
    if (!data) return { error: 'Không tìm thấy bài viết.' }
    current = data as CurrentRow
  }

  // Ngày đăng chỉ đặt khi bài chuyển sang "published" (hoặc tạo mới đã published). Bài đang published mà lưu lại
  // thì GIỮ ngày cũ, nếu không mỗi lần sửa chữ sẽ đổi ngày đăng và đẩy bài lên đầu danh sách.
  let publishedAt: string | null = null
  if (input.status === 'published') {
    publishedAt = current?.status === 'published' && current.published_at ? current.published_at : new Date().toISOString()
  }

  // Chỉ nhận đúng các cột nội dung (không chuyển nguyên object từ trình duyệt vào DB).
  const payload: Record<string, unknown> = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    cover_image: input.cover_image,
    tags: input.tags,
    status: input.status,
    published_at: publishedAt,
  }

  const patch = input.seo_patch
  if (patch) {
    const title: I18nCol = { ...(current?.seo_title ?? { vi: '', en: '' }) }
    const desc: I18nCol = { ...(current?.seo_description ?? { vi: '', en: '' }) }
    if (typeof patch.title_vi === 'string') title.vi = cleanSeoText(patch.title_vi, 200)
    if (typeof patch.title_en === 'string') title.en = cleanSeoText(patch.title_en, 200)
    if (typeof patch.desc_vi === 'string') desc.vi = cleanSeoText(patch.desc_vi, 400)
    if (typeof patch.desc_en === 'string') desc.en = cleanSeoText(patch.desc_en, 400)
    if ('title_vi' in patch || 'title_en' in patch) payload.seo_title = title
    if ('desc_vi' in patch || 'desc_en' in patch) payload.seo_description = desc
    if (typeof patch.og === 'string') {
      const og = patch.og.trim()
      const ogError = ogUrlError(og)
      if (ogError) return { error: ogError }
      payload.og_image = og || null
    }
  }

  if (id === 'new') {
    const { data, error } = await supabase
      .from('posts')
      .insert({ ...payload, author_id: user.id })
      .select('id, slug')
      .single()
    if (error) return { error: error.message }
    revalidatePath('/blog')
    revalidatePath('/')
    revalidatePath('/en')
    updateTag('posts')
    revalidatePath(`/blog/${data.slug}`)
    revalidatePath('/admin-cls/posts')
    redirect(`/admin-cls/posts/${data.id}/edit?created=1`)
  } else {
    const { error } = await supabase.from('posts').update(payload).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/blog')
    revalidatePath('/')
    revalidatePath('/en')
    updateTag('posts')
    revalidatePath(`/blog/${input.slug}`)
    revalidatePath('/admin-cls/posts')
    revalidatePath(`/admin-cls/posts/${id}/edit`)
    return { ok: true }
  }
}

export async function deletePost(id: string, slug: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath('/')
  revalidatePath('/en')
  updateTag('posts')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin-cls/posts')
  redirect('/admin-cls/posts')
}
