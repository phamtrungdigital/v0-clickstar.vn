'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { WebContentUpdate } from '@/lib/cms/web-content-shared'

export async function saveWebContent(input: WebContentUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const { error } = await supabase
    .from('web_content')
    .update({ footer: input.footer, service_ctas: input.service_ctas, updated_by: user.id })
    .eq('id', 1)

  if (error) return { error: error.message }

  revalidatePath('/admin-cls/footer-cta')
  // Footer ở mọi trang + CTA services → revalidate toàn bộ trang dùng root layout.
  revalidatePath('/', 'layout')
  return { ok: true }
}
