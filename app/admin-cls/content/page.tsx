import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { loadContentAnalysis } from '@/lib/cms/content-data'
import { PageHeader, btn } from '@/components/admin/ui'
import { ContentDashboard } from './_components/content-dashboard'
import { IndexNowPanel } from './_components/indexnow-panel'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const content = await loadContentAnalysis()

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <PageHeader
        className="mb-1"
        title="Quản trị bài viết"
        description="Kho bài blog đang phủ nhóm chủ đề, dịch vụ và giai đoạn mua nào, còn thiếu gì và nên viết bài nào tiếp."
        actions={
          <>
            <Link href="/admin-cls/posts" className={btn('secondary')}>
              <FileText className="h-4 w-4" />
              Danh sách bài viết
            </Link>
            <Link href="/admin-cls/posts/new" className={btn('primary')}>
              <Plus className="h-4 w-4" />
              Thêm bài viết
            </Link>
          </>
        }
      />

      <IndexNowPanel />

      <ContentDashboard data={content} />
    </div>
  )
}
