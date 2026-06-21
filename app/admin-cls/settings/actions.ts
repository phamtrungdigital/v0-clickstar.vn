'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SiteSettings } from '@/lib/cms/settings'

export type SettingsUpdate = Omit<SiteSettings, 'id' | 'updated_at'>

// Cột tracking có thể chưa được tạo trong DB (migration chạy thủ công).
// Tách riêng để retry không-kèm-tracking nếu Postgres báo cột không tồn tại.
const TRACKING_KEYS = ['head_code', 'body_start_code', 'body_end_code'] as const

export async function saveSettings(input: SettingsUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const payload = { ...input, updated_by: user.id }

  let { error } = await supabase.from('site_settings').update(payload).eq('id', 1)

  // Fallback: nếu cột tracking chưa tồn tại (migration chưa chạy), lưu lại
  // phần còn lại để Settings không bị chặn. Báo nhẹ cho admin biết.
  if (error && error.code === '42703') {
    const stripped: Record<string, unknown> = { ...payload }
    for (const k of TRACKING_KEYS) delete stripped[k]
    const retry = await supabase.from('site_settings').update(stripped).eq('id', 1)
    if (retry.error) return { error: retry.error.message }
    revalidateTag('site_settings')
    revalidatePath('/admin-cls/settings')
    revalidatePath('/')
    return { ok: true, warning: 'tracking_columns_missing' }
  }

  if (error) return { error: error.message }
  revalidateTag('site_settings')
  revalidatePath('/admin-cls/settings')
  revalidatePath('/')
  return { ok: true }
}
