import type { Metadata } from 'next'
import { BRAND } from './site'
import { localizePath, type Lang } from '@/lib/i18n/locale'

/** Đuôi thương hiệu thường gặp trong tiêu đề cũ: "... — ClickStar", "| Click Star Digital"... */
const BRAND_TAIL = /\s*[|\-–—:·]\s*click star(\s+digital)?\s*$/i
/** Từ nối bỏ khỏi cuối khi cắt tiêu đề cho ngắn, tránh kết thúc dở dang như "... Tăng trưởng khách hàng và". */
const DANGLING = /\s+(và|nhờ|giúp|của|cho|để|với|trong|tại|the|and|for|of|to|with|in|on|a|an)$/i

/**
 * Chuẩn hóa tên thương hiệu trong tiêu đề: "ClickStar", "Clickstar" thành "Click Star", bỏ đuôi thương hiệu cũ
 * rồi gắn lại đúng một kiểu " | Click Star". Tiêu đề đã bắt đầu bằng thương hiệu (trang chủ) giữ nguyên.
 * Không cắt ngắn: tiêu đề do người dùng admin nhập được giữ đủ chữ.
 */
export function brandTitle(raw: string): string {
  const cleaned = (raw || '').trim().replace(/click\s?star/gi, BRAND)
  const core = cleaned.replace(BRAND_TAIL, '').trim()
  if (!core) return BRAND
  if (core.toLowerCase().includes(BRAND.toLowerCase())) return core
  return `${core} | ${BRAND}`
}

/** Cắt chữ còn tối đa `max` ký tự, ưu tiên ngắt ở ranh giới từ và bỏ từ nối thừa ở cuối. */
export function fitTitle(text: string, max: number): string {
  const t = (text || '').trim().replace(/\s+/g, ' ')
  if (t.length <= max) return t
  let cut = t.slice(0, max + 1)
  const sp = cut.lastIndexOf(' ')
  cut = sp > max * 0.5 ? cut.slice(0, sp) : t.slice(0, max)
  cut = cut.replace(/[\s,;:\-–—]+$/, '')
  while (DANGLING.test(cut)) cut = cut.replace(DANGLING, '')
  return cut
}

/** Độ dài mô tả tối đa: Google thường hiện khoảng 155-160 ký tự, dài hơn bị cắt giữa chừng trên kết quả tìm kiếm. */
export const DESCRIPTION_MAX = 160

/**
 * Mô tả quá dài thì rút gọn: ưu tiên dừng ở hết câu (dấu chấm) nếu đoạn còn lại vẫn đủ ý (từ 100 ký tự),
 * không thì cắt ở ranh giới từ và thêm dấu "…". Mô tả nhập trong admin vẫn lưu đủ chữ, chỉ thẻ meta bị rút.
 */
export function fitDescription(text: string | null | undefined, max = DESCRIPTION_MAX): string | undefined {
  const t = (text || '').trim().replace(/\s+/g, ' ')
  if (!t) return undefined
  if (t.length <= max) return t
  const head = t.slice(0, max)
  const dot = Math.max(head.lastIndexOf('. '), head.endsWith('.') ? head.length - 1 : -1)
  if (dot >= 100) return head.slice(0, dot + 1)
  return `${fitTitle(t, max - 1)}…`
}

type MetaInput = {
  title: string
  description?: string | null
  /** Đường dẫn TIẾNG VIỆT của trang (không tiền tố), ví dụ "/blog/abc". Bản /en được suy ra từ đây. */
  path?: string
  /** Ngôn ngữ của bản đang dựng metadata (mặc định tiếng Việt). */
  lang?: Lang
  /**
   * Trang này có bản tiếng Anh đủ nội dung chưa (mặc định có). Có: cặp hreflang hai chiều vi/en/x-default.
   * Chưa có: bản /en vẫn mở được cho khách nhưng không lập chỉ mục (noindex, canonical trỏ chính nó, không hreflang)
   * và bản tiếng Việt không khai báo hreflang tiếng Anh.
   */
  hasEn?: boolean
  images?: (string | null | undefined)[]
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
}

/**
 * Ảnh chia sẻ có bản tiếng Anh: ảnh dựng sẵn nằm ở /images/og/<tên>.jpg, bản tiếng Anh là <tên>-en.jpg.
 * Trang /en tự dùng bản tiếng Anh; ảnh khác (bìa bài viết, ảnh tải lên) giữ nguyên.
 */
export function localizeOgImage(url: string, lang: Lang): string {
  if (lang !== 'en') return url
  return url.replace(/(\/images\/og\/[a-z0-9-]+)\.jpg(\?.*)?$/i, (_m, base: string, q?: string) =>
    base.endsWith('-en') ? `${base}.jpg${q ?? ''}` : `${base}-en.jpg${q ?? ''}`
  )
}

/** Metadata đầy đủ cho một trang: tiêu đề chuẩn thương hiệu, canonical, hreflang, Open Graph, Twitter. */
export function buildMetadata(o: MetaInput): Metadata {
  const lang: Lang = o.lang ?? 'vi'
  const hasEn = o.hasEn ?? true
  const title = brandTitle(o.title)
  const description = fitDescription(o.description)
  const images = (o.images ?? []).filter((x): x is string => !!x).map((x) => localizeOgImage(x, lang))
  const viPath = o.path
  const selfPath = viPath ? localizePath(viPath, lang) : undefined
  // Bản /en chưa đủ nội dung: không lập chỉ mục (vẫn cho theo liên kết). Canonical vẫn trỏ chính nó: noindex kèm canonical
  // sang địa chỉ khác là hai tín hiệu mâu thuẫn, Google khuyên chọn một.
  const enFallback = lang === 'en' && !hasEn
  const alternates: Metadata['alternates'] = !viPath
    ? undefined
    : {
        canonical: selfPath,
        languages: hasEn ? { vi: viPath, en: localizePath(viPath, 'en'), 'x-default': viPath } : undefined,
      }
  return {
    title,
    description,
    alternates,
    robots: enFallback ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: selfPath,
      siteName: BRAND,
      locale: lang === 'en' ? 'en_US' : 'vi_VN',
      alternateLocale: hasEn ? [lang === 'en' ? 'vi_VN' : 'en_US'] : undefined,
      type: o.type ?? 'website',
      images,
      ...(o.type === 'article'
        ? { publishedTime: o.publishedTime ?? undefined, modifiedTime: o.modifiedTime ?? undefined }
        : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}
