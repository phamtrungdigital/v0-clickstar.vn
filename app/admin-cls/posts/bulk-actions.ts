'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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

  // Đăng hàng loạt chỉ đặt ngày đăng cho bài CHƯA đăng (hoặc đã đăng nhưng thiếu ngày); bài đang đăng giữ ngày cũ.
  const query =
    status === 'published'
      ? supabase
          .from('posts')
          .update({ status, published_at: new Date().toISOString() }, { count: 'exact' })
          .in('id', ids)
          .or('status.neq.published,published_at.is.null')
      : supabase.from('posts').update({ status }, { count: 'exact' }).in('id', ids)
  const { error, count: changed } = await query
  if (error) return { error: error.message }
  // Số bài báo lại cho người dùng là số bài THỰC SỰ đang ở trạng thái đó (bài đã đăng sẵn không bị cập nhật nhưng vẫn tính;
  // bài bị từ chối ghi, ví dụ do quyền, thì không tính).
  let count = changed
  if (status === 'published') {
    const { count: nowPublished } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .in('id', ids)
      .eq('status', 'published')
    count = nowPublished
  }
  revalidatePath('/admin-cls/posts')
  revalidatePath('/blog')
  revalidatePath('/')
  updateTag('posts')
  return { ok: count ?? ids.length }
}
