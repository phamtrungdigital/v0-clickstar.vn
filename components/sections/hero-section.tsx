'use client'

import { Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { InlineSvgImage } from '@/components/inline-svg-image'
import type { HeroContent } from '@/lib/cms/types'

export function HeroSection({ content }: { content: HeroContent }) {
  const { t } = useLanguage()

  return (
    <section
      data-cms-section="hero"
      className="relative bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-br from-primary/15 to-primary-dark/10 rounded-full blur-2xl" />
      </div>

      {/* Bottom curved edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-24 z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path d="M0 96V0C240 64 480 96 720 96C960 96 1200 64 1440 0V96H0Z" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 xl:py-28">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              data-cms-field="badge"
              className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-xs sm:text-sm uppercase tracking-wide px-4 py-2 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t(content.badge.vi, content.badge.en)}
            </div>

            {/* Heading */}
            <h1
              data-cms-field="heading"
              className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-foreground leading-[1.1] tracking-tight text-balance"
            >
              {t(content.heading_lead.vi, content.heading_lead.en)}
              <span className="text-primary">{content.heading_number}</span>
              {t(content.heading_middle.vi, content.heading_middle.en)}
              <span className="text-primary">
                {t(content.heading_highlight.vi, content.heading_highlight.en)}
              </span>
              {t(content.heading_tail.vi, content.heading_tail.en)}
            </h1>

            {/* Description */}
            <p
              data-cms-field="description"
              className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty"
            >
              {t(content.description.vi, content.description.en)}
            </p>

            {/* CTA Group */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <a
                data-cms-field="cta"
                href={content.cta_href}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                {t(content.cta_label.vi, content.cta_label.en)}
              </a>

              <a
                data-cms-field="support"
                href={`tel:${content.support_phone.replace(/[^+\d]/g, '')}`}
                className="group flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                  <Phone className="w-5 h-5 text-primary" />
                </span>
                <span className="text-sm sm:text-base">
                  <span className="block text-muted-foreground text-xs sm:text-sm">
                    {t(content.support_label.vi, content.support_label.en)}
                  </span>
                  <span className="font-semibold">{content.support_phone}</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
              <InlineSvgImage
                cmsField="image"
                src={content.image_src}
                alt={t(content.image_alt.vi, content.image_alt.en)}
                className="w-full h-auto relative z-10 rounded-2xl overflow-hidden [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
