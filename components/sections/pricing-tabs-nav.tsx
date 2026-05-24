'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import type { PricingTabsNavContent } from '@/lib/cms/types'

/**
 * Sticky tabs nav for pricing page — scrolls to anchored pricing_tiers sections.
 * Uses IntersectionObserver to highlight active tab as user scrolls.
 */
export function PricingTabsNav({ content }: { content: PricingTabsNavContent }) {
  const { t } = useLanguage()
  const [activeAnchor, setActiveAnchor] = useState<string>(content.tabs[0]?.anchor ?? '')

  useEffect(() => {
    if (content.tabs.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveAnchor(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    )

    content.tabs.forEach((tab) => {
      const el = document.getElementById(tab.anchor)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [content.tabs])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault()
    const el = document.getElementById(anchor)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveAnchor(anchor)
    }
  }

  return (
    <section
      data-cms-section="pricing_tabs_nav"
      className="sticky top-[72px] z-30 bg-background/95 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-3 scrollbar-hide">
          {content.tabs.map((tab, idx) => {
            const isActive = activeAnchor === tab.anchor
            return (
              <a
                key={idx}
                data-cms-field="tab"
                data-cms-item-index={idx}
                href={`#${tab.anchor}`}
                onClick={(e) => handleClick(e, tab.anchor)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {t(tab.label.vi, tab.label.en)}
              </a>
            )
          })}
        </div>
        {content.hint?.vi && (
          <p data-cms-field="hint" className="text-[11px] text-muted-foreground pb-2 hidden sm:block">
            {t(content.hint.vi, content.hint.en)}
          </p>
        )}
      </div>
    </section>
  )
}
