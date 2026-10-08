import { PostEditor } from '../[id]/edit/_components/post-editor'
import { getAdminProfile } from '@/lib/admin-cls/auth'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function NewPostPage() {
  const me = await getAdminProfile()
  return <PostEditor post={null} mode="new" currentEditorName={me?.full_name ?? null} />
}
