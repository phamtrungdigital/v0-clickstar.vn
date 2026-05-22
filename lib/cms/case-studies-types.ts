// Client-safe types + helpers cho case studies.
// Tách khỏi `case-studies.ts` (server-only, dùng next/headers) để có thể
// import từ Client Components mà không bundle Supabase server client.

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

/** Slugify helper — lowercase, vietnamese-safe, dash-separated. Pure function, no IO. */
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
