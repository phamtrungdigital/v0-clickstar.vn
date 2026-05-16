'use client'

import Link from 'next/link'
import { type ReactNode } from 'react'

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
  tag: string
  iconBgColor?: string
  tagColor?: string
  href?: string
}

export function ServiceCard({
  icon,
  title,
  description,
  tag,
  iconBgColor = 'bg-blue-50',
  tagColor = 'bg-blue-50 text-blue-600',
  href,
}: ServiceCardProps) {
  const inner = (
    <>
      <div className={`w-14 h-14 ${iconBgColor} rounded-xl flex items-center justify-center mb-6`}>
        {icon}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{description}</p>

      <span
        className={`inline-block self-start text-xs font-semibold px-3 py-1.5 rounded-full ${tagColor}`}
      >
        {tag}
      </span>
    </>
  )

  const className =
    'group bg-card p-8 rounded-xl border border-border hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full'

  if (!href) {
    return <div className={className}>{inner}</div>
  }

  // External URL → open in new tab; internal → standard navigation
  const isExternal = /^https?:\/\//.test(href)
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
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
