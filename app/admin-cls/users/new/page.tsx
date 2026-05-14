import Link from 'next/link'
import { ArrowLeft, UserCheck, Edit3 } from 'lucide-react'
import { createAdminUser } from '../actions'

export default function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; duplicate?: string; existingId?: string; existingEmail?: string }>
}) {
  return <NewUserInner searchParams={searchParams} />
}

async function NewUserInner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; duplicate?: string; existingId?: string; existingEmail?: string }>
}) {
  const params = await searchParams
  const error = params.error
  const isDuplicate = params.duplicate === '1'
  const existingId = params.existingId
  const existingEmail = params.existingEmail

  async function action(formData: FormData) {
    'use server'
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const result = await createAdminUser({
      email,
      name: String(formData.get('name') || '').trim(),
      password: String(formData.get('password') || ''),
      role: String(formData.get('role') || 'admin') as any,
    })
    if (result?.error) {
      const { redirect } = await import('next/navigation')
      if (result.error === 'duplicate' && result.existingUserId) {
        redirect(
          `/admin-cls/users/new?duplicate=1&existingId=${result.existingUserId}&existingEmail=${encodeURIComponent(email)}`
        )
      } else {
        redirect('/admin-cls/users/new?error=' + encodeURIComponent(result.error))
      }
    }
  }

  return (
    <div className="max-w-xl space-y-3">
      <Link
        href="/admin-cls/users"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Quay lại
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Thêm người dùng admin</h1>

        {isDuplicate && existingId && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2.5">
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  Email{' '}
                  <span className="font-mono">{existingEmail}</span>{' '}
                  đã tồn tại trong hệ thống
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Người dùng này đã được tạo trước đó. Anh có thể mở trang chỉnh sửa để đổi role,
                  reset mật khẩu, hoặc disable tài khoản.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-7">
              <Link
                href={`/admin-cls/users/${existingId}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Mở trang chỉnh sửa
              </Link>
              <Link
                href="/admin-cls/users/new"
                className="text-xs text-amber-800 hover:text-amber-900 underline"
              >
                Hoặc dùng email khác
              </Link>
            </div>
          </div>
        )}

        {error && !isDuplicate && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {error}
          </div>
        )}

        <form action={action} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              placeholder="email@clickstar.vn"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Họ tên</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Nguyễn Văn A"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Mật khẩu tạm</label>
            <input
              type="text"
              name="password"
              required
              minLength={8}
              placeholder="Tối thiểu 8 ký tự"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Anh share mật khẩu này cho user qua kênh bảo mật, họ sẽ đổi sau khi login lần đầu.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Vai trò</label>
            <select
              name="role"
              defaultValue="admin"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
            >
              <option value="admin">Admin — toàn quyền</option>
              <option value="editor">Editor — edit content (chưa enforce)</option>
              <option value="viewer">Viewer — chỉ xem (chưa enforce)</option>
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              Hiện tại tất cả role đều có quyền edit. Phân quyền sẽ bổ sung phase sau.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white text-sm font-medium py-2 rounded hover:bg-primary/90"
          >
            Tạo người dùng
          </button>
        </form>
      </div>
    </div>
  )
}
