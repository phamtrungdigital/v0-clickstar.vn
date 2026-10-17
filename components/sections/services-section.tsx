'use client'

import { ServiceCard } from './service-card'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { InlineSvgImage } from '@/components/inline-svg-image'
import type { ServicesContent } from '@/lib/cms/types'

/**
 * Theo mockup Apple, section này gồm 2 khối liên tiếp:
 *  1) Khối tối: sơ đồ pipeline dữ liệu (giữ nguyên ảnh SVG hiện có) đặt như "ảnh sản phẩm".
 *  2) Khối xám nhạt: lưới thẻ dịch vụ.
 * Các trường CMS (eyebrow, heading, description, services, footer_link, pipeline_*) giữ nguyên.
 * Màu/biểu tượng riêng từng dịch vụ (service.color, service.icon) không còn dùng: thiết kế một màu xanh.
 */
export function ServicesSection({ content }: { content: ServicesContent }) {
  const { t } = useLanguage()

  return (
    <div data-cms-section="services">
      {/* Khối tối: pipeline */}
      <section data-cms-field="pipeline" className="ap-tile ap-dark" id="pipeline">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ap-stack">
            <p className="text-sm text-[#a1a1a6] tracking-[-0.016em]">
              {t(content.pipeline_eyebrow.vi, content.pipeline_eyebrow.en)}
            </p>
            <h2 className="ap-display">{t(content.pipeline_heading.vi, content.pipeline_heading.en)}</h2>
            <p className="ap-lead max-w-[820px]">
              {t(content.pipeline_subtitle.vi, content.pipeline_subtitle.en)}
            </p>
          </div>

          <div className="ap-product max-w-[1180px] mt-10 sm:mt-14">
            <InlineSvgImage
              src={content.pipeline_image_src}
              alt={t(content.pipeline_image_alt.vi, content.pipeline_image_alt.en)}
              className="w-full h-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
            />
          </div>
        </div>
      </section>

      {/* Khối xám nhạt: dịch vụ */}
      <section className="ap-tile ap-parchment" id="services">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ap-stack">
            <span data-cms-field="eyebrow" className="text-sm text-muted-foreground tracking-[-0.016em]">
              {t(content.eyebrow.vi, content.eyebrow.en)}
            </span>
            <h2 data-cms-field="heading" className="ap-display">
              {t(content.heading_lead.vi, content.heading_lead.en)}
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </h2>
            <p data-cms-field="description" className="ap-lead max-w-[760px]">
              {t(content.description.vi, content.description.en)}
            </p>
          </div>

          <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
            {content.services.map((service, index) => (
              <div key={index} data-cms-field="item" data-cms-item-index={index} className="h-full min-w-0">
                <ServiceCard
                  title={t(service.title.vi, service.title.en)}
                  description={t(service.description.vi, service.description.en)}
                  tag={t(service.tag.vi, service.tag.en)}
                  href={service.href}
                  badge={service.badge ? t(service.badge.vi, service.badge.en) : undefined}
                  moreLabel={t('Tìm hiểu thêm', 'Learn more')}
                />
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link data-cms-field="footer_link" href={content.footer_link_href} className="text-base text-muted-foreground">
              {t(content.footer_link_prefix.vi, content.footer_link_prefix.en)}
              <span className="ap-link">{t(content.footer_link_label.vi, content.footer_link_label.en)}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
