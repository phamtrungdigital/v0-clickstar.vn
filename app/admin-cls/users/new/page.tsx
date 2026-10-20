import Link from 'next/link'
import { ArrowLeft, UserCheck, Pencil } from 'lucide-react'
import { Card, PageHeader, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
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
    <div className="mx-auto max-w-xl">
      <Link href="/admin-cls/users" className="mb-3 inline-flex items-center gap-1.5 text-[13.5px] text-[var(--ad-fg-3)] hover:text-[var(--ad-fg)]">
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      <PageHeader title="Thêm người dùng" description="Tạo tài khoản mới để vào khu quản trị." />

      <Card className="space-y-4 p-6">
        {isDuplicate && existingId && (
          <div className="space-y-3 rounded-2xl bg-[rgba(255,159,10,.14)] p-4">
            <div className="flex items-start gap-3">
              <UserCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#b25e00]" />
              <div className="flex-1">
                <p className="text-[14.5px] font-semibold text-[#8a4a00]">
                  Email <span className="font-mono">{existingEmail}</span> đã có trong hệ thống
                </p>
                <p className="mt-1 text-[13.5px] text-[#8a4a00]">
                  Tài khoản này đã được tạo trước đó. Anh mở trang chỉnh sửa để đổi vai trò, đặt lại mật khẩu hoặc khoá tài khoản.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pl-8">
              <Link href={`/admin-cls/users/${existingId}/edit`} className={btn('primary', 'sm')}>
                <Pencil className="h-3.5 w-3.5" />
                Mở trang chỉnh sửa
              </Link>
              <Link href="/admin-cls/users/new" className="text-[13.5px] text-[#8a4a00] underline">
                Hoặc dùng email khác
              </Link>
            </div>
          </div>
        )}

        {error && !isDuplicate && (
          <div className="rounded-xl bg-[rgba(255,59,48,.10)] px-4 py-2.5 text-[13.5px] text-[#d70015]">{error}</div>
        )}

        <form action={action} className="space-y-4">
          <div>
            <label className={fieldLabelClass}>Email</label>
            <input type="email" name="email" required autoFocus placeholder="email@clickstar.vn" className={fieldInputClass} />
          </div>
          <div>
            <label className={fieldLabelClass}>Họ tên</label>
            <input type="text" name="name" required placeholder="Nguyễn Văn A" className={fieldInputClass} />
          </div>
          <div>
            <label className={fieldLabelClass}>Mật khẩu tạm</label>
            <input
              type="text"
              name="password"
              required
              minLength={8}
              placeholder="Tối thiểu 8 ký tự"
              className={fieldInputClass + ' font-mono'}
            />
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
              Anh gửi mật khẩu này cho người dùng qua kênh bảo mật, họ nên đổi sau khi đăng nhập lần đầu.
            </p>
          </div>
          <div>
            <label className={fieldLabelClass}>Vai trò</label>
            <select name="role" defaultValue="admin" className={fieldInputClass}>
              <option value="admin">Quản trị viên: toàn quyền</option>
              <option value="editor">Biên tập viên: sửa nội dung (chưa áp dụng)</option>
              <option value="viewer">Người xem: chỉ xem (chưa áp dụng)</option>
            </select>
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
              Hiện mọi vai trò đều có quyền sửa. Phân quyền theo vai trò sẽ làm ở giai đoạn sau.
            </p>
          </div>

          <button type="submit" className={btn('primary', 'lg') + ' w-full'}>
            Tạo người dùng
          </button>
        </form>
      </Card>
    </div>
  )
}
