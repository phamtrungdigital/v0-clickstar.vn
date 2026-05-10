'use client'

import { Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative bg-background-soft overflow-hidden">
      {/* Bottom curved edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-24">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 96V0C240 64 480 96 720 96C960 96 1200 64 1440 0V96H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 xl:py-28">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-xs sm:text-sm uppercase tracking-wide px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t('Giải pháp chuyển đổi số toàn diện', 'Comprehensive Digital Transformation Solutions')}
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-foreground leading-[1.1] tracking-tight text-balance">
              {t('Đồng hành cùng ', 'Partnering with ')}
              <span className="text-primary">500+</span>
              {t(' doanh nghiệp ', ' businesses for ')}
              <span className="text-primary">{t('chuyển đổi số', 'digital transformation')}</span>
              {t(' thành công', ' success')}
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
              {t(
                'Chúng tôi cung cấp giải pháp Digital Marketing, thiết kế Website, Dashboard dữ liệu và tích hợp AI giúp doanh nghiệp tối ưu vận hành và tăng trưởng bền vững.',
                'We provide Digital Marketing, Website Design, Data Dashboard and AI Integration solutions to help businesses optimize operations and achieve sustainable growth.'
              )}
            </p>

            {/* CTA Group */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Primary CTA */}
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                {t('Nhận tư vấn miễn phí', 'Get Free Consultation')}
              </a>

              {/* Phone Contact */}
              <a
                href="tel:+84123456789"
                className="group flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                  <Phone className="w-5 h-5 text-primary" />
                </span>
                <span className="text-sm sm:text-base">
                  <span className="block text-muted-foreground text-xs sm:text-sm">{t('Bạn cần hỗ trợ?', 'Need help?')}</span>
                  <span className="font-semibold">+84 123 456 789</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              
              {/* ClickStar Data Flow SVG */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/clickstar-data-flow.svg"
                alt="Kiến trúc luồng dữ liệu ClickStar - MySQL và PostgreSQL hợp nhất qua ETL Pipeline vào Neon Postgres, phục vụ Dashboard và AI Analysis"
                className="w-full h-auto relative z-10 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
