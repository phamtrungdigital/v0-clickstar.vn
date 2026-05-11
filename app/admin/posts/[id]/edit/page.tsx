import { notFound } from 'next/navigation'
import { getPostForAdmin } from '@/lib/cms/posts'
import { PostEditor } from './_components/post-editor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPostForAdmin(id)
  if (!post) notFound()
  return <PostEditor post={post} mode="edit" />
}
