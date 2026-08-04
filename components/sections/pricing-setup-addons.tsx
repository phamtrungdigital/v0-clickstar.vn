'use client'

import Link from 'next/link'
import { Settings, Clock, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { PricingSetupAddonsContent } from '@/lib/cms/types'

export function PricingSetupAddons({ content }: { content: PricingSetupAddonsContent }) {
  const { t } = useLanguage()

  return (
    <section
      data-cms-section="pricing_setup_addons"
      className="py-20 lg:py-28 bg-secondary/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 font-semibold text-sm px-4 py-2 rounded-full mb-5"
          >
            <Settings className="w-4 h-4" />
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

        {/* Items list */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {content.items.map((item, idx) => (
            <div
              key={idx}
              data-cms-field="item"
              data-cms-item-index={idx}
              className={`grid grid-cols-1 lg:grid-cols-[1fr_180px_140px_140px] gap-4 lg:gap-6 p-5 lg:p-6 ${
                idx > 0 ? 'border-t border-border' : ''
              } hover:bg-secondary/30 transition-colors`}
            >
              {/* Name + description */}
              <div className="lg:pr-4">
                <h3 className="text-base lg:text-lg font-bold text-foreground mb-1.5">
                  {t(item.name.vi, item.name.en)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(item.description.vi, item.description.en)}
                </p>
              </div>

              {/* Duration */}
              <div className="lg:text-center flex lg:flex-col items-baseline lg:items-center gap-1.5 lg:gap-0.5">
                {item.duration?.vi ? (
                  <>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground lg:order-1 mt-1">
                      <Clock className="inline w-3 h-3 mr-1" />
                      {t('Thời gian', 'Timeline')}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {t(item.duration.vi, item.duration.en)}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Price */}
              <div className="lg:text-center flex lg:flex-col items-baseline lg:items-center gap-1.5 lg:gap-0.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground lg:order-1 mt-1">
                  {t('Chi phí', 'Price')}
                </div>
                <div className="text-lg font-extrabold text-primary">
                  {t(item.price.vi, item.price.en)}
                </div>
              </div>

              {/* CTA */}
              <div className="lg:text-right">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-foreground/90 transition-colors whitespace-nowrap"
                >
                  {t('Liên hệ', 'Contact us')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t(
            '💡 Tất cả gói setup đều được tư vấn 1-1 miễn phí trước khi báo giá cụ thể theo nhu cầu doanh nghiệp.',
            '💡 Every setup package starts with a free 1-on-1 consultation before we tailor a quote to your business needs.'
          )}
        </p>
      </div>
    </section>
  )
}
