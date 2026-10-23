import { isSitemapView, sitemapViewHtml } from '@/lib/seo/sitemap-xml'

// Bản xem sitemap bằng trình duyệt; next.config.mjs rewrite /sitemap*.xml về đây khi tiêu đề Sec-Fetch-Dest là document.
export const revalidate = 3600

export async function GET(_req: Request, ctx: { params: Promise<{ nhom: string }> }) {
  const { nhom } = await ctx.params
  if (!isSitemapView(nhom)) return new Response('Not found', { status: 404 })
  return new Response(await sitemapViewHtml(nhom), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'X-Robots-Tag': 'noindex',
    },
  })
}
