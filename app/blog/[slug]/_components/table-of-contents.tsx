'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'
import type { Heading } from '@/lib/blog/headings'
import { useLanguage } from '@/contexts/language-context'

/** Hộp "Trong bài này" ở đầu bài: danh sách mục đánh số, mục đang đọc được tô sáng, bấm để cuộn mượt tới mục. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const { t } = useLanguage()
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )
    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  let n = 0
  return (
    <nav
      aria-label={t('Mục lục bài viết', 'Table of contents')}
      className="bp-up bp-tocbox rounded-2xl border border-border bg-secondary/40 p-5 sm:p-7"
      style={{ ['--d' as string]: '.35s' }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <List className="w-4 h-4 text-[#1859b8]" />
        {t('Trong bài này', 'In this article')}
        <span className="ml-1 text-xs font-normal text-muted-foreground">({headings.length})</span>
      </div>
      <ol className="grid md:grid-cols-2 gap-x-8 gap-y-0.5">
        {headings.map((h, i) => {
          const isActive = activeId === h.id
          if (h.level === 2) n += 1
          return (
            <li key={h.id} className={`bp-toc-item ${h.level === 3 ? 'pl-5' : ''}`} style={{ ['--i' as string]: i }}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  const el = document.getElementById(h.id)
                  if (!el) return
                  e.preventDefault()
                  el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
                  history.replaceState(null, '', `#${h.id}`)
                }}
                className={`group flex items-baseline gap-2.5 py-1.5 text-[14.5px] leading-snug transition-colors ${
                  isActive ? 'text-[#1859b8] font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className={`w-5 shrink-0 text-xs tabular-nums transition-colors ${isActive ? 'text-[#1859b8]' : 'text-muted-foreground/60 group-hover:text-primary'}`}>
                  {h.level === 2 ? String(n).padStart(2, '0') : '–'}
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">{h.text}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
