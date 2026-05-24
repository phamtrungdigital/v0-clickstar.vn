import Link from 'next/link'
import { Plus, Target } from 'lucide-react'
import { listCampaignsForAdmin } from '@/lib/personalize/campaigns'
import { CampaignsTable } from './_components/campaigns-table'

export const dynamic = 'force-dynamic'

export default async function AdminPersonalizePage() {
  const campaigns = await listCampaignsForAdmin()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Cá nhân hóa</h1>
          <p className="text-xs text-slate-500">
            Quản lý banner gợi ý hiển thị dựa trên lịch sử truy cập ({campaigns.length})
          </p>
        </div>
        <Link
          href="/admin-cls/personalize/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 mb-3">Chưa có campaign nào</p>
          <Link
            href="/admin-cls/personalize/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Tạo campaign đầu tiên
          </Link>
        </div>
      ) : (
        <CampaignsTable items={campaigns} />
      )}

      <div className="text-[11px] text-slate-500 px-1">
        💡 Banner xuất hiện cho khách dựa trên priority (cao trước) — campaign nào match điều kiện đầu tiên sẽ
        được hiển thị. Test trực tiếp trên public site sau khi save.
      </div>
    </div>
  )
}
