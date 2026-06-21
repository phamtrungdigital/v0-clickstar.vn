import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import type { Page } from './types'

/**
 * Fetch a published page by slug for public rendering.
 * Cache theo slug (data cache) — revalidate khi admin Lưu trang đó.
 * Dùng cho cả layout PageDataProvider lẫn generateMetadata → 1 query/slug được tái dùng.
 */
export async function getPublishedPage(slug: string): Promise<Page | null> {
  const cached = unstable_cache(
    async (s: string): Promise<Page | null> => {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', s)
        .eq('is_published', true)
        .maybeSingle()
      if (error || !data) return null
      return data as unknown as Page
    },
    ['published-page', slug],
    { tags: ['pages', `page:${slug}`], revalidate: 3600 }
  )
  return cached(slug)
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
