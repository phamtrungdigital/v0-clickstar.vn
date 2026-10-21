import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import type { CaseStudy } from './case-studies-types'

// Re-export types + slugify từ file client-safe để các consumer chỉ cần 1 import path
export type { CaseStudy, CaseStudyMetric, CaseStudyStatus } from './case-studies-types'
export { slugify } from './case-studies-types'

// Trang dự án dựng tĩnh (ISR): dữ liệu công khai đọc bằng client không cookie, cache gắn tag `case_studies`
// (admin lưu dự án gọi updateTag('case_studies')) và `pages` (tag mà các phiên sửa nội dung bằng SQL vẫn xoá
// bằng invalidate_by_tags). Lỗi truy vấn thì ném lỗi để trang giữ bản cũ thay vì cache danh sách rỗng.
const CASE_STUDY_CACHE = { tags: ['case_studies', 'pages'], revalidate: 3600 }

/** Public list — only published, ordered by sort_order desc then created_at desc */
export async function getPublishedCaseStudies(limit?: number): Promise<CaseStudy[]> {
  const cached = unstable_cache(
    async (n: number): Promise<CaseStudy[]> => {
      const supabase = createPublicClient()
      let query = supabase
        .from('case_studies')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false })
      if (n > 0) query = query.limit(n)
      const { data, error } = await query
      if (error) throw new Error(`getPublishedCaseStudies: ${error.message}`)
      return (data || []) as unknown as CaseStudy[]
    },
    ['published-case-studies'],
    CASE_STUDY_CACHE
  )
  return cached(limit ?? 0)
}

/** Public detail by slug — only if published */
export async function getPublishedCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const cached = unstable_cache(
    async (s: string): Promise<CaseStudy | null> => {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', s)
        .eq('status', 'published')
        .maybeSingle()
      if (error) throw new Error(`getPublishedCaseStudyBySlug(${s}): ${error.message}`)
      return (data as unknown as CaseStudy) || null
    },
    ['published-case-study'],
    CASE_STUDY_CACHE
  )
  return cached(slug)
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
