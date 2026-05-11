import Link from 'next/link'
import { Plus, Users, Edit, ShieldCheck } from 'lucide-react'
import { listAdminUsers, getCurrentUserId } from '@/lib/cms/users'

export const dynamic = 'force-dynamic'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

export default async function AdminUsersList() {
  const users = await listAdminUsers()
  const currentId = await getCurrentUserId()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Người dùng</h1>
          <p className="text-xs text-slate-500">Quản lý tài khoản admin ({users.length})</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm người dùng
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Chưa có user nào</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
                <th className="px-4 py-2.5">Tài khoản</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Vai trò</th>
                <th className="px-4 py-2.5">Trạng thái</th>
                <th className="px-4 py-2.5">Tạo lúc</th>
                <th className="px-4 py-2.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map((u) => {
                const isSelf = u.user_id === currentId
                return (
                  <tr key={u.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                          {(u.full_name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {u.full_name || '(chưa đặt tên)'}
                          {isSelf && <span className="text-[10px] ml-1 text-emerald-600">(bạn)</span>}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        <ShieldCheck className="w-3 h-3" />
                        {ROLE_LABEL[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          u.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/users/${u.user_id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
                      >
                        <Edit className="w-3 h-3" />
                        Sửa
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
