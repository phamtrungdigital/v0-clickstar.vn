'use client'

import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePageSection } from '@/lib/cms/page-data-context'

const COLOR_MAP = {
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  pink: 'bg-pink-50 text-pink-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  rose: 'bg-rose-50 text-rose-600',
}

function renderIcon(name: string, className: string) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.AlertCircle
  return <Icon className={className} />
}

export function ProblemsGrid() {
  const { t } = useLanguage()
  const section = usePageSection('problems_grid')
  if (!section) return null
  const content = section.content

  return (
    <section data-cms-section="problems_grid" className="py-20 lg:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span data-cms-field="eyebrow" className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-full mb-6">
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2 data-cms-field="heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 text-balance">
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p data-cms-field="description" className="text-muted-foreground text-lg leading-relaxed">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {content.items.map((item, idx) => {
            const colors = COLOR_MAP[item.color] || COLOR_MAP.blue
            return (
              <div
                key={idx}
                data-cms-field="item"
                data-cms-item-index={idx}
                className="bg-card border border-border rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${colors} rounded-xl flex items-center justify-center mb-5`}>
                  {renderIcon(item.icon, 'w-6 h-6')}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  ❌ {t(item.problem.vi, item.problem.en)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ✓ <span className="text-foreground/90">{t(item.solution.vi, item.solution.en)}</span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
