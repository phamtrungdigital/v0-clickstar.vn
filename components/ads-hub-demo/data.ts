/**
 * Dữ liệu minh họa cho bản demo giao diện ADS hub (trang /ads-hub). Toàn bộ là số giả lập,
 * sinh bằng công thức cố định (không dùng Math.random) để máy chủ và trình duyệt ra cùng kết quả.
 */

export type Lang = 'vi' | 'en'

/* ---------------------------- Định dạng số, tiền, ngày --------------------------- */

const group = (n: number, sep: string) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep)

export function num(v: number, lang: Lang) {
  return group(v, lang === 'vi' ? '.' : ',')
}

export function dec(v: number, digits: number, lang: Lang) {
  const s = v.toFixed(digits)
  return lang === 'vi' ? s.replace('.', ',') : s
}

/** Tiền VND rút gọn: 159,7tr / ₫159.7M. */
export function money(v: number, lang: Lang) {
  const a = Math.abs(v)
  if (lang === 'vi') {
    if (a >= 1e9) return `${dec(v / 1e9, 1, lang)} tỷ`
    if (a >= 1e6) return `${dec(v / 1e6, 1, lang)}tr`
    if (a >= 1e3) return `${Math.round(v / 1e3)}k`
    return String(Math.round(v))
  }
  if (a >= 1e9) return `₫${dec(v / 1e9, 1, lang)}B`
  if (a >= 1e6) return `₫${dec(v / 1e6, 1, lang)}M`
  if (a >= 1e3) return `₫${Math.round(v / 1e3)}K`
  return `₫${Math.round(v)}`
}

/** Tiền ngắn không ký hiệu (cho trục biểu đồ). */
export function axisMoney(v: number, lang: Lang) {
  if (v >= 1e6) return `${dec(v / 1e6, v % 1e6 === 0 ? 0 : 1, lang)}${lang === 'vi' ? 'tr' : 'M'}`
  if (v >= 1e3) return `${Math.round(v / 1e3)}${lang === 'vi' ? 'k' : 'K'}`
  return String(Math.round(v))
}

export const pct = (v: number, lang: Lang, d = 2) => `${dec(v, d, lang)}%`

const END = Date.UTC(2026, 9, 11) // Chủ nhật 11/10/2026, mốc cuối cố định của dữ liệu minh họa
const DAY = 86400000

export function dateAt(offsetFromEnd: number) {
  return new Date(END - offsetFromEnd * DAY)
}

export function fmtDay(d: Date, lang: Lang) {
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  return lang === 'vi' ? `${dd}/${mm}` : `${mm}/${dd}`
}

export function fmtFull(d: Date, lang: Lang) {
  return `${fmtDay(d, lang)}/${d.getUTCFullYear()}`
}

export function rangeLabel(days: number, lang: Lang) {
  return `${fmtFull(dateAt(days - 1), lang)} – ${fmtFull(dateAt(0), lang)}`
}

/* --------------------------------- Chuỗi ngày --------------------------------- */

const TOTAL_DAYS = 60

const VOL = 0.6 // biên độ dao động quanh xu hướng
const wave = (i: number, seed: number) =>
  1 + VOL * (0.17 * Math.sin(i * 0.52 + seed) + 0.09 * Math.sin(i * 1.27 + seed * 2.1))

export type DayRow = {
  spend: number
  clicks: number
  impressions: number
  leads: number
  form: number
  messenger: number
}

function buildDays(base: { spend: number; cpl: number; cpc: number; cpm: number; msgShare: number }, seed: number): DayRow[] {
  // xu hướng nhẹ: chi tiêu tăng dần, chi phí mỗi lead giảm dần (đúng kiểu tài khoản đang tối ưu tốt)
  const rows: DayRow[] = []
  for (let g = 0; g < TOTAL_DAYS; g++) {
    const dow = (g + 3) % 7 // nhịp tuần: cuối tuần thấp hơn
    const weekday = dow >= 5 ? 0.82 : 1
    const grow = 1 + g * 0.006
    const spend = Math.round((base.spend * grow * wave(g, seed) * weekday) / 1000) * 1000
    const cpl = base.cpl * (1 - g * 0.002) * wave(g, seed + 3)
    const cpc = base.cpc * (1 - g * 0.0015) * wave(g, seed + 5)
    const cpm = base.cpm * (1 - g * 0.0015) * wave(g, seed + 7)
    const leads = Math.max(1, Math.round(spend / cpl))
    const messenger = Math.round(leads * base.msgShare * wave(g, seed + 9))
    rows.push({
      spend,
      clicks: Math.round(spend / cpc),
      impressions: Math.round((spend / cpm) * 1000),
      leads,
      form: leads - messenger,
      messenger,
    })
  }
  return rows
}

/** Toàn tài khoản (màn Tổng quan). */
export const ACCOUNT_DAYS = buildDays({ spend: 6000000, cpl: 448000, cpc: 4400, cpm: 39000, msgShare: 0.06 }, 3)
/** Một chiến dịch (màn Chi tiết chiến dịch). */
export const CAMPAIGN_DAYS = buildDays({ spend: 456000, cpl: 152000, cpc: 4100, cpm: 43000, msgShare: 0.22 }, 1.5)

