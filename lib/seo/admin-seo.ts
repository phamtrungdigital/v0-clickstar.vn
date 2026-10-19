/**
 * Logic thuần (chạy được cả server lẫn client) cho màn SEO trong admin:
 * khuôn dữ liệu một mục (trang, dịch vụ, bài viết, dự án), cách tính tiêu đề/mô tả Google thực sự nhận,
 * mức đạt của từng chỉ số và điểm tổng. Không import server-only để dùng trong component client.
 */
import { BRAND } from './site'
import { brandTitle, fitTitle } from './metadata'

export type SeoKind = 'page' | 'service' | 'post' | 'project'
export type Level = 'ok' | 'warn' | 'bad'

export const KIND_LABEL: Record<SeoKind, string> = {
  page: 'Trang',
  service: 'Dịch vụ',
  post: 'Bài viết',
  project: 'Dự án',
}

/** Số ký tự tiêu đề tối đa (gồm cả đuôi thương hiệu) trước khi Google bắt đầu cắt. */
export const TITLE_MAX = 60
export const TITLE_MIN = 30
export const DESC_MIN = 110
export const DESC_MAX = 160
/** " | Click Star" */
const BRAND_SUFFIX_LEN = 3 + BRAND.length

export type SeoText = { title: string; desc: string }

/** Giá trị đang lưu (hoặc đang soạn) của một mục. `en` chỉ dùng cho bài viết. */
export type SeoDraft = { vi: SeoText; en: SeoText; og: string }

export type SeoItem = {
  key: string
  kind: SeoKind
  id: string
  label: string
  /** Đường dẫn công khai, ví dụ "/blog/abc". */
  path: string
  /** false = bản nháp hoặc trang chưa đăng: có trong danh sách nhưng không tính điểm. */
  published: boolean
  /** Dự án chưa có ô SEO riêng nên chỉ xem. */
  editable: boolean
  editHref: string
  saved: SeoDraft
  /** Giá trị hệ thống dùng khi ô SEO để trống (tên trang, tóm tắt bài...). */
  fallback: { vi: SeoText; en: SeoText }
  /** Ảnh dùng làm ảnh chia sẻ khi chưa có ảnh OG riêng (ảnh bìa bài viết, ảnh dự án). */
  ogFallback: string
  /** Nguồn của mô tả khi để trống, dùng làm câu giải thích. */
  descFallbackNote: string
}

export type Lang = 'vi' | 'en'

export type Metric = {
  /** Phần người dùng nhập hoặc phần dự phòng, chưa gắn thương hiệu. */
  raw: string
  /** Chuỗi hiển thị cuối cùng trên Google (tiêu đề đã gắn "| Click Star"). */
  shown: string
  len: number
  level: Level
  /** true = đang dùng giá trị dự phòng vì ô SEO để trống. */
  fromFallback: boolean
}

export type Issue = { level: Level | 'info'; text: string }

export type Analysis = {
  title: Metric
  desc: Metric
  hasOg: boolean
  issues: Issue[]
  score: number
}

export function titleLevel(len: number): Level {
  if (len >= TITLE_MIN && len <= TITLE_MAX) return 'ok'
  if (len >= 25 && len <= 70) return 'warn'
  return 'bad'
}

export function descLevel(len: number): Level {
  if (len >= DESC_MIN && len <= DESC_MAX) return 'ok'
  if (len >= 80 && len <= 190) return 'warn'
  return 'bad'
}

const nfc = (s: string) => (s || '').normalize('NFC').trim()

export function measureTitle(item: SeoItem, draft: SeoDraft, lang: Lang = 'vi'): Metric {
  const own = nfc(draft[lang].title)
  const fb = nfc(item.fallback[lang].title) || nfc(item.fallback.vi.title)
  const raw = own || fb
  const shown = raw ? brandTitle(raw) : ''
  return { raw, shown, len: shown.length, level: titleLevel(shown.length), fromFallback: !own }
}

export function measureDesc(item: SeoItem, draft: SeoDraft, lang: Lang = 'vi'): Metric {
  const own = nfc(draft[lang].desc)
  const fb = nfc(item.fallback[lang].desc) || nfc(item.fallback.vi.desc)
  const raw = own || fb
  return { raw, shown: raw, len: raw.length, level: descLevel(raw.length), fromFallback: !own }
}

