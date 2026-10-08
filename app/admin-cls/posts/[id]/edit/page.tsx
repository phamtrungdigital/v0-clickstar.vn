import { notFound } from 'next/navigation'
import { getPostForAdmin } from '@/lib/cms/posts'
import { getAdminProfile } from '@/lib/admin-cls/auth'
import { PostEditor } from './_components/post-editor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [post, me] = await Promise.all([getPostForAdmin(id), getAdminProfile()])
  if (!post) notFound()
  return <PostEditor post={post} mode="edit" currentEditorName={me?.full_name ?? null} />
}
