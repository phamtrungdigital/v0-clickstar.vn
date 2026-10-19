import { getSiteSettings } from '@/lib/cms/settings'

/**
 * Ảnh chia sẻ (og:image) cho một trang: ảnh riêng đầu tiên có giá trị, nếu không có thì dùng ảnh mặc định của site
 * (Cài đặt, mục SEO mặc định). Cần thiết vì metadata của trang con thay thế hẳn openGraph của layout gốc,
 * nên ảnh mặc định ở layout gốc không tự áp xuống các trang chưa có ảnh riêng.
 */
export async function ogImageOr(...own: (string | null | undefined)[]): Promise<string[]> {
  const first = own.find((x): x is string => !!x)
  if (first) return [first]
  const settings = await getSiteSettings()
  return settings?.default_og_image ? [settings.default_og_image] : []
}
