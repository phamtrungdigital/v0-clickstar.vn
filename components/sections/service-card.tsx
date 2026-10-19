'use client'

import Link, { useLocalHref } from '@/components/app-link'
import { type ReactNode } from 'react'

interface ServiceCardProps {
  /** Giữ để tương thích với nơi gọi cũ; thiết kế Apple không dùng ô biểu tượng màu */
  icon?: ReactNode
  title: string
  description: string
  tag: string
  iconBgColor?: string
  tagColor?: string
  href?: string
  /** Nhãn nhỏ cạnh tên (vd "MỚI") — để trống thì không hiện */
  badge?: string
  /** Chữ của liên kết cuối thẻ (vd "Tìm hiểu thêm") */
  moreLabel?: string
}

/**
 * Thẻ dịch vụ theo mockup Apple: viền mảnh, bo 18px, không bóng, không ô biểu tượng màu.
 * Cấu trúc: tên, dòng phạm vi (tag), mô tả, liên kết "Tìm hiểu thêm".
 */
export function ServiceCard({ title, description, tag, href, badge, moreLabel = 'Learn more' }: ServiceCardProps) {
  const localHref = useLocalHref()
  const inner = (
    <>
      <h3 className="text-[21px] leading-tight font-semibold tracking-[0.01em] text-foreground flex items-center gap-2">
        {title}
        {badge && (
          <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#1e6dda] text-white">
            {badge}
          </span>
        )}
      </h3>
      <span className="text-sm text-muted-foreground leading-snug tracking-[-0.016em]">{tag}</span>
      <p className="text-[17px] leading-[1.47] text-foreground mt-1 flex-1">{description}</p>
      <span className="ap-link text-[15px] pt-3">{moreLabel}</span>
    </>
  )

  const className =
    'group bg-white border border-border rounded-[18px] p-6 flex flex-col gap-1.5 h-full min-w-0 text-left transition-colors hover:border-[#1e6dda]'

  if (!href) {
    return <div className={className}>{inner}</div>
  }

  const isExternal = /^https?:\/\//.test(href)
  if (isExternal) {
    return (
      <a href={localHref(href)} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  )
}
