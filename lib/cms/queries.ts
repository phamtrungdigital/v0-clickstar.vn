import { createClient } from '@/lib/supabase/server'
import type { Page } from './types'

/**
 * Fetch a published page by slug for public rendering.
 * Returns null if not found or unpublished.
 */
export async function getPublishedPage(slug: string): Promise<Page | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as Page
}

/**
 * Fetch any page by slug for admin editing (incl. drafts).
 */
export async function getPageForAdmin(slug: string): Promise<Page | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as Page
}

/**
 * List all pages for admin overview.
 */
export async function listPagesForAdmin(): Promise<Page[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as Page[]
}
