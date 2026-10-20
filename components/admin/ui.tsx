/**
 * Thành phần dùng chung cho khu quản trị (phong cách Apple). Màu và bóng lấy từ biến --ad-* ở
 * app/admin-cls/_components/admin-theme.tsx, nên chỉ dùng được bên trong .admin-scope.
 *
 * File này an toàn dùng ở cả server component lẫn client component (không có state).
 * Phần có tương tác: components/admin/segmented.tsx, components/admin/save-bar.tsx.
 */
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Tiêu đề trang lớn kiểu Apple: tên trang, một dòng mô tả, các nút hành động bên phải. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0 flex-1 basis-80">
        <h1 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--ad-fg)]">{title}</h1>
        {description ? <p className="mt-1 text-[14.5px] leading-snug text-[var(--ad-fg-2)]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-none flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/** Khối trắng bo tròn, viền mảnh, bóng nhẹ. */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-[var(--ad-line)] bg-[var(--ad-surface)] shadow-[var(--ad-shadow)]', className)}>
      {children}
    </div>
  )
}

/** Khối có tiêu đề ở đầu (tiêu đề, mô tả ngắn, hành động bên phải) và nội dung bên dưới. */
export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <Card className={className}>
      <div className="flex flex-wrap items-start justify-between gap-2 px-5 pt-4">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold tracking-[-0.018em] text-[var(--ad-fg)]">{title}</h2>
          {description ? <p className="mt-0.5 text-[13px] text-[var(--ad-fg-3)]">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      <div className={cn('px-5 pb-5 pt-3', bodyClassName)}>{children}</div>
    </Card>
  )
}

/** Ô số liệu: nhãn nhỏ, số lớn, ghi chú. `href` thì cả ô bấm được. */
export function StatCard({
  label,
  value,
  note,
  tone = 'neutral',
  href,
}: {
  label: string
  value: React.ReactNode
  note?: React.ReactNode
  tone?: 'neutral' | 'ok' | 'warn'
  href?: string
}) {
  const noteColor = tone === 'ok' ? 'text-[#248a3d]' : tone === 'warn' ? 'text-[#b25e00]' : 'text-[var(--ad-fg-3)]'
  const inner = (
    <Card className={cn('h-full px-5 py-4', href && 'transition-shadow hover:shadow-[0_8px_28px_-10px_rgba(0,0,0,.2)]')}>
      <div className="text-[13px] text-[var(--ad-fg-2)]">{label}</div>
      <div className="mt-1.5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] tabular-nums text-[var(--ad-fg)]">{value}</div>
      {note ? <div className={cn('mt-1 text-[12.5px] font-medium', noteColor)}>{note}</div> : null}
    </Card>
  )
  return href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  )
}

const CHIP_TONES = {
  neutral: 'bg-[var(--ad-fill)] text-[var(--ad-fg-2)]',
  blue: 'bg-[var(--ad-accent-soft)] text-[var(--ad-accent)]',
  ok: 'bg-[rgba(52,199,89,.14)] text-[#248a3d]',
  warn: 'bg-[rgba(255,159,10,.16)] text-[#b25e00]',
  bad: 'bg-[rgba(255,59,48,.12)] text-[#d70015]',
} as const

/** Nhãn nhỏ dạng viên thuốc: trạng thái, chủ đề, số đếm. */
export function Chip({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: keyof typeof CHIP_TONES
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn('inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium', CHIP_TONES[tone], className)}>
      {children}
    </span>
  )
}

const BTN_BASE =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
const BTN_SIZES = { md: 'h-8 px-3.5 text-[13.5px]', lg: 'h-10 px-5 text-[15px]', sm: 'h-7 px-3 text-[12.5px]' } as const
const BTN_VARIANTS = {
  primary: 'bg-[var(--ad-accent)] text-white hover:bg-[var(--ad-accent-d)]',
  secondary: 'bg-[var(--ad-fill)] text-[var(--ad-fg)] hover:bg-[var(--ad-fill-2)]',
  ghost: 'text-[var(--ad-accent)] hover:bg-[var(--ad-accent-soft)]',
  danger: 'bg-[rgba(255,59,48,.12)] text-[#d70015] hover:bg-[rgba(255,59,48,.2)]',
} as const

