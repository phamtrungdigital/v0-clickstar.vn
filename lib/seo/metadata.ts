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

type MetaInput = {
  title: string
  description?: string | null
  /** Đường dẫn TIẾNG VIỆT của trang (không tiền tố), ví dụ "/blog/abc". Bản /en được suy ra từ đây. */
  path?: string
  /** Ngôn ngữ của bản đang dựng metadata (mặc định tiếng Việt). */
  lang?: Lang
  /**
   * Trang này có bản tiếng Anh đủ nội dung chưa (mặc định có). Có: cặp hreflang hai chiều vi/en/x-default.
   * Chưa có: bản /en vẫn mở được cho khách nhưng không lập chỉ mục (noindex, canonical về bản tiếng Việt)
   * và bản tiếng Việt không khai báo hreflang tiếng Anh.
   */
  hasEn?: boolean
  images?: (string | null | undefined)[]
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
}

/** Metadata đầy đủ cho một trang: tiêu đề chuẩn thương hiệu, canonical, hreflang, Open Graph, Twitter. */
export function buildMetadata(o: MetaInput): Metadata {
  const lang: Lang = o.lang ?? 'vi'
  const hasEn = o.hasEn ?? true
  const title = brandTitle(o.title)
  const description = o.description || undefined
  const images = (o.images ?? []).filter((x): x is string => !!x)
  const viPath = o.path
  const selfPath = viPath ? localizePath(viPath, lang) : undefined
  // Bản /en chưa đủ nội dung: canonical về bản tiếng Việt và không lập chỉ mục (vẫn cho theo liên kết).
  const enFallback = lang === 'en' && !hasEn
  const alternates: Metadata['alternates'] = !viPath
    ? undefined
    : enFallback
      ? { canonical: viPath }
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
