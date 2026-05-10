'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage, type Language } from '@/contexts/language-context'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const caseStudiesData: Record<Language, { id: number; title: string; image: string; tags: string[]; category: string }[]> = {
  vi: [
    { id: 1, title: 'Dashboard phân tích dữ liệu Marketing', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', tags: ['Dashboard', 'Analytics'], category: 'Data Analytics' },
    { id: 2, title: 'Website thương mại điện tử', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', tags: ['E-commerce', 'Website'], category: 'Thiết kế Website' },
    { id: 3, title: 'Hệ thống CRM tích hợp AI', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop', tags: ['CRM', 'AI'], category: 'AI Integration' },
    { id: 4, title: 'Chiến dịch Digital Marketing', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop', tags: ['Marketing', 'Ads'], category: 'Digital Marketing' },
    { id: 5, title: 'Chatbot AI cho doanh nghiệp', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop', tags: ['AI', 'Chatbot'], category: 'AI Automation' },
    { id: 6, title: 'Nền tảng CDP khách hàng', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', tags: ['CDP', 'Data'], category: 'CRM/CDP' }
  ],
  en: [
    { id: 1, title: 'Marketing Data Analytics Dashboard', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', tags: ['Dashboard', 'Analytics'], category: 'Data Analytics' },
    { id: 2, title: 'E-commerce Website', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', tags: ['E-commerce', 'Website'], category: 'Website Design' },
    { id: 3, title: 'AI-Integrated CRM System', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop', tags: ['CRM', 'AI'], category: 'AI Integration' },
    { id: 4, title: 'Digital Marketing Campaign', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop', tags: ['Marketing', 'Ads'], category: 'Digital Marketing' },
    { id: 5, title: 'Enterprise AI Chatbot', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop', tags: ['AI', 'Chatbot'], category: 'AI Automation' },
    { id: 6, title: 'Customer Data Platform', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', tags: ['CDP', 'Data'], category: 'CRM/CDP' }
  ]
}

const caseStudies = [
  {
    id: 1,
    title: 'Dashboard phân tích dữ liệu Marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    tags: ['Dashboard', 'Analytics'],
    category: 'Data Analytics'
  },
  {
    id: 2,
    title: 'Website thương mại điện tử',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    tags: ['E-commerce', 'Website'],
    category: 'Thiết kế Website'
  },
  {
    id: 3,
    title: 'Hệ thống CRM tích hợp AI',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
    tags: ['CRM', 'AI'],
    category: 'AI Integration'
  },
  {
    id: 4,
    title: 'Chiến dịch Digital Marketing',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
    tags: ['Marketing', 'Ads'],
    category: 'Digital Marketing'
  },
  {
    id: 5,
    title: 'Chatbot AI cho doanh nghiệp',
    image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop',
    tags: ['AI', 'Chatbot'],
    category: 'AI Automation'
  },
  {
    id: 6,
    title: 'Nền tảng CDP khách hàng',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    tags: ['CDP', 'Data'],
    category: 'CRM/CDP'
  }
]

export function CaseStudiesSection() {
  const swiperRef = useRef<SwiperType | null>(null)
  const { language, t } = useLanguage()
  const studies = caseStudiesData[language]

  return (
    <section className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              {t('Dự án tiêu biểu', 'Featured Projects')}
            </div>
            
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight text-balance">
              {t('Những dự án', 'Projects')}{' '}
              <span className="text-primary">{t('đã triển khai', 'we delivered')}</span>
            </h2>
          </div>

          {/* View All + Navigation */}
          <div className="flex items-center gap-4">
            <Link 
              href="/portfolio"
              className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200"
            >
              {t('Xem tất cả', 'View all')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            {/* Custom Navigation Arrows */}
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

        {/* Swiper Carousel */}
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
            bulletClass: 'inline-block w-2 h-2 rounded-full bg-border cursor-pointer transition-all duration-200',
            bulletActiveClass: '!bg-primary !w-6'
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          breakpoints={{
            640: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }}
          className="!overflow-visible"
        >
          {studies.map((study) => (
            <SwiperSlide key={study.id}>
              <CaseStudyCard {...study} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="case-studies-pagination flex items-center justify-center gap-2 mt-10" />

        {/* Mobile View All */}
        <div className="sm:hidden mt-8 text-center">
          <Link 
            href="/portfolio"
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            {t('Xem tất cả', 'View all')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

interface CaseStudyCardProps {
  title: string
  image: string
  tags: string[]
  category: string
}

function CaseStudyCard({ title, image, tags, category }: CaseStudyCardProps) {
  return (
    <Link href="#" className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
        {/* Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Tags on image */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white/70 text-sm mb-1">{category}</p>
          <h3 className="text-white text-lg font-bold group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Hover arrow indicator */}
        <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Link>
  )
}