/** Lớp CSS của nút: dùng cho `<button>` và `<Link>`: className={btn('primary')}. */
export function btn(variant: keyof typeof BTN_VARIANTS = 'secondary', size: keyof typeof BTN_SIZES = 'md') {
  return cn(BTN_BASE, BTN_SIZES[size], BTN_VARIANTS[variant])
}

/** Hàng ngang chứa ô tìm, bộ lọc và nút ở đầu danh sách. */
export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-3.5 flex flex-wrap items-center gap-2.5', className)}>{children}</div>
}

/** Ô tìm kiếm nhỏ. Dùng như input thường (value, onChange, placeholder). */
export const searchInputClass =
  'h-8 min-w-0 rounded-[10px] border border-[var(--ad-line-2)] bg-[var(--ad-surface)] px-3 text-[13.5px] text-[var(--ad-fg)] placeholder:text-[var(--ad-fg-3)]'

/**
 * Nhóm cài đặt kiểu "Cài đặt hệ thống" của Apple: tên nhóm và mô tả ở cột trái, nội dung nhập ở khối bên phải.
 * Nhiều nhóm xếp liền nhau, cách nhau bằng đường kẻ mảnh.
 */
export function SettingsGroup({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('grid gap-3 border-t border-[var(--ad-line)] py-6 first:border-t-0 first:pt-1 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-x-8', className)}>
      <div className="lg:pt-1">
        <h2 className="text-[16px] font-semibold tracking-[-0.018em] text-[var(--ad-fg)]">{title}</h2>
        {description ? <p className="mt-1 text-[13.5px] leading-snug text-[var(--ad-fg-3)]">{description}</p> : null}
      </div>
      <Card className="min-w-0 p-5">{children}</Card>
    </section>
  )
}

/** Lớp CSS cho ô nhập và nhãn ở các trang sửa (bản ghi, cài đặt). */
export const fieldInputClass =
  'w-full rounded-[10px] border border-[var(--ad-line-2)] bg-[var(--ad-surface)] px-3 py-2 text-[14px] text-[var(--ad-fg)] placeholder:text-[var(--ad-fg-3)]'
export const fieldLabelClass = 'mb-1.5 block text-[13px] font-medium text-[var(--ad-fg-2)]'

/** Nhãn trạng thái lưu: "Đã lưu", "Chưa lưu", hoặc lỗi (rê chuột để xem đầy đủ). */
export function SaveStatus({ status, errorMsg }: { status: 'idle' | 'saved' | 'error' | 'dirty'; errorMsg?: string }) {
  if (status === 'saved') return <Chip tone="ok">Đã lưu</Chip>
  if (status === 'dirty') return <Chip tone="warn">Chưa lưu</Chip>
  if (status === 'error')
    return (
      <span title={errorMsg}>
        <Chip tone="bad">{errorMsg ? `Lỗi: ${errorMsg.slice(0, 40)}` : 'Lỗi'}</Chip>
      </span>
    )
  return null
}

/**
 * Thanh đầu trang sửa bản ghi (dự án, thành viên, footer…): dính dưới thanh trên, nền kính mờ,
 * có nút quay lại, tên, mô tả ngắn và các nút hành động bên phải (nút Lưu do nơi dùng truyền vào).
 */
export function EditorBar({
  backHref,
  title,
  subtitle,
  children,
}: {
  backHref?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="ad-glass sticky top-[52px] z-20 -mx-4 -mt-4 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ad-line)] px-4 py-2.5 lg:-mx-6 lg:-mt-6 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Quay lại danh sách"
            title="Quay lại danh sách"
            className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--ad-fill)] text-[var(--ad-fg-2)] hover:bg-[var(--ad-fill-2)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        ) : null}
        <div className="min-w-0">
          <h1 className="truncate font-semibold tracking-[-0.02em] text-[var(--ad-fg)]">{title}</h1>
          {subtitle ? <p className="truncate text-[12.5px] text-[var(--ad-fg-3)]">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

/** Trạng thái trống: biểu tượng, câu nói ngắn, một hành động gợi ý. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-6 py-12 text-center">
      {icon ? <div className="mb-1 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--ad-fill)] text-[var(--ad-fg-3)]">{icon}</div> : null}
      <p className="text-[15px] font-medium text-[var(--ad-fg)]">{title}</p>
      {description ? <p className="max-w-sm text-[13.5px] text-[var(--ad-fg-3)]">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
