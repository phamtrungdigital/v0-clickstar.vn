'use client'

import Link, { useLocalHref } from '@/components/app-link'
import { ArrowRight } from 'lucide-react'
import { type CSSProperties, type MouseEvent, type ReactNode } from 'react'

interface ServiceCardProps {
  /** Biểu tượng của dịch vụ (lucide), đặt trong ô vuông phát sáng */
  icon?: ReactNode
  title: string
  description: string
  tag: string
  href?: string
  /** Nhãn nhỏ cạnh tên (vd "MỚI") — để trống thì không hiện */
  badge?: string
  /** Chữ của liên kết cuối thẻ (vd "Tìm hiểu thêm") */
  moreLabel?: string
  /** Số thứ tự trên lộ trình (01, 02, ...) và tên tầng (Thu hút, Chuyển đổi, ...) */
  step?: string
  layer?: string
}

/**
 * Thẻ dịch vụ kiểu công nghệ: viền mảnh, ô biểu tượng nền xanh nhạt, nhãn tầng trên lộ trình khách hàng,
 * ánh sáng đi theo con trỏ chuột (chỉ máy có chuột), nâng nhẹ khi rê, mũi tên trượt.
 * Cấu trúc nội dung: tên, dòng phạm vi (tag), mô tả, liên kết "Tìm hiểu thêm".
 */
export function ServiceCard({ icon, title, description, tag, href, badge, moreLabel = 'Learn more', step, layer }: ServiceCardProps) {
  const localHref = useLocalHref()

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const inner = (
    <>
      {/* Ánh sáng theo chuột */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(280px circle at var(--mx, 50%) var(--my, 0%), rgba(30,109,218,0.10), transparent 70%)' } as CSSProperties}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-[#cfe0fa] bg-gradient-to-br from-[#eaf2fd] to-white text-[#1e6dda] shadow-[0_6px_16px_-8px_rgba(30,109,218,0.5)] transition-transform duration-300 group-hover:scale-105 [&>svg]:h-6 [&>svg]:w-6">
          {icon}
        </span>
        {step && layer && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf2fd] px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-[#144c97]">
            <span className="tabular-nums text-[#1e6dda]">{step}</span>
            {layer}
          </span>
        )}
      </div>

      <h3 className="flex items-center gap-2 text-[21px] font-semibold leading-tight tracking-[0.005em] text-foreground">
        {title}
        {badge && (
          <span className="rounded-full bg-[#1e6dda] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">{badge}</span>
        )}
      </h3>
      <span className="mt-1 text-sm leading-snug tracking-[-0.016em] text-muted-foreground">{tag}</span>
      <p className="mt-3 flex-1 text-base leading-[1.5] text-[#3a3a3c]">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1859b8]">
        {moreLabel}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </>
  )

  const className =
    'group relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-border bg-white p-6 text-left transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#1e6dda]/55 hover:shadow-[0_22px_44px_-24px_rgba(30,109,218,0.55)] motion-reduce:transition-none motion-reduce:hover:translate-y-0'

  if (!href) {
    return (
      <div className={className} onMouseMove={onMove}>
        {inner}
      </div>
    )
  }

  const isExternal = /^https?:\/\//.test(href)
  if (isExternal) {
    return (
      <a href={localHref(href)} target="_blank" rel="noopener noreferrer" className={className} onMouseMove={onMove}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onMouseMove={onMove}>
      {inner}
    </Link>
  )
}
