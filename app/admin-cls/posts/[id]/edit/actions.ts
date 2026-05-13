'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Post, PostStatus } from '@/lib/cms/posts'

export type PostUpdate = {
  slug: string
  title: { vi: string; en: string }
  excerpt: { vi: string; en: string }
  content: { vi: string; en: string }
  cover_image: string | null
  tags: string[]
  status: PostStatus
  seo_title: { vi: string; en: string } | null
  seo_description: { vi: string; en: string } | null
  og_image: string | null
}

export async function savePost(id: string | 'new', input: PostUpdate) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  // Validate slug unique
  if (!input.slug) return { error: 'Slug không được trống' }
  if (!input.title.vi) return { error: 'Tiêu đề VI không được trống' }

  const payload = {
    ...input,
    published_at:
      input.status === 'published' ? new Date().toISOString() : null,
  }

  if (id === 'new') {
    const { data, error } = await supabase
      .from('posts')
      .insert({ ...payload, author_id: user.id })
      .select('id, slug')
      .single()
    if (error) return { error: error.message }
    revalidatePath('/blog')
    revalidatePath(`/blog/${data.slug}`)
    revalidatePath('/admin-cls/posts')
    redirect(`/admin-cls/posts/${data.id}/edit?created=1`)
  } else {
    const { error } = await supabase.from('posts').update(payload).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/blog')
    revalidatePath(`/blog/${input.slug}`)
    revalidatePath('/admin-cls/posts')
    revalidatePath(`/admin-cls/posts/${id}/edit`)
    return { ok: true }
  }
}

export async function deletePost(id: string, slug: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin-cls/posts')
  redirect('/admin-cls/posts')
}
