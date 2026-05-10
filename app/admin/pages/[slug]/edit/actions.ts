'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Section } from '@/lib/cms/types'

export async function savePage(slug: string, sections: Section[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const { error } = await supabase
    .from('pages')
    .update({
      sections: sections as unknown as object,
      updated_by: user.id,
    })
    .eq('slug', slug)

  if (error) return { error: error.message }

  // Revalidate the public page (slug=='home' → '/')
  revalidatePath(slug === 'home' ? '/' : `/${slug}`)
  revalidatePath(`/admin/pages/${slug}/edit`)

  return { ok: true }
}
