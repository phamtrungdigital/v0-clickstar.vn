import { PostEditor } from '../[id]/edit/_components/post-editor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default function NewPostPage() {
  return <PostEditor post={null} mode="new" />
}
