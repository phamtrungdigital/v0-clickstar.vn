'use client'

import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePageSection } from '@/lib/cms/page-data-context'

const COLOR_MAP = {
  blue: { iconText: 'text-blue-600', iconBg: 'bg-blue-50' },
  purple: { iconText: 'text-purple-600', iconBg: 'bg-purple-50' },
  pink: { iconText: 'text-pink-600', iconBg: 'bg-pink-50' },
  amber: { iconText: 'text-amber-600', iconBg: 'bg-amber-50' },
  emerald: { iconText: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  cyan: { iconText: 'text-cyan-600', iconBg: 'bg-cyan-50' },
  rose: { iconText: 'text-rose-600', iconBg: 'bg-rose-50' },
}

function renderIcon(name: string, className: string) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles
  return <Icon className={className} />
}

export function FeatureGrid() {
  const { t } = useLanguage()
  const section = usePageSection('feature_grid')
  if (!section) return null
  const content = section.content
  const cols = content.columns ?? 3
  const gridCols =
    cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'

  return (
    <section data-cms-section="feature_grid" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span data-cms-field="eyebrow" className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
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

        <div className={`grid grid-cols-1 ${gridCols} gap-6 lg:gap-8`}>
          {content.items.map((item, idx) => {
            const colors = COLOR_MAP[item.color] || COLOR_MAP.blue
            return (
              <div
                key={idx}
                data-cms-field="item"
                data-cms-item-index={idx}
                className="group bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  {renderIcon(item.icon, `w-7 h-7 ${colors.iconText}`)}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {t(item.title.vi, item.title.en)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(item.description.vi, item.description.en)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
