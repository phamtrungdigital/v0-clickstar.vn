'use client'

import { ServiceCard } from './service-card'
import Link from '@/components/app-link'
import { useLanguage } from '@/contexts/language-context'
import { InlineSvgImage } from '@/components/inline-svg-image'
import { Reveal } from '@/components/ui/reveal'
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ServicesContent } from '@/lib/cms/types'

/**
 * Lộ trình khách hàng (khớp phần "Định vị" trong hồ sơ năng lực): mỗi dịch vụ thuộc một tầng, thẻ hiển thị theo thứ tự tầng.
 * Gán theo đoạn cuối của đường dẫn dịch vụ; dịch vụ lạ (chưa có trong bảng) xếp cuối và không có nhãn tầng.
 */
const LEGACY_PIPELINE_SRC = '/images/clickstar-pipeline.svg'
const PIPELINE_DARK = {
  vi: { desktop: '/images/clickstar-pipeline-dark.svg', mobile: '/images/clickstar-pipeline-dark-m.svg' },
  en: { desktop: '/images/clickstar-pipeline-dark-en.svg', mobile: '/images/clickstar-pipeline-dark-m-en.svg' },
}

const LAYERS = [
  { vi: 'Thu hút khách hàng', en: 'Attract customers' },
  { vi: 'Chuyển đổi khách hàng', en: 'Convert customers' },
  { vi: 'Quản trị khách hàng', en: 'Manage customers' },
  { vi: 'Đo lường hiệu quả', en: 'Measure results' },
  { vi: 'Ứng dụng AI', en: 'Apply AI' },
  { vi: 'Phần mềm riêng', en: 'Custom software' },
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
/** Tách "A → B → C, ghi chú" thành các chặng và phần ghi chú; không đúng dạng thì trả steps rỗng để hiện nguyên câu. */
function parseChain(text: string): { steps: string[]; note: string } {
  const [chain, ...rest] = text.split(/,\s*/)
  const steps = chain.split(/\s*→\s*/).map((x) => x.trim()).filter(Boolean)
  return steps.length >= 3 ? { steps, note: rest.join(', ') } : { steps: [], note: text }
}

/**
 * icons: biểu tượng của từng dịch vụ (theo thứ tự content.services), dựng sẵn ở máy chủ (home-view) từ tên admin nhập.
 * Tra tên biểu tượng ở máy chủ để trình duyệt không phải tải cả danh sách hơn 100 biểu tượng (lib/icons) chỉ cho khối này.
 */
export function ServicesSection({ content, icons }: { content: ServicesContent; icons?: ReactNode[] }) {
  const { t, language } = useLanguage()
  const lang = language === 'en' ? 'en' : 'vi'
  // Ảnh cũ (nền sáng, chữ nhỏ): CMS còn trỏ vào thì tự dùng sơ đồ tối mới có bản mobile dọc và bản tiếng Anh; chọn ảnh khác thì hiện ảnh đó
  const darkPipeline = !content.pipeline_image_src || content.pipeline_image_src === LEGACY_PIPELINE_SRC
  const pipelineAlt = t(content.pipeline_image_alt.vi, content.pipeline_image_alt.en)

  return (
    <div data-cms-section="services">
      {/* Khối tối: pipeline dữ liệu thời gian thực */}
      <section data-cms-field="pipeline" className="ap-tile ap-dark relative isolate overflow-hidden" id="pipeline">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(55% 45% at 50% 0%, rgba(30,109,218,0.30), rgba(30,109,218,0) 70%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 44px 44px, 44px 44px',
            maskImage: 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)',
          }}
        />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="ap-stack">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#7db8ff]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d058] opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34d058]" />
                </span>
                {t(content.pipeline_eyebrow.vi, content.pipeline_eyebrow.en)}
              </p>
              <h2 className="ap-display">{t(content.pipeline_heading.vi, content.pipeline_heading.en)}</h2>
              {(() => {
                const { steps, note } = parseChain(t(content.pipeline_subtitle.vi, content.pipeline_subtitle.en))
                if (steps.length === 0) {
                  return <p className="max-w-[640px] text-balance text-[17px] leading-[1.55] text-[#d2d2d7] sm:text-[19px]">{note}</p>
                }
                return (
                  <>
                    {/* Các chặng của luồng dữ liệu: hai chặng giữa (lõi) nổi bật */}
                    <ol className="m-0 mt-1 flex max-w-[980px] list-none flex-wrap items-center justify-center gap-x-2 gap-y-3 p-0" aria-label={steps.join(' → ')}>
                      {steps.map((st, i) => {
                        const core = steps.length === 5 && (i === 2 || i === 3)
                        return (
                          <li key={i} className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold leading-none sm:text-[15px] ${
                                core
                                  ? 'border-[#7db8ff]/55 bg-[#1e6dda]/25 text-white shadow-[0_0_24px_-6px_rgba(30,109,218,0.9)]'
                                  : 'border-white/15 bg-white/[0.06] text-[#e5e5ea]'
                              }`}
                            >
                              <span className={`text-[11px] tabular-nums ${core ? 'text-[#a9d0ff]' : 'text-[#7db8ff]'}`}>{String(i + 1).padStart(2, '0')}</span>
                              {st}
                            </span>
                            {i < steps.length - 1 && <ArrowRight aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-[#7db8ff]/70 sm:block" />}
                          </li>
                        )
                      })}
                    </ol>
                    {note && (
                      <p className="inline-flex items-center gap-2 text-[14px] text-[#a1a1a6] sm:text-[15px]">
                        <RefreshCw aria-hidden="true" className="h-4 w-4 text-[#7db8ff] [animation:spin_6s_linear_infinite] motion-reduce:animate-none" />
                        {note.charAt(0).toUpperCase() + note.slice(1)}
                      </p>
                    )}
                  </>
                )
              })()}
            </div>
          </Reveal>

          <Reveal delay={120}>
            {/* Khung sơ đồ kiểu cửa sổ ứng dụng. Sơ đồ tối có bản dọc cho điện thoại; ảnh khác (nền sáng) thì cho vuốt ngang */}
            <div
              className={`mx-auto mt-10 max-w-[1180px] overflow-hidden rounded-[20px] shadow-[0_40px_90px_-40px_rgba(30,109,218,0.75)] ring-1 ring-white/15 sm:mt-14 ${darkPipeline ? 'bg-[#0b1020]' : 'bg-white'}`}
            >
              <div
                className={`flex items-center justify-between gap-3 border-b px-4 py-2.5 ${darkPipeline ? 'border-white/10 bg-white/[0.05]' : 'border-[#e8e8ed] bg-[#f5f5f7]'}`}
              >
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className={`truncate text-[12px] font-medium ${darkPipeline ? 'text-[#8e9bb5]' : 'text-[#6e6e73]'}`}>clickstar · data pipeline</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${darkPipeline ? 'bg-[#28c840]/15 text-[#7ee08f]' : 'bg-[#28c840]/15 text-[#1d7a34]'}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                  {t('Trực tuyến', 'Live')}
                </span>
              </div>
              {darkPipeline ? (
                <>
                  <InlineSvgImage
                    src={PIPELINE_DARK[lang].desktop}
                    alt={pipelineAlt}
                    loading="lazy"
                    className="hidden aspect-[1280/700] w-full h-auto sm:block [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
                  />
                  {/* Trên điện thoại sơ đồ này nằm trong màn hình đầu và là phần tử lớn nhất (LCP theo PageSpeed): tải ngay, ưu tiên cao */}
                  <InlineSvgImage
                    src={PIPELINE_DARK[lang].mobile}
                    alt={pipelineAlt}
                    fetchPriority="high"
                    className="aspect-[480/1490] w-full h-auto sm:hidden [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
                  />
                </>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-[860px] sm:min-w-0">
                    <InlineSvgImage
                      src={content.pipeline_image_src}
                      alt={pipelineAlt}
                      className="w-full h-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
                    />
                  </div>
                </div>
              )}
            </div>
            {!darkPipeline && (
              <p className="mt-4 text-center text-[13px] text-[#a1a1a6] sm:hidden">{t('Vuốt ngang để xem toàn bộ sơ đồ', 'Swipe sideways to see the full diagram')}</p>
            )}
            <p className="mx-auto mt-5 max-w-[680px] text-balance text-center text-[15px] leading-[1.55] text-[#a1a1a6]">
              {t(
                'Dữ liệu chảy liên tục từ quảng cáo đến báo cáo. Kết quả đo được ở cuối quay lại điều chỉnh ngân sách và nội dung ở đầu.',
                'Data flows continuously from ads to reports. What we measure at the end feeds back into budget and content at the start.'
              )}
            </p>
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
              <p
                data-cms-field="description"
                className="max-w-[640px] text-balance text-[17px] leading-[1.55] tracking-[-0.01em] text-[#515154] sm:text-[19px]"
              >
                {t(content.description.vi, content.description.en)}
              </p>
            </div>
          </Reveal>

          {/* Lộ trình 6 tầng: từ thu hút khách đến nền tảng riêng. Chỉ hiện từ màn hình vừa trở lên. */}
          <Reveal delay={100} className="hidden md:block">
            <ol className="relative mx-auto mt-10 grid max-w-[1000px] list-none grid-cols-6 p-0 sm:mt-12" aria-hidden="true">
              <span className="absolute left-[8.33%] right-[8.33%] top-[15px] h-px bg-gradient-to-r from-[#1e6dda]/20 via-[#1e6dda]/50 to-[#1e6dda]/20" />
              {LAYERS.map((l, i) => (
                <li key={i} className="relative flex flex-col items-center gap-2.5 px-1">
                  <span className="grid h-[31px] w-[31px] place-items-center rounded-full border border-[#1e6dda]/40 bg-white text-[12px] font-semibold tabular-nums text-[#1e6dda] shadow-[0_0_0_4px_rgba(245,245,247,1)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="max-w-[124px] text-balance text-center text-[14px] font-semibold leading-tight tracking-[-0.01em] text-[#144c97]">{t(l.vi, l.en)}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 auto-rows-fr">
            {content.services
              .map((service, index) => ({ service, index, layer: layerOf(service.href ?? '') }))
              .sort((x, y) => (x.layer < 0 ? 99 : x.layer) - (y.layer < 0 ? 99 : y.layer) || x.index - y.index)
              .map(({ service, index, layer }, order, all) => {
                // Lưới 3 cột (6 phần): hàng cuối thiếu thẻ thì các thẻ cuối giãn ra cho kín hàng, không để ô trống
                const rest = all.length % 3
                const inLast = order >= all.length - rest
                const span = !rest || !inLast ? 'lg:col-span-2' : rest === 2 ? 'lg:col-span-3' : 'lg:col-span-6'
                const l = layer >= 0 ? LAYERS[layer] : null
                return (
                  <Reveal key={index} delay={(order % 3) * 90} className={`h-full min-w-0 ${span}`}>
                    <div data-cms-field="item" data-cms-item-index={index} className="h-full min-w-0">
                      <ServiceCard
                        icon={icons?.[index] ?? <Sparkles aria-hidden="true" />}
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
