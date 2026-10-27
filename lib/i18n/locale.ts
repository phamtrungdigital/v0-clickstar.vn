/**
 * Quy ước địa chỉ theo ngôn ngữ (thuần, dùng được ở cả server lẫn client):
 *  - Tiếng Việt (ngôn ngữ mặc định) giữ NGUYÊN địa chỉ hiện tại, không tiền tố: /about, /blog/abc.
 *  - Tiếng Anh nằm dưới /en: /en, /en/about, /en/blog/abc.
 * Ngôn ngữ của một trang luôn suy ra từ ĐỊA CHỈ (không từ cookie), nên HTML tĩnh đúng ngôn ngữ ngay khi tải và
 * công cụ tìm kiếm thấy hai bản có địa chỉ riêng.
 */
import { SITE_URL } from '@/lib/seo/site'

export type Lang = 'vi' | 'en'

export const DEFAULT_LANG: Lang = 'vi'
export const EN_PREFIX = '/en'

/** Phần đường dẫn (không query, không hash). */
function pathOnly(p: string): string {
  const i = p.search(/[?#]/)
  return i === -1 ? p : p.slice(0, i)
}

/** 'en' nếu đường dẫn nằm dưới /en, ngược lại 'vi'. Chấp nhận cả chuỗi có query/hash. */
export function langFromPathname(pathname: string | null | undefined): Lang {
  if (!pathname) return DEFAULT_LANG
  const p = pathOnly(pathname)
  return p === EN_PREFIX || p.startsWith(`${EN_PREFIX}/`) ? 'en' : 'vi'
}

/** Bỏ tiền tố /en: '/en/about' thành '/about', '/en' thành '/'. Giữ nguyên query/hash. */
export function stripLocale(path: string): string {
  const only = pathOnly(path)
  const rest = path.slice(only.length)
  if (only === EN_PREFIX) return `/${rest}`
  if (only.startsWith(`${EN_PREFIX}/`)) return `${only.slice(EN_PREFIX.length)}${rest}`
  return path
}

/** Đường dẫn nội bộ có nên gắn tiền tố ngôn ngữ không (loại: ngoài site, neo #, khu admin, API, tệp tĩnh). */
export function isLocalizableHref(href: string): boolean {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return false
  const only = pathOnly(href)
  if (/^\/(admin-cls|api|_next|login|dang-nhap)(\/|$)/.test(only)) return false
  // Tệp tĩnh (có đuôi mở rộng ở đoạn cuối): /images/a.png, /ho-so-nang-luc.html, /sitemap.xml...
  const last = only.split('/').pop() || ''
  if (/\.[a-z0-9]{2,5}$/i.test(last)) return false
  return true
}

/**
 * Địa chỉ của `path` (đường dẫn tiếng Việt, có thể kèm query/hash) trong ngôn ngữ `lang`.
 * localizePath('/about', 'en') = '/en/about'; localizePath('/', 'en') = '/en'; 'vi' giữ nguyên.
 * Đường dẫn không localize được (tệp tĩnh, admin, ngoài site) trả về nguyên vẹn.
 */
export function localizePath(path: string, lang: Lang): string {
  if (!isLocalizableHref(path)) return path
  const vi = stripLocale(path)
  if (lang !== 'en') return vi
  const only = pathOnly(vi)
  const rest = vi.slice(only.length)
  return `${EN_PREFIX}${only === '/' ? '' : only}${rest}`
}

/** Địa chỉ tương ứng ở ngôn ngữ khác: dùng cho nút đổi ngôn ngữ. */
export function switchLocalePath(pathname: string, target: Lang): string {
  // Trang chủ dựng sẵn (prerender) nhận pathname "/index": không chuẩn hoá thì HTML gửi cho Google có liên kết /index
  // (trùng trang chủ) và /en/index (404).
  const p = pathname.replace(/^(\/en)?\/index$/, (_m, en: string | undefined) => en || '/')
  return localizePath(stripLocale(p), target)
}

/** Gốc địa chỉ của chính site (có và không có www): CMS hay dán dạng tuyệt đối https://clickstar.vn/projects/x. */
const OWN_ORIGINS = [SITE_URL, SITE_URL.replace('://', '://www.')]

/**
 * Như localizePath nhưng hiểu cả địa chỉ tuyệt đối tới chính site, dành cho thẻ <a> thường (nội dung CMS):
 * https://clickstar.vn/projects/x sang https://clickstar.vn/en/projects/x khi xem tiếng Anh.
 * Tiếng Việt và địa chỉ ngoài site giữ nguyên.
 */
export function localizeAnyHref(href: string, lang: Lang): string {
  if (!href) return href
  const origin = OWN_ORIGINS.find((o) => href.startsWith(o) && (href.length === o.length || /[/?#]/.test(href[o.length])))
  if (!origin) return localizePath(href, lang)
  if (lang !== 'en') return href
  const rest = href.slice(origin.length)
  return `${SITE_URL}${localizePath(/^[?#]/.test(rest) ? `/${rest}` : rest || '/', 'en')}`
}
