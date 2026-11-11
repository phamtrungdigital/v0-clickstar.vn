// Client-safe types + helpers cho case studies.
// Tách khỏi `case-studies.ts` (server-only, dùng next/headers) để có thể
// import từ Client Components mà không bundle Supabase server client.

export type CaseStudyMetric = {
  label_vi: string
  label_en?: string
  value: string
}

export type CaseStudyStatus = 'draft' | 'published' | 'archived'

/**
 * Mức kiểm chứng của dự án (GEO, 11/11/2026): trợ lý AI chỉ tin dự án khi có nguồn đối chiếu được.
 * unverified = chưa xin phép khách; permission = khách cho nêu tên; confirmed = khách đã đọc và xác nhận nội dung.
 * Lời nhận xét và người xác nhận chỉ hiện trên website khi confirmed.
 */
export type CaseStudyVerification = 'unverified' | 'permission' | 'confirmed'

export const VERIFICATION_OPTIONS: { value: CaseStudyVerification; label: string }[] = [
  { value: 'unverified', label: 'Chưa xin phép khách' },
  { value: 'permission', label: 'Khách cho phép nêu tên' },
  { value: 'confirmed', label: 'Khách đã xác nhận nội dung' },
]

/** Dịch vụ Click Star đã làm trong dự án: khoá lưu trong cột services, kèm đường dẫn trang dịch vụ. */
export const PROJECT_SERVICES: { key: string; path: string; vi: string; en: string }[] = [
  { key: 'digital-marketing', path: '/services/digital-marketing', vi: 'Digital Marketing', en: 'Digital marketing' },
  { key: 'website', path: '/services/website', vi: 'Thiết kế website', en: 'Website design' },
  { key: 'dashboard', path: '/services/dashboard', vi: 'Dashboard dữ liệu', en: 'Data dashboards' },
  { key: 'ai-integration', path: '/services/ai-integration', vi: 'Tích hợp AI', en: 'AI integration' },
  { key: 'automation', path: '/services/automation', vi: 'Tự động hóa', en: 'Automation' },
  { key: 'crm-cdp', path: '/services/crm-cdp', vi: 'CRM và CDP', en: 'CRM and CDP' },
  { key: 'speech-insight-ai', path: '/services/speech-insight-ai', vi: 'Phân tích cuộc gọi AI', en: 'AI call analytics' },
  { key: 'custom-software', path: '/services/custom-software', vi: 'Phần mềm theo yêu cầu', en: 'Custom software' },
  { key: 'ads-hub', path: '/ads-hub', vi: 'ADS hub', en: 'ADS hub' },
]

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
  /** Website của khách hàng. */
  project_url: string | null
  /** Thời gian thực hiện, ngày đầu tháng (YYYY-MM-01); delivered_to trống = đang làm. */
  delivered_from: string | null
  delivered_to: string | null
  services: string[]
  verifier_name: string | null
  verifier_title: string | null
  verifier_url: string | null
  testimonial_vi: string | null
  testimonial_en: string | null
  /** Trang của khách có dòng "Thiết kế bởi Click Star". */
  client_credit_url: string | null
  verification: CaseStudyVerification
  verified_on: string | null
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

/** Nội dung tiếng Anh tối thiểu (ký tự) để bản /en của dự án được coi là đã dịch đủ. */
export const CASE_EN_MIN_BODY = 300

/** Dự án có bản tiếng Anh đủ nội dung chưa (tên, tóm tắt, nội dung). Chưa có thì /en/projects/<slug> noindex. */
export function caseStudyHasEnglish(p: Pick<CaseStudy, 'title_en' | 'summary_en' | 'body_en'>): boolean {
  return !!p.title_en?.trim() && !!p.summary_en?.trim() && (p.body_en || '').trim().length >= CASE_EN_MIN_BODY
}

/**
 * Tên khách hàng hiển thị. Vài dự án ghi "Bảo mật" (giấu tên khách theo thỏa thuận): bản tiếng Anh hiện "Confidential".
 * Tên riêng khác giữ nguyên ở cả hai ngôn ngữ.
 */
export function clientLabel(lang: 'vi' | 'en', name: string | null | undefined): string {
  const n = (name || '').trim()
  if (!n) return ''
  if (lang === 'en' && n.toLowerCase() === 'bảo mật') return 'Confidential'
  return n
}

/** "2025-03-01" thành "03/2025". */
export function monthLabel(d: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})/.exec(d || '')
  return m ? `${m[2]}/${m[1]}` : ''
}
