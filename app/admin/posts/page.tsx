import Link from 'next/link'
import Image from 'next/image'
import { Plus, FileText, ExternalLink, Edit } from 'lucide-react'
import { listPostsForAdmin } from '@/lib/cms/posts'

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
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
                <th className="px-4 py-2.5">Bài viết</th>
                <th className="px-4 py-2.5">Slug</th>
                <th className="px-4 py-2.5">Tags</th>
                <th className="px-4 py-2.5">Trạng thái</th>
                <th className="px-4 py-2.5">Đăng</th>
                <th className="px-4 py-2.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt=""
                          width={48}
                          height={36}
                          className="w-12 h-9 rounded object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-9 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900 dark:text-white line-clamp-2">
                        {post.title.vi}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{post.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === 'published' && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                          title="Xem"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
                      >
                        <Edit className="w-3 h-3" />
                        Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
