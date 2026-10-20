'use client'

import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import type { TestimonialsContent, TestimonialItem } from '@/lib/cms/types'

function TestimonialCard({
  testimonial,
  quote,
  source,
  itemIndex,
}: {
  testimonial: TestimonialItem
  quote: string
  source: string
  itemIndex?: number
}) {
  return (
    <div
      data-cms-field={itemIndex !== undefined ? 'item' : undefined}
      data-cms-item-index={itemIndex}
      className="bg-white rounded-2xl p-7 shadow-sm border border-border/50 relative h-full"
    >
      <div className="absolute top-6 right-6 text-[#1859b8]/10">
        <Quote className="w-12 h-12 fill-current" />
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating ? 'fill-[#1e6dda] text-[#1859b8]' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>

      <p className="text-foreground leading-relaxed mb-6 text-[15px] relative z-10">
        &quot;{quote}&quot;
      </p>

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
          <Image quality={95} src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" sizes="48px" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
          <p className="text-sm text-muted-foreground">{source}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection({ content }: { content: TestimonialsContent }) {
  const { t } = useLanguage()
  // Mỗi thẻ trôi qua khoảng 4 giây (như slider cũ); dải gồm 2 bản để vòng lặp liền mạch.
  const duration = `${Math.max(1, content.items.length) * 4}s`

  return (
    <section data-cms-section="testimonials" className="py-20 lg:py-28 bg-[#eaf2fd] overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
        <div className="text-center max-w-2xl mx-auto">
          <div
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-white text-[#1859b8] font-semibold text-sm px-4 py-2 rounded-full mb-6 shadow-sm"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </div>

          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-[#1859b8]">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>

          <p data-cms-field="subtitle" className="text-muted-foreground text-lg">
            {t(content.subtitle.vi, content.subtitle.en)}
          </p>
        </div>
      </div>

      {/* Dải đánh giá trôi liên tục bằng CSS (không dùng thư viện trượt): dừng khi rê chuột hoặc chạm.
          Người dùng bật giảm chuyển động thì không trôi, thay bằng cuộn ngang. */}
      <div className="relative">
        <div className="tm-viewport overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="tm-track flex w-max" style={{ ['--tm-dur' as string]: duration }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1 ? true : undefined}>
                {content.items.map((testimonial, index) => (
                  <div key={`${copy}-${index}`} className="tm-card shrink-0">
                    <TestimonialCard
                      testimonial={testimonial}
                      quote={t(testimonial.quote.vi, testimonial.quote.en)}
                      source={t(testimonial.source.vi, testimonial.source.en)}
                      itemIndex={copy === 0 ? index : undefined}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-[#f5f5f7] z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-[#f5f5f7] z-10 pointer-events-none" />

        <style>{`
          .tm-card{width:calc((100vw - 32px) / 1.2 - 20px);margin-right:20px}
          @media (min-width:480px){.tm-card{width:calc((100vw - 32px) / 1.5 - 20px)}}
          @media (min-width:640px){.tm-card{width:calc((100vw - 48px) / 2.2 - 24px);margin-right:24px}}
          @media (min-width:768px){.tm-card{width:calc((100vw - 48px) / 2.8 - 24px)}}
          @media (min-width:1024px){.tm-card{width:calc((100vw - 64px) / 3.5 - 28px);margin-right:28px}}
          @media (min-width:1280px){.tm-card{width:calc((100vw - 64px) / 4.2 - 28px)}}
          @media (min-width:1536px){.tm-card{width:calc((100vw - 64px) / 5 - 32px);margin-right:32px}}
          .tm-track{animation:tm-marquee var(--tm-dur) linear infinite}
          .tm-viewport:hover .tm-track,.tm-viewport:active .tm-track,.tm-viewport:focus-within .tm-track{animation-play-state:paused}
          @keyframes tm-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
          @media (prefers-reduced-motion:reduce){
            .tm-viewport{overflow-x:auto;scroll-snap-type:x mandatory}
            .tm-track{animation:none}
            .tm-track>[aria-hidden]{display:none}
            .tm-card{scroll-snap-align:start}
          }
        `}</style>
      </div>
    </section>
  )
}
