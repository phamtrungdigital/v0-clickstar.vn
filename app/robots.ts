import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

/**
 * robots.txt: cho phép thu thập toàn bộ phần công khai (kể cả CSS/JS trong /_next để Google hiển thị trang),
 * chặn khu quản trị và API. Các trình thu thập AI (OAI-SearchBot, GPTBot...) hiện được phép như mọi bot khác;
 * muốn chặn riêng từng loại thì thêm quy tắc userAgent tương ứng ở đây.
 * Không khai "Host:": chỉ Yandex dùng, Googlebot bỏ qua và Search Console báo cảnh báo.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin-cls', '/api/', '/login', '/dang-nhap'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
