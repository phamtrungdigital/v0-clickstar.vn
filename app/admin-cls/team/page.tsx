import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { listTeamMembersForAdmin } from '@/lib/cms/team-members'
import { TeamTable } from './_components/team-table'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const members = await listTeamMembersForAdmin()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Đội ngũ</h1>
          <p className="text-xs text-slate-500">
            Quản lý thành viên — đồng bộ giữa trang chủ, Giới thiệu và mọi page có section Team ({members.length})
          </p>
        </div>
        <Link
          href="/admin-cls/team/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm thành viên
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 mb-3">Chưa có thành viên nào</p>
          <Link
            href="/admin-cls/team/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm thành viên đầu tiên
          </Link>
        </div>
      ) : (
        <TeamTable items={members} />
      )}

      <div className="text-[11px] text-slate-500 px-1">
        💡 Sửa 1 thành viên → tự sync trên trang chủ + /about + mọi page có section Team. Sort cao hiển thị trước.
      </div>
    </div>
  )
}
