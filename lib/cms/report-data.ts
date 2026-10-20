import { createClient } from '@/lib/supabase/server'

/**
 * Số liệu cho màn Báo cáo (/admin-cls/reports). Chỉ đọc bảng sẵn có: leads, posts, cấu hình mã nhúng.
 * Không gửi tên, email, số điện thoại hay lời nhắn của khách xuống trình duyệt: mỗi lead chỉ còn
 * ngày tạo, nguồn, trạng thái, giá trị dự kiến, dịch vụ quan tâm (tách từ lời nhắn) và đã đẩy CRM chưa.
 */
export type ReportLead = {
  createdAt: string
  source: string
  status: string
  value: number
  service: string | null
  crmSynced: boolean
}

export type ReportData = {
  /** Mốc "bây giờ" lấy ở máy chủ, để trình duyệt tính kỳ báo cáo giống hệt (không lệch khi hydrate). */
  nowMs: number
  leads: ReportLead[]
  /** Ngày đăng của các bài đã đăng. */
  postDates: string[]
  draftPosts: number
  /** Mã GA4 đang gắn trên website (nếu có): số liệu truy cập xem ở Google Analytics. */
  ga4Id: string | null
}

const GA4_ID = /\bG-[A-Z0-9]{6,14}\b/
// Form liên hệ ghi dịch vụ vào đầu lời nhắn: "Dịch vụ quan tâm: <tên>" (xem app/contact/actions.ts).
const SERVICE_LINE = /^Dịch vụ quan tâm:\s*(.+)$/m

export function parseService(message: string | null): string | null {
  const m = message?.match(SERVICE_LINE)
  return m ? m[1].trim().slice(0, 80) : null
}

export async function loadReportData(): Promise<ReportData> {
  const supabase = await createClient()
  const [leadsRes, postsRes, settingsRes, snippetsRes] = await Promise.all([
    supabase.from('leads').select('created_at, source, status, value_estimate, message, crm_synced_at').order('created_at'),
    supabase.from('posts').select('status, published_at'),
    supabase.from('site_settings').select('head_code').limit(1).maybeSingle(),
    supabase.from('site_code_snippets').select('code, config, enabled'),
  ])

  const leads: ReportLead[] = ((leadsRes.data ?? []) as any[]).map((l) => ({
    createdAt: l.created_at,
    source: l.source || 'khac',
    status: l.status || 'new',
    value: Number(l.value_estimate) || 0,
    service: parseService(l.message),
    crmSynced: !!l.crm_synced_at,
  }))

  const posts = (postsRes.data ?? []) as { status: string; published_at: string | null }[]
  const postDates = posts.filter((p) => p.status === 'published' && p.published_at).map((p) => p.published_at as string)

  const enabledCode = ((snippetsRes.data ?? []) as any[])
    .filter((s) => s.enabled)
    .map((s) => `${s.code ?? ''} ${JSON.stringify(s.config ?? {})}`)
    .join(' ')
  const ga4Id = `${(settingsRes.data as any)?.head_code ?? ''} ${enabledCode}`.match(GA4_ID)?.[0] ?? null

  return {
    nowMs: Date.now(),
    leads,
    postDates,
    draftPosts: posts.filter((p) => p.status !== 'published').length,
    ga4Id,
  }
}
