import type { Metadata } from 'next'
import { BRAND } from './site'

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
  /** Đường dẫn tuyệt đối của trang, ví dụ "/blog/abc". Dùng cho canonical và og:url. */
  path?: string
  images?: (string | null | undefined)[]
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
}

/** Metadata đầy đủ cho một trang: tiêu đề chuẩn thương hiệu, canonical, Open Graph, Twitter. */
export function buildMetadata(o: MetaInput): Metadata {
  const title = brandTitle(o.title)
  const description = o.description || undefined
  const images = (o.images ?? []).filter((x): x is string => !!x)
  return {
    title,
    description,
    alternates: o.path ? { canonical: o.path } : undefined,
    openGraph: {
      title,
      description,
      url: o.path,
      siteName: BRAND,
      locale: 'vi_VN',
      type: o.type ?? 'website',
      images,
      ...(o.type === 'article'
        ? { publishedTime: o.publishedTime ?? undefined, modifiedTime: o.modifiedTime ?? undefined }
        : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}
