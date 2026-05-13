'use server'

import { revalidatePath } from 'next/cache'
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

  const patch: { status: 'draft' | 'published'; published_at?: string } = { status }
  if (status === 'published') {
    patch.published_at = new Date().toISOString()
  }

  const { error, count } = await supabase
    .from('posts')
    .update(patch, { count: 'exact' })
    .in('id', ids)
  if (error) return { error: error.message }
  revalidatePath('/admin-cls/posts')
  revalidatePath('/blog')
  return { ok: count ?? ids.length }
}
