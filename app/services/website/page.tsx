'use client'

import { MainNav } from '@/components/layout/main-nav'
import { ServiceAnswer, ServiceReadMore } from '@/components/seo/service-answer'
import { Footer } from '@/components/layout/footer'
import { useLanguage } from '@/contexts/language-context'
import { useServiceCta } from '@/contexts/web-content-context'
import { DEFAULT_SERVICE_CTAS } from '@/lib/cms/web-content-shared'
import Link from '@/components/app-link'
import Image from 'next/image'
import { 
  ArrowRight, 
  Zap, 
  Palette,
  Code2,
  Search,
  BarChart3,
  Target,
  CheckCircle2,
  XCircle,
  Globe,
  Smartphone,
  Gauge,
  Shield,
  Figma,
  PenTool,
  Layers,
  MousePointer2,
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  Building2,
  Briefcase,
  Heart,
  GraduationCap,
  Utensils,
  ArrowUpRight,
  Play,
  Star,
  Clock,
  Monitor,
  Settings,
  Sparkles
} from 'lucide-react'
import { WebsiteBrowserIllustration } from '@/components/illustrations/service-illustrations'

export default function WebsiteDesignPage() {
  const { language, t } = useLanguage()
  const cta = useServiceCta('website') ?? DEFAULT_SERVICE_CTAS.website

  const problems = language === 'vi' ? [
    { 
      icon: <Gauge className="w-5 h-5" />,
      problem: 'Website cũ, load chậm, không tối ưu mobile',
      solution: 'Thiết kế responsive, tối ưu Core Web Vitals, đạt 90+ điểm PageSpeed'
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />,
      problem: 'Tỷ lệ chuyển đổi thấp, khách truy cập không để lại thông tin',
      solution: 'UX/UI tối ưu conversion, CTA rõ ràng, form thông minh giảm friction'
    },
    { 
      icon: <Palette className="w-5 h-5" />,
      problem: 'Giao diện lỗi thời, không thể hiện được giá trị thương hiệu',
      solution: 'Design hiện đại theo brand guidelines, tạo ấn tượng chuyên nghiệp'
    },
    { 
      icon: <Search className="w-5 h-5" />,
      problem: 'Không xuất hiện trên Google, khó tìm thấy trên internet',
      solution: 'SEO Technical chuẩn, cấu trúc semantic, schema markup đầy đủ'
    },
  ] : [
    { 
      icon: <Gauge className="w-5 h-5" />,
      problem: 'Old website, slow loading, not mobile optimized',
      solution: 'Responsive design, Core Web Vitals optimized, 90+ PageSpeed score'
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />,
      problem: 'Low conversion rate, visitors don\'t leave information',
      solution: 'UX/UI optimized for conversion, clear CTAs, smart forms reduce friction'
    },
    { 
      icon: <Palette className="w-5 h-5" />,
      problem: 'Outdated interface, doesn\'t reflect brand value',
      solution: 'Modern design following brand guidelines, professional impression'
    },
    { 
      icon: <Search className="w-5 h-5" />,
      problem: 'Not appearing on Google, hard to find online',
      solution: 'SEO Technical standard, semantic structure, complete schema markup'
    },
  ]

  const processSteps = language === 'vi' ? [
    {
      step: '01',
      title: 'Khám phá & Phân tích',
      description: 'Tìm hiểu mục tiêu kinh doanh, đối thủ cạnh tranh, hành vi người dùng và xác định yêu cầu dự án.',
      icon: <Search className="w-6 h-6" />,
      duration: '3-5 ngày',
      deliverables: ['Báo cáo phân tích', 'Sitemap', 'User personas']
    },
    {
      step: '02',
      title: 'Thiết kế UI/UX',
      description: 'Xây dựng wireframe, thiết kế giao diện trên Figma với đầy đủ responsive và các trạng thái tương tác.',
      icon: <Figma className="w-6 h-6" />,
      duration: '7-10 ngày',
      deliverables: ['Wireframes', 'UI Design', 'Prototype tương tác']
    },
    {
      step: '03',
      title: 'Nhận diện thương hiệu',
      description: 'Hoàn thiện bộ nhận diện: logo, màu sắc, typography, iconography phù hợp với thương hiệu.',
      icon: <PenTool className="w-6 h-6" />,
      duration: '5-7 ngày',
      deliverables: ['Brand guidelines', 'Design system', 'Asset library']
    },
    {
      step: '04',
      title: 'Phát triển Code',
      description: 'Chuyển đổi thiết kế thành code với công nghệ hiện đại, đảm bảo performance và maintainability.',
      icon: <Code2 className="w-6 h-6" />,
      duration: '14-21 ngày',
      deliverables: ['Website hoàn chỉnh', 'CMS tích hợp', 'Admin panel']
    },
    {
      step: '05',
      title: 'SEO & Đo lường',
      description: 'Tối ưu SEO on-page, cài đặt Google Analytics, Search Console, conversion tracking.',
      icon: <BarChart3 className="w-6 h-6" />,
      duration: '3-5 ngày',
      deliverables: ['SEO audit report', 'Analytics setup', 'Tracking dashboard']
    },
    {
      step: '06',
      title: 'Launch & Hỗ trợ',
      description: 'Go-live, training sử dụng CMS, bảo trì và hỗ trợ kỹ thuật sau bàn giao.',
      icon: <Zap className="w-6 h-6" />,
      duration: 'Ongoing',
      deliverables: ['Training docs', 'Support SLA', 'Maintenance']
    },
  ] : [
    {
      step: '01',
      title: 'Discovery & Analysis',
      description: 'Understand business goals, competitors, user behavior and define project requirements.',
      icon: <Search className="w-6 h-6" />,
      duration: '3-5 days',
      deliverables: ['Analysis report', 'Sitemap', 'User personas']
    },
    {
      step: '02',
      title: 'UI/UX Design',
      description: 'Build wireframes, design interface in Figma with full responsive and interaction states.',
      icon: <Figma className="w-6 h-6" />,
      duration: '7-10 days',
      deliverables: ['Wireframes', 'UI Design', 'Interactive prototype']
    },
    {
      step: '03',
      title: 'Brand Identity',
      description: 'Complete brand identity: logo, colors, typography, iconography matching the brand.',
      icon: <PenTool className="w-6 h-6" />,
      duration: '5-7 days',
      deliverables: ['Brand guidelines', 'Design system', 'Asset library']
    },
    {
      step: '04',
      title: 'Development',
      description: 'Convert design to code with modern technology, ensuring performance and maintainability.',
      icon: <Code2 className="w-6 h-6" />,
      duration: '14-21 days',
      deliverables: ['Complete website', 'CMS integration', 'Admin panel']
    },
    {
      step: '05',
      title: 'SEO & Tracking',
      description: 'On-page SEO optimization, setup Google Analytics, Search Console, conversion tracking.',
      icon: <BarChart3 className="w-6 h-6" />,
      duration: '3-5 days',
      deliverables: ['SEO audit report', 'Analytics setup', 'Tracking dashboard']
    },
    {
      step: '06',
      title: 'Launch & Support',
      description: 'Go-live, CMS training, maintenance and technical support after handover.',
      icon: <Zap className="w-6 h-6" />,
      duration: 'Ongoing',
      deliverables: ['Training docs', 'Support SLA', 'Maintenance']
    },
  ]

  const websiteTypes = language === 'vi' ? [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Website Doanh nghiệp',
      description: 'Thể hiện chuyên nghiệp, xây dựng uy tín thương hiệu',
      features: ['Giới thiệu công ty', 'Dịch vụ/Sản phẩm', 'Blog/Tin tức', 'Liên hệ'],
      color: 'blue'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Website Thương mại',
      description: 'Bán hàng online, tối ưu chuyển đổi và doanh thu',
      features: ['Catalog sản phẩm', 'Giỏ hàng & Thanh toán', 'Quản lý đơn hàng', 'Tích hợp CRM'],
      color: 'emerald'
    },
    {
      icon: <MousePointer2 className="w-8 h-8" />,
      title: 'Landing Page',
      description: 'Tập trung chuyển đổi, thu lead hiệu quả',
      features: ['Hero section mạnh', 'Social proof', 'CTA tối ưu', 'A/B testing ready'],
      color: 'purple'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Website Portfolio',
      description: 'Showcase dự án, thu hút khách hàng tiềm năng',
      features: ['Gallery dự án', 'Case studies', 'Testimonials', 'Contact form'],
      color: 'amber'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Website Giáo dục',
      description: 'LMS, khóa học online, quản lý học viên',
      features: ['Quản lý khóa học', 'Video lessons', 'Quiz & Certificates', 'Student portal'],
      color: 'rose'
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Website F&B',
      description: 'Nhà hàng, cafe với menu online và đặt bàn',
      features: ['Menu digital', 'Đặt bàn online', 'Delivery integration', 'Loyalty program'],
      color: 'orange'
    },
  ] : [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Corporate Website',
      description: 'Professional appearance, build brand credibility',
      features: ['Company intro', 'Services/Products', 'Blog/News', 'Contact'],
      color: 'blue'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'E-commerce',
      description: 'Online sales, optimized conversion and revenue',
      features: ['Product catalog', 'Cart & Checkout', 'Order management', 'CRM integration'],
      color: 'emerald'
    },
    {
      icon: <MousePointer2 className="w-8 h-8" />,
      title: 'Landing Page',
      description: 'Conversion focused, effective lead generation',
      features: ['Strong hero', 'Social proof', 'Optimized CTA', 'A/B testing ready'],
      color: 'purple'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Portfolio Website',
      description: 'Project showcase, attract potential clients',
      features: ['Project gallery', 'Case studies', 'Testimonials', 'Contact form'],
      color: 'amber'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Education Website',
      description: 'LMS, online courses, student management',
      features: ['Course management', 'Video lessons', 'Quiz & Certificates', 'Student portal'],
      color: 'rose'
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'F&B Website',
      description: 'Restaurant, cafe with online menu and booking',
      features: ['Digital menu', 'Table booking', 'Delivery integration', 'Loyalty program'],
      color: 'orange'
    },
  ]

  const addOnServices = language === 'vi' ? [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'SEO On-page',
      description: 'Tối ưu cấu trúc, meta tags, schema markup, internal linking, sitemap',
      features: ['Technical SEO audit', 'Keyword optimization', 'Content structure', 'Speed optimization']
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Google Ads Ready',
      description: 'Chuẩn bị landing page, conversion tracking, remarketing pixel',
      features: ['Landing page optimization', 'Conversion setup', 'Pixel integration', 'A/B testing']
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics & Tracking',
      description: 'GA4, GTM, Search Console, Hotjar, custom events',
      features: ['GA4 setup', 'Event tracking', 'Funnel analysis', 'Heatmaps']
    },
  ] : [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'On-page SEO',
      description: 'Structure optimization, meta tags, schema markup, internal linking, sitemap',
      features: ['Technical SEO audit', 'Keyword optimization', 'Content structure', 'Speed optimization']
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Google Ads Ready',
      description: 'Landing page preparation, conversion tracking, remarketing pixel',
      features: ['Landing page optimization', 'Conversion setup', 'Pixel integration', 'A/B testing']
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics & Tracking',
      description: 'GA4, GTM, Search Console, Hotjar, custom events',
      features: ['GA4 setup', 'Event tracking', 'Funnel analysis', 'Heatmaps']
    },
  ]

  const portfolioItems = [
    {
      title: 'TechVision Corp',
      category: language === 'vi' ? 'Website Doanh nghiệp' : 'Corporate Website',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=1000&fit=crop',
      metrics: { conversion: '+180%', speed: '95/100', bounce: '-45%' }
    },
    {
      title: 'Fashion Store',
      category: language === 'vi' ? 'E-commerce' : 'E-commerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=1000&fit=crop',
      metrics: { conversion: '+250%', speed: '92/100', bounce: '-38%' }
    },
    {
      title: 'EduLearn Platform',
      category: language === 'vi' ? 'Website Giáo dục' : 'Education Website',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1600&h=1000&fit=crop',
      metrics: { conversion: '+320%', speed: '90/100', bounce: '-52%' }
    },
  ]

  const colorMap: Record<string, string> = {
    blue: 'from-[#1e6dda] to-[#1e6dda]',
    emerald: 'from-[#1e6dda] to-[#1e6dda]',
    purple: 'from-[#1e6dda] to-[#1e6dda]',
    amber: 'from-[#1e6dda] to-[#1e6dda]',
    rose: 'from-[#1e6dda] to-[#1e6dda]',
    orange: 'from-[#1e6dda] to-[#1e6dda]'
  }

  const bgColorMap: Record<string, string> = {
    blue: 'bg-[#eaf2fd] group-hover:bg-[#eaf2fd]',
    emerald: 'bg-[#f5f5f7] group-hover:bg-[#f5f5f7]',
    purple: 'bg-[#f5f5f7] group-hover:bg-[#f5f5f7]',
    amber: 'bg-[#f5f5f7] group-hover:bg-[#f5f5f7]',
    rose: 'bg-[#f5f5f7] group-hover:bg-[#f5f5f7]',
    orange: 'bg-[#f5f5f7] group-hover:bg-[#f5f5f7]'
  }

  const textColorMap: Record<string, string> = {
    blue: 'text-[#1859b8]',
    emerald: 'text-[#1859b8]',
    purple: 'text-[#1859b8]',
    amber: 'text-[#1859b8]',
    rose: 'text-[#1859b8]',
    orange: 'text-[#1859b8]'
  }

  return (
    <div className="theme-apple">
      <MainNav />
      <main>
        {/* Hero: khối trắng, căn giữa, cửa sổ trình duyệt làm ảnh sản phẩm */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <p className="text-sm uppercase tracking-[-0.016em] text-[#515154]">{t('THIẾT KẾ WEBSITE', 'WEBSITE DESIGN')}</p>
              <h1 className="ap-hero-title">
                {t('Website chuyển đổi cao', 'Website that converts')}
              </h1>
              <p className="ap-lead max-w-[760px]">
                {t(
                  'Thiết kế chuyên nghiệp, từ concept đến ngày ra mắt.',
                  'Professional design, from concept to launch.'
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">
                  {t('Nhận báo giá miễn phí', 'Get free quote')}
                </Link>
                <Link href="#portfolio" className="ap-btn ap-btn-ghost">
                  {t('Xem Portfolio', 'View Portfolio')}
                </Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { v: '200+', l: t('Dự án hoàn thành', 'Projects completed') },
                { v: '95+', l: t('Điểm PageSpeed', 'PageSpeed Score') },
                { v: '3x', l: t('Tăng Conversion', 'Conversion increase') },
              ].map((x) => (
                <div key={x.l}>
                  <div className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums text-[#1d1d1f]">{x.v}</div>
                  <div className="mt-1 text-[15px] text-[#515154]">{x.l}</div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-14 max-w-[860px] overflow-hidden rounded-[18px] border border-[#d2d2d7] bg-white text-left shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0]">
              <div className="flex items-center gap-2 border-b border-[#e0e0e0] bg-[#f5f5f7] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                  <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                  <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-1 text-xs text-[#515154]">
                    <Shield className="h-3 w-3 text-[#1859b8]" />
                    yourwebsite.com
                  </div>
                </div>
              </div>
              <div className="aspect-[16/9] bg-[#eaf2fd]">
                <Image
                  quality={95}
                  src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1600&h=1200&fit=crop"
                  alt="Website Design Preview"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 860px"
                />
              </div>
            </div>
          </div>
        </section>

        <ServiceAnswer slug="website" />

        {/* Vấn đề và giải pháp */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <WebsiteBrowserIllustration className="w-full h-auto" />
              </div>
              <div className="order-1 lg:order-2">
                <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#515154]">
                  <Target className="h-4 w-4" />
                  {t('VẤN ĐỀ & GIẢI PHÁP', 'PROBLEMS & SOLUTIONS')}
                </span>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-[42px]">
                  {t('Website của bạn', 'Is your website')}{' '}
                  <span className="text-[#1859b8]">{t('đang mất khách?', 'losing customers?')}</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[#515154]">
                  {t(
                    'Một website không tối ưu có thể khiến bạn mất đến 70% khách hàng tiềm năng. Hãy để chúng tôi giúp bạn.',
                    'An unoptimized website can cost you up to 70% of potential customers. Let us help you.'
                  )}
                </p>
                <div className="mt-8 space-y-4">
                  {problems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-[18px] border border-[#d2d2d7] bg-white p-5">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#eaf2fd] text-[#1859b8]">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <span className="inline-flex rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-xs font-medium text-[#515154]">{t('Vấn đề', 'Problem')}</span>
                          <p className="mt-1.5 text-[15px] leading-snug text-[#515154]">{item.problem}</p>
                        </div>
                        <div>
                          <span className="inline-flex rounded-full bg-[#1e6dda] px-2.5 py-0.5 text-xs font-medium text-white">{t('Giải pháp', 'Solution')}</span>
                          <p className="mt-1.5 text-base font-semibold leading-snug text-[#1d1d1f]">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quy trình: khối tối, 6 thẻ đều nhau, Portal theo dõi dự án bên dưới */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#d2d2d7]">
                <Layers className="h-4 w-4" />
                {t('QUY TRÌNH LÀM VIỆC', 'OUR PROCESS')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-white sm:text-4xl lg:text-5xl">
                {t('Quy trình ', 'Transparent ')}
                <span className="text-[#7db8ff]">{t('minh bạch', 'process')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-[#d2d2d7]">
                {t(
                  '6 bước rõ ràng từ khám phá đến bàn giao, bạn luôn nắm được tiến độ qua portal riêng.',
                  '6 clear steps from discovery to delivery, you always track progress through your dedicated portal.'
                )}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {processSteps.map((step, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda] [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-white">
                      {step.icon}
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">{step.duration}</span>
                  </div>
                  <div className="mt-5 text-sm font-medium tabular-nums text-[#7db8ff]">{t('Bước', 'Step')} {step.step}</div>
                  <h3 className="mt-1 text-xl font-semibold leading-snug text-white">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#d2d2d7]">{step.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {step.deliverables.map((item, i) => (
                      <span key={i} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-[#f5f5f7]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Portal theo dõi dự án */}
            <div className="mt-14 grid items-center gap-8 rounded-[18px] border border-white/20 bg-[#1d1d1f] p-7 sm:p-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <h3 className="text-2xl font-semibold leading-snug text-white lg:text-3xl">
                  {t('Portal theo dõi dự án', 'Project Tracking Portal')}
                </h3>
                <p className="mt-4 text-[17px] leading-relaxed text-[#d2d2d7]">
                  {t(
                    'Truy cập portal riêng để xem tiến độ real-time, phê duyệt design, và giao tiếp trực tiếp với team.',
                    'Access your dedicated portal to see real-time progress, approve designs, and communicate directly with the team.'
                  )}
                </p>
                <ul className="mt-6 space-y-3.5">
                  {[
                    t('Theo dõi tiến độ real-time', 'Real-time progress tracking'),
                    t('Phê duyệt design trực tuyến', 'Online design approval'),
                    t('Chat trực tiếp với team', 'Direct chat with team'),
                    t('Lịch sử thay đổi đầy đủ', 'Complete change history'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-base text-white">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1e6dda]">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-[14px] border border-white/20 bg-[#272729]">
                <div className="flex items-center gap-2 border-b border-white/15 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-white/30" />
                  <div className="h-3 w-3 rounded-full bg-white/30" />
                  <div className="h-3 w-3 rounded-full bg-white/30" />
                  <span className="ml-2 text-xs text-[#d2d2d7]">portal.clickstar.vn</span>
                </div>
                <div className="space-y-3 p-4">
                  {[
                    { icon: <Figma className="h-5 w-5" />, name: t('UI Design - Homepage', 'UI Design - Homepage'), tag: t('Đã duyệt', 'Approved'), on: true },
                    { icon: <Code2 className="h-5 w-5" />, name: t('Development Sprint 2', 'Development Sprint 2'), tag: t('Đang làm', 'In Progress'), on: true },
                    { icon: <BarChart3 className="h-5 w-5" />, name: t('SEO Setup', 'SEO Setup'), tag: t('Chờ', 'Pending'), on: false },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center justify-between gap-3 rounded-[10px] bg-white/10 p-3">
                      <div className="flex min-w-0 items-center gap-3 text-white">
                        <span className={row.on ? 'text-[#7db8ff]' : 'text-[#d2d2d7]'}>{row.icon}</span>
                        <span className="truncate text-sm">{row.name}</span>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${row.on ? 'bg-[#1e6dda] text-white' : 'bg-white/15 text-white'}`}>
                        {row.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loại website */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#515154]">
                <Layers className="h-4 w-4" />
                {t('LOẠI WEBSITE', 'WEBSITE TYPES')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Mẫu website ', 'Website templates for ')}
                <span className="text-[#1859b8]">{t('chuyển đổi cao', 'high conversion')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-[#515154]">
                {t(
                  'Dù bạn cần website doanh nghiệp, e-commerce hay landing page, chúng tôi đều có giải pháp phù hợp.',
                  'Whether you need a corporate website, e-commerce or landing page, we have the right solution.'
                )}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
              {websiteTypes.map((type, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#1e6dda] [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-white">
                    {type.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-[#1d1d1f]">{type.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{type.description}</p>
                  <div className="my-5 h-px w-full bg-[#e0e0e0]" />
                  <ul className="space-y-3">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf2fd]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1859b8]" />
                        </span>
                        <span className="text-[15px] text-[#1d1d1f]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dịch vụ bổ sung */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#515154]">
                <Sparkles className="h-4 w-4" />
                {t('DỊCH VỤ BỔ SUNG', 'ADD-ON SERVICES')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('SEO & Ads ', 'SEO & Ads ')}
                <span className="text-[#1859b8]">{t('tích hợp sẵn', 'ready to go')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-[#515154]">
                {t(
                  'Website được tối ưu SEO từ đầu và sẵn sàng cho các chiến dịch quảng cáo.',
                  'Website optimized for SEO from the start and ready for advertising campaigns.'
                )}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-6 lg:grid-cols-3 lg:gap-8">
              {addOnServices.map((service, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#1e6dda] [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-white">
                    {service.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-[#1d1d1f]">{service.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#515154]">{service.description}</p>
                  <div className="my-5 h-px w-full bg-[#e0e0e0]" />
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf2fd]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1859b8]" />
                        </span>
                        <span className="text-[15px] text-[#1d1d1f]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dự án tiêu biểu */}
        <section id="portfolio" className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#515154]">
                <Star className="h-4 w-4" />
                {t('DỰ ÁN TIÊU BIỂU', 'FEATURED PROJECTS')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Kết quả ', 'Results ')}
                <span className="text-[#1859b8]">{t('thực tế', 'that speak')}</span>
              </h2>
            </div>

            <div className="grid auto-rows-fr gap-6 lg:grid-cols-3 lg:gap-8">
              {portfolioItems.map((item, index) => (
                <div key={index} className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d2d2d7] bg-white">
                  <div className="aspect-[16/10] overflow-hidden bg-[#e0e0e0]">
                    <Image
                      quality={95}
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={500}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1859b8]">{item.category}</span>
                    <h3 className="mt-2 text-xl font-semibold leading-snug text-[#1d1d1f]">{item.title}</h3>
                    <div className="mt-auto grid grid-cols-3 gap-3 pt-6">
                      {[
                        { v: item.metrics.conversion, l: 'Conversion' },
                        { v: item.metrics.speed, l: 'PageSpeed' },
                        { v: item.metrics.bounce, l: 'Bounce Rate' },
                      ].map((m) => (
                        <div key={m.l} className="rounded-[12px] bg-[#f5f5f7] p-3 text-center">
                          <div className="text-lg font-semibold tabular-nums text-[#1859b8]">{m.v}</div>
                          <div className="mt-0.5 text-xs text-[#515154]">{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/projects" className="ap-link inline-flex items-center gap-2 font-semibold">
                {t('Xem tất cả dự án', 'View all projects')}
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="ap-tile ap-dark">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display max-w-[820px]">{cta.heading[language]}</h2>
              <p className="ap-lead max-w-[680px]">{cta.description[language]}</p>
              <div className="ap-cta-row mt-2">
                <Link href={cta.primary.href} className="ap-btn ap-btn-primary">
                  {cta.primary.label[language]}
                </Link>
                <Link href={cta.secondary.href} className="ap-btn ap-btn-ghost">
                  {cta.secondary.label[language]}
                </Link>
              </div>
            </div>
          </div>
        </section>
      <ServiceReadMore slug="website" />
      </main>
      <Footer />
    </div>
  )
}
