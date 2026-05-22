'use client'

import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  Zap,
  Search,
  Share2,
  Mail,
  MousePointerClick,
  LineChart,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Play,
  MessageSquare,
  FileText,
  Settings,
  Rocket,
  Shield,
  Clock,
  DollarSign,
  Eye,
  ThumbsUp
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'

export default function DigitalMarketingPage() {
  const { t } = useLanguage()

  const platforms = [
    { name: 'Google Ads', icon: '/images/platforms/google.svg', color: 'bg-red-50 border-red-200' },
    { name: 'Meta Ads', icon: '/images/platforms/meta.svg', color: 'bg-blue-50 border-blue-200' },
    { name: 'TikTok Ads', icon: '/images/platforms/tiktok.svg', color: 'bg-gray-50 border-gray-200' },
    { name: 'YouTube Ads', icon: '/images/platforms/youtube.svg', color: 'bg-red-50 border-red-200' },
    { name: 'LinkedIn Ads', icon: '/images/platforms/linkedin.svg', color: 'bg-blue-50 border-blue-200' },
    { name: 'Zalo Ads', icon: '/images/platforms/zalo.svg', color: 'bg-blue-50 border-blue-200' },
  ]

  const problems = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      problem: t('Chi phí quảng cáo cao nhưng không hiệu quả', 'High advertising costs but ineffective'),
      solution: t('Tối ưu ngân sách với AI targeting, giảm CPC đến 40%', 'Optimize budget with AI targeting, reduce CPC by up to 40%'),
    },
    {
      icon: <Target className="w-6 h-6" />,
      problem: t('Khó tiếp cận đúng khách hàng tiềm năng', 'Hard to reach the right potential customers'),
      solution: t('Phân tích data chuyên sâu, xây dựng audience chính xác', 'In-depth data analysis, build accurate audience segments'),
    },
    {
      icon: <Eye className="w-6 h-6" />,
      problem: t('Không biết chiến dịch đang hoạt động thế nào', 'Don\'t know how campaigns are performing'),
      solution: t('Dashboard real-time, báo cáo tự động hàng tuần', 'Real-time dashboard, automated weekly reports'),
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      problem: t('Tỷ lệ chuyển đổi thấp, khó scale', 'Low conversion rate, hard to scale'),
      solution: t('A/B testing liên tục, landing page optimization', 'Continuous A/B testing, landing page optimization'),
    },
  ]

  const services = [
    {
      icon: <MousePointerClick className="w-8 h-8 text-blue-600" />,
      title: t('Quảng cáo đa nền tảng', 'Multi-platform Advertising'),
      description: t(
        'Chạy quảng cáo trên Google, Facebook, TikTok, YouTube với chiến lược tối ưu cho từng kênh.',
        'Run ads on Google, Facebook, TikTok, YouTube with optimized strategies for each channel.'
      ),
      features: [
        t('Google Search & Display Ads', 'Google Search & Display Ads'),
        t('Meta Ads (Facebook & Instagram)', 'Meta Ads (Facebook & Instagram)'),
        t('TikTok Ads & Spark Ads', 'TikTok Ads & Spark Ads'),
        t('YouTube Video Ads', 'YouTube Video Ads'),
        t('Retargeting & Remarketing', 'Retargeting & Remarketing'),
      ],
      color: 'bg-blue-50',
    },
    {
      icon: <Search className="w-8 h-8 text-emerald-600" />,
      title: t('SEO & Content Marketing', 'SEO & Content Marketing'),
      description: t(
        'Tối ưu website để đứng top Google, xây dựng nội dung chất lượng thu hút khách hàng tự nhiên.',
        'Optimize website to rank top on Google, build quality content to attract organic customers.'
      ),
      features: [
        t('Technical SEO Audit', 'Technical SEO Audit'),
        t('On-page & Off-page SEO', 'On-page & Off-page SEO'),
        t('Keyword Research & Strategy', 'Keyword Research & Strategy'),
        t('Content Creation & Optimization', 'Content Creation & Optimization'),
        t('Link Building chất lượng', 'Quality Link Building'),
      ],
      color: 'bg-emerald-50',
    },
    {
      icon: <Share2 className="w-8 h-8 text-purple-600" />,
      title: t('Social Media Marketing', 'Social Media Marketing'),
      description: t(
        'Xây dựng và phát triển thương hiệu trên các nền tảng mạng xã hội với content sáng tạo.',
        'Build and grow brand presence on social media platforms with creative content.'
      ),
      features: [
        t('Lập kế hoạch content calendar', 'Content calendar planning'),
        t('Thiết kế visual & video', 'Visual & video design'),
        t('Community management', 'Community management'),
        t('Influencer marketing', 'Influencer marketing'),
        t('Social listening & Analytics', 'Social listening & Analytics'),
      ],
      color: 'bg-purple-50',
    },
    {
      icon: <Mail className="w-8 h-8 text-amber-600" />,
      title: t('Email & Automation Marketing', 'Email & Automation Marketing'),
      description: t(
        'Xây dựng hệ thống email marketing tự động, nurturing leads và tăng retention.',
        'Build automated email marketing systems, nurture leads and increase retention.'
      ),
      features: [
        t('Email sequence automation', 'Email sequence automation'),
        t('Lead nurturing workflows', 'Lead nurturing workflows'),
        t('Personalization & Segmentation', 'Personalization & Segmentation'),
        t('A/B testing campaigns', 'A/B testing campaigns'),
        t('Performance tracking', 'Performance tracking'),
      ],
      color: 'bg-amber-50',
    },
  ]

  const processSteps = [
    {
      step: '01',
      title: t('Khám phá & Phân tích', 'Discovery & Analysis'),
      description: t(
        'Tìm hiểu sâu về doanh nghiệp, sản phẩm, khách hàng mục tiêu và đối thủ cạnh tranh.',
        'Deep dive into business, products, target customers and competitors.'
      ),
      tasks: [
        t('Họp kick-off với stakeholders', 'Kick-off meeting with stakeholders'),
        t('Audit các kênh marketing hiện tại', 'Audit current marketing channels'),
        t('Phân tích đối thủ cạnh tranh', 'Competitor analysis'),
        t('Xác định KPIs và mục tiêu', 'Define KPIs and objectives'),
      ],
      duration: t('1-2 tuần', '1-2 weeks'),
      color: 'bg-blue-500',
    },
    {
      step: '02',
      title: t('Chiến lược & Kế hoạch', 'Strategy & Planning'),
      description: t(
        'Xây dựng chiến lược marketing tổng thể và kế hoạch triển khai chi tiết.',
        'Build overall marketing strategy and detailed implementation plan.'
      ),
      tasks: [
        t('Xây dựng marketing strategy', 'Build marketing strategy'),
        t('Lập kế hoạch ngân sách', 'Budget planning'),
        t('Thiết kế customer journey', 'Design customer journey'),
        t('Tạo content calendar', 'Create content calendar'),
      ],
      duration: t('1-2 tuần', '1-2 weeks'),
      color: 'bg-purple-500',
    },
    {
      step: '03',
      title: t('Setup & Triển khai', 'Setup & Implementation'),
      description: t(
        'Thiết lập tài khoản, pixel tracking, và triển khai các chiến dịch đầu tiên.',
        'Set up accounts, pixel tracking, and launch initial campaigns.'
      ),
      tasks: [
        t('Setup tài khoản quảng cáo', 'Set up ad accounts'),
        t('Cài đặt tracking & pixels', 'Install tracking & pixels'),
        t('Tạo audiences & segments', 'Create audiences & segments'),
        t('Launch chiến dịch pilot', 'Launch pilot campaigns'),
      ],
      duration: t('1-2 tuần', '1-2 weeks'),
      color: 'bg-emerald-500',
    },
    {
      step: '04',
      title: t('Tối ưu & Scale', 'Optimize & Scale'),
      description: t(
        'Liên tục tối ưu dựa trên data, A/B testing và scale các chiến dịch hiệu quả.',
        'Continuously optimize based on data, A/B testing and scale effective campaigns.'
      ),
      tasks: [
        t('Phân tích performance data', 'Analyze performance data'),
        t('A/B testing creative & copy', 'A/B test creative & copy'),
        t('Tối ưu bidding & targeting', 'Optimize bidding & targeting'),
        t('Scale chiến dịch winning', 'Scale winning campaigns'),
      ],
      duration: t('Liên tục', 'Ongoing'),
      color: 'bg-amber-500',
    },
    {
      step: '05',
      title: t('Báo cáo & Đánh giá', 'Reporting & Review'),
      description: t(
        'Báo cáo định kỳ minh bạch, họp review và điều chỉnh chiến lược khi cần.',
        'Regular transparent reporting, review meetings and strategy adjustments.'
      ),
      tasks: [
        t('Dashboard real-time trên Portal', 'Real-time dashboard on Portal'),
        t('Báo cáo tự động hàng tuần', 'Automated weekly reports'),
        t('Họp review hàng tháng', 'Monthly review meetings'),
        t('Điều chỉnh chiến lược Q/Q', 'Quarterly strategy adjustments'),
      ],
      duration: t('Liên tục', 'Ongoing'),
      color: 'bg-rose-500',
    },
  ]

  const portalFeatures = [
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      title: t('Dashboard Real-time', 'Real-time Dashboard'),
      description: t('Theo dõi hiệu suất chiến dịch mọi lúc, mọi nơi', 'Track campaign performance anytime, anywhere'),
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: t('Báo cáo tự động', 'Automated Reports'),
      description: t('Nhận báo cáo chi tiết qua email hàng tuần', 'Receive detailed reports via email weekly'),
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: t('Chat & Support', 'Chat & Support'),
      description: t('Trao đổi trực tiếp với team qua chat', 'Communicate directly with team via chat'),
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      title: t('Quản lý Campaign', 'Campaign Management'),
      description: t('Xem và approve content, creative trước khi chạy', 'View and approve content, creatives before launch'),
    },
  ]

  const stats = [
    { value: '500+', label: t('Chiến dịch đã triển khai', 'Campaigns launched') },
    { value: '40%', label: t('Giảm CPC trung bình', 'Average CPC reduction') },
    { value: '3.5x', label: t('ROAS trung bình', 'Average ROAS') },
    { value: '98%', label: t('Khách hàng hài lòng', 'Client satisfaction') },
  ]

  const caseStudies = [
    {
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&q=80',
      industry: t('E-commerce', 'E-commerce'),
      title: t('Tăng 250% doanh thu từ quảng cáo', '250% increase in ad revenue'),
      metrics: [
        { label: 'ROAS', value: '4.2x' },
        { label: t('Giảm CPA', 'CPA Reduction'), value: '-35%' },
      ],
    },
    {
      logo: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop&q=80',
      industry: t('Giáo dục', 'Education'),
      title: t('300+ leads chất lượng mỗi tháng', '300+ quality leads per month'),
      metrics: [
        { label: t('Cost per Lead', 'Cost per Lead'), value: '-45%' },
        { label: t('Conversion Rate', 'Conversion Rate'), value: '+120%' },
      ],
    },
    {
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop&q=80',
      industry: t('Y tế', 'Healthcare'),
      title: t('Top 3 Google cho từ khóa chính', 'Top 3 Google for main keywords'),
      metrics: [
        { label: t('Organic Traffic', 'Organic Traffic'), value: '+180%' },
        { label: t('Bookings', 'Bookings'), value: '+95%' },
      ],
    },
  ]

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
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-6 shadow-lg shadow-blue-500/25">
                  <Zap className="w-4 h-4" />
                  {t('DIGITAL MARKETING', 'DIGITAL MARKETING')}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6">
                  {t('Tăng trưởng doanh thu với', 'Grow revenue with')}{' '}
                  <span className="text-primary">{t('Digital Marketing', 'Digital Marketing')}</span>
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  {t(
                    'Chiến lược marketing đa kênh được thiết kế riêng cho doanh nghiệp của bạn. Từ quảng cáo Google, Facebook đến SEO - chúng tôi giúp bạn tiếp cận đúng khách hàng với chi phí tối ưu.',
                    'Multi-channel marketing strategy designed specifically for your business. From Google, Facebook ads to SEO - we help you reach the right customers at optimal cost.'
                  )}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                  >
                    {t('Nhận tư vấn miễn phí', 'Get Free Consultation')}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-foreground font-semibold px-8 py-4 rounded-full border border-border transition-all duration-300">
                    <Play className="w-5 h-5 text-primary" />
                    {t('Xem case study', 'Watch case study')}
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index}>
                      <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platforms Grid */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
                  <h3 className="text-lg font-bold text-foreground mb-6 text-center">
                    {t('Nền tảng quảng cáo chúng tôi hỗ trợ', 'Advertising platforms we support')}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {platforms.map((platform, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 ${platform.color} hover:scale-105 transition-transform cursor-pointer`}
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm p-2">
                          <Image
                            src={platform.icon}
                            alt={platform.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 text-center">{platform.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Trust badges */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <span>{t('Google Partner', 'Google Partner')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span>{t('Meta Partner', 'Meta Partner')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  +250% ROI
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{t('Tăng trưởng', 'Growth')}</div>
                    <div className="text-xs text-muted-foreground">{t('Liên tục mỗi tháng', 'Every month')}</div>
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
                <div className="relative">
                  {/* Main SVG Illustration */}
                  <svg viewBox="0 0 500 400" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background circles */}
                    <circle cx="250" cy="200" r="180" fill="#EEF2FF" opacity="0.5"/>
                    <circle cx="250" cy="200" r="130" fill="#E0E7FF" opacity="0.5"/>
                    
                    {/* Central dashboard */}
                    <rect x="150" y="100" width="200" height="140" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                    <rect x="165" y="115" width="170" height="25" rx="4" fill="#F3F4F6"/>
                    <circle cx="178" cy="127" r="6" fill="#EF4444"/>
                    <circle cx="195" cy="127" r="6" fill="#F59E0B"/>
                    <circle cx="212" cy="127" r="6" fill="#10B981"/>
                    
                    {/* Chart bars */}
                    <rect x="175" y="200" width="20" height="25" rx="2" fill="#DBEAFE"/>
                    <rect x="205" y="185" width="20" height="40" rx="2" fill="#93C5FD"/>
                    <rect x="235" y="170" width="20" height="55" rx="2" fill="#60A5FA"/>
                    <rect x="265" y="155" width="20" height="70" rx="2" fill="#3B82F6"/>
                    <rect x="295" y="165" width="20" height="60" rx="2" fill="#2563EB"/>
                    
                    {/* Growth arrow */}
                    <path d="M180 195 L310 145" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 4"/>
                    <polygon points="315,140 305,145 310,155" fill="#10B981"/>
                    
                    {/* Floating elements - Problem indicators (red) */}
                    <g>
                      <rect x="50" y="80" width="80" height="50" rx="8" fill="white" stroke="#FEE2E2" strokeWidth="2"/>
                      <circle cx="70" cy="105" r="12" fill="#FEE2E2"/>
                      <text x="70" y="110" textAnchor="middle" fill="#DC2626" fontSize="14" fontWeight="bold">!</text>
                      <rect x="90" y="95" width="30" height="6" rx="2" fill="#FECACA"/>
                      <rect x="90" y="105" width="25" height="6" rx="2" fill="#FEE2E2"/>
                    </g>
                    
                    <g>
                      <rect x="30" y="200" width="80" height="50" rx="8" fill="white" stroke="#FEE2E2" strokeWidth="2"/>
                      <circle cx="50" cy="225" r="12" fill="#FEE2E2"/>
                      <text x="50" y="230" textAnchor="middle" fill="#DC2626" fontSize="14" fontWeight="bold">$</text>
                      <rect x="70" y="215" width="30" height="6" rx="2" fill="#FECACA"/>
                      <rect x="70" y="225" width="25" height="6" rx="2" fill="#FEE2E2"/>
                    </g>
                    
                    {/* Floating elements - Solution indicators (green) */}
                    <g>
                      <rect x="370" y="70" width="90" height="55" rx="8" fill="white" stroke="#D1FAE5" strokeWidth="2"/>
                      <circle cx="392" cy="97" r="14" fill="#D1FAE5"/>
                      <path d="M386 97 L390 101 L400 91" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="415" y="87" width="35" height="6" rx="2" fill="#A7F3D0"/>
                      <rect x="415" y="97" width="28" height="6" rx="2" fill="#D1FAE5"/>
                    </g>
                    
                    <g>
                      <rect x="380" y="180" width="90" height="55" rx="8" fill="white" stroke="#D1FAE5" strokeWidth="2"/>
                      <circle cx="402" cy="207" r="14" fill="#D1FAE5"/>
                      <path d="M396 207 L400 211 L410 201" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="425" y="197" width="35" height="6" rx="2" fill="#A7F3D0"/>
                      <rect x="425" y="207" width="28" height="6" rx="2" fill="#D1FAE5"/>
                    </g>
                    
                    {/* Connecting lines with animation effect */}
                    <path d="M130 105 L150 120" stroke="#FCA5A5" strokeWidth="2" strokeDasharray="4 2"/>
                    <path d="M110 225 L150 200" stroke="#FCA5A5" strokeWidth="2" strokeDasharray="4 2"/>
                    <path d="M350 200 L370 207" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="4 2"/>
                    <path d="M350 130 L370 105" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="4 2"/>
                    
                    {/* Target icon in center */}
                    <circle cx="250" cy="300" r="30" fill="white" stroke="#3B82F6" strokeWidth="3"/>
                    <circle cx="250" cy="300" r="20" fill="white" stroke="#3B82F6" strokeWidth="2"/>
                    <circle cx="250" cy="300" r="8" fill="#3B82F6"/>
                    
                    {/* Small decorative dots */}
                    <circle cx="80" cy="320" r="4" fill="#93C5FD"/>
                    <circle cx="420" cy="280" r="5" fill="#86EFAC"/>
                    <circle cx="400" cy="320" r="3" fill="#FCA5A5"/>
                    <circle cx="100" cy="150" r="3" fill="#C4B5FD"/>
                  </svg>
                </div>
              </div>

              {/* Right: Content */}
              <div className="order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-6">
                  <Target className="w-4 h-4" />
                  {t('VẤN ĐỀ & GIẢI PHÁP', 'PROBLEMS & SOLUTIONS')}
                </span>
                
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-6">
                  {t('Doanh nghiệp của bạn đang', 'Is your business')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                    {t('gặp khó khăn?', 'struggling?')}
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t(
                    'Chúng tôi hiểu những thách thức bạn đang đối mặt và có giải pháp cụ thể cho từng vấn đề.',
                    'We understand the challenges you face and have specific solutions for each problem.'
                  )}
                </p>

                {/* Problems & Solutions List */}
                <div className="space-y-5">
                  {problems.map((item, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Problem */}
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                            <p className="text-foreground font-semibold text-sm line-through decoration-rose-300">{item.problem}</p>
                          </div>
                          
                          {/* Solution */}
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <p className="text-muted-foreground text-sm">{item.solution}</p>
                          </div>
                        </div>
                        
                        {/* Arrow indicator */}
                        <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <div className="mt-10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    {t('Tìm hiểu giải pháp cho doanh nghiệp của bạn', 'Find solutions for your business')}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Detail */}
        <section className="py-12 lg:py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                {t('DỊCH VỤ CHI TIẾT', 'DETAILED SERVICES')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                {t('Giải pháp', 'Solutions')}{' '}
                <span className="text-primary">{t('toàn diện', 'comprehensive')}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`${service.color} rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group`}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="pt-12 pb-20 lg:pt-16 lg:pb-28 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-4 py-2 rounded-full mb-6">
                <Rocket className="w-4 h-4" />
                {t('QUY TRÌNH TRIỂN KHAI', 'IMPLEMENTATION PROCESS')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                {t('Quy trình làm việc', 'Working process')}{' '}
                <span className="text-primary">{t('minh bạch', 'transparent')}</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {t(
                  '5 bước triển khai rõ ràng, bạn theo dõi được tiến độ mọi lúc qua Portal.',
                  '5 clear implementation steps, track progress anytime via Portal.'
                )}
              </p>
            </div>

            <div className="relative">
              {/* Connection line */}
              <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500" />

              <div className="grid lg:grid-cols-5 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Step number */}
                    <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 mx-auto lg:mx-0 relative z-10`}>
                      {step.step}
                    </div>

                    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 h-full">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portal Features */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/5 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
                  <Settings className="w-4 h-4" />
                  {t('CLICKSTAR PORTAL', 'CLICKSTAR PORTAL')}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                  {t('Theo dõi chiến dịch', 'Track campaigns')}{' '}
                  <span className="text-primary">{t('mọi lúc, mọi nơi', 'anytime, anywhere')}</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t(
                    'Portal riêng cho khách hàng với đầy đủ tính năng: dashboard real-time, báo cáo tự động, chat với team, và approval workflow.',
                    'Dedicated client portal with full features: real-time dashboard, automated reports, team chat, and approval workflow.'
                  )}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {portalFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portal Preview */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
                  {/* Browser header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white rounded-lg px-4 py-1 text-sm text-gray-500">
                        portal.clickstar.vn
                      </div>
                    </div>
                  </div>

                  {/* Dashboard preview */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-bold text-foreground">{t('Dashboard Overview', 'Dashboard Overview')}</h4>
                        <p className="text-sm text-muted-foreground">{t('Cập nhật 5 phút trước', 'Updated 5 minutes ago')}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">{t('Đang chạy', 'Running')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground mb-1">{t('Chi tiêu', 'Spend')}</div>
                        <div className="text-xl font-bold text-foreground">45.2M</div>
                        <div className="text-xs text-emerald-600">+12% vs tuần trước</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground mb-1">{t('Leads', 'Leads')}</div>
                        <div className="text-xl font-bold text-foreground">324</div>
                        <div className="text-xs text-emerald-600">+28% vs tuần trước</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground mb-1">ROAS</div>
                        <div className="text-xl font-bold text-foreground">3.8x</div>
                        <div className="text-xs text-emerald-600">+0.5 vs tuần trước</div>
                      </div>
                    </div>

                    {/* Chart placeholder */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-foreground">{t('Hiệu suất theo ngày', 'Daily Performance')}</span>
                        <LineChart className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="h-32 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${h}%` }}>
                            <div className="w-full bg-primary rounded-t" style={{ height: `${h * 0.7}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ThumbsUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{t('Chiến dịch đạt KPI!', 'Campaign hit KPI!')}</div>
                    <div className="text-xs text-muted-foreground">{t('Vừa xong', 'Just now')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-4 h-4" />
                {t('CASE STUDIES', 'CASE STUDIES')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                {t('Kết quả', 'Results')}{' '}
                <span className="text-primary">{t('thực tế', 'in action')}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={study.logo}
                      alt={study.industry}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 bg-white/90 text-foreground text-sm font-medium px-3 py-1 rounded-full">
                      {study.industry}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">{study.title}</h3>
                    <div className="flex gap-4">
                      {study.metrics.map((metric, idx) => (
                        <div key={idx} className="flex-1 bg-secondary/50 rounded-xl p-3 text-center">
                          <div className="text-lg font-bold text-primary">{metric.value}</div>
                          <div className="text-xs text-muted-foreground">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                {t('Xem tất cả case studies', 'View all case studies')}
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-12 lg:py-16 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t('Sẵn sàng tăng trưởng?', 'Ready to grow?')}
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {t(
                'Đặt lịch tư vấn miễn phí với chuyên gia Digital Marketing của chúng tôi ngay hôm nay.',
                'Schedule a free consultation with our Digital Marketing experts today.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
              >
                {t('Đặt lịch tư vấn', 'Book Consultation')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+84123456789"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                <Clock className="w-5 h-5" />
                {t('Gọi ngay: 0977 713 428', 'Call now: 0977 713 428')}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
