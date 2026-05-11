'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SiteSettings } from '@/lib/cms/settings'

export type SettingsUpdate = Omit<SiteSettings, 'id' | 'updated_at'>

export async function saveSettings(input: SettingsUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const { error } = await supabase
    .from('site_settings')
    .update({ ...input, updated_by: user.id })
    .eq('id', 1)

  if (error) return { error: error.message }
  revalidatePath('/admin/settings')
  revalidatePath('/')
  return { ok: true }
}
