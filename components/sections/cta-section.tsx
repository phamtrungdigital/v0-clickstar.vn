'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { CtaContent } from '@/lib/cms/types'

export function CTASection({ content }: { content: CtaContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="cta" className="py-20 lg:py-28 bg-[#EEF3FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Badge */}
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>

          {/* Heading */}
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-8 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              data-cms-field="cta"
              href={content.cta_href}
              className="group inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              {t(content.cta_label.vi, content.cta_label.en)}
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              data-cms-field="phone"
              href={`tel:${content.phone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <Phone className="w-5 h-5 text-primary" />
              </span>
              <span className="text-left">
                <span className="block text-sm text-muted-foreground">
                  {t(content.phone_label.vi, content.phone_label.en)}
                </span>
                <span className="block font-semibold">{content.phone}</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Partners */}
        <div data-cms-field="partners" className="border-t border-primary/10 pt-12">
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t(content.trust_label.vi, content.trust_label.en)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {content.partner_names.map((partner) => (
              <div
                key={partner}
                className="text-xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
