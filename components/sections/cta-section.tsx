'use client'

import Link from '@/components/app-link'
import { useLanguage } from '@/contexts/language-context'
import type { CtaContent } from '@/lib/cms/types'

export function CTASection({ content }: { content: CtaContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="cta" className="ap-tile ap-parchment">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ap-stack">
          <span data-cms-field="eyebrow" className="text-sm text-muted-foreground tracking-[-0.016em]">
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>

          <h2 data-cms-field="heading" className="ap-display max-w-[820px]">
            {t(content.heading_lead.vi, content.heading_lead.en)}
            {t(content.heading_highlight.vi, content.heading_highlight.en)}
          </h2>

          <div className="ap-cta-row mt-2">
            <Link data-cms-field="cta" href={content.cta_href} className="ap-btn ap-btn-primary">
              {t(content.cta_label.vi, content.cta_label.en)}
            </Link>
            <Link
              data-cms-field="phone"
              href={`tel:${content.phone.replace(/[^+\d]/g, '')}`}
              className="ap-btn ap-btn-ghost"
            >
              {content.phone}
            </Link>
          </div>
        </div>

        {/* Partners — danh sách rỗng thì ẩn cả khối (admin xoá hết tên trong CMS là dải này biến mất) */}
        {(content.partner_names?.length ?? 0) > 0 && (
          <div data-cms-field="partners" className="mt-14 pt-10 border-t border-border">
            <p className="text-sm text-muted-foreground mb-6">
              {t(content.trust_label.vi, content.trust_label.en)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              {content.partner_names.map((partner) => (
                <div key={partner} className="text-xl font-semibold text-[#515154]">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
