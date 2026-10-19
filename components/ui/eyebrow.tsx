import type { ReactNode } from 'react'

/**
 * Huy hiệu nhỏ đứng trên tiêu đề mỗi khối (trang dịch vụ, bài blog): bo tròn, viền và nền xanh nhạt, chữ in hoa nhỏ giãn chữ.
 * Dùng chung một kiểu cho cả trang để các nhãn đồng bộ. `dark` dành cho khối nền tối. Truyền biểu tượng lucide (h-4 w-4)
 * làm phần tử đầu của children; không có biểu tượng thì đặt `dot` để hiện chấm tròn nhỏ.
 */
export function Eyebrow({
  children,
  dark = false,
  dot = false,
  className = '',
}: {
  children: ReactNode
  dark?: boolean
  dot?: boolean
  className?: string
}) {
  const tone = dark
    ? 'border-white/20 bg-white/10 text-[#d2d2d7] [&>svg]:text-[#7db8ff]'
    : 'border-[#b9d4f8] bg-[#eaf2fd] text-[#144c97] [&>svg]:text-[#1e6dda]'
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase leading-none tracking-[0.06em] [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0 ${tone} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-[#7db8ff]' : 'bg-[#1e6dda]'}`} aria-hidden="true" />}
      {children}
    </span>
  )
}
