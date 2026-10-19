import { notFound } from 'next/navigation'
import { getPostForAdmin } from '@/lib/cms/posts'
import { getSiteSettings } from '@/lib/cms/settings'
import { PostEditor } from './_components/post-editor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [post, settings] = await Promise.all([getPostForAdmin(id), getSiteSettings()])
  if (!post) notFound()
  return <PostEditor post={post} mode="edit" siteUrl={settings?.site_url} />
}
