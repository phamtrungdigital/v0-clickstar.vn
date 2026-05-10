'use client'

import { ServiceCard } from './service-card'
import { 
  Megaphone, 
  Globe, 
  Bot,
  Workflow,
  Database,
  LayoutDashboard,
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

const servicesData = {
  vi: [
  {
    icon: <Megaphone className="w-6 h-6 text-blue-600" />,
    title: 'Digital Marketing',
    description: 'Chiến lược marketing đa kênh hiệu quả: SEO, Google Ads, Facebook Ads, Content Marketing giúp tăng trưởng doanh thu.',
    tag: 'Marketing',
    iconBgColor: 'bg-blue-50',
    tagColor: 'bg-blue-50 text-blue-600'
  },
  {
    icon: <Globe className="w-6 h-6 text-purple-600" />,
    title: 'Thiết kế Website',
    description: 'Website chuyên nghiệp, tối ưu SEO, tốc độ nhanh và trải nghiệm người dùng xuất sắc trên mọi thiết bị.',
    tag: 'Website',
    iconBgColor: 'bg-purple-50',
    tagColor: 'bg-purple-50 text-purple-600'
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 text-pink-600" />,
    title: 'Dashboard dữ liệu',
    description: 'Trực quan hóa dữ liệu kinh doanh real-time, báo cáo tự động giúp ra quyết định nhanh chóng và chính xác.',
    tag: 'Data Analytics',
    iconBgColor: 'bg-pink-50',
    tagColor: 'bg-pink-50 text-pink-600'
  },
  {
    icon: <Bot className="w-6 h-6 text-amber-600" />,
    title: 'Tích hợp AI vào doanh nghiệp',
    description: 'Ứng dụng AI vào quy trình kinh doanh: chatbot, phân tích dữ liệu, dự đoán xu hướng và tự động hóa.',
    tag: 'AI Integration',
    iconBgColor: 'bg-amber-50',
    tagColor: 'bg-amber-50 text-amber-600'
  },
  {
    icon: <Workflow className="w-6 h-6 text-emerald-600" />,
    title: 'Hệ thống AI Automation',
    description: 'Xây dựng quy trình tự động hóa thông minh với AI, giảm chi phí vận hành và tăng hiệu suất làm việc.',
    tag: 'Automation',
    iconBgColor: 'bg-emerald-50',
    tagColor: 'bg-emerald-50 text-emerald-600'
  },
  {
    icon: <Database className="w-6 h-6 text-cyan-600" />,
    title: 'Xây dựng CRM & CDP',
    description: 'Hệ thống quản lý khách hàng và nền tảng dữ liệu khách hàng giúp cá nhân hóa trải nghiệm và tăng retention.',
    tag: 'CRM/CDP',
    iconBgColor: 'bg-cyan-50',
    tagColor: 'bg-cyan-50 text-cyan-600'
  }
  ],
  en: [
    {
      icon: <Megaphone className="w-6 h-6 text-blue-600" />,
      title: 'Digital Marketing',
      description: 'Effective multi-channel marketing strategy: SEO, Google Ads, Facebook Ads, Content Marketing to boost revenue growth.',
      tag: 'Marketing',
      iconBgColor: 'bg-blue-50',
      tagColor: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      title: 'Website Design',
      description: 'Professional websites optimized for SEO, fast loading speed and excellent user experience across all devices.',
      tag: 'Website',
      iconBgColor: 'bg-purple-50',
      tagColor: 'bg-purple-50 text-purple-600'
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-pink-600" />,
      title: 'Data Dashboard',
      description: 'Real-time business data visualization, automated reporting for quick and accurate decision making.',
      tag: 'Data Analytics',
      iconBgColor: 'bg-pink-50',
      tagColor: 'bg-pink-50 text-pink-600'
    },
    {
      icon: <Bot className="w-6 h-6 text-amber-600" />,
      title: 'AI Integration',
      description: 'Apply AI to business processes: chatbot, data analysis, trend prediction and automation.',
      tag: 'AI Integration',
      iconBgColor: 'bg-amber-50',
      tagColor: 'bg-amber-50 text-amber-600'
    },
    {
      icon: <Workflow className="w-6 h-6 text-emerald-600" />,
      title: 'AI Automation System',
      description: 'Build intelligent automation workflows with AI, reduce operational costs and increase work efficiency.',
      tag: 'Automation',
      iconBgColor: 'bg-emerald-50',
      tagColor: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: <Database className="w-6 h-6 text-cyan-600" />,
      title: 'CRM & CDP Development',
      description: 'Customer management systems and customer data platforms to personalize experiences and increase retention.',
      tag: 'CRM/CDP',
      iconBgColor: 'bg-cyan-50',
      tagColor: 'bg-cyan-50 text-cyan-600'
    }
  ]
}

export function ServicesSection() {
  const { language, t } = useLanguage()
  const services = servicesData[language]
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Tag */}
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t('DỊCH VỤ CỦA CHÚNG TÔI', 'OUR SERVICES')}
          </span>
          
          {/* H2 */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 text-balance">
            {t('Tại sao nên', 'Why')}{' '}
            <span className="text-primary">{t('chọn ClickStar?', 'choose ClickStar?')}</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t(
              'Chúng tôi cung cấp giải pháp chuyển đổi số toàn diện, từ Digital Marketing đến xây dựng hệ thống AI tự động hóa cho hơn 500+ doanh nghiệp.',
              'We provide comprehensive digital transformation solutions, from Digital Marketing to AI automation systems for over 500+ businesses.'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              tag={service.tag}
              iconBgColor={service.iconBgColor}
              tagColor={service.tagColor}
            />
          ))}
        </div>

        {/* Bottom CTA Link */}
        <div className="text-center mt-14">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="text-base">
              {t('Xem tất cả dịch vụ hoặc', 'View all services or')}{' '}
              <span className="text-primary font-semibold underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary">
                {t('liên hệ tư vấn ngay', 'contact us for consultation')}
              </span>
            </span>
            <svg 
              className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Data Pipeline Architecture Diagram */}
        <div className="mt-16 lg:mt-24 pt-16 lg:pt-24 border-t border-border/50">
          {/* Pipeline Header */}
          <div className="text-center mb-10">
            {/* Tag */}
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              {t('KIẾN TRÚC DỮ LIỆU THỜI GIAN THỰC', 'REAL-TIME DATA ARCHITECTURE')}
            </span>
            
            {/* Heading */}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
              {t('Kiến trúc Data Pipeline của ClickStar', 'ClickStar Data Pipeline Architecture')}
            </h3>
            
            {/* Subtitle */}
            <p className="text-muted-foreground text-lg">
              {t('Ad Platforms → Data Sources → FLATDAT → Claude AI → Insights, với vòng phản hồi tự động', 'Ad Platforms → Data Sources → FLATDAT → Claude AI → Insights, with automatic feedback loop')}
            </p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/clickstar-pipeline.svg"
            alt="ClickStar Data Pipeline Architecture - Ad Platforms to Data Sources through FLATDAT and Claude AI Analysis to Insights and Visualization"
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>
    </section>
  )
}
