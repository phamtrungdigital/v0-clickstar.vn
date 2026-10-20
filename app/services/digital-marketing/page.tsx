'use client'

import Image from 'next/image'
import Link, { useLocalHref } from '@/components/app-link'
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
import { useServiceCta } from '@/contexts/web-content-context'
import { DEFAULT_SERVICE_CTAS } from '@/lib/cms/web-content-shared'
import { MainNav } from '@/components/layout/main-nav'
import { Eyebrow } from '@/components/ui/eyebrow'
import { ServiceBottom } from '@/components/seo/service-answer'
import { Footer } from '@/components/layout/footer'
import { MarketingGrowthIllustration } from '@/components/illustrations/service-illustrations'

export default function DigitalMarketingPage() {
  const { t, language } = useLanguage()
  const localHref = useLocalHref()
  const cta = useServiceCta('digital-marketing') ?? DEFAULT_SERVICE_CTAS['digital-marketing']

  const platforms = [
    { name: 'Google Ads', icon: '/images/platforms/google.svg', color: 'bg-[#f5f5f7] border-border' },
    { name: 'Meta Ads', icon: '/images/platforms/meta.svg', color: 'bg-[#f5f5f7] border-border' },
    { name: 'TikTok Ads', icon: '/images/platforms/tiktok.svg', color: 'bg-[#f5f5f7] border-border' },
    { name: 'YouTube Ads', icon: '/images/platforms/youtube.svg', color: 'bg-[#f5f5f7] border-border' },
    { name: 'LinkedIn Ads', icon: '/images/platforms/linkedin.svg', color: 'bg-[#f5f5f7] border-border' },
    { name: 'Zalo Ads', icon: '/images/platforms/zalo.svg', color: 'bg-[#f5f5f7] border-border' },
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
      icon: <MousePointerClick className="w-8 h-8 text-[#1859b8]" />,
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
      color: 'bg-[#f5f5f7]',
    },
    {
      icon: <Search className="w-8 h-8 text-[#1859b8]" />,
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
      color: 'bg-[#f5f5f7]',
    },
    {
      icon: <Share2 className="w-8 h-8 text-[#1859b8]" />,
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
      color: 'bg-[#f5f5f7]',
    },
    {
      icon: <Mail className="w-8 h-8 text-[#1859b8]" />,
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
      color: 'bg-[#f5f5f7]',
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
      color: 'bg-[#1e6dda]',
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
      color: 'bg-[#1e6dda]',
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
      color: 'bg-[#1e6dda]',
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
      color: 'bg-[#1e6dda]',
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
      color: 'bg-[#1e6dda]',
    },
  ]

  const portalFeatures = [
    {
      icon: <BarChart3 className="w-6 h-6 text-[#1859b8]" />,
      title: t('Dashboard Real-time', 'Real-time Dashboard'),
      description: t('Theo dõi hiệu suất chiến dịch mọi lúc, mọi nơi', 'Track campaign performance anytime, anywhere'),
    },
    {
      icon: <FileText className="w-6 h-6 text-[#1859b8]" />,
      title: t('Báo cáo tự động', 'Automated Reports'),
      description: t('Nhận báo cáo chi tiết qua email hàng tuần', 'Receive detailed reports via email weekly'),
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#1859b8]" />,
      title: t('Chat & Support', 'Chat & Support'),
      description: t('Trao đổi trực tiếp với team qua chat', 'Communicate directly with team via chat'),
    },
    {
      icon: <Settings className="w-6 h-6 text-[#1859b8]" />,
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
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=1000&fit=crop&q=80',
      industry: t('E-commerce', 'E-commerce'),
      title: t('Tăng 250% doanh thu từ quảng cáo', '250% increase in ad revenue'),
      metrics: [
        { label: 'ROAS', value: '4.2x' },
        { label: t('Giảm CPA', 'CPA Reduction'), value: '-35%' },
      ],
    },
    {
      logo: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&h=1000&fit=crop&q=80',
      industry: t('Giáo dục', 'Education'),
      title: t('300+ leads chất lượng mỗi tháng', '300+ quality leads per month'),
      metrics: [
        { label: t('Cost per Lead', 'Cost per Lead'), value: '-45%' },
        { label: t('Conversion Rate', 'Conversion Rate'), value: '+120%' },
      ],
    },
    {
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=1000&fit=crop&q=80',
      industry: t('Y tế', 'Healthcare'),
      title: t('Top 3 Google cho từ khóa chính', 'Top 3 Google for main keywords'),
      metrics: [
        { label: t('Organic Traffic', 'Organic Traffic'), value: '+180%' },
        { label: t('Bookings', 'Bookings'), value: '+95%' },
      ],
    },
  ]

  return (
    <div className="theme-apple">
      <MainNav />
      <main className="[counter-reset:eyebrow]">
        {/* Hero: khối sáng, căn giữa theo mockup Apple */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <Eyebrow numbered={false} className="mb-4">
                {t('DIGITAL MARKETING', 'DIGITAL MARKETING')}
              </Eyebrow>

              <h1 className="ap-hero-title">
                Digital Marketing
              </h1>

              <p className="ap-lead max-w-[760px]">
                {t(
                  'Google, Facebook và SEO: đúng khách hàng, chi phí hợp lý.',
                  'Google, Facebook and SEO: the right customers, a sensible cost.'
                )}
              </p>

              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">
                  {t('Nhận tư vấn miễn phí', 'Get Free Consultation')}
                </Link>
                <a href="#case-studies" className="ap-btn ap-btn-ghost">
                  {t('Xem case study', 'Watch case study')}
                </a>
              </div>
            </div>

            {/* Số liệu */}
            <div className="mt-12 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[15px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Nền tảng quảng cáo hỗ trợ: logo xám có tên (giữ nguyên các file logo) */}
            <div className="mt-14 sm:mt-16 pt-10 border-t border-border">
              <p className="text-sm text-muted-foreground tracking-[-0.016em]">
                {t('Nền tảng quảng cáo chúng tôi hỗ trợ', 'Advertising platforms we support')}
              </p>
              <ul className="mt-6 m-0 p-0 list-none flex flex-wrap justify-center gap-x-9 gap-y-5">
                {platforms.map((platform, index) => (
                  <li key={index} className="inline-flex items-center gap-2.5">
                    <Image
                      quality={95}
                      src={platform.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain grayscale opacity-60"
                    />
                    <span className="text-sm text-[#515154] tracking-[-0.016em] whitespace-nowrap">{platform.name}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                {t('Google Partner · Meta Partner', 'Google Partner · Meta Partner')}
              </p>
            </div>
          </div>
        </section>

{/* Vấn đề và giải pháp: khối trắng, ảnh minh họa SVG bên trái, 4 thẻ bên phải */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <MarketingGrowthIllustration className="w-full h-auto" />
              </div>

              <div className="order-1 lg:order-2">
                <Eyebrow className="mb-3">
                  <Target className="h-4 w-4" />
                  {t('VẤN ĐỀ & GIẢI PHÁP', 'PROBLEMS & SOLUTIONS')}
                </Eyebrow>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-[42px]">
                  {t('Doanh nghiệp của bạn đang', 'Is your business')}{' '}
                  <span className="text-[#1859b8]">{t('gặp khó khăn?', 'struggling?')}</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[#515154]">
                  {t(
                    'Chúng tôi hiểu những thách thức bạn đang đối mặt và có giải pháp cụ thể cho từng vấn đề.',
                    'We understand the challenges you face and have specific solutions for each problem.'
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
                          <span className="inline-flex rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-xs font-medium text-[#515154]">
                            {t('Vấn đề', 'Problem')}
                          </span>
                          <p className="mt-1.5 text-[15px] leading-snug text-[#515154]">{item.problem}</p>
                        </div>
                        <div>
                          <span className="inline-flex rounded-full bg-[#1e6dda] px-2.5 py-0.5 text-xs font-medium text-white">
                            {t('Giải pháp', 'Solution')}
                          </span>
                          <p className="mt-1.5 text-base font-semibold leading-snug text-[#1d1d1f]">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/contact" className="ap-link inline-flex items-center gap-2 font-semibold">
                    {t('Tìm hiểu giải pháp cho doanh nghiệp của bạn', 'Find solutions for your business')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dịch vụ chi tiết: lưới 2x2, thẻ trắng viền rõ, đều chiều cao */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-14">
              <Eyebrow className="mb-3">
                <Zap className="w-4 h-4" />
                {t('DỊCH VỤ CHI TIẾT', 'DETAILED SERVICES')}
              </Eyebrow>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1d1d1f] leading-[1.15] tracking-[-0.005em]">
                {t('Giải pháp', 'Solutions')}{' '}
                <span className="text-[#1859b8]">{t('toàn diện', 'comprehensive')}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 auto-rows-fr">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7 sm:p-9"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#1e6dda] [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-white">
                    {service.icon}
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[0.005em] text-[#1d1d1f]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-[#515154]">{service.description}</p>
                  <div className="my-6 h-px w-full bg-[#e0e0e0]" />
                  <ul className="space-y-3.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf2fd]">
                          <Check className="h-3.5 w-3.5 text-[#1859b8]" strokeWidth={3} />
                        </span>
                        <span className="text-base text-[#1d1d1f]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình triển khai: 5 thẻ đều nhau trên khối tối, đường nối qua các số bước */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-14">
              <Eyebrow dark className="mb-3">
                <Rocket className="w-4 h-4" />
                {t('QUY TRÌNH TRIỂN KHAI', 'IMPLEMENTATION PROCESS')}
              </Eyebrow>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-[-0.005em] text-white">
                {t('Quy trình làm việc', 'Working process')}{' '}
                <span className="text-[#7db8ff]">{t('minh bạch', 'transparent')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-[#d2d2d7]">
                {t(
                  '5 bước triển khai rõ ràng, bạn theo dõi được tiến độ mọi lúc qua Portal.',
                  '5 clear implementation steps, track progress anytime via Portal.'
                )}
              </p>
            </div>

            <div className="relative">
              {/* Đường nối các số bước (chỉ hiện khi đủ 5 cột) */}
              <div className="pointer-events-none absolute left-7 right-[calc(20%-44px)] top-7 hidden h-px bg-white/30 xl:block" aria-hidden="true" />

              <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-5">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative flex h-full flex-col">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e6dda] text-xl font-semibold text-white ring-[6px] ring-[#272729]">
                      {step.step}
                    </div>

                    <div className="mt-5 flex flex-1 flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6">
                      <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                        {step.duration}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold leading-snug text-white xl:min-h-[3.25rem]">{step.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-[#d2d2d7] xl:min-h-[6.5rem]">{step.description}</p>
                      <div className="my-5 h-px w-full bg-white/20" />
                      <ul className="space-y-3">
                        {step.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-[15px] leading-snug text-[#f5f5f7]">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1e6dda]">
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            </span>
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

        {/* Portal: khối trắng, 4 tính năng bên trái, cửa sổ Portal bên phải */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Eyebrow className="mb-3">
                  <Settings className="h-4 w-4" />
                  {t('CLICKSTAR PORTAL', 'CLICKSTAR PORTAL')}
                </Eyebrow>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                  {t('Theo dõi chiến dịch', 'Track campaigns')}{' '}
                  <span className="text-[#1859b8]">{t('mọi lúc, mọi nơi', 'anytime, anywhere')}</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[#515154]">
                  {t(
                    'Portal riêng cho khách hàng với đầy đủ tính năng: dashboard real-time, báo cáo tự động, chat với team, và approval workflow.',
                    'Dedicated client portal with full features: real-time dashboard, automated reports, team chat, and approval workflow.'
                  )}
                </p>

                <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2">
                  {portalFeatures.map((feature, index) => (
                    <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#1e6dda] [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-white">
                        {feature.icon}
                      </div>
                      <h4 className="mt-4 text-[17px] font-semibold leading-snug text-[#1d1d1f]">{feature.title}</h4>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[#515154]">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cửa sổ Portal: ảnh sản phẩm, bóng đổ duy nhất của khối */}
              <div className="rounded-[18px] border border-[#d2d2d7] bg-white overflow-hidden shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0]">
                <div className="flex items-center gap-2 border-b border-[#e0e0e0] bg-[#f5f5f7] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                    <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                    <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <div className="rounded-lg bg-white px-4 py-1 text-sm text-[#515154]">portal.clickstar.vn</div>
                  </div>
                </div>

                <div className="bg-[#f5f5f7] p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-[#1d1d1f]">{t('Dashboard Overview', 'Dashboard Overview')}</h4>
                      <p className="text-sm text-[#515154]">{t('Cập nhật 5 phút trước', 'Updated 5 minutes ago')}</p>
                    </div>
                    <span className="rounded-full bg-[#1e6dda] px-3 py-1 text-sm text-white">{t('Đang chạy', 'Running')}</span>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-3">
                    {[
                      { k: t('Chi tiêu', 'Spend'), v: '45.2M', d: t('+12% vs tuần trước', '+12% vs last week') },
                      { k: t('Leads', 'Leads'), v: '324', d: t('+28% vs tuần trước', '+28% vs last week') },
                      { k: 'ROAS', v: '3.8x', d: t('+0.5 vs tuần trước', '+0.5 vs last week') },
                    ].map((m) => (
                      <div key={m.k} className="min-w-0 rounded-[12px] border border-[#e0e0e0] bg-white p-3.5">
                        <div className="text-sm text-[#515154]">{m.k}</div>
                        <div className="mt-0.5 text-xl font-semibold tabular-nums text-[#1d1d1f]">{m.v}</div>
                        <div className="mt-0.5 text-xs font-medium text-[#1859b8]">{m.d}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1d1d1f]">{t('Hiệu suất theo ngày', 'Daily Performance')}</span>
                      <LineChart className="h-5 w-5 text-[#515154]" />
                    </div>
                    <div className="flex h-32 items-end justify-between gap-2">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} className="flex flex-1 items-end rounded-t bg-[#eaf2fd]" style={{ height: `${h}%` }}>
                          <div className="w-full rounded-t bg-[#1e6dda]" style={{ height: `${h * 0.7}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case studies: khối xám nhạt, 3 thẻ đều nhau, ảnh có lớp phủ tối để nhãn đọc rõ */}
        <section id="case-studies" className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <Eyebrow className="mb-3">
                <TrendingUp className="h-4 w-4" />
                {t('CASE STUDIES', 'CASE STUDIES')}
              </Eyebrow>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Kết quả', 'Results')}{' '}
                <span className="text-[#1859b8]">{t('thực tế', 'in action')}</span>
              </h2>
            </div>

            <div className="grid auto-rows-fr gap-6 md:grid-cols-3 lg:gap-8">
              {caseStudies.map((study, index) => (
                <div key={index} className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d2d2d7] bg-white">
                  <div className="relative h-52 bg-[#e0e0e0]">
                    <Image
                      quality={95}
                      src={study.logo}
                      alt={study.industry}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-medium text-[#1d1d1f]">
                      {study.industry}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold leading-snug text-[#1d1d1f]">{study.title}</h3>
                    <div className="mt-auto flex gap-3 pt-6">
                      {study.metrics.map((metric, idx) => (
                        <div key={idx} className="flex-1 rounded-[12px] bg-[#f5f5f7] p-3.5 text-center">
                          <div className="text-2xl font-semibold tabular-nums tracking-tight text-[#1859b8]">{metric.value}</div>
                          <div className="mt-0.5 text-[13px] text-[#515154]">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/projects" className="ap-link inline-flex items-center gap-2 font-semibold">
                {t('Xem tất cả case studies', 'View all case studies')}
              </Link>
            </div>
          </div>
        </section>

        <ServiceBottom slug="digital-marketing" />

        {/* CTA Section */}
        <section id="contact" className="ap-tile ap-dark">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display max-w-[820px]">{cta.heading[language]}</h2>
              <p className="ap-lead max-w-[680px]">{cta.description[language]}</p>
              <div className="ap-cta-row mt-2">
                <Link href={cta.primary.href} className="ap-btn ap-btn-primary">
                  {cta.primary.label[language]}
                </Link>
                <a href={localHref(cta.secondary.href)} className="ap-btn ap-btn-ghost">
                  {cta.secondary.label[language]}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
