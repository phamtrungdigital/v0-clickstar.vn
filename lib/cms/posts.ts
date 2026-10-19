import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import type { I18n } from './types'

export type PostStatus = 'draft' | 'published'

export type Post = {
  id: string
  slug: string
  title: I18n
  excerpt: I18n
  content: I18n
  cover_image: string | null
  tags: string[]
  status: PostStatus
  published_at: string | null
  author_id: string | null
  seo_title: I18n | null
  seo_description: I18n | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export async function listPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  return (data as unknown as Post[]) || []
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return (data as unknown as Post) || null
}

export async function listPostsForAdmin(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false })
  return (data as unknown as Post[]) || []
}

export async function getPostForAdmin(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
  return (data as unknown as Post) || null
}

/** Bài hiển thị ở khối tin tức trang chủ (chỉ các trường cần cho thẻ bài). */
export type LatestPost = {
  id: string
  slug: string
  title: I18n
  excerpt: I18n
  cover_image: string | null
  tags: string[]
  published_at: string | null
}

/**
 * N bài đã đăng mới nhất, dùng cho trang chủ. Cache 5 phút (và xoá khi admin lưu bài, tag `posts`)
 * bằng client không cookie để trang chủ vẫn render tĩnh.
 */
export async function getLatestPosts(limit = 3): Promise<LatestPost[]> {
  const cached = unstable_cache(
    async (n: number): Promise<LatestPost[]> => {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('posts')
        .select('id, slug, title, excerpt, cover_image, tags, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(n)
      if (error || !data) return []
      return data as unknown as LatestPost[]
    },
    ['latest-posts'],
    { tags: ['posts'], revalidate: 300 }
  )
  return cached(limit)
}

/** Dữ liệu cho mục Tin tức trên thanh menu: 3 bài mới nhất và số bài đăng trong 7 ngày gần nhất. */
export type NavNews = { count: number; items: LatestPost[] }

export async function getNavNews(): Promise<NavNews> {
  const cached = unstable_cache(
    async (): Promise<NavNews> => {
      const supabase = createPublicClient()
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const [latest, recent] = await Promise.all([
        supabase
          .from('posts')
          .select('id, slug, title, excerpt, cover_image, tags, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(4),
        supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published')
          .gte('published_at', since),
      ])
      if (latest.error || !latest.data) return { count: 0, items: [] }
      return { count: recent.count ?? 0, items: latest.data as unknown as LatestPost[] }
    },
    ['nav-news'],
    { tags: ['posts'], revalidate: 300 }
  )
  return cached()
}