export type Totals = DayRow & { cpc: number; cpm: number; cpl: number; ctr: number }

export function totalsOf(rows: DayRow[]): Totals {
  const s = rows.reduce(
    (a, r) => ({
      spend: a.spend + r.spend,
      clicks: a.clicks + r.clicks,
      impressions: a.impressions + r.impressions,
      leads: a.leads + r.leads,
      form: a.form + r.form,
      messenger: a.messenger + r.messenger,
    }),
    { spend: 0, clicks: 0, impressions: 0, leads: 0, form: 0, messenger: 0 }
  )
  return {
    ...s,
    cpc: s.spend / Math.max(1, s.clicks),
    cpm: (s.spend / Math.max(1, s.impressions)) * 1000,
    cpl: s.spend / Math.max(1, s.leads),
    ctr: (s.clicks / Math.max(1, s.impressions)) * 100,
  }
}

/** Lấy `n` ngày gần nhất và `n` ngày liền trước đó để tính % thay đổi. */
export function windowOf(rows: DayRow[], n: number) {
  const cur = rows.slice(TOTAL_DAYS - n)
  const prev = rows.slice(TOTAL_DAYS - 2 * n, TOTAL_DAYS - n)
  return { cur, prev, curT: totalsOf(cur), prevT: totalsOf(prev) }
}

export const change = (cur: number, prev: number) => (prev === 0 ? 0 : ((cur - prev) / prev) * 100)

/* ------------------------------- Chiến dịch, tuyến ------------------------------ */

export type Campaign = {
  name: { vi: string; en: string }
  spend: number
  leads: number
  cpc: number
  ctr: number
  cpm: number
  active: boolean
}

export const CAMPAIGNS: Campaign[] = [
  { name: { vi: 'Remarketing · Lookalike 1%', en: 'Remarketing · Lookalike 1%' }, spend: 4900000, leads: 32, cpc: 4200, ctr: 1.32, cpm: 55000, active: true },
  { name: { vi: 'Traffic · Bài blog tháng 10', en: 'Traffic · October blog post' }, spend: 4500000, leads: 28, cpc: 3800, ctr: 1.19, cpm: 49000, active: true },
  { name: { vi: 'Lead Gen · Webinar 2026', en: 'Lead Gen · Webinar 2026' }, spend: 3200000, leads: 21, cpc: 4100, ctr: 1.05, cpm: 43000, active: true },
  { name: { vi: 'Conversion · Khách hàng mới', en: 'Conversion · New customers' }, spend: 2800000, leads: 18, cpc: 4500, ctr: 0.98, cpm: 41000, active: true },
  { name: { vi: 'Retargeting · Video xem 50%', en: 'Retargeting · 50% video viewers' }, spend: 2100000, leads: 14, cpc: 3600, ctr: 1.1, cpm: 36000, active: true },
  { name: { vi: 'Awareness · Ưu đãi cuối năm', en: 'Awareness · Year-end offer' }, spend: 1600000, leads: 6, cpc: 5200, ctr: 0.62, cpm: 31000, active: false },
]

export type Stream = {
  name: { vi: string; en: string }
  level: 'high' | 'mid' | 'low'
  spend: number
  leads: number
  cpc: number
  ctr: number
  cpm: number
  /** hệ số khi xem 30 ngày thay vì 7 ngày */
  k30: { spend: number; leads: number }
  trend: number[]
}

export const STREAMS: Stream[] = [
  { name: { vi: 'Kiến thức chuyên sâu', en: 'Expert insights' }, level: 'high', spend: 12400000, leads: 32, cpc: 6000, ctr: 0.82, cpm: 41000, k30: { spend: 4.13, leads: 4.1 }, trend: [8, 11, 9, 13, 12, 15, 14] },
  { name: { vi: 'Case study', en: 'Case studies' }, level: 'high', spend: 9800000, leads: 28, cpc: 7000, ctr: 0.71, cpm: 38000, k30: { spend: 4.2, leads: 4.4 }, trend: [7, 9, 8, 10, 11, 10, 12] },
  { name: { vi: 'Hướng dẫn sử dụng', en: 'How-to guides' }, level: 'mid', spend: 6500000, leads: 16, cpc: 5000, ctr: 0.68, cpm: 36000, k30: { spend: 4.0, leads: 3.9 }, trend: [6, 6, 8, 7, 7, 9, 8] },
  { name: { vi: 'Chia sẻ khách hàng', en: 'Customer stories' }, level: 'high', spend: 8200000, leads: 24, cpc: 6000, ctr: 0.75, cpm: 39000, k30: { spend: 4.3, leads: 4.5 }, trend: [5, 8, 9, 9, 11, 10, 13] },
  { name: { vi: 'Tin tức ngành', en: 'Industry news' }, level: 'low', spend: 3100000, leads: 5, cpc: 4000, ctr: 0.41, cpm: 32000, k30: { spend: 4.2, leads: 4.2 }, trend: [4, 3, 4, 3, 2, 3, 2] },
  { name: { vi: 'Ưu đãi & khuyến mãi', en: 'Offers & promotions' }, level: 'mid', spend: 5700000, leads: 14, cpc: 6000, ctr: 0.55, cpm: 34000, k30: { spend: 4.1, leads: 4.0 }, trend: [6, 7, 6, 8, 7, 8, 7] },
  { name: { vi: 'Livestream & sự kiện', en: 'Livestreams & events' }, level: 'high', spend: 7300000, leads: 21, cpc: 5000, ctr: 0.79, cpm: 37000, k30: { spend: 4.4, leads: 4.6 }, trend: [5, 6, 8, 9, 9, 11, 12] },
  { name: { vi: 'Khác', en: 'Other' }, level: 'low', spend: 1200000, leads: 2, cpc: 3000, ctr: 0.38, cpm: 28000, k30: { spend: 4.0, leads: 3.5 }, trend: [2, 1, 2, 1, 2, 1, 1] },
]

