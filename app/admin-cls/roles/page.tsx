import Link from 'next/link'
import { ShieldCheck, Pencil, Eye } from 'lucide-react'
import { Card, Chip, PageHeader } from '@/components/admin/ui'

const ROLES = [
  {
    name: 'Quản trị viên',
    tone: 'ok' as const,
    icon: <ShieldCheck className="h-5 w-5" />,
    desc: 'Toàn quyền: sửa nội dung, quản lý bài viết, leads, người dùng và cài đặt.',
    enforced: true,
  },
  {
    name: 'Biên tập viên',
    tone: 'blue' as const,
    icon: <Pencil className="h-5 w-5" />,
    desc: 'Sửa nội dung và bài viết. Không quản lý người dùng, cài đặt, leads.',
    enforced: false,
  },
  {
    name: 'Người xem',
    tone: 'neutral' as const,
    icon: <Eye className="h-5 w-5" />,
    desc: 'Chỉ xem Tổng quan và nội dung, không được sửa.',
    enforced: false,
  },
]

export default function RolesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Phân quyền" description="Hệ thống có 3 vai trò. Phân quyền chi tiết theo từng màn sẽ áp dụng ở giai đoạn sau." />

      <div className="space-y-3">
        {ROLES.map((r) => (
          <Card key={r.name} className="flex items-start gap-4 p-5">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[var(--ad-fill)] text-[var(--ad-fg-2)]">{r.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15.5px] font-semibold text-[var(--ad-fg)]">{r.name}</h3>
                <Chip tone={r.enforced ? r.tone : 'warn'}>{r.enforced ? 'Đang áp dụng' : 'Chưa áp dụng'}</Chip>
              </div>
              <p className="mt-1 text-[14px] leading-snug text-[var(--ad-fg-2)]">{r.desc}</p>
              {!r.enforced && <p className="mt-1 text-[13px] text-[var(--ad-fg-3)]">Hiện vai trò này vẫn có toàn quyền.</p>}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-[rgba(255,159,10,.14)] p-4 text-[13.5px] leading-relaxed text-[#8a4a00]">
        <strong>Lưu ý:</strong> hiện mọi vai trò đều vào được toàn bộ khu quản trị, vì cơ sở dữ liệu mới chỉ kiểm tài khoản còn hoạt động. Khi cần phân quyền thật
        (ví dụ Người xem chỉ được xem), em sẽ chỉnh lớp kiểm tra truy cập và quy tắc bảo mật theo vai trò.
      </div>

      <p className="mt-4 text-[13.5px] text-[var(--ad-fg-3)]">
        Đổi vai trò của một người dùng tại{' '}
        <Link href="/admin-cls/users" className="text-[var(--ad-accent)] hover:underline">
          trang Người dùng
        </Link>
        .
      </p>
    </div>
  )
}
