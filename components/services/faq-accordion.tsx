'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { I18n } from '@/lib/cms/types'

export type FaqAccordionItem = { q: I18n; a: I18n }

/**
 * Accordion FAQ cho các trang dịch vụ.
 * KHÔNG dùng components/sections/faq-section.tsx vì file đó tự render eyebrow + h2
 * theo layout 35/65 sticky và mang data-cms-section="faq" (dành cho CMS page).
 */
export function FaqAccordion({
  items,
  defaultOpen = 0,
  accent = 'cyan',
}: {
  items: FaqAccordionItem[]
  defaultOpen?: number
  accent?: 'cyan'
}) {
  const { language } = useLanguage()
  const [open, setOpen] = useState<number | null>(defaultOpen)

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className={`rounded-2xl border bg-white transition-all duration-300 ${
              isOpen ? 'border-cyan-300 shadow-lg shadow-cyan-500/5' : 'border-border hover:border-cyan-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
            >
              <span className="text-base sm:text-lg font-semibold text-foreground">{item.q[language]}</span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-cyan-600' : 'text-muted-foreground'
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden min-h-0">
                <p className="px-5 sm:px-6 pb-5 text-muted-foreground leading-relaxed">{item.a[language]}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
