import { createClient } from '@/lib/supabase/server'
import type { CaseStudy } from './case-studies-types'

// Re-export types + slugify từ file client-safe để các consumer chỉ cần 1 import path
export type { CaseStudy, CaseStudyMetric, CaseStudyStatus } from './case-studies-types'
export { slugify } from './case-studies-types'

/** Public list — only published, ordered by sort_order desc then created_at desc */
export async function getPublishedCaseStudies(limit?: number): Promise<CaseStudy[]> {
  const supabase = await createClient()
  let query = supabase
    .from('case_studies')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error || !data) return []
  return data as unknown as CaseStudy[]
}

/** Public detail by slug — only if published */
export async function getPublishedCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as CaseStudy
}

/** Admin list — all statuses */
export async function listCaseStudiesForAdmin(): Promise<CaseStudy[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .order('sort_order', { ascending: false })
    .order('updated_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as CaseStudy[]
}

/** Admin detail by id */
export async function getCaseStudyForAdmin(id: string): Promise<CaseStudy | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as CaseStudy
}
