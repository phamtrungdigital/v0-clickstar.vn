import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Số liệu cho tab "Đồng ý cookie" ở màn Báo cáo, đọc bảng consent_log (sổ đồng ý, xem components/consent/consent-manager.tsx).
 * RLS chỉ cho tài khoản quyền admin đọc (is_site_admin). Bảng không có tên, email, IP: mã khách là mã ngẫu nhiên trong cookie cs_consent.
 * Đọc từng trang 1000 dòng (PostgREST trả tối đa 1000 dòng mỗi lần) rồi gộp ở máy chủ; ngày tính theo giờ Việt Nam.
 */

export type ConsentAction = 'accept_all' | 'reject_all' | 'custom' | 'withdraw'

export type ConsentRow = {
  id: number
  createdAt: string
  visitorId: string
  action: ConsentAction
  analytics: boolean
  marketing: boolean
  lang: string | null
  pagePath: string | null
  policyVersion: string
}

/** Trạng thái hiện tại của một khách, suy từ lần chọn cuối cùng (không theo tên nút đã bấm). */
export type ConsentChoice = 'all' | 'none' | 'partial'

export type ConsentReport = {
  days: number
  /** Có quyền đọc sổ không (chỉ quyền admin). */
  allowed: boolean
  kpis: {
    visitors: number
    events: number
    all: number
    none: number
    partial: number
    analytics: number
    marketing: number
    changed: number
  }
  daily: { day: string; counts: Record<ConsentAction, number> }[]
  pages: { path: string; count: number }[]
  langs: { lang: string; count: number }[]
  /** Danh sách lượt: 100 lượt mới nhất trong kỳ, hoặc mọi lượt khớp ô tra cứu. */
  list: ConsentRow[]
  query: string
  /** Tổng số lượt khớp ô tra cứu (danh sách có thể bị cắt). */
  listTotal: number
}

const DAY = 86_400_000
const VN = 7 * 3600_000
const PAGE = 1000
const MAX_ROWS = 50_000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const vnDay = (iso: string) => new Date(new Date(iso).getTime() + VN).toISOString().slice(0, 10)

export const choiceOf = (r: { analytics: boolean; marketing: boolean }): ConsentChoice =>
  r.analytics && r.marketing ? 'all' : !r.analytics && !r.marketing ? 'none' : 'partial'

const COLS = 'id, created_at, visitor_id, action, analytics, marketing, lang, page_path, policy_version'

function toRow(r: any): ConsentRow {
  return {
    id: r.id,
    createdAt: r.created_at,
    visitorId: r.visitor_id,
    action: r.action,
    analytics: !!r.analytics,
    marketing: !!r.marketing,
    lang: r.lang,
    pagePath: r.page_path,
    policyVersion: r.policy_version,
  }
}

export async function loadConsentReport(days: number, rawQuery = ''): Promise<ConsentReport> {
  const supabase = await createClient()
  const query = rawQuery.trim().toLowerCase().slice(0, 40)

  // Mốc đầu kỳ: 0 giờ (giờ Việt Nam) của ngày cách đây days-1 ngày.
  const todayVn = Math.floor((Date.now() + VN) / DAY) * DAY
  const startMs = todayVn - (days - 1) * DAY - VN
  const dayKeys = Array.from({ length: days }, (_, i) => new Date(todayVn - (days - 1 - i) * DAY).toISOString().slice(0, 10))

  const [{ data: isAdmin }, rows] = await Promise.all([
    supabase.rpc('is_site_admin'),
    (async () => {
      const out: ConsentRow[] = []
      for (let from = 0; from < MAX_ROWS; from += PAGE) {
        const { data, error } = await supabase
          .from('consent_log')
          .select(COLS)
          .gte('created_at', new Date(startMs).toISOString())
          .order('id', { ascending: true })
          .range(from, from + PAGE - 1)
        if (error || !data?.length) break
        out.push(...data.map(toRow))
        if (data.length < PAGE) break
      }
      return out
    })(),
  ])

  // Lần chọn cuối cùng của mỗi khách trong kỳ (rows đã xếp tăng dần theo id).
  const latest = new Map<string, ConsentRow>()
  const perVisitor = new Map<string, number>()
  for (const r of rows) {
    latest.set(r.visitorId, r)
    perVisitor.set(r.visitorId, (perVisitor.get(r.visitorId) ?? 0) + 1)
  }
  const states = [...latest.values()]

  const empty = (): Record<ConsentAction, number> => ({ accept_all: 0, custom: 0, reject_all: 0, withdraw: 0 })
  const byDay = new Map(dayKeys.map((d) => [d, empty()]))
  const pages = new Map<string, number>()
  const langs = new Map<string, number>()
  for (const r of rows) {
    const c = byDay.get(vnDay(r.createdAt))
    if (c) c[r.action] = (c[r.action] ?? 0) + 1
    const p = r.pagePath || '(không rõ)'
    pages.set(p, (pages.get(p) ?? 0) + 1)
    const l = r.lang || '(không rõ)'
    langs.set(l, (langs.get(l) ?? 0) + 1)
  }

  // Tra cứu: mã khách đầy đủ thì xem toàn bộ lịch sử (mọi thời điểm); gõ một phần mã thì lọc trong kỳ.
  let list: ConsentRow[]
  if (UUID.test(query)) {
    const { data } = await supabase.from('consent_log').select(COLS).eq('visitor_id', query).order('id', { ascending: false }).limit(500)
    list = (data ?? []).map(toRow)
  } else if (query) {
    list = rows.filter((r) => r.visitorId.startsWith(query)).reverse()
  } else {
    list = rows.slice().reverse()
  }
  const listTotal = list.length

  return {
    days,
    allowed: !!isAdmin,
    kpis: {
      visitors: states.length,
      events: rows.length,
      all: states.filter((s) => choiceOf(s) === 'all').length,
      none: states.filter((s) => choiceOf(s) === 'none').length,
      partial: states.filter((s) => choiceOf(s) === 'partial').length,
      analytics: states.filter((s) => s.analytics).length,
      marketing: states.filter((s) => s.marketing).length,
      changed: [...perVisitor.values()].filter((n) => n > 1).length,
    },
    daily: dayKeys.map((day) => ({ day, counts: byDay.get(day)! })),
    pages: [...pages].map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    langs: [...langs].map(([lang, count]) => ({ lang, count })).sort((a, b) => b.count - a.count),
    list: list.slice(0, 100),
    query,
    listTotal,
  }
}