/* --------------------------- Nhóm quảng cáo, quảng cáo, đối tượng --------------------------- */

export const ADSETS = [
  { name: { vi: 'Lookalike 1% · Nhà quản lý', en: 'Lookalike 1% · Managers' }, spend: 5200000, leads: 36, ctr: 1.52, active: true },
  { name: { vi: 'Quan tâm · Marketing & Quảng cáo', en: 'Interest · Marketing & Ads' }, spend: 4400000, leads: 27, ctr: 1.18, active: true },
  { name: { vi: 'Tệp khách truy cập 30 ngày', en: '30-day site visitors' }, spend: 2900000, leads: 19, ctr: 1.74, active: true },
  { name: { vi: 'Mở rộng · Toàn quốc', en: 'Broad · Nationwide' }, spend: 1500000, leads: 5, ctr: 0.71, active: false },
]

export const ADS = [
  { name: { vi: 'Video 30s · Giới thiệu webinar', en: '30s video · Webinar teaser' }, format: 'Video', spend: 4100000, leads: 31, ctr: 1.68 },
  { name: { vi: 'Ảnh đơn · Đăng ký giữ chỗ', en: 'Single image · Reserve a seat' }, format: 'Image', spend: 3300000, leads: 24, ctr: 1.35 },
  { name: { vi: 'Carousel · 3 chủ đề chính', en: 'Carousel · 3 key topics' }, format: 'Carousel', spend: 2800000, leads: 18, ctr: 1.12 },
  { name: { vi: 'Ảnh đơn · Câu hỏi thường gặp', en: 'Single image · FAQ' }, format: 'Image', spend: 1700000, leads: 8, ctr: 0.84 },
]

export const AUDIENCE_AGE = [
  { label: '18–24', value: 9 },
  { label: '25–34', value: 38 },
  { label: '35–44', value: 31 },
  { label: '45–54', value: 15 },
  { label: '55+', value: 7 },
]

/* ------------------------------- Meta API Setup ------------------------------- */

export const PIPELINE_STEPS = [
  { vi: 'Ủy quyền', en: 'Authorize', subVi: 'Meta Business', subEn: 'Meta Business' },
  { vi: 'System User Token', en: 'System User Token', subVi: 'Đã lấy token', subEn: 'Token issued' },
  { vi: 'App & quyền', en: 'App & permissions', subVi: 'Đã cấu hình', subEn: 'Configured' },
  { vi: 'Webhook', en: 'Webhook', subVi: 'Đang hoạt động', subEn: 'Active' },
  { vi: 'Test pipeline', en: 'Pipeline test', subVi: 'Thành công', subEn: 'Passed' },
]

export const PIPELINE_TESTS = [
  { vi: 'Ads Insights', en: 'Ads Insights', subVi: 'Dữ liệu chiến dịch', subEn: 'Campaign data' },
  { vi: 'Leads', en: 'Leads', subVi: 'Lead từ Form & Messenger', subEn: 'Leads from Form & Messenger' },
  { vi: 'Campaigns', en: 'Campaigns', subVi: 'Danh sách chiến dịch', subEn: 'Campaign list' },
  { vi: 'Ad Sets', en: 'Ad Sets', subVi: 'Nhóm quảng cáo', subEn: 'Ad groups' },
  { vi: 'Ads', en: 'Ads', subVi: 'Quảng cáo', subEn: 'Creatives' },
]

export const RECENT_SYNC = [
  { time: '10:32:15', kind: 'Ads Insights', vi: 'Đồng bộ 128 chiến dịch', en: 'Synced 128 campaigns' },
  { time: '10:32:10', kind: 'Leads', vi: 'Đồng bộ 45 lead (Form: 38, Messenger: 7)', en: 'Synced 45 leads (Form: 38, Messenger: 7)' },
  { time: '10:31:58', kind: 'Campaigns', vi: 'Cập nhật 128 chiến dịch', en: 'Updated 128 campaigns' },
]
