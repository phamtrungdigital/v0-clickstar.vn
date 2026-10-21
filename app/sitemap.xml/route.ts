import { sitemapIndexXml, xmlResponse } from '@/lib/seo/sitemap-xml'

// Xem lib/seo/sitemap-xml.ts: sitemap chia nhóm, tạo lại tối đa mỗi giờ.
export const revalidate = 3600

export async function GET() {
  return xmlResponse(await sitemapIndexXml())
}
