'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Section } from '@/lib/cms/types'
import type { SeoFields } from './_components/seo-form'

export async function savePage(slug: string, sections: Section[], seo?: SeoFields) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const update: Record<string, unknown> = {
    sections: sections as unknown as object,
    updated_by: user.id,
  }
  if (seo) {
    update.seo_title = seo.seo_title
    update.seo_description = seo.seo_description
    update.og_image = seo.og_image
  }

  const { error } = await supabase.from('pages').update(update).eq('slug', slug)
  if (error) return { error: error.message }

  revalidateTag('pages')
  revalidateTag(`page:${slug}`)
  revalidatePath(slug === 'home' ? '/' : `/${slug}`)
  revalidatePath(`/admin-cls/pages/${slug}/edit`)

  return { ok: true }
}
