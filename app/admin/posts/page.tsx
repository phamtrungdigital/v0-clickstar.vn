import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { listPostsForAdmin } from '@/lib/cms/posts'
import { PostsTable } from './_components/posts-table'

export const dynamic = 'force-dynamic'

export default async function AdminPostsList() {
  const posts = await listPostsForAdmin()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Bài viết</h1>
          <p className="text-xs text-slate-500">Quản lý bài blog ({posts.length})</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm bài viết
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Chưa có bài viết nào</p>
        </div>
      ) : (
        <PostsTable posts={posts} />
      )}
    </div>
  )
}
