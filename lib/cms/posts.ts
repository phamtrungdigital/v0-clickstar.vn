import { createClient } from '@/lib/supabase/server'
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
