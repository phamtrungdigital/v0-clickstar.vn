'use client'

import { Rocket } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AboutTimelineContent } from '@/lib/cms/types'

export function AboutTimelineSection({ content }: { content: AboutTimelineContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="about_timeline" className="py-20 lg:py-28 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <Rocket className="w-4 h-4" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
        </div>

        {/* Timeline grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative auto-rows-fr">
          {/* Connecting line — desktop only */}
          <div
            className="hidden lg:block absolute top-3 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"
            aria-hidden="true"
          />

          {content.items.map((milestone, index) => (
            <div
              key={index}
              data-cms-field="item"
              data-cms-item-index={index}
              className="relative flex flex-col items-center h-full cursor-pointer"
            >
              {/* Dot on timeline line */}
              <div className="hidden lg:flex items-center justify-center w-6 h-6 mb-4 flex-shrink-0">
                <span className="absolute w-6 h-6 bg-primary/30 rounded-full animate-pulse" />
                <span className="relative w-3 h-3 bg-primary rounded-full ring-4 ring-foreground" />
              </div>

              {/* Card */}
              <div className="w-full flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:border-primary/40 hover:bg-white/10 transition-all">
                <div className="text-primary font-bold text-2xl mb-2">{milestone.year}</div>
                <h3 className="font-bold text-base lg:text-lg mb-2 text-white">
                  {t(milestone.title.vi, milestone.title.en)}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed flex-1">
                  {t(milestone.description.vi, milestone.description.en)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
