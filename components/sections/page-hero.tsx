'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePageSection } from '@/lib/cms/page-data-context'
import type { PageHeroContent } from '@/lib/cms/types'

export function PageHero({ fallback }: { fallback?: PageHeroContent }) {
  const { t } = useLanguage()
  const section = usePageSection('page_hero')
  const content = section?.content ?? fallback
  if (!content) return null

  return (
    <section
      data-cms-section="page_hero"
      className="relative overflow-hidden bg-gradient-to-br from-background-soft via-white to-secondary"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-primary-dark/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-dark/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="text-center max-w-3xl mx-auto">
          <span
            data-cms-field="badge"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-xs sm:text-sm uppercase tracking-wide px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.badge.vi, content.badge.en)}
          </span>

          <h1
            data-cms-field="heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6 text-balance"
          >
            {t(content.heading.vi, content.heading.en)}
          </h1>

          <p
            data-cms-field="description"
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 text-pretty"
          >
            {t(content.description.vi, content.description.en)}
          </p>

          {content.cta_label?.vi && (
            <Link
              data-cms-field="cta"
              href={content.cta_href || '/contact'}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              {t(content.cta_label.vi, content.cta_label.en)}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
