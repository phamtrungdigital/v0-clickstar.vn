'use client'

import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AboutValuesContent } from '@/lib/cms/types'

function renderIcon(name: string, className: string) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Heart
  return <Icon className={className} />
}

export function AboutValuesSection({ content }: { content: AboutValuesContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="about_values" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            {renderIcon('Heart', 'w-4 h-4')}
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p data-cms-field="description" className="text-muted-foreground text-lg">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((value, index) => (
            <div
              key={index}
              data-cms-field="item"
              data-cms-item-index={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {renderIcon(value.icon, 'w-6 h-6')}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {t(value.title.vi, value.title.en)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(value.description.vi, value.description.en)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
