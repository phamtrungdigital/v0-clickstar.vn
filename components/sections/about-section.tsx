'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, X, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function AboutSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-28 bg-background">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[40%_60%] gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                {t('Về chúng tôi', 'About Us')}
              </span>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 text-balance">
                {t('Đưa doanh nghiệp của bạn lên', 'Take your business to')}{' '}
                <span className="text-primary">{t('tầm cao mới', 'new heights')}</span>
              </h2>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t(
                  'Với hơn 10 năm kinh nghiệm trong lĩnh vực chuyển đổi số, chúng tôi đã giúp hàng trăm doanh nghiệp Việt Nam tối ưu quy trình và tăng trưởng doanh thu một cách bền vững thông qua công nghệ.',
                  'With over 10 years of experience in digital transformation, we have helped hundreds of Vietnamese businesses optimize processes and achieve sustainable revenue growth through technology.'
                )}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">10+</div>
                  <div className="text-sm text-muted-foreground">{t('Năm kinh nghiệm', 'Years of Experience')}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">{t('Dự án hoàn thành', 'Projects Completed')}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">{t('Khách hàng hài lòng', 'Satisfied Clients')}</div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="#about"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 group"
              >
                {t('Tìm hiểu thêm về chúng tôi', 'Learn more about us')}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right Video Thumbnail */}
            <div className="order-1 lg:order-2">
              <div 
                className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setIsVideoOpen(true)}
              >
                {/* Thumbnail Image */}
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop"
                  alt="Video giới thiệu đội ngũ ClickStar"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-300" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulse rings */}
                    <span className="absolute inset-0 w-20 h-20 bg-primary/30 rounded-full animate-ping" />
                    <span className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    
                    {/* Play button */}
                    <button
                      className="relative w-20 h-20 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
                      aria-label="Play video"
                    >
                      <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
                    </button>
                  </div>
                </div>

                {/* Video duration badge */}
                <div className="absolute bottom-4 right-4 bg-foreground/80 text-background text-sm font-medium px-3 py-1 rounded-lg">
                  2:45
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsVideoOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors duration-200 z-10"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>

            {/* YouTube Embed */}
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="About ClickStar Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  )
}
