'use client'

import Image from 'next/image'
import { Award } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AboutStoryContent } from '@/lib/cms/types'

export function AboutStorySection({ content }: { content: AboutStoryContent }) {
  const { t } = useLanguage()

  return (
    <section
      data-cms-section="about_story"
      id="story"
      className="py-20 lg:py-28 bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={content.image}
                alt={t(content.image_alt.vi, content.image_alt.en)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 max-w-[240px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{content.stat_value}</div>
                  <div className="text-sm text-muted-foreground">
                    {t(content.stat_label.vi, content.stat_label.en)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span
              data-cms-field="eyebrow"
              className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
            >
              {t(content.eyebrow.vi, content.eyebrow.en)}
            </span>

            <h2
              data-cms-field="heading"
              className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-6"
            >
              {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
              <span className="text-primary">
                {t(content.heading_highlight.vi, content.heading_highlight.en)}
              </span>
            </h2>

            <div className="space-y-5 text-muted-foreground leading-relaxed">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{t(p.vi, p.en)}</p>
              ))}
            </div>

            {/* Industries chip list */}
            {content.industries.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-foreground mb-4">
                  {t(content.industries_label.vi, content.industries_label.en)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {content.industries.map((industry, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white rounded-full text-sm text-muted-foreground border border-border"
                    >
                      {t(industry.vi, industry.en)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
