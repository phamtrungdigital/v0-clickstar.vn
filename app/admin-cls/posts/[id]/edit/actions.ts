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
 * Dữ liệu gửi lên khi lưu bài. Ba cột SEO chỉ được gửi khi người dùng có sửa khối SEO trong trình sửa bài,
 * để lần lưu không ghi đè SEO vừa sửa ở màn SEO (trình sửa bài mở từ trước giữ bản cũ).
 */
export type PostSave = Omit<PostUpdate, 'seo_title' | 'seo_description' | 'og_image'> &
  Partial<Pick<PostUpdate, 'seo_title' | 'seo_description' | 'og_image'>>

const seoPair = (v: { vi: string; en: string } | null | undefined, max: number) =>
  v ? { vi: cleanSeoText(v.vi, max), en: cleanSeoText(v.en, max) } : null

export async function savePost(id: string | 'new', input: PostSave) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  // Validate slug unique
  if (!input.slug) return { error: 'Slug không được trống' }
  if (!input.title.vi) return { error: 'Tiêu đề VI không được trống' }

  // Ngày đăng chỉ đặt khi bài chuyển sang "published" (hoặc tạo mới đã published). Bài đang published mà lưu lại
  // thì GIỮ ngày cũ, nếu không mỗi lần sửa chữ sẽ đổi ngày đăng và đẩy bài lên đầu danh sách.
  let publishedAt: string | null = null
  if (input.status === 'published') {
    publishedAt = new Date().toISOString()
    if (id !== 'new') {
      const { data: cur } = await supabase.from('posts').select('status, published_at').eq('id', id).maybeSingle()
      if (cur?.status === 'published' && cur.published_at) publishedAt = cur.published_at
    }
  }

  const payload: Record<string, unknown> = { ...input, published_at: publishedAt }
  if ('seo_title' in input) payload.seo_title = seoPair(input.seo_title, 200)
  if ('seo_description' in input) payload.seo_description = seoPair(input.seo_description, 400)
  if ('og_image' in input) {
    const og = (input.og_image ?? '').trim()
    const ogError = ogUrlError(og)
    if (ogError) return { error: ogError }
    payload.og_image = og || null
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
    updateTag('posts')
    revalidatePath(`/blog/${data.slug}`)
    revalidatePath('/admin-cls/posts')
    redirect(`/admin-cls/posts/${data.id}/edit?created=1`)
  } else {
    const { error } = await supabase.from('posts').update(payload).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/blog')
    revalidatePath('/')
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
  updateTag('posts')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin-cls/posts')
  redirect('/admin-cls/posts')
}
