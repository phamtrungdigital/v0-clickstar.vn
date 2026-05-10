'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { useLanguage, type Language } from '@/contexts/language-context'

import 'swiper/css'
import 'swiper/css/free-mode'

interface Testimonial {
  id: number
  rating: number
  quote: string
  name: string
  avatar: string
  source: string
}

const testimonialsData: Record<Language, Testimonial[]> = {
  vi: [
    { id: 1, rating: 5, quote: "ClickStar đã giúp chúng tôi xây dựng hệ thống dashboard hoàn chỉnh, giờ đây việc theo dõi KPI trở nên dễ dàng hơn bao giờ hết!", name: "Nguyễn Thành Long", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", source: "CEO, ABC Company" },
    { id: 2, rating: 5, quote: "Đội ngũ chuyên nghiệp, tận tâm. Hệ thống CRM họ xây dựng đã giúp chúng tôi tăng 40% tỷ lệ chuyển đổi khách hàng.", name: "Trần Minh Tuấn", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", source: "Marketing Director, XYZ Corp" },
    { id: 3, rating: 5, quote: "Website mới đẹp, load nhanh và tối ưu SEO xuất sắc. Lượng khách hàng online tăng 200% sau 3 tháng.", name: "Lê Thị Hồng", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", source: "Founder, Shop ABC" },
    { id: 4, rating: 5, quote: "Giải pháp AI chatbot của ClickStar đã giảm 60% tải công việc cho đội ngũ CSKH, đồng thời tăng satisfaction rate.", name: "Phạm Văn Đức", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", source: "COO, Tech Solutions" },
    { id: 5, rating: 5, quote: "Chiến dịch Digital Marketing của ClickStar mang lại ROI 500%. Đây là đối tác đáng tin cậy nhất chúng tôi từng làm việc.", name: "Hoàng Thị Mai", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", source: "CMO, Beauty Brand" },
    { id: 6, rating: 5, quote: "Từ lúc triển khai CDP, chúng tôi hiểu khách hàng sâu sắc hơn và personalize được trải nghiệm cho từng segment.", name: "Vũ Minh Khoa", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", source: "Data Manager, Retail Chain" },
    { id: 7, rating: 5, quote: "Hệ thống automation của ClickStar đã giúp tiết kiệm 30 giờ làm việc mỗi tuần cho team marketing.", name: "Đặng Thị Lan Anh", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", source: "Head of Digital, Media Corp" },
    { id: 8, rating: 5, quote: "Dashboard real-time giúp chúng tôi phản ứng nhanh với thị trường. Quyết định kinh doanh giờ dựa trên data, không còn cảm tính.", name: "Bùi Quang Huy", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", source: "CEO, Startup Vietnam" }
  ],
  en: [
    { id: 1, rating: 5, quote: "ClickStar helped us build a complete dashboard system, now tracking KPIs is easier than ever!", name: "Nguyen Thanh Long", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", source: "CEO, ABC Company" },
    { id: 2, rating: 5, quote: "Professional and dedicated team. The CRM system they built helped us increase customer conversion rate by 40%.", name: "Tran Minh Tuan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", source: "Marketing Director, XYZ Corp" },
    { id: 3, rating: 5, quote: "Beautiful new website, fast loading and excellent SEO optimization. Online customers increased 200% after 3 months.", name: "Le Thi Hong", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", source: "Founder, Shop ABC" },
    { id: 4, rating: 5, quote: "ClickStar's AI chatbot solution reduced 60% of workload for our customer service team while increasing satisfaction rate.", name: "Pham Van Duc", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", source: "COO, Tech Solutions" },
    { id: 5, rating: 5, quote: "ClickStar's Digital Marketing campaign delivered 500% ROI. This is the most reliable partner we've ever worked with.", name: "Hoang Thi Mai", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", source: "CMO, Beauty Brand" },
    { id: 6, rating: 5, quote: "Since implementing CDP, we understand customers deeper and can personalize experiences for each segment.", name: "Vu Minh Khoa", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", source: "Data Manager, Retail Chain" },
    { id: 7, rating: 5, quote: "ClickStar's automation system saved 30 hours of work per week for the marketing team.", name: "Dang Thi Lan Anh", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", source: "Head of Digital, Media Corp" },
    { id: 8, rating: 5, quote: "Real-time dashboard helps us react quickly to market. Business decisions are now based on data, no more guessing.", name: "Bui Quang Huy", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", source: "CEO, Startup Vietnam" }
  ]
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-border/50 relative h-full">
      {/* Quote icon */}
      <div className="absolute top-6 right-6 text-primary/10">
        <Quote className="w-12 h-12 fill-current" />
      </div>
      
      {/* Rating stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
          />
        ))}
      </div>
      
      {/* Quote text */}
      <p className="text-foreground leading-relaxed mb-6 text-[15px] relative z-10">
        &quot;{testimonial.quote}&quot;
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.source}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null)
  const { language, t } = useLanguage()
  const testimonials = testimonialsData[language]

  const handleMouseEnter = () => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop()
    }
  }

  const handleMouseLeave = () => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start()
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-[#EEF3FF] overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
        <div className="text-center max-w-2xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t('Khách hàng nói gì về chúng tôi', 'What our clients say')}
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance">
            {t('Đánh giá từ', 'Reviews from')} <span className="text-primary">{t('khách hàng', 'our clients')}</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-muted-foreground text-lg">
            {t('Hãy nghe những chia sẻ thực tế từ các doanh nghiệp đã hợp tác cùng ClickStar.', 'Hear real stories from businesses that have partnered with ClickStar.')}
          </p>
        </div>
      </div>

      {/* Testimonials Slider - Full width with peek effect */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Swiper
          modules={[Autoplay, FreeMode]}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          slidesPerView={1.2}
          spaceBetween={20}
          centeredSlides={false}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          freeMode={{
            enabled: true,
            momentum: false,
          }}
          breakpoints={{
            480: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2.8,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 4.2,
              spaceBetween: 28,
            },
            1536: {
              slidesPerView: 5,
              spaceBetween: 32,
            },
          }}
          className="!px-4 sm:!px-6 lg:!px-8"
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <SwiperSlide key={`${testimonial.id}-${index}`} className="!h-auto">
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gradient overlays for peek effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[#EEF3FF] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[#EEF3FF] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  )
}
