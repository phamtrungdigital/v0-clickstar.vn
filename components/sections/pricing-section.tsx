'use client'

import { Check, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useLanguage, type Language } from '@/contexts/language-context'

interface PricingPlan {
  name: string
  nameEn: string
  description: string
  price: string
  popular: boolean
  features: string[]
  cta: string
  href: string
}

const pricingPlansData: Record<Language, PricingPlan[]> = {
  vi: [
  {
    name: 'Cơ bản',
    nameEn: 'Basic',
    description: 'Phù hợp cho doanh nghiệp nhỏ hoặc startup mới bắt đầu chuyển đổi số',
    price: 'Liên hệ',
    popular: false,
    features: [
      'Thiết kế website chuẩn SEO',
      'Tối ưu tốc độ tải trang',
      'Responsive trên mọi thiết bị',
      'SSL Certificate miễn phí',
      'Hỗ trợ kỹ thuật 8/5',
      'Training sử dụng cơ bản',
      'Bảo trì 3 tháng miễn phí',
    ],
    cta: 'Liên hệ tư vấn',
    href: '/contact',
  },
  {
    name: 'Nâng cao',
    nameEn: 'Professional',
    description: 'Dành cho doanh nghiệp vừa cần giải pháp toàn diện hơn',
    price: 'Liên hệ',
    popular: true,
    features: [
      'Tất cả tính năng gói Cơ bản',
      'Dashboard phân tích dữ liệu',
      'Tích hợp CRM cơ bản',
      'Chiến dịch Digital Marketing',
      'SEO & Google Ads setup',
      'Chatbot AI cơ bản',
      'Hỗ trợ kỹ thuật 24/7',
      'Training chuyên sâu',
      'Bảo trì 6 tháng miễn phí',
    ],
    cta: 'Liên hệ tư vấn',
    href: '/contact',
  },
  {
    name: 'Cao cấp',
    nameEn: 'Enterprise',
    description: 'Giải pháp toàn diện cho doanh nghiệp lớn với yêu cầu phức tạp',
    price: 'Liên hệ',
    popular: false,
    features: [
      'Tất cả tính năng gói Nâng cao',
      'Hệ thống CDP đầy đủ',
      'AI Automation workflows',
      'Tích hợp đa nền tảng',
      'Dashboard real-time nâng cao',
      'Machine Learning models',
      'API tùy chỉnh',
      'Account Manager riêng',
      'SLA cam kết uptime 99.9%',
      'Hỗ trợ on-site khi cần',
      'Bảo trì 12 tháng miễn phí',
    ],
    cta: 'Liên hệ tư vấn',
    href: '/contact',
  },
  ],
  en: [
    {
      name: 'Basic',
      nameEn: 'Basic',
      description: 'Suitable for small businesses or startups just beginning digital transformation',
      price: 'Contact',
      popular: false,
      features: [
        'SEO-optimized website design',
        'Page load speed optimization',
        'Responsive on all devices',
        'Free SSL Certificate',
        'Technical support 8/5',
        'Basic usage training',
        '3 months free maintenance',
      ],
      cta: 'Contact us',
      href: '/contact',
    },
    {
      name: 'Professional',
      nameEn: 'Professional',
      description: 'For medium businesses needing more comprehensive solutions',
      price: 'Contact',
      popular: true,
      features: [
        'All Basic plan features',
        'Data analytics dashboard',
        'Basic CRM integration',
        'Digital Marketing campaigns',
        'SEO & Google Ads setup',
        'Basic AI Chatbot',
        '24/7 technical support',
        'Advanced training',
        '6 months free maintenance',
      ],
      cta: 'Contact us',
      href: '/contact',
    },
    {
      name: 'Enterprise',
      nameEn: 'Enterprise',
      description: 'Comprehensive solution for large enterprises with complex requirements',
      price: 'Contact',
      popular: false,
      features: [
        'All Professional plan features',
        'Full CDP system',
        'AI Automation workflows',
        'Multi-platform integration',
        'Advanced real-time dashboard',
        'Machine Learning models',
        'Custom API',
        'Dedicated Account Manager',
        'SLA 99.9% uptime commitment',
        'On-site support when needed',
        '12 months free maintenance',
      ],
      cta: 'Contact us',
      href: '/contact',
    },
  ]
}

export function PricingSection() {
  const { language, t } = useLanguage()
  const pricingPlans = pricingPlansData[language]
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border transition-all duration-300 hover:shadow-xl",
                plan.popular
                  ? "border-primary bg-primary/[0.02] shadow-lg shadow-primary/10 scale-[1.02] lg:scale-105"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {t('Phổ biến nhất', 'Most Popular')}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <span className="text-sm text-muted-foreground">({plan.nameEn})</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 pb-8 border-b border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('Báo giá theo yêu cầu cụ thể', 'Quote based on specific requirements')}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-foreground mb-4">{t('Bao gồm:', 'Includes:')}</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <span className={cn(
                          "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                          plan.popular ? "bg-primary/20" : "bg-primary/10"
                        )}>
                          <Check className={cn(
                            "w-3 h-3",
                            plan.popular ? "text-primary" : "text-primary"
                          )} />
                        </span>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.href}
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-full transition-all duration-300 group",
                    plan.popular
                      ? "bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                      : "bg-foreground hover:bg-foreground/90 text-background"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            {t(
              'Tất cả các gói đều có thể tùy chỉnh theo nhu cầu cụ thể của doanh nghiệp. Liên hệ để được tư vấn và nhận báo giá chi tiết phù hợp với quy mô và mục tiêu của bạn.',
              'All plans can be customized to your specific business needs. Contact us for consultation and detailed pricing that fits your scale and goals.'
            )}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-12 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Doanh nghiệp tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Khách hàng hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Hỗ trợ kỹ thuật</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-primary mb-1">10+</div>
              <div className="text-sm text-muted-foreground">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
