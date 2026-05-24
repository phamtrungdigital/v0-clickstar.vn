'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { PricingGroupedTiersContent, PricingTierGroup } from '@/lib/cms/types'

/**
 * Pricing với tabs pill style HubSpot — click tab switch group (1 group visible at a time).
 * Fade-in transition giữa các group.
 */
export function PricingGroupedTiers({ content }: { content: PricingGroupedTiersContent }) {
  const { t } = useLanguage()
  const [activeId, setActiveId] = useState<string>(content.groups[0]?.id ?? '')
  const activeGroup = content.groups.find((g) => g.id === activeId) ?? content.groups[0]

  if (!activeGroup) return null

  return (
    <section
      data-cms-section="pricing_grouped_tiers"
      className="py-16 lg:py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header chung */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-5"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p data-cms-field="description" className="text-muted-foreground text-lg">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {/* Tabs pill style — HubSpot */}
        <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 mb-10 lg:mb-14">
          {content.groups.map((group, idx) => {
            const isActive = group.id === activeId
            return (
              <button
                key={group.id}
                data-cms-field="group_tab"
                data-cms-item-index={idx}
                onClick={() => setActiveId(group.id)}
                className={`relative inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full text-sm lg:text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-white text-foreground border border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {t(group.label.vi, group.label.en)}
                {group.badge?.vi && (
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {t(group.badge.vi, group.badge.en)}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Active group tiers — fade transition */}
        <div
          key={activeGroup.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <PricingGroupTiers group={activeGroup} />
        </div>
      </div>
    </section>
  )
}

function PricingGroupTiers({ group }: { group: PricingTierGroup }) {
  const { t } = useLanguage()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {group.tiers.map((tier, idx) => (
          <div
            key={idx}
            data-cms-field="tier"
            data-cms-item-index={idx}
            className={`relative bg-card border rounded-2xl p-7 lg:p-8 transition-all duration-300 ${
              tier.popular
                ? 'border-primary shadow-xl shadow-primary/10 lg:scale-105'
                : 'border-border hover:border-primary/40 hover:shadow-lg hover:-translate-y-1'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
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

            <div className="mb-7">
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

            <ul className="space-y-2.5 mb-8">
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

      {group.disclaimer?.vi && (
        <p className="text-center text-sm text-muted-foreground">
          {t(group.disclaimer.vi, group.disclaimer.en)}
        </p>
      )}
    </>
  )
}
