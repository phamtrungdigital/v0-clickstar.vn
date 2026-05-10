'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const partners = [
  { name: 'Codecanyon', logo: '/images/partners/codecanyon.svg' },
  { name: 'Envato', logo: '/images/partners/envato.svg' },
  { name: 'Microsoft', logo: '/images/partners/microsoft.svg' },
  { name: 'Google', logo: '/images/partners/google.svg' },
  { name: 'Amazon', logo: '/images/partners/amazon.svg' },
]

export function CTASection() {
  const { t } = useLanguage()

  return (
    <section className="py-20 lg:py-28 bg-[#EEF3FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            {t('Hợp tác cùng chuyên gia công nghệ', 'Partner with technology experts')}
          </span>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-8 text-balance">
            {t('Bạn muốn bắt đầu ngay?', 'Ready to get started?')}{' '}
            <span className="text-primary">{t('Liên hệ chúng tôi', 'Contact us')}</span>
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              {t('Liên hệ ngay', 'Contact now')}
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="tel:+84123456789"
              className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <Phone className="w-5 h-5 text-primary" />
              </span>
              <span className="text-left">
                <span className="block text-sm text-muted-foreground">{t('Hotline hỗ trợ', 'Support hotline')}</span>
                <span className="block font-semibold">+84 123 456 789</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Partners */}
        <div className="border-t border-primary/10 pt-12">
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('Được tin tưởng bởi các doanh nghiệp hàng đầu', 'Trusted by leading companies')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {/* Using text logos as fallback */}
            {[
              'Meta',
              'Google',
              'TikTok',
              'Shopee',
              'Lazada',
              'Grab'
            ].map((partner) => (
              <div
                key={partner}
                className="text-xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
