'use client'

import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
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

export default function WebsiteDesignPage() {
  const { language, t } = useLanguage()

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
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      metrics: { conversion: '+180%', speed: '95/100', bounce: '-45%' }
    },
    {
      title: 'Fashion Store',
      category: language === 'vi' ? 'E-commerce' : 'E-commerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
      metrics: { conversion: '+250%', speed: '92/100', bounce: '-38%' }
    },
    {
      title: 'EduLearn Platform',
      category: language === 'vi' ? 'Website Giáo dục' : 'Education Website',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=500&fit=crop',
      metrics: { conversion: '+320%', speed: '90/100', bounce: '-52%' }
    },
  ]

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    orange: 'from-orange-500 to-orange-600'
  }

  const bgColorMap: Record<string, string> = {
    blue: 'bg-blue-50 group-hover:bg-blue-100',
    emerald: 'bg-emerald-50 group-hover:bg-emerald-100',
    purple: 'bg-purple-50 group-hover:bg-purple-100',
    amber: 'bg-amber-50 group-hover:bg-amber-100',
    rose: 'bg-rose-50 group-hover:bg-rose-100',
    orange: 'bg-orange-50 group-hover:bg-orange-100'
  }

  const textColorMap: Record<string, string> = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    orange: 'text-orange-600'
  }

  return (
    <>
      <MainNav />
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
          </div>
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-6 shadow-lg shadow-purple-500/25">
                  <Globe className="w-4 h-4" />
                  {t('THIẾT KẾ WEBSITE', 'WEBSITE DESIGN')}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6">
                  {t('Website ', 'Website ')}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {t('chuyển đổi cao', 'that converts')}
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  {t(
                    'Thiết kế website chuyên nghiệp, tối ưu trải nghiệm người dùng và tỷ lệ chuyển đổi. Từ concept đến launch, chúng tôi đồng hành cùng bạn.',
                    'Professional website design, optimized user experience and conversion rate. From concept to launch, we accompany you.'
                  )}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div>
                    <div className="text-3xl font-extrabold text-foreground">200+</div>
                    <div className="text-sm text-muted-foreground">{t('Dự án hoàn thành', 'Projects completed')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-foreground">95+</div>
                    <div className="text-sm text-muted-foreground">{t('Điểm PageSpeed', 'PageSpeed Score')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-foreground">3x</div>
                    <div className="text-sm text-muted-foreground">{t('Tăng Conversion', 'Conversion increase')}</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                  >
                    {t('Nhận báo giá miễn phí', 'Get free quote')}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#portfolio"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-foreground font-semibold px-8 py-4 rounded-full border border-border transition-all duration-300"
                  >
                    <Eye className="w-5 h-5" />
                    {t('Xem Portfolio', 'View Portfolio')}
                  </Link>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-2 border border-border">
                  {/* Browser mockup */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-t-xl">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-2 border">
                        <Shield className="w-3 h-3 text-green-500" />
                        yourwebsite.com
                      </div>
                    </div>
                  </div>
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 rounded-b-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop"
                      alt="Website Design Preview"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">PageSpeed</div>
                      <div className="text-lg font-bold text-green-600">98/100</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Mobile</div>
                      <div className="text-lg font-bold text-purple-600">100%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problems & Solutions */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: SVG Illustration */}
              <div className="relative order-2 lg:order-1">
                <svg viewBox="0 0 500 400" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background */}
                  <circle cx="250" cy="200" r="180" fill="#F5F3FF" opacity="0.5"/>
                  <circle cx="250" cy="200" r="130" fill="#EDE9FE" opacity="0.5"/>
                  
                  {/* Main monitor */}
                  <rect x="120" y="80" width="260" height="180" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                  <rect x="120" y="80" width="260" height="30" rx="12" fill="#F3F4F6"/>
                  <circle cx="140" cy="95" r="5" fill="#EF4444"/>
                  <circle cx="155" cy="95" r="5" fill="#F59E0B"/>
                  <circle cx="170" cy="95" r="5" fill="#10B981"/>
                  
                  {/* Website content mockup */}
                  <rect x="135" y="120" width="230" height="20" rx="4" fill="#8B5CF6" opacity="0.2"/>
                  <rect x="135" y="150" width="100" height="80" rx="6" fill="#DBEAFE"/>
                  <rect x="245" y="150" width="120" height="12" rx="2" fill="#E5E7EB"/>
                  <rect x="245" y="170" width="100" height="8" rx="2" fill="#F3F4F6"/>
                  <rect x="245" y="185" width="110" height="8" rx="2" fill="#F3F4F6"/>
                  <rect x="245" y="210" width="70" height="20" rx="4" fill="#8B5CF6"/>
                  
                  {/* Monitor stand */}
                  <rect x="230" y="260" width="40" height="20" fill="#E5E7EB"/>
                  <rect x="200" y="280" width="100" height="10" rx="5" fill="#D1D5DB"/>
                  
                  {/* Floating design tools */}
                  <g transform="translate(40, 120)">
                    <rect width="60" height="60" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                    <rect x="15" y="15" width="30" height="30" rx="4" fill="#FECACA"/>
                    <path d="M25 25 L35 25 L35 35 L25 35 Z" fill="#EF4444"/>
                  </g>
                  
                  <g transform="translate(400, 100)">
                    <rect width="60" height="60" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                    <circle cx="30" cy="30" r="15" fill="#BBF7D0"/>
                    <path d="M23 30 L28 35 L38 25" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </g>
                  
                  <g transform="translate(50, 250)">
                    <rect width="70" height="50" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                    <rect x="10" y="15" width="50" height="8" rx="2" fill="#C4B5FD"/>
                    <rect x="10" y="27" width="35" height="8" rx="2" fill="#E9D5FF"/>
                  </g>
                  
                  <g transform="translate(380, 220)">
                    <rect width="70" height="50" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                    <circle cx="25" cy="25" r="12" fill="#DBEAFE"/>
                    <rect x="42" y="18" width="18" height="6" rx="2" fill="#93C5FD"/>
                    <rect x="42" y="28" width="14" height="6" rx="2" fill="#BFDBFE"/>
                  </g>
                  
                  {/* Connection lines */}
                  <path d="M100 150 L120 140" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="4 2"/>
                  <path d="M400 130 L380 140" stroke="#86EFAC" strokeWidth="2" strokeDasharray="4 2"/>
                  <path d="M120 275 L135 250" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="4 2"/>
                  <path d="M380 245 L365 240" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 2"/>
                  
                  {/* Decorative elements */}
                  <circle cx="70" cy="80" r="4" fill="#A78BFA"/>
                  <circle cx="430" cy="180" r="5" fill="#86EFAC"/>
                  <circle cx="100" cy="320" r="3" fill="#FCA5A5"/>
                  <circle cx="400" cy="300" r="4" fill="#93C5FD"/>
                </svg>
              </div>

              {/* Right: Content */}
              <div className="order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-6">
                  <Target className="w-4 h-4" />
                  {t('VẤN ĐỀ & GIẢI PHÁP', 'PROBLEMS & SOLUTIONS')}
                </span>
                
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-6">
                  {t('Website của bạn', 'Is your website')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {t('đang mất khách?', 'losing customers?')}
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t(
                    'Một website không tối ưu có thể khiến bạn mất đến 70% khách hàng tiềm năng. Hãy để chúng tôi giúp bạn.',
                    'An unoptimized website can cost you up to 70% of potential customers. Let us help you.'
                  )}
                </p>

                {/* Problems & Solutions List */}
                <div className="space-y-4">
                  {problems.map((item, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-2xl p-5 border border-border hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                            <p className="text-foreground font-semibold text-sm line-through decoration-rose-300">{item.problem}</p>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <p className="text-muted-foreground text-sm">{item.solution}</p>
                          </div>
                        </div>
                        
                        <ArrowUpRight className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 lg:py-16 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4 backdrop-blur">
                <Layers className="w-4 h-4" />
                {t('QUY TRÌNH LÀM VIỆC', 'OUR PROCESS')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                {t('Quy trình ', 'Transparent ')}<span className="text-purple-400">{t('minh bạch', 'process')}</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {t(
                  '6 bước rõ ràng từ khám phá đến bàn giao, bạn luôn nắm được tiến độ qua portal riêng.',
                  '6 clear steps from discovery to delivery, you always track progress through your dedicated portal.'
                )}
              </p>
            </div>

            {/* Process Timeline */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.step}
                  </div>
                  
                  <div className="pt-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    
                    {/* Title & Duration */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                    
                    {/* Deliverables */}
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((item, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Portal Preview */}
            <div className="mt-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl p-8 lg:p-12 border border-white/10">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    {t('Portal theo dõi dự án', 'Project Tracking Portal')}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {t(
                      'Truy cập portal riêng để xem tiến độ real-time, phê duyệt design, và giao tiếp trực tiếp với team.',
                      'Access your dedicated portal to see real-time progress, approve designs, and communicate directly with the team.'
                    )}
                  </p>
                  <ul className="space-y-3">
                    {[
                      t('Theo dõi tiến độ real-time', 'Real-time progress tracking'),
                      t('Phê duyệt design trực tuyến', 'Online design approval'),
                      t('Chat trực tiếp với team', 'Direct chat with team'),
                      t('Lịch sử thay đổi đầy đủ', 'Complete change history'),
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <div className="bg-gray-900 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-2 text-xs text-gray-500">portal.clickstar.vn</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Figma className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-white">{t('UI Design - Homepage', 'UI Design - Homepage')}</span>
                        </div>
                        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">{t('Đã duyệt', 'Approved')}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Code2 className="w-5 h-5 text-blue-400" />
                          <span className="text-sm text-white">{t('Development Sprint 2', 'Development Sprint 2')}</span>
                        </div>
                        <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">{t('Đang làm', 'In Progress')}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-white">{t('SEO Setup', 'SEO Setup')}</span>
                        </div>
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{t('Chờ', 'Pending')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Website Types */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Layers className="w-4 h-4" />
                {t('LOẠI WEBSITE', 'WEBSITE TYPES')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                {t('Mẫu website ', 'Website templates for ')}<span className="text-primary">{t('chuyển đổi cao', 'high conversion')}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Dù bạn cần website doanh nghiệp, e-commerce hay landing page, chúng tôi đều có giải pháp phù hợp.',
                  'Whether you need a corporate website, e-commerce or landing page, we have the right solution.'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteTypes.map((type, index) => (
                <div
                  key={index}
                  className={`group relative bg-white rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300 ${bgColorMap[type.color]}`}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[type.color]} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    {type.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">{type.title}</h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-5">{type.description}</p>
                  
                  {/* Features */}
                  <ul className="space-y-2">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className={`w-4 h-4 ${textColorMap[type.color]} flex-shrink-0`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Arrow */}
                  <div className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br ${colorMap[type.color]} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO & Ads Add-ons */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                {t('DỊCH VỤ BỔ SUNG', 'ADD-ON SERVICES')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                {t('SEO & Ads ', 'SEO & Ads ')}<span className="text-emerald-600">{t('tích hợp sẵn', 'ready to go')}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Website được tối ưu SEO từ đầu và sẵn sàng cho các chiến dịch quảng cáo.',
                  'Website optimized for SEO from the start and ready for advertising campaigns.'
                )}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {addOnServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-border hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <div className="space-y-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Star className="w-4 h-4" />
                {t('DỰ ÁN TIÊU BIỂU', 'FEATURED PROJECTS')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                {t('Kết quả ', 'Results ')}<span className="text-primary">{t('thực tế', 'that speak')}</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-xl font-bold text-foreground mt-2 mb-4">{item.title}</h3>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-lg font-bold text-emerald-600">{item.metrics.conversion}</div>
                        <div className="text-xs text-muted-foreground">Conversion</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{item.metrics.speed}</div>
                        <div className="text-xs text-muted-foreground">PageSpeed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{item.metrics.bounce}</div>
                        <div className="text-xs text-muted-foreground">Bounce Rate</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                    <button className="flex items-center gap-2 bg-white text-foreground font-semibold px-6 py-3 rounded-full">
                      {t('Xem chi tiết', 'View details')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                {t('Xem tất cả dự án', 'View all projects')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-12 lg:py-16 bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t('Sẵn sàng có website mới?', 'Ready for a new website?')}
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {t(
                'Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.',
                'Contact us now for free consultation and detailed quote for your project.'
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="tel:+84123456789"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-secondary transition-all shadow-lg"
              >
                <Settings className="w-5 h-5" />
                {t('Gọi ngay: 0977 713 428', 'Call now: 0977 713 428')}
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all border border-white/30"
              >
                {t('Nhận báo giá qua email', 'Get quote via email')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
