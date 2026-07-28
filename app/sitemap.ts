import type { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase/public'

export const revalidate = 3600

const BASE_URL = 'https://clickstar.vn'

/** Route tĩnh không nằm trong bảng pages. */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/services', priority: 0.9 },
  { path: '/contact', priority: 0.8 },
  { path: '/blog', priority: 0.7 },
  { path: '/projects', priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient()

  // posts + case_studies dùng cột `status = 'published'` (KHÔNG phải is_published),
  // và dự án nằm ở bảng case_studies chứ không có bảng `projects`.
  const [pagesRes, postsRes, projectsRes] = await Promise.all([
    supabase.from('pages').select('slug, updated_at').eq('is_published', true),
    supabase.from('posts').select('slug, updated_at').eq('status', 'published'),
    supabase.from('case_studies').select('slug, updated_at').eq('status', 'published'),
  ])

  const now = new Date()

  const cmsPages: MetadataRoute.Sitemap = (pagesRes.data ?? []).map((p: any) => {
    const path = p.slug === 'home' ? '/' : `/${p.slug}`
    return {
      url: `${BASE_URL}${path}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : path.startsWith('/services/') ? 0.9 : 0.8,
    }
  })

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: r.priority,
  }))

  const posts: MetadataRoute.Sitemap = (postsRes.data ?? []).map((p: any) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const projects: MetadataRoute.Sitemap = (projectsRes.data ?? []).map((p: any) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...cmsPages, ...staticPages, ...posts, ...projects]
}
