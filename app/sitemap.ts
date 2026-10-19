import type { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { localizePath, type Lang } from '@/lib/i18n/locale'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { caseStudyHasEnglish } from '@/lib/cms/case-studies-types'

export const revalidate = 3600

const BASE_URL = 'https://clickstar.vn'

/** Route tĩnh không nằm trong bảng pages. */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/services', priority: 0.9 },
  { path: '/contact', priority: 0.8 },
  { path: '/blog', priority: 0.7 },
  { path: '/projects', priority: 0.7 },
]

const abs = (path: string, lang: Lang) => `${BASE_URL}${localizePath(path, lang)}`

type Meta = Pick<MetadataRoute.Sitemap[number], 'lastModified' | 'changeFrequency' | 'priority'>

/**
 * Một trang tiếng Việt kèm bản /en tương ứng (nếu đã có bản tiếng Anh đủ nội dung). Cả hai mục khai báo cặp
 * hreflang hai chiều vi/en để công cụ tìm kiếm ghép đúng hai bản. Trang chưa có bản tiếng Anh chỉ có mục tiếng Việt.
 */
function pair(path: string, meta: Meta, hasEn: boolean): MetadataRoute.Sitemap {
  const viUrl = abs(path, 'vi')
  if (!hasEn) return [{ url: viUrl, ...meta }]
  const alternates = { languages: { vi: viUrl, en: abs(path, 'en') } }
  return [
    { url: viUrl, ...meta, alternates },
    { url: abs(path, 'en'), ...meta, alternates },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient()

  // posts + case_studies dùng cột `status = 'published'` (KHÔNG phải is_published),
  // và dự án nằm ở bảng case_studies chứ không có bảng `projects`.
  const [pagesRes, postsRes, projectsRes] = await Promise.all([
    supabase.from('pages').select('slug, updated_at, seo_title').eq('is_published', true),
    supabase.from('posts').select('slug, updated_at, title, content').eq('status', 'published'),
    supabase.from('case_studies').select('slug, updated_at, title_en, summary_en, body_en').eq('status', 'published'),
  ])

  const now = new Date()
  const when = (d: string | null | undefined) => (d ? new Date(d) : now)

  const cmsPages: MetadataRoute.Sitemap = (pagesRes.data ?? []).flatMap((p: any) => {
    const path = p.slug === 'home' ? '/' : `/${p.slug}`
    return pair(
      path,
      {
        lastModified: when(p.updated_at),
        changeFrequency: 'monthly',
        priority: path === '/' ? 1 : path.startsWith('/services/') ? 0.9 : 0.8,
      },
      // Trang CMS có tiêu đề SEO tiếng Anh thì bản /en được lập chỉ mục (khớp pageMetadata)
      !!p.seo_title?.en?.trim()
    )
  })

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((r) =>
    pair(r.path, { lastModified: now, changeFrequency: 'weekly', priority: r.priority }, true)
  )

  const posts: MetadataRoute.Sitemap = (postsRes.data ?? []).flatMap((p: any) =>
    pair(
      `/blog/${p.slug}`,
      { lastModified: when(p.updated_at), changeFrequency: 'monthly', priority: 0.6 },
      postHasEnglish({ title: p.title, content: p.content })
    )
  )

  const projects: MetadataRoute.Sitemap = (projectsRes.data ?? []).flatMap((p: any) =>
    pair(
      `/projects/${p.slug}`,
      { lastModified: when(p.updated_at), changeFrequency: 'monthly', priority: 0.6 },
      caseStudyHasEnglish({ title_en: p.title_en, summary_en: p.summary_en, body_en: p.body_en })
    )
  )

  return [...cmsPages, ...staticPages, ...posts, ...projects]
}
