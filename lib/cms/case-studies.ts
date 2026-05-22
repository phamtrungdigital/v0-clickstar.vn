import { createClient } from '@/lib/supabase/server'

export type CaseStudyMetric = {
  label_vi: string
  label_en?: string
  value: string
}

export type CaseStudyStatus = 'draft' | 'published' | 'archived'

export type CaseStudy = {
  id: string
  slug: string
  title_vi: string
  title_en: string | null
  client_name: string | null
  industry_vi: string | null
  industry_en: string | null
  summary_vi: string | null
  summary_en: string | null
  cover_image: string | null
  body_vi: string | null
  body_en: string | null
  metrics: CaseStudyMetric[]
  tags: string[]
  project_url: string | null
  status: CaseStudyStatus
  sort_order: number
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

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

/** Slugify helper — lowercase, vietnamese-safe, dash-separated */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
