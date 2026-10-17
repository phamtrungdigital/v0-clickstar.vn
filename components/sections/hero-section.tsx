'use client'

import { useLanguage } from '@/contexts/language-context'
import { InlineSvgImage } from '@/components/inline-svg-image'
import type { HeroContent } from '@/lib/cms/types'

/**
 * Hero theo mockup Apple: tiêu đề căn giữa, một đoạn dẫn, hai nút, rồi ảnh minh họa SVG
 * (giữ nguyên ảnh luồng dữ liệu hiện có) làm "ảnh sản phẩm" với bóng đổ duy nhất của trang.
 * Mọi trường CMS (badge, heading, description, cta, support, image) vẫn sửa được như cũ.
 */
export function HeroSection({ content }: { content: HeroContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="hero" className="ap-tile ap-light">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ap-stack">
          <p data-cms-field="badge" className="text-sm text-muted-foreground tracking-[-0.016em]">
            {t(content.badge.vi, content.badge.en)}
          </p>

          <h1 data-cms-field="heading" className="ap-hero-title">
            {t(content.heading_lead.vi, content.heading_lead.en)}
            {content.heading_number}
            {t(content.heading_middle.vi, content.heading_middle.en)}
            {t(content.heading_highlight.vi, content.heading_highlight.en)}
            {t(content.heading_tail.vi, content.heading_tail.en)}
          </h1>

          <p data-cms-field="description" className="ap-lead max-w-[760px]">
            {t(content.description.vi, content.description.en)}
          </p>

          <div className="ap-cta-row mt-2">
            <a data-cms-field="cta" href={content.cta_href} className="ap-btn ap-btn-primary">
              {t(content.cta_label.vi, content.cta_label.en)}
            </a>
            <a
              data-cms-field="support"
              href={`tel:${content.support_phone.replace(/[^+\d]/g, '')}`}
              className="ap-btn ap-btn-ghost"
            >
              {content.support_phone}
            </a>
          </div>
        </div>

        <div className="ap-product ap-product-shadow max-w-[760px] mt-10 sm:mt-14">
          <InlineSvgImage
            cmsField="image"
            src={content.image_src}
            alt={t(content.image_alt.vi, content.image_alt.en)}
            className="w-full h-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
          />
        </div>
      </div>
    </section>
  )
}
