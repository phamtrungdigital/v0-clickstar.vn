import type { Metadata } from 'next'
import { getPublishedPage } from './queries'
import { buildMetadata, brandTitle } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import type { Lang } from '@/lib/i18n/locale'

/**
 * Build Next.js Metadata for a page by reading its `pages` row.
 * Used in route-level `layout.tsx` so each route gets SEO from CMS.
 *
 *   export const generateMetadata = () => pageMetadata('about')            // tiếng Việt
 *   export const generateMetadata = () => pageMetadata('about', undefined, 'en')  // bản /en
 *
 * Tiêu đề được chuẩn hóa thương hiệu ("| Click Star"), có canonical, hreflang và Open Graph đầy đủ.
 * Bản tiếng Anh dùng seo_title.en / seo_description.en (thiếu thì rơi về bản tiếng Việt); chỉ được lập chỉ mục
 * khi trang có tiêu đề SEO tiếng Anh.
 */
export async function pageMetadata(slug: string, fallbackTitle = 'Click Star', lang: Lang = 'vi'): Promise<Metadata> {
  const page = await getPublishedPage(slug)
  const path = slug === 'home' ? '/' : `/${slug}`
  // Chưa có dòng `pages`: bản tiếng Việt giữ như cũ; bản /en không lập chỉ mục (sitemap cũng không liệt kê trang chưa có SEO tiếng Anh).
  if (!page) return lang === 'en' ? buildMetadata({ title: fallbackTitle, path, lang, hasEn: false }) : { title: brandTitle(fallbackTitle) }
  const en = lang === 'en'
  return buildMetadata({
    title: (en ? page.seo_title?.en || page.seo_title?.vi : page.seo_title?.vi) || page.title || fallbackTitle,
    description: (en ? page.seo_description?.en || page.seo_description?.vi : page.seo_description?.vi) || '',
    path,
    lang,
    hasEn: !!page.seo_title?.en?.trim(),
    images: await ogImageOr(page.og_image),
  })
}
