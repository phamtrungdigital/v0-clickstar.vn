import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { listPostsForAdmin } from '@/lib/cms/posts'
import { Card, EmptyState, PageHeader, btn } from '@/components/admin/ui'
import { PostsTable } from './_components/posts-table'

export const dynamic = 'force-dynamic'

export default async function AdminPostsList() {
  const posts = await listPostsForAdmin()

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Bài viết"
        description={`Quản lý bài blog, hiện có ${posts.length} bài.`}
        actions={
          <Link href="/admin-cls/posts/new" className={btn('primary')}>
            <Plus className="h-4 w-4" />
            Thêm bài viết
          </Link>
        }
      />

      {posts.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title="Chưa có bài viết nào"
            description="Bài đầu tiên sẽ hiện ở đây sau khi anh tạo."
            action={
              <Link href="/admin-cls/posts/new" className={btn('primary')}>
                <Plus className="h-4 w-4" />
                Viết bài đầu tiên
              </Link>
            }
          />
        </Card>
      ) : (
        <PostsTable posts={posts} />
      )}
    </div>
  )
}
