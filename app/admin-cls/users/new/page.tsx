import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createAdminUser } from '../actions'

export default function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return <NewUserInner searchParams={searchParams} />
}

async function NewUserInner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error

  async function action(formData: FormData) {
    'use server'
    const result = await createAdminUser({
      email: String(formData.get('email') || '').trim().toLowerCase(),
      name: String(formData.get('name') || '').trim(),
      password: String(formData.get('password') || ''),
      role: String(formData.get('role') || 'admin') as any,
    })
    if (result?.error) {
      const { redirect } = await import('next/navigation')
      redirect('/admin-cls/users/new?error=' + encodeURIComponent(result.error))
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

        {error && (
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
