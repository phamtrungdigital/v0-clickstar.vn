import type { Metadata } from 'next'
import { getPublishedPage } from './queries'

/**
 * Build Next.js Metadata for a page by reading its `pages` row.
 * Used in route-level `layout.tsx` so each route gets SEO from CMS.
 *
 *   export const generateMetadata = () => pageMetadata('about')
 */
export async function pageMetadata(slug: string, fallbackTitle = 'ClickStar'): Promise<Metadata> {
  const page = await getPublishedPage(slug)
  if (!page) return { title: fallbackTitle }
  const title = page.seo_title?.vi || page.title || fallbackTitle
  const description = page.seo_description?.vi || ''
  const ogImages = page.og_image ? [page.og_image] : []
  return {
    title,
    description,
    openGraph: { title, description, images: ogImages },
    twitter: { card: 'summary_large_image', title, description, images: ogImages },
  }
}
