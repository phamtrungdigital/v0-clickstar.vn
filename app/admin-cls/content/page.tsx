import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { loadContentAnalysis } from '@/lib/cms/content-data'
import { ContentDashboard } from './_components/content-dashboard'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const content = await loadContentAnalysis()

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Quản trị bài viết</h1>
          <p className="text-xs text-slate-500">
            Kho bài blog đang phủ nhóm chủ đề, dịch vụ và giai đoạn mua nào, còn thiếu gì và nên viết bài nào tiếp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin-cls/posts"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-700/40"
          >
            <FileText className="w-3.5 h-3.5" />
            Danh sách bài viết
          </Link>
          <Link
            href="/admin-cls/posts/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm bài viết
          </Link>
        </div>
      </div>

      <ContentDashboard data={content} />
    </div>
  )
}
