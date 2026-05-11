'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import type { TestimonialsContent, TestimonialItem } from '@/lib/cms/types'

import 'swiper/css'
import 'swiper/css/free-mode'

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
      <div className="absolute top-6 right-6 text-primary/10">
        <Quote className="w-12 h-12 fill-current" />
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>

      <p className="text-foreground leading-relaxed mb-6 text-[15px] relative z-10">
        &quot;{quote}&quot;
      </p>

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
          <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{source}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection({ content }: { content: TestimonialsContent }) {
  const swiperRef = useRef<SwiperType | null>(null)
  const { t } = useLanguage()

  return (
    <section data-cms-section="testimonials" className="py-20 lg:py-28 bg-[#EEF3FF] overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
        <div className="text-center max-w-2xl mx-auto">
          <div
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6 shadow-sm"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </div>

          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>

          <p data-cms-field="subtitle" className="text-muted-foreground text-lg">
            {t(content.subtitle.vi, content.subtitle.en)}
          </p>
        </div>
      </div>

      {/* Slider */}
      <div
        className="relative"
        onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
        onMouseLeave={() => swiperRef.current?.autoplay?.start()}
      >
        <Swiper
          modules={[Autoplay, FreeMode]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          slidesPerView={1.2}
          spaceBetween={20}
          loop={true}
          speed={4000}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          freeMode={{ enabled: true, momentum: false }}
          breakpoints={{
            480: { slidesPerView: 1.5, spaceBetween: 20 },
            640: { slidesPerView: 2.2, spaceBetween: 24 },
            768: { slidesPerView: 2.8, spaceBetween: 24 },
            1024: { slidesPerView: 3.5, spaceBetween: 28 },
            1280: { slidesPerView: 4.2, spaceBetween: 28 },
            1536: { slidesPerView: 5, spaceBetween: 32 },
          }}
          className="!px-4 sm:!px-6 lg:!px-8"
        >
          {[...content.items, ...content.items].map((testimonial, index) => {
            const realIdx = index % content.items.length
            return (
              <SwiperSlide key={`${realIdx}-${index}`} className="!h-auto">
                <TestimonialCard
                  testimonial={testimonial}
                  quote={t(testimonial.quote.vi, testimonial.quote.en)}
                  source={t(testimonial.source.vi, testimonial.source.en)}
                  itemIndex={index < content.items.length ? realIdx : undefined}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>

        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[#EEF3FF] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[#EEF3FF] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  )
}
