'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { CaseStudiesContent, CaseStudyItem } from '@/lib/cms/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export function CaseStudiesSection({ content }: { content: CaseStudiesContent }) {
  const swiperRef = useRef<SwiperType | null>(null)
  const { t } = useLanguage()

  return (
    <section
      data-cms-section="case_studies"
      className="py-16 lg:py-24 bg-background overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <div
              data-cms-field="eyebrow"
              className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-full mb-4"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              {t(content.eyebrow.vi, content.eyebrow.en)}
            </div>

            <h2
              data-cms-field="heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight text-balance"
            >
              {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
              <span className="text-primary">
                {t(content.heading_highlight.vi, content.heading_highlight.en)}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              data-cms-field="view_all"
              href={content.view_all_href}
              className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200"
            >
              {t(content.view_all_label.vi, content.view_all_label.en)}
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-11 h-11 rounded-full border-2 border-border bg-background flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="w-11 h-11 rounded-full border-2 border-border bg-background flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: '.case-studies-pagination',
            bulletClass:
              'inline-block w-2 h-2 rounded-full bg-border cursor-pointer transition-all duration-200',
            bulletActiveClass: '!bg-primary !w-6',
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="!overflow-visible"
        >
          {content.items.map((study, index) => (
            <SwiperSlide key={index}>
              <CaseStudyCard
                study={study}
                title={t(study.title.vi, study.title.en)}
                category={t(study.category.vi, study.category.en)}
                itemIndex={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="case-studies-pagination flex items-center justify-center gap-2 mt-10" />

        <div className="sm:hidden mt-8 text-center">
          <Link
            href={content.view_all_href}
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            {t(content.view_all_label.vi, content.view_all_label.en)}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function CaseStudyCard({
  study,
  title,
  category,
  itemIndex,
}: {
  study: CaseStudyItem
  title: string
  category: string
  itemIndex: number
}) {
  const inner = (
    <div
      data-cms-field="item"
      data-cms-item-index={itemIndex}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
    >
      <Image quality={95}
        src={study.image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white/70 text-sm mb-1">{category}</p>
        <h3 className="text-white text-lg font-bold group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
      </div>
      <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <ArrowRight className="w-5 h-5 text-primary" />
      </div>
    </div>
  )

  if (!study.href) return <div className="group block">{inner}</div>
  const isExternal = /^https?:\/\//.test(study.href)
  if (isExternal)
    return (
      <a href={study.href} target="_blank" rel="noopener noreferrer" className="group block">
        {inner}
      </a>
    )
  return (
    <Link href={study.href} className="group block">
      {inner}
    </Link>
  )
}
