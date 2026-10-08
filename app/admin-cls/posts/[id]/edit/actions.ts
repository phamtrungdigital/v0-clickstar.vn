'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { PostStatus } from '@/lib/cms/posts'
import { countExpertPlaceholders } from '@/lib/ai/content-rules'

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
  /** Nhãn AI: bài có AI hỗ trợ soạn + người biên tập, chức danh. */
  ai_assisted?: boolean
  editor_name?: string | null
  editor_title?: string | null
}

const AI_LABEL_FIELDS = ['ai_assisted', 'editor_name', 'editor_title'] as const

/** Lỗi do DB chưa có cột nhãn AI (chưa chạy migration) → lưu lại không kèm các cột đó. */
function isMissingAiColumn(message: string | undefined) {
  return !!message && AI_LABEL_FIELDS.some((f) => message.includes(f))
}

// Thiếu cột mà vẫn lưu bài AI → mất dấu "có AI hỗ trợ", lần sau mở lại có thể đăng mà
// không có nhãn. Nên chặn hẳn việc lưu bài AI cho tới khi chạy SQL thêm cột.
const AI_COLUMN_MISSING =
  'Chưa lưu được bài có AI hỗ trợ: CSDL chưa có cột nhãn AI (chờ chạy SQL thêm cột). Nội dung vẫn còn trong trình soạn, đừng tải lại trang.'

function withoutAiFields<T extends Record<string, unknown>>(payload: T) {
  const copy: Record<string, unknown> = { ...payload }
  for (const f of AI_LABEL_FIELDS) delete copy[f]
  return copy
}

/** Kiểm trước khi đăng: còn ô chuyên gia, hoặc bài AI chưa có người biên tập → không cho đăng. */
function publishBlocker(input: PostUpdate): string | null {
  const left = countExpertPlaceholders(input.content.vi) + countExpertPlaceholders(input.content.en)
  if (left > 0) {
    return `Bài còn ${left} ô [[CHUYÊN GIA: ...]] chưa điền (tính cả 2 ngôn ngữ). Điền nội dung thật hoặc xoá ô rồi mới đăng.`
  }
  if (input.ai_assisted && !input.editor_name?.trim()) {
    return 'Bài có AI hỗ trợ: cần điền "Người biên tập" ở khung Nhãn AI trước khi đăng.'
  }
  return null
}

export async function savePost(id: string | 'new', input: PostUpdate) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  // Validate slug unique
  if (!input.slug) return { error: 'Slug không được trống' }
  if (!input.title.vi) return { error: 'Tiêu đề VI không được trống' }
  if (input.status === 'published') {
    const blocker = publishBlocker(input)
    if (blocker) return { error: blocker }
  }

  // Ngày đăng: giữ ngày cũ khi lưu lại bài đã đăng. Trước đây mỗi lần lưu đều ghi
  // new Date() → 5 bài đăng 11/05 bị đổi thành 22/06, 29/06 (Google thấy như bài mới).
  // Chuyển về Draft cũng KHÔNG xoá ngày đăng (đăng lại giữ ngày gốc).
  let publishedAt: string | null | undefined = undefined
  if (input.status === 'published') {
    if (id !== 'new') {
      const { data: current } = await supabase
        .from('posts')
        .select('published_at')
        .eq('id', id)
        .maybeSingle()
      publishedAt = current?.published_at ?? null
    }
    publishedAt = publishedAt ?? new Date().toISOString()
  }

  const payload: Record<string, unknown> = {
    ...input,
    editor_name: input.editor_name?.trim() || null,
    editor_title: input.editor_title?.trim() || null,
  }
  if (publishedAt !== undefined) payload.published_at = publishedAt
  if (input.ai_assisted === undefined) {
    for (const f of AI_LABEL_FIELDS) delete payload[f]
  }

  if (id === 'new') {
    let res = await supabase
      .from('posts')
      .insert({ ...payload, author_id: user.id })
      .select('id, slug')
      .single()
    if (res.error && isMissingAiColumn(res.error.message)) {
      if (input.ai_assisted) return { error: AI_COLUMN_MISSING }
      res = await supabase
        .from('posts')
        .insert({ ...withoutAiFields(payload), author_id: user.id })
        .select('id, slug')
        .single()
    }
    if (res.error) return { error: res.error.message }
    revalidatePath('/blog')
    revalidatePath(`/blog/${res.data.slug}`)
    revalidatePath('/admin-cls/posts')
    redirect(`/admin-cls/posts/${res.data.id}/edit?created=1`)
  } else {
    let { error } = await supabase.from('posts').update(payload).eq('id', id)
    let warning: string | undefined
    if (error && isMissingAiColumn(error.message)) {
      if (input.ai_assisted) return { error: AI_COLUMN_MISSING }
      ;({ error } = await supabase.from('posts').update(withoutAiFields(payload)).eq('id', id))
      warning = 'Đã lưu bài, nhưng nhãn AI chưa lưu được vì CSDL chưa có cột nhãn AI (chờ chạy SQL).'
    }
    if (error) return { error: error.message }
    revalidatePath('/blog')
    revalidatePath(`/blog/${input.slug}`)
    revalidatePath('/admin-cls/posts')
    revalidatePath(`/admin-cls/posts/${id}/edit`)
    return { ok: true, warning }
  }
}

export async function deletePost(id: string, slug: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin-cls/posts')
  redirect('/admin-cls/posts')
}
