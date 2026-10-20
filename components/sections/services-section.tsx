'use client'

import { ServiceCard } from './service-card'
import Link from '@/components/app-link'
import { useLanguage } from '@/contexts/language-context'
import { InlineSvgImage } from '@/components/inline-svg-image'
import { Reveal } from '@/components/ui/reveal'
import { iconByName } from '@/lib/icons'
import { Sparkles } from 'lucide-react'
import type { ServicesContent } from '@/lib/cms/types'

/**
 * Lộ trình khách hàng (khớp phần "Định vị" trong hồ sơ năng lực): mỗi dịch vụ thuộc một tầng, thẻ hiển thị theo thứ tự tầng.
 * Gán theo đoạn cuối của đường dẫn dịch vụ; dịch vụ lạ (chưa có trong bảng) xếp cuối và không có nhãn tầng.
 */
const LAYERS = [
  { vi: 'Thu hút', en: 'Attract' },
  { vi: 'Chuyển đổi', en: 'Convert' },
  { vi: 'Quản trị', en: 'Manage' },
  { vi: 'Đo lường', en: 'Measure' },
  { vi: 'AI', en: 'AI' },
  { vi: 'Xây riêng', en: 'Custom' },
]
const SLUG_LAYER: Record<string, number> = {
  'digital-marketing': 0,
  website: 1,
  'crm-cdp': 2,
  automation: 2,
  dashboard: 3,
  'ai-integration': 4,
  'speech-insight-ai': 4,
  'custom-software': 5,
}
const layerOf = (href: string) => {
  const seg = href.split('?')[0].split('#')[0].replace(/\/+$/, '').split('/').pop() ?? ''
  return seg in SLUG_LAYER ? SLUG_LAYER[seg] : -1
}

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
          <Reveal>
            <div className="ap-stack">
              <p className="text-sm text-[#d2d2d7] tracking-[-0.016em]">
                {t(content.pipeline_eyebrow.vi, content.pipeline_eyebrow.en)}
              </p>
              <h2 className="ap-display">{t(content.pipeline_heading.vi, content.pipeline_heading.en)}</h2>
              <p className="ap-lead max-w-[820px]">
                {t(content.pipeline_subtitle.vi, content.pipeline_subtitle.en)}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="ap-product max-w-[1180px] mt-10 sm:mt-14">
              <InlineSvgImage
                src={content.pipeline_image_src}
                alt={t(content.pipeline_image_alt.vi, content.pipeline_image_alt.en)}
                className="w-full h-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Khối xám nhạt: dịch vụ, xếp theo lộ trình khách hàng */}
      <section
        className="ap-tile ap-parchment relative isolate overflow-hidden"
        id="services"
        style={{
          backgroundImage: 'radial-gradient(rgba(30,109,218,0.10) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
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
          </Reveal>

          {/* Lộ trình 6 tầng: từ thu hút khách đến nền tảng riêng. Chỉ hiện từ màn hình vừa trở lên. */}
          <Reveal delay={100} className="hidden md:block">
            <ol className="relative mx-auto mt-10 flex max-w-[1000px] list-none items-center justify-between p-0 sm:mt-12" aria-hidden="true">
              <span className="absolute left-4 right-4 top-[15px] h-px bg-gradient-to-r from-transparent via-[#1e6dda]/45 to-transparent" />
              {LAYERS.map((l, i) => (
                <li key={i} className="relative flex flex-col items-center gap-2">
                  <span className="grid h-[31px] w-[31px] place-items-center rounded-full border border-[#1e6dda]/40 bg-white text-[12px] font-semibold tabular-nums text-[#1e6dda] shadow-[0_0_0_4px_rgba(245,245,247,1)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#144c97]">{t(l.vi, l.en)}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 auto-rows-fr">
            {content.services
              .map((service, index) => ({ service, index, layer: layerOf(service.href ?? '') }))
              .sort((x, y) => (x.layer < 0 ? 99 : x.layer) - (y.layer < 0 ? 99 : y.layer) || x.index - y.index)
              .map(({ service, index, layer }, order, all) => {
                const Icon = iconByName(service.icon, Sparkles)
                // Lưới 3 cột (6 phần): hàng cuối thiếu thẻ thì các thẻ cuối giãn ra cho kín hàng, không để ô trống
                const rest = all.length % 3
                const inLast = order >= all.length - rest
                const span = !rest || !inLast ? 'lg:col-span-2' : rest === 2 ? 'lg:col-span-3' : 'lg:col-span-6'
                const l = layer >= 0 ? LAYERS[layer] : null
                return (
                  <Reveal key={index} delay={(order % 3) * 90} className={`h-full min-w-0 ${span}`}>
                    <div data-cms-field="item" data-cms-item-index={index} className="h-full min-w-0">
                      <ServiceCard
                        icon={<Icon aria-hidden="true" />}
                        title={t(service.title.vi, service.title.en)}
                        description={t(service.description.vi, service.description.en)}
                        tag={t(service.tag.vi, service.tag.en)}
                        href={service.href}
                        badge={service.badge ? t(service.badge.vi, service.badge.en) : undefined}
                        moreLabel={t('Tìm hiểu thêm', 'Learn more')}
                        step={l ? String(layer + 1).padStart(2, '0') : undefined}
                        layer={l ? t(l.vi, l.en) : undefined}
                      />
                    </div>
                  </Reveal>
                )
              })}
          </div>

          <Reveal className="mt-10">
            <Link data-cms-field="footer_link" href={content.footer_link_href} className="text-base text-muted-foreground">
              {t(content.footer_link_prefix.vi, content.footer_link_prefix.en)}
              <span className="ap-link">{t(content.footer_link_label.vi, content.footer_link_label.en)}</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
