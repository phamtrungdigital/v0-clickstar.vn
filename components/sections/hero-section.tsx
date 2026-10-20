'use client'

import { useLanguage } from '@/contexts/language-context'
import { useLocalHref } from '@/components/app-link'
import { InlineSvgImage } from '@/components/inline-svg-image'
import type { HeroContent } from '@/lib/cms/types'

/**
 * Hero theo mockup Apple: tiêu đề căn giữa, một đoạn dẫn, hai nút, hàng số liệu uy tín, rồi "ảnh sản phẩm":
 * sơ đồ nền tảng Click Star (SVG sống, có bản PC ngang và bản mobile dọc, có bản EN) với bóng đổ duy nhất của trang.
 * Ảnh cũ (luồng dữ liệu) vẫn được hiểu: CMS còn trỏ vào đường dẫn cũ thì tự dùng sơ đồ mới; chọn ảnh khác thì hiện ảnh đó.
 * Mọi trường CMS (badge, heading, description, cta, support, image) vẫn sửa được như cũ.
 */
/** Hiệu ứng vào nhẹ khi tải trang: từng lớp trượt lên và hiện dần, lần lượt; tắt khi chọn giảm chuyển động. */
const HERO_CSS = `
@keyframes cs-hero-in { from { transform: translateY(12px) } to { transform: none } }
@keyframes cs-hero-rise { from { opacity: 0; transform: translateY(26px) scale(.985) } to { opacity: 1; transform: none } }
.cs-hero-in { animation: cs-hero-in .7s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--d, 0) * 1ms) }
.cs-hero-rise { animation: cs-hero-rise .9s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--d, 0) * 1ms) }
@media (prefers-reduced-motion: reduce) { .cs-hero-in, .cs-hero-rise { animation: none } }
`

const LEGACY_FLOW_SRC = '/images/clickstar-data-flow.svg'
const PLATFORM_SRC = {
  vi: { desktop: '/images/clickstar-hero-platform.svg', mobile: '/images/clickstar-hero-platform-m.svg' },
  en: { desktop: '/images/clickstar-hero-platform-en.svg', mobile: '/images/clickstar-hero-platform-m-en.svg' },
}

// Số liệu thương hiệu đã được chủ site xác nhận (khớp trang Giới thiệu)
const TRUST = [
  { value: '10+', vi: 'năm kinh nghiệm', en: 'years of experience' },
  { value: '100+', vi: 'doanh nghiệp đồng hành', en: 'businesses served' },
  { value: '90%+', vi: 'khách hàng hài lòng', en: 'satisfied clients' },
]

export function HeroSection({ content }: { content: HeroContent }) {
  const { t, language } = useLanguage()
  const localHref = useLocalHref()
  const lang = language === 'en' ? 'en' : 'vi'
  const usePlatform = content.image_src === LEGACY_FLOW_SRC || !content.image_src
  // Ảnh SVG có chữ tiếng Việt do CMS chọn: dùng bản tiếng Anh khi site ở EN (chỉ các ảnh đã có bản -en)
  const EN_VARIANT: Record<string, string> = { [LEGACY_FLOW_SRC]: '/images/clickstar-data-flow-en.svg' }
  const imageSrc = language === 'en' ? (EN_VARIANT[content.image_src] ?? content.image_src) : content.image_src
  const imageAlt = t(content.image_alt.vi, content.image_alt.en)
  const imgClass = 'w-full h-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:block'

  return (
    <section data-cms-section="hero" className="ap-tile ap-light relative isolate overflow-hidden">
      {/* Quầng sáng xanh rất nhạt phía sau, tạo chiều sâu mà không phá nền trắng của trang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(30,109,218,0.10),rgba(30,109,218,0)_70%)]"
      />
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ap-stack">
          <p
            data-cms-field="badge"
            style={{ ['--d' as string]: 0 } as React.CSSProperties}
            className="cs-hero-in inline-flex items-center gap-2 rounded-full border border-[#b9d4f8] bg-[#eaf2fd] px-4 py-1.5 text-[13px] font-semibold text-[#144c97]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#1e6dda]" />
            {t(content.badge.vi, content.badge.en)}
          </p>

          <h1 data-cms-field="heading" className="ap-hero-title cs-hero-in" style={{ ['--d' as string]: 70 } as React.CSSProperties}>
            {t(content.heading_lead.vi, content.heading_lead.en)}
            {content.heading_number}
            {t(content.heading_middle.vi, content.heading_middle.en)}
            {t(content.heading_highlight.vi, content.heading_highlight.en)}
            {t(content.heading_tail.vi, content.heading_tail.en)}
          </h1>

          <p data-cms-field="description" className="ap-lead max-w-[760px] cs-hero-in" style={{ ['--d' as string]: 150 } as React.CSSProperties}>
            {t(content.description.vi, content.description.en)}
          </p>

          <div className="ap-cta-row mt-2 cs-hero-in" style={{ ['--d' as string]: 230 } as React.CSSProperties}>
            <a data-cms-field="cta" href={localHref(content.cta_href)} className="ap-btn ap-btn-primary">
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

          <ul className="cs-hero-in mt-5 grid w-full max-w-[640px] grid-cols-3 divide-x divide-[#e0e0e0]" style={{ ['--d' as string]: 310 } as React.CSSProperties}>
            {TRUST.map((x) => (
              <li key={x.value} className="flex flex-col items-center gap-1 px-2 sm:px-4">
                <span className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-[32px]">{x.value}</span>
                <span className="text-[12px] leading-tight text-[#515154] sm:text-sm">{lang === 'vi' ? x.vi : x.en}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ap-product ap-product-shadow cs-hero-rise max-w-[880px] mt-10 sm:mt-14" style={{ ['--d' as string]: 380 } as React.CSSProperties}>
          {usePlatform ? (
            <>
              <InlineSvgImage
                cmsField="image"
                src={PLATFORM_SRC[lang].desktop}
                alt={imageAlt}
                className={`hidden sm:block aspect-[1080/600] ${imgClass}`}
              />
              <InlineSvgImage src={PLATFORM_SRC[lang].mobile} alt={imageAlt} className={`sm:hidden aspect-[480/652] ${imgClass}`} />
            </>
          ) : (
            <InlineSvgImage cmsField="image" src={imageSrc} alt={imageAlt} className={imgClass} />
          )}
        </div>
      </div>
    </section>
  )
}
