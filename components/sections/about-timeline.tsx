'use client'

import { Rocket } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AboutTimelineContent } from '@/lib/cms/types'
import { splitTimeline, type TimelineEntry } from '@/lib/cms/timeline'

function MilestoneCard({ milestone, now, soft }: { milestone: TimelineEntry; now?: boolean; soft?: boolean }) {
  const { t } = useLanguage()
  return (
    <div
      data-cms-field="item"
      data-cms-item-index={milestone.index}
      className={`flex h-full flex-col rounded-xl p-6 text-center transition-all ${
        soft
          ? 'border border-dashed border-white/25 bg-white/[0.02]'
          : now
            ? 'border border-[#7db8ff]/60 bg-white/10'
            : 'border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/40 hover:bg-white/10'
      }`}
    >
      <div className={`mb-2 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold ${soft ? 'text-white/60' : 'text-[#1859b8]'}`}>
        {milestone.year}
        {now && (
          <span className="rounded-full bg-[#1e6dda] px-2 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-white">
            {t('Hiện nay', 'Now')}
          </span>
        )}
      </div>
      <h3 className="mb-2 text-base font-bold text-white lg:text-lg">{t(milestone.title.vi, milestone.title.en)}</h3>
      <p className="flex-1 text-sm leading-relaxed text-white/70">{t(milestone.description.vi, milestone.description.en)}</p>
    </div>
  )
}

export function AboutTimelineSection({ content }: { content: AboutTimelineContent }) {
  const { t } = useLanguage()
  const { past, future } = splitTimeline(content.items)

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
            <span className="text-[#1859b8]">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
        </div>

        {/* Mốc đã qua, mốc "Hiện nay" là mốc cuối. Mốc định hướng (năm lớn hơn năm nay) nằm riêng bên dưới. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 auto-rows-fr">
          {past.map((milestone, i) => (
            <MilestoneCard key={milestone.index} milestone={milestone} now={i === past.length - 1} />
          ))}
        </div>

        {future.length > 0 && (
          <div className="mt-14">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#7db8ff]">
              {t('Định hướng', 'Direction')} {future[0].year}
              {future.length > 1 ? ` - ${future[future.length - 1].year}` : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 auto-rows-fr">
              {future.map((milestone) => (
                <MilestoneCard key={milestone.index} milestone={milestone} soft />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
