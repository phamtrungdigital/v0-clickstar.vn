'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'

type Heading = { id: string; text: string; level: 2 | 3 }

/** Parse markdown content to extract h2/h3 headings + generate slug-id matching ReactMarkdown's auto-id pattern */
export function parseHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n')
  const headings: Heading[] = []
  let inCodeBlock = false

  for (const line of lines) {
    // Skip headings inside ``` code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const m2 = /^## +(.+)$/.exec(line)
    const m3 = /^### +(.+)$/.exec(line)
    if (m2) {
      const text = m2[1].trim().replace(/[*_`]/g, '')
      headings.push({ id: slugifyId(text), text, level: 2 })
    } else if (m3) {
      const text = m3[1].trim().replace(/[*_`]/g, '')
      headings.push({ id: slugifyId(text), text, level: 3 })
    }
  }
  return headings
}

function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Lấy heading đầu tiên trong viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
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

  return (
    <>
      {/* Mobile collapsible */}
      <div className="lg:hidden mb-6 bg-secondary/30 border border-border/50 rounded-lg overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            Mục lục bài viết ({headings.length})
          </span>
          <span className="text-xs text-muted-foreground">{open ? 'Thu gọn' : 'Mở rộng'}</span>
        </button>
        {open && (
          <ul className="border-t border-border/50 px-4 py-3 space-y-2 text-sm">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors block"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop sticky sidebar */}
      <nav className="hidden lg:block sticky top-24">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <List className="w-3.5 h-3.5" />
          Mục lục
        </div>
        <ul className="space-y-2 text-sm border-l-2 border-border">
          {headings.map((h) => {
            const isActive = activeId === h.id
            return (
              <li key={h.id} className={h.level === 3 ? 'pl-6' : 'pl-4'}>
                <a
                  href={`#${h.id}`}
                  className={`block -ml-[2px] pl-3 border-l-2 transition-colors leading-snug py-1 ${
                    isActive
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {h.text}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
