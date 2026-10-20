/**
 * IndexNow: báo cho Bing, Yandex, Naver, Seznam (và các công cụ cùng chuẩn) biết ngay khi có bài mới hoặc bài vừa sửa,
 * thay vì chờ họ tự đọc sitemap. KHÔNG áp dụng cho Google (Google chưa hỗ trợ IndexNow, chỉ đọc sitemap và liên kết).
 *
 * Khóa không phải bí mật: IndexNow bắt buộc công khai khóa ở https://clickstar.vn/<khóa>.txt (file nằm ở public/) để
 * công cụ tìm kiếm xác minh chủ website. Đổi khóa thì đổi cả tên file và nội dung file đó.
 */
import { after } from 'next/server'
import { SITE_URL } from './site'
import { localizePath } from '@/lib/i18n/locale'

export const INDEXNOW_KEY = '7af5f067c2f80ed77cc01db298d540b1'
const ENDPOINT = 'https://api.indexnow.org/IndexNow'
const MAX_URLS = 10_000

export type IndexNowResult = {
  ok: boolean
  /** Mã HTTP IndexNow trả về, 0 nếu không gọi được. */
  status: number
  submitted: number
  message: string
}

/** Địa chỉ một bài blog: bản tiếng Việt, kèm bản /en khi bài đã có bản tiếng Anh đủ nội dung (khớp sitemap). */
export function postUrls(slug: string, hasEn: boolean): string[] {
  const path = `/blog/${slug}`
  const urls = [`${SITE_URL}${localizePath(path, 'vi')}`]
  if (hasEn) urls.push(`${SITE_URL}${localizePath(path, 'en')}`)
  return urls
}

/** Danh sách blog (vi và en): đổi mỗi khi có bài mới nên cũng nên báo. */
export function blogIndexUrls(): string[] {
  return [`${SITE_URL}${localizePath('/blog', 'vi')}`, `${SITE_URL}${localizePath('/blog', 'en')}`]
}

const MESSAGES: Record<number, string> = {
  200: 'Đã gửi. Công cụ tìm kiếm đã nhận danh sách địa chỉ.',
  202: 'Đã nhận. Công cụ tìm kiếm đang xác minh khóa rồi sẽ xử lý.',
  400: 'Yêu cầu không hợp lệ.',
  403: 'IndexNow chưa xác minh được khóa của website nên chưa nhận danh sách. Thường tự hết sau vài giờ; nếu sau 1 ngày vẫn báo thì cần kiểm tra lại.',
  422: 'Có địa chỉ không thuộc clickstar.vn.',
  429: 'Gửi quá nhiều lần, hãy thử lại sau.',
}

/** Gửi một danh sách địa chỉ tới IndexNow. Không ném lỗi: mọi sự cố trả về trong kết quả. */
export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  const list = [...new Set(urls)].filter((u) => u.startsWith(`${SITE_URL}/`)).slice(0, MAX_URLS)
  if (!list.length) return { ok: false, status: 0, submitted: 0, message: 'Không có địa chỉ hợp lệ để gửi.' }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: list,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })
    const ok = res.status === 200 || res.status === 202
    return {
      ok,
      status: res.status,
      submitted: ok ? list.length : 0,
      message: MESSAGES[res.status] ?? `IndexNow trả mã ${res.status}.`,
    }
  } catch {
    return { ok: false, status: 0, submitted: 0, message: 'Không kết nối được tới IndexNow, hãy thử lại sau.' }
  }
}

/**
 * Tự báo sau khi đăng hoặc sửa bài (chạy sau khi đã trả lời người dùng, không làm chậm nút Lưu). Chỉ chạy ở bản
 * production để bản xem trước và bản chạy máy không gửi địa chỉ thật; lỗi bị bỏ qua vì sitemap vẫn là đường dự phòng.
 */
export function notifyIndexNow(urls: string[]): void {
  if (process.env.VERCEL_ENV !== 'production') return
  const run = async () => {
    await submitIndexNow(urls)
  }
  try {
    after(run)
  } catch {
    void run()
  }
}
