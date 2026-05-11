import { PostEditor } from '../[id]/edit/_components/post-editor'

export const dynamic = 'force-dynamic'

export default function NewPostPage() {
  return <PostEditor post={null} mode="new" />
}