/** Phân tích tiếng Việt (bản Google thấy mặc định): tiêu đề, mô tả, ảnh chia sẻ, danh sách việc cần sửa và điểm. */
export function analyze(item: SeoItem, draft: SeoDraft, duplicateWith: string[] = []): Analysis {
  const title = measureTitle(item, draft)
  const desc = measureDesc(item, draft)
  const hasOg = !!(draft.og || item.ogFallback)
  const issues: Issue[] = []
  let score = 100

  if (title.len === 0) {
    issues.push({ level: 'bad', text: 'Chưa có tiêu đề. Google sẽ tự đặt tiêu đề cho trang này.' })
    score -= 25
  } else if (title.len > TITLE_MAX) {
    issues.push({
      level: title.level,
      text: `Tiêu đề dài ${title.len} ký tự (đã gồm “| ${BRAND}”). Google thường cắt sau khoảng ${TITLE_MAX} ký tự, phần cuối sẽ bị ẩn.`,
    })
    score -= title.level === 'bad' ? 25 : 10
  } else if (title.len < TITLE_MIN) {
    issues.push({
      level: title.level,
      text: `Tiêu đề hơi ngắn (${title.len} ký tự). Nên dài khoảng ${TITLE_MIN} đến ${TITLE_MAX} ký tự để nói rõ nội dung trang.`,
    })
    score -= title.level === 'bad' ? 25 : 10
  }

  if (desc.len === 0) {
    issues.push({ level: 'bad', text: 'Chưa có mô tả. Google sẽ tự lấy một đoạn trong trang, thường không như ý.' })
    score -= 25
  } else if (desc.len > DESC_MAX) {
    issues.push({
      level: desc.level,
      text: `Mô tả dài ${desc.len} ký tự. Google thường cắt sau khoảng ${DESC_MAX} ký tự.`,
    })
    score -= desc.level === 'bad' ? 25 : 10
  } else if (desc.len < DESC_MIN) {
    issues.push({
      level: desc.level,
      text: `Mô tả hơi ngắn (${desc.len} ký tự). Nên giữ trong khoảng ${DESC_MIN} đến ${DESC_MAX} ký tự.`,
    })
    score -= desc.level === 'bad' ? 25 : 10
  }

  if (!hasOg) {
    issues.push({
      level: 'warn',
      text: 'Chưa có ảnh chia sẻ riêng, khi gửi link lên Facebook hay Zalo sẽ dùng ảnh mặc định của site.',
    })
    score -= 15
  }

  if (duplicateWith.length > 0) {
    issues.push({
      level: 'warn',
      text: `Trùng tiêu đề với: ${duplicateWith.slice(0, 3).join(', ')}${duplicateWith.length > 3 ? '...' : ''}. Mỗi trang nên có tiêu đề riêng.`,
    })
    score -= 10
  }

  return { title, desc, hasOg, issues, score: Math.max(0, score) }
}

export const SCORE_OK = 80
export function scoreTone(score: number): Level {
  return score >= SCORE_OK ? 'ok' : score >= 60 ? 'warn' : 'bad'
}

/** Các nhóm mục đã đăng có cùng tiêu đề hiển thị (mỗi nhóm từ 2 mục trở lên). */
export function duplicateGroups(items: SeoItem[]): SeoItem[][] {
  const byTitle = new Map<string, SeoItem[]>()
  for (const it of items) {
    if (!it.published) continue
    const t = measureTitle(it, it.saved).shown.toLowerCase()
    if (!t) continue
    byTitle.set(t, [...(byTitle.get(t) ?? []), it])
  }
  return [...byTitle.values()].filter((g) => g.length > 1)
}

/** Map key mục -> tên các mục khác trùng tiêu đề với nó. */
export function findDuplicateTitles(items: SeoItem[]): Map<string, string[]> {
  const out = new Map<string, string[]>()
  for (const group of duplicateGroups(items)) {
    for (const it of group) out.set(it.key, group.filter((g) => g !== it).map((g) => g.label))
  }
  return out
}

/**
 * Gợi ý tiêu đề vừa khung hiển thị của Google (đã tính cả đuôi thương hiệu): ưu tiên cắt ở dấu ngăn tự nhiên
 * (hai chấm, phẩy, gạch), nếu không có thì cắt ở ranh giới từ.
 */
export function suggestTitle(raw: string): string {
  const core = brandTitle(nfc(raw)).replace(new RegExp(`\\s*\\|\\s*${BRAND}$`), '')
  const max = TITLE_MAX - BRAND_SUFFIX_LEN
  if (core.length <= max) return core
  const head = core.slice(0, max + 1)
  const cut = Math.max(head.lastIndexOf(':'), head.lastIndexOf(','), head.lastIndexOf(' – '), head.lastIndexOf(' - '), head.lastIndexOf(' | '))
  if (cut >= 20) return head.slice(0, cut).trim()
  return fitTitle(core, max)
}

export function truncateChars(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s
}

/** Mô tả cho bản xem trước Google: ghi rõ địa chỉ dạng "clickstar.vn › blog › abc". */
export function breadcrumbUrl(host: string, path: string): string {
  const parts = path.split('/').filter(Boolean)
  return [host, ...parts].join(' › ')
}

export type CheckLevel = 'ok' | 'warn' | 'bad' | 'unknown'
export type SiteCheck = {
  id: 'robots' | 'sitemap' | 'language' | 'hotline' | 'defaults' | 'duplicates' | 'ga4' | 'gsc'
  level: CheckLevel
  title: string
  detail?: string
  /** Chi tiết bổ sung hiện dưới dạng danh sách gạch đầu dòng. */
  lines?: string[]
  /** Mã GA4 đang gắn (nếu có), dùng cho ô nhập. */
  ga4Id?: string
  /** true nếu mã GA4 do màn này gắn (có thể gỡ hoặc đổi tại đây). */
  ga4Managed?: boolean
}

