import Link from 'next/link'
import { Plus, Users, Pencil } from 'lucide-react'
import { listAdminUsers, getCurrentUserId } from '@/lib/cms/users'
import { Card, Chip, EmptyState, PageHeader, btn } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Quản trị viên',
  editor: 'Biên tập viên',
  viewer: 'Người xem',
}
const ROLE_TONE: Record<string, 'blue' | 'neutral'> = { admin: 'blue', editor: 'neutral', viewer: 'neutral' }

export default async function AdminUsersList() {
  const users = await listAdminUsers()
  const currentId = await getCurrentUserId()

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Người dùng"
        description={`Tài khoản được vào khu quản trị, hiện có ${users.length} tài khoản.`}
        actions={
          <Link href="/admin-cls/users/new" className={btn('primary')}>
            <Plus className="h-4 w-4" />
            Thêm người dùng
          </Link>
        }
      />

      {users.length === 0 ? (
        <Card>
          <EmptyState icon={<Users className="h-5 w-5" />} title="Chưa có người dùng nào" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--ad-line)] text-left">
                  <th className="px-5 py-3">Tài khoản</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Vai trò</th>
                  <th className="px-3 py-3">Trạng thái</th>
                  <th className="px-3 py-3">Ngày tạo</th>
                  <th className="px-5 py-3 text-right">
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.user_id === currentId
                  return (
                    <tr key={u.user_id} className="border-t border-[var(--ad-line)] first:border-t-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[var(--ad-accent-soft)] text-[13px] font-semibold text-[var(--ad-accent)]">
                            {(u.full_name || u.email).charAt(0).toUpperCase()}
                          </div>
                          <p className="text-[14.5px] font-medium text-[var(--ad-fg)]">
                            {u.full_name || '(chưa đặt tên)'}
                            {isSelf && <span className="ml-1.5 text-[12.5px] font-normal text-[var(--ad-fg-3)]">(bạn)</span>}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[13.5px] text-[var(--ad-fg-2)]">{u.email}</td>
                      <td className="px-3 py-3">
                        <Chip tone={ROLE_TONE[u.role] ?? 'neutral'}>{ROLE_LABEL[u.role] || u.role}</Chip>
                      </td>
                      <td className="px-3 py-3">
                        <Chip tone={u.is_active ? 'ok' : 'neutral'}>{u.is_active ? 'Đang hoạt động' : 'Đã khoá'}</Chip>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[var(--ad-fg-3)]">
                        {new Date(u.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/admin-cls/users/${u.user_id}/edit`} className={btn('secondary', 'sm')}>
                          <Pencil className="h-3.5 w-3.5" />
                          Sửa
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
