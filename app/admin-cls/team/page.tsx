import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { listTeamMembersForAdmin } from '@/lib/cms/team-members'
import { Card, EmptyState, PageHeader, btn } from '@/components/admin/ui'
import { TeamTable } from './_components/team-table'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const members = await listTeamMembersForAdmin()

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Đội ngũ"
        description={`Thành viên hiển thị đồng bộ ở trang chủ, trang Giới thiệu và mọi trang có khối Đội ngũ, hiện có ${members.length} người.`}
        actions={
          <Link href="/admin-cls/team/new" className={btn('primary')}>
            <Plus className="h-4 w-4" />
            Thêm thành viên
          </Link>
        }
      />

      {members.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="Chưa có thành viên nào"
            description="Thành viên đầu tiên sẽ hiện ở đây sau khi anh thêm."
            action={
              <Link href="/admin-cls/team/new" className={btn('primary')}>
                <Plus className="h-4 w-4" />
                Thêm thành viên đầu tiên
              </Link>
            }
          />
        </Card>
      ) : (
        <TeamTable items={members} />
      )}

      <p className="mt-3 px-1 text-[13px] text-[var(--ad-fg-3)]">
        Sửa một thành viên thì mọi trang tự cập nhật theo. Số thứ tự càng cao thì hiện càng trước.
      </p>
    </div>
  )
}
