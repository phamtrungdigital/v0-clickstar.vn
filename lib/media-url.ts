/**
 * Ảnh tải lên từ trang quản trị nằm trong kho lưu trữ của nhà cung cấp dữ liệu (bucket `media`), nhưng khách và
 * công cụ tìm kiếm chỉ được thấy địa chỉ của chính website: clickstar.vn/media/... (xem app/media/[...path]/route.ts).
 *
 * Cơ sở dữ liệu vẫn lưu địa chỉ gốc (trang quản trị đọc và ghi nguyên bản). Mọi hàm đọc dữ liệu CÔNG KHAI phải chạy
 * kết quả qua maskMedia() trước khi trả ra, để HTML, thẻ og:image, JSON-LD, sitemap và /_next/image không lộ tên máy chủ.
 */
const MEDIA_URL = /https?:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/media\//gi

export const MEDIA_PATH_PREFIX = '/media/'

/** Đổi địa chỉ ảnh gốc (trong một chuỗi, kể cả đoạn HTML/markdown dài) thành /media/... của website. */
export function maskMediaUrl<T extends string | null | undefined>(s: T): T {
  if (typeof s !== 'string' || s.indexOf('supabase.co') === -1) return s
  return s.replace(MEDIA_URL, MEDIA_PATH_PREFIX) as T
}

/** Như maskMediaUrl nhưng đi sâu vào mảng/đối tượng thường (bản ghi trả về từ cơ sở dữ liệu). */
export function maskMedia<T>(value: T): T {
  if (typeof value === 'string') return maskMediaUrl(value) as unknown as T
  if (Array.isArray(value)) return value.map((v) => maskMedia(v)) as unknown as T
  if (value && typeof value === 'object') {
    const proto = Object.getPrototypeOf(value)
    if (proto !== Object.prototype && proto !== null) return value
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = maskMedia(v)
    return out as T
  }
  return value
}
