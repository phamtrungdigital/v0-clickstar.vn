'use client'

import Link from 'next/link'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePageSection } from '@/lib/cms/page-data-context'
import type { PricingTiersContent } from '@/lib/cms/types'

/**
 * Support 2 modes:
 *  1. Standalone (no props): pulls first `pricing_tiers` section from page data context — backward compat for service pages
 *  2. Controlled (content + id): explicit content + section id anchor, used when page has MULTIPLE pricing_tiers sections (e.g. /pricing with tabs)
 */
export function PricingTiers({
  content: contentProp,
  sectionId,
}: { content?: PricingTiersContent; sectionId?: string } = {}) {
  const { t } = useLanguage()
  const section = usePageSection('pricing_tiers')
  const content = contentProp ?? section?.content
  if (!content) return null

  return (
    <section
      id={sectionId}
      data-cms-section="pricing_tiers"
      className="py-20 lg:py-28 bg-background scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {content.tiers.map((tier, idx) => (
            <div
              key={idx}
              data-cms-field="tier"
              data-cms-item-index={idx}
              className={`relative bg-card border rounded-2xl p-8 transition-all duration-300 ${
                tier.popular
                  ? 'border-primary shadow-xl shadow-primary/10 lg:scale-105'
                  : 'border-border hover:border-primary/40 hover:shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  Phổ biến nhất
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-2">
                {t(tier.name.vi, tier.name.en)}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                {t(tier.description.vi, tier.description.en)}
              </p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    {t(tier.price.vi, tier.price.en)}
                  </span>
                  {tier.price_period?.vi && (
                    <span className="text-sm text-muted-foreground">
                      {t(tier.price_period.vi, tier.price_period.en)}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{t(f.vi, f.en)}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.cta_href}
                className={`block w-full text-center font-semibold py-3 px-6 rounded-full transition-all duration-200 ${
                  tier.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-lg shadow-primary/25'
                    : 'bg-foreground text-background hover:bg-foreground/90'
                }`}
              >
                {t(tier.cta_label.vi, tier.cta_label.en)}
              </Link>
            </div>
          ))}
        </div>

        {content.disclaimer?.vi && (
          <p className="text-center text-sm text-muted-foreground">
            {t(content.disclaimer.vi, content.disclaimer.en)}
          </p>
        )}
      </div>
    </section>
  )
}
