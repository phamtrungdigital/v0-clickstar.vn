'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { countExpertPlaceholders } from '@/lib/ai/content-rules'

export async function bulkDeletePosts(ids: string[]): Promise<{ ok?: number; error?: string }> {
  if (!ids?.length) return { error: 'Không có bài nào được chọn' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  const { error, count } = await supabase
    .from('posts')
    .delete({ count: 'exact' })
    .in('id', ids)
  if (error) return { error: error.message }
  revalidatePath('/admin-cls/posts')
  revalidatePath('/blog')
  revalidatePath('/')
  updateTag('posts')
  return { ok: count ?? ids.length }
}

export async function bulkSetStatus(
  ids: string[],
  status: 'draft' | 'published'
): Promise<{ ok?: number; error?: string }> {
  if (!ids?.length) return { error: 'Không có bài nào được chọn' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  if (status === 'published') {
    // Cùng luật với nút Lưu: không đăng bài còn ô chuyên gia hoặc bài AI chưa có người biên tập.
    const { data: rows, error: readErr } = await supabase.from('posts').select('*').in('id', ids)
    if (readErr) return { error: readErr.message }
    const blocked = (rows ?? []).filter((r) => {
      const c = (r.content ?? {}) as { vi?: string; en?: string }
      const placeholders = countExpertPlaceholders(c.vi) + countExpertPlaceholders(c.en)
      return placeholders > 0 || (r.ai_assisted === true && !String(r.editor_name ?? '').trim())
    })
    if (blocked.length) {
      const names = blocked
        .slice(0, 3)
        .map((r) => `"${(r.title as { vi?: string } | null)?.vi || r.slug}"`)
        .join(', ')
      return {
        error: `${blocked.length} bài chưa đăng được (còn ô [[CHUYÊN GIA]] hoặc thiếu người biên tập): ${names}${blocked.length > 3 ? '…' : ''}`,
      }
    }
  }

  const { error, count } = await supabase
    .from('posts')
    .update({ status }, { count: 'exact' })
    .in('id', ids)
  if (error) return { error: error.message }

  // Ngày đăng: chỉ gán cho bài chưa từng đăng. Trước đây đăng hàng loạt ghi đè ngày của cả
  // bài đã đăng (cùng lỗi với nút Lưu) → Google thấy như bài mới.
  if (status === 'published') {
    const { error: dateErr } = await supabase
      .from('posts')
      .update({ published_at: new Date().toISOString() })
      .in('id', ids)
      .is('published_at', null)
    if (dateErr) return { error: dateErr.message }
  }

  revalidatePath('/admin-cls/posts')
  revalidatePath('/blog')
  revalidatePath('/')
  updateTag('posts')
  return { ok: count ?? ids.length }
}
