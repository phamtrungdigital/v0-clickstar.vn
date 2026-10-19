import type { Metadata } from 'next'
import { getPublishedPage } from './queries'
import { buildMetadata, brandTitle } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'

/**
 * Build Next.js Metadata for a page by reading its `pages` row.
 * Used in route-level `layout.tsx` so each route gets SEO from CMS.
 *
 *   export const generateMetadata = () => pageMetadata('about')
 *
 * Tiêu đề được chuẩn hóa thương hiệu ("| Click Star"), có canonical và Open Graph đầy đủ.
 */
export async function pageMetadata(slug: string, fallbackTitle = 'Click Star'): Promise<Metadata> {
  const page = await getPublishedPage(slug)
  if (!page) return { title: brandTitle(fallbackTitle) }
  return buildMetadata({
    title: page.seo_title?.vi || page.title || fallbackTitle,
    description: page.seo_description?.vi || '',
    path: slug === 'home' ? '/' : `/${slug}`,
    images: await ogImageOr(page.og_image),
  })
}
