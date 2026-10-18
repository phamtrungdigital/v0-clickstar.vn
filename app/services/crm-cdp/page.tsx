'use client'

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Users, 
  Database, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Settings,
  BarChart3,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Target,
  TrendingUp,
  Shield,
  Layers,
  GitBranch,
  RefreshCw,
  Eye,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  Building2,
  DollarSign,
  Clock,
  Star,
  ChevronRight,
  Activity,
  PieChart,
  Workflow,
  BrainCircuit,
  MousePointerClick,
  Fingerprint,
  Radio,
  Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomerProfileIllustration } from '@/components/illustrations/service-illustrations'
import {
  CrmVsCdpSection,
  JourneySection,
  StorySection,
  UnifiedSection,
  FollowFlowSection,
} from './_components/journey-sections'

export default function CRMCDPPage() {
  const { language } = useLanguage()
  
  const t = (vi: string, en: string) => language === 'vi' ? vi : en

  const crmProblems = [
    {
      icon: <Database className="w-5 h-5" />,
      problem: t('Dữ liệu khách hàng nằm rải rác ở nhiều nơi', 'Customer data scattered across multiple places'),
      solution: t('Tập trung toàn bộ dữ liệu vào một nền tảng CRM duy nhất', 'Centralize all data into a single CRM platform')
    },
    {
      icon: <Users className="w-5 h-5" />,
      problem: t('Không theo dõi được hành trình khách hàng', 'Unable to track customer journey'),
      solution: t('Timeline đầy đủ từ lead đến chốt đơn và chăm sóc sau bán', 'Complete timeline from lead to close and after-sales care')
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      problem: t('Chăm sóc khách hàng thủ công, tốn thời gian', 'Manual customer care, time-consuming'),
      solution: t('Automation email, ZNS, SMS theo kịch bản đã thiết lập', 'Automated email, ZNS, SMS based on preset scenarios')
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      problem: t('Không có báo cáo để ra quyết định', 'No reports for decision making'),
      solution: t('Dashboard real-time với các chỉ số kinh doanh quan trọng', 'Real-time dashboard with key business metrics')
    }
  ]

  const crmFeatures = [
    {
      icon: <Users className="w-6 h-6" />,
      title: t('Quản trị khách hàng 360°', 'Customer Management 360°'),
      description: t(
        'Lưu trữ toàn bộ thông tin, lịch sử tương tác, giao dịch của từng khách hàng. Phân loại theo nhóm, đánh tag, scoring tự động.',
        'Store all information, interaction history, transactions for each customer. Classify by group, tag, auto scoring.'
      ),
      features: [
        t('Hồ sơ khách hàng chi tiết', 'Detailed customer profiles'),
        t('Lịch sử tương tác đa kênh', 'Multi-channel interaction history'),
        t('Phân khúc khách hàng thông minh', 'Smart customer segmentation'),
        t('Lead scoring tự động', 'Automatic lead scoring')
      ]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: t('Thiết lập & Tuỳ biến', 'Setup & Customization'),
      description: t(
        'Cấu hình CRM theo đặc thù doanh nghiệp. Tùy chỉnh pipeline, workflow, trường dữ liệu phù hợp với quy trình kinh doanh.',
        'Configure CRM according to business specifics. Customize pipeline, workflow, data fields to match business processes.'
      ),
      features: [
        t('Pipeline bán hàng tuỳ chỉnh', 'Customizable sales pipeline'),
        t('Workflow automation', 'Workflow automation'),
        t('Custom fields & modules', 'Custom fields & modules'),
        t('Phân quyền người dùng', 'User permissions')
      ]
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: t('Tích hợp API & Kết nối', 'API Integration & Connection'),
      description: t(
        'Kết nối CRM với các hệ thống hiện có: Website, POS, Accounting, Ads platforms. Đồng bộ dữ liệu real-time.',
        'Connect CRM with existing systems: Website, POS, Accounting, Ads platforms. Real-time data sync.'
      ),
      features: [
        t('REST API đầy đủ', 'Full REST API'),
        t('Webhook & Events', 'Webhook & Events'),
        t('Kết nối Google/Meta Ads', 'Google/Meta Ads connection'),
        t('Sync với Dashboard phân tích', 'Sync with Analytics Dashboard')
      ]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('Automation đa kênh', 'Multi-channel Automation'),
      description: t(
        'Tự động chăm sóc khách hàng qua Email, ZNS (Zalo), SMS theo kịch bản. Nhắc lịch, chúc mừng sinh nhật, follow-up tự động.',
        'Automated customer care via Email, ZNS (Zalo), SMS based on scenarios. Reminders, birthday wishes, automatic follow-up.'
      ),
      features: [
        t('Email marketing automation', 'Email marketing automation'),
        t('ZNS Zalo integration', 'ZNS Zalo integration'),
        t('SMS campaigns', 'SMS campaigns'),
        t('Trigger-based workflows', 'Trigger-based workflows')
      ]
    }
  ]

  const cdpFeatures = [
    {
      icon: <Fingerprint className="w-6 h-6" />,
      title: t('Định danh khách hàng', 'Customer Identity'),
      description: t(
        'Nhận diện và hợp nhất profile khách hàng từ nhiều touchpoint: Website, App, Social, Offline.',
        'Identify and unify customer profiles from multiple touchpoints: Website, App, Social, Offline.'
      )
    },
    {
      icon: <MousePointerClick className="w-6 h-6" />,
      title: t('Đo lường hành vi', 'Behavior Tracking'),
      description: t(
        'Theo dõi mọi hành vi trên website: page views, clicks, scroll depth, time on page, form submissions.',
        'Track all website behaviors: page views, clicks, scroll depth, time on page, form submissions.'
      )
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: t('Phân tích & Segmentation', 'Analytics & Segmentation'),
      description: t(
        'Phân khúc khách hàng dựa trên hành vi, demographics, RFM. Tạo audience cho remarketing.',
        'Segment customers based on behavior, demographics, RFM. Create audiences for remarketing.'
      )
    },
    {
      icon: <Radio className="w-6 h-6" />,
      title: t('Real-time Personalization', 'Real-time Personalization'),
      description: t(
        'Cá nhân hóa trải nghiệm website theo từng khách hàng: content, offers, recommendations.',
        'Personalize website experience for each customer: content, offers, recommendations.'
      )
    }
  ]

  const cdpPackages = [
    {
      name: t('CDP Starter', 'CDP Starter'),
      price: t('Từ 15 triệu/tháng', 'From $600/month'),
      description: t('Phù hợp SME bắt đầu với CDP', 'Suitable for SMEs starting with CDP'),
      features: [
        t('Tracking cơ bản (5 events)', 'Basic tracking (5 events)'),
        t('1 website domain', '1 website domain'),
        t('Segment cơ bản', 'Basic segmentation'),
        t('Báo cáo hàng tuần', 'Weekly reports')
      ],
      highlight: false
    },
    {
      name: t('CDP Professional', 'CDP Professional'),
      price: t('Từ 35 triệu/tháng', 'From $1,400/month'),
      description: t('Cho doanh nghiệp cần phân tích sâu', 'For businesses needing deep analysis'),
      features: [
        t('Tracking nâng cao (20 events)', 'Advanced tracking (20 events)'),
        t('3 website domains', '3 website domains'),
        t('AI-powered segmentation', 'AI-powered segmentation'),
        t('Real-time dashboard', 'Real-time dashboard'),
        t('Integration với CRM', 'CRM integration')
      ],
      highlight: true
    },
    {
      name: t('CDP Enterprise', 'CDP Enterprise'),
      price: t('Liên hệ', 'Contact us'),
      description: t('Giải pháp toàn diện cho enterprise', 'Comprehensive solution for enterprise'),
      features: [
        t('Unlimited tracking events', 'Unlimited tracking events'),
        t('Unlimited domains', 'Unlimited domains'),
        t('Predictive analytics', 'Predictive analytics'),
        t('Custom ML models', 'Custom ML models'),
        t('Dedicated support', 'Dedicated support'),
        t('On-premise option', 'On-premise option')
      ],
      highlight: false
    }
  ]

  const integrationFlow = [
    {
      title: t('Website', 'Website'),
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-[#1e6dda]'
    },
    {
      title: t('CDP', 'CDP'),
      icon: <BrainCircuit className="w-5 h-5" />,
      color: 'bg-[#1e6dda]'
    },
    {
      title: t('CRM', 'CRM'),
      icon: <Users className="w-5 h-5" />,
      color: 'bg-[#1e6dda]'
    },
    {
      title: t('Dashboard', 'Dashboard'),
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-[#1e6dda]'
    }
  ]

  return (
    <div className="theme-apple">
      <MainNav />
      <main>
{/* Hero: khối trắng, căn giữa, bảng điều khiển CRM làm ảnh sản phẩm */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <p className="text-sm uppercase tracking-[-0.016em] text-[#515154]">{t('Quản trị & thấu hiểu khách hàng', 'Manage & understand customers')}</p>
              <h1 className="ap-hero-title">CRM &amp; CDP</h1>
              <p className="ap-lead max-w-[780px]">
                {t(
                  'Nhận ra khách từ lần ghé đầu tiên, chăm sóc đến khi ký hợp đồng.',
                  'Recognize customers from their first visit and serve them through to the contract.'
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">{t('Tư vấn triển khai', 'Get Consultation')}</Link>
                <Link href="#journey" className="ap-btn ap-btn-ghost">{t('Xem hành trình khách hàng', 'See the customer journey')}</Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { v: '50+', l: t('Dự án CRM', 'CRM Projects') },
                { v: '3x', l: t('Tăng retention', 'Retention increase') },
                { v: '40%', l: t('Tiết kiệm chi phí', 'Cost savings') },
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
                <div className="mx-4 flex-1 text-center">
                  <span className="rounded-md bg-white px-3 py-1 text-xs text-[#515154]">crm.clickstar.vn/dashboard</span>
                </div>
              </div>
              <div className="bg-[#f5f5f7] p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#1d1d1f]">{t('Tổng quan khách hàng', 'Customer Overview')}</div>
                    <div className="text-sm text-[#515154]">{t('Cập nhật real-time', 'Real-time update')}</div>
                  </div>
                  <span className="rounded-full bg-[#1e6dda] px-3 py-1 text-xs font-medium text-white">Real-time</span>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: t('Tổng KH', 'Total'), value: '2,456' },
                    { label: t('Mới tháng này', 'New this month'), value: '+124' },
                    { label: t('Hot leads', 'Hot leads'), value: '45' },
                    { label: t('Chờ chăm sóc', 'Need care'), value: '18' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-[12px] border border-[#e0e0e0] bg-white p-3.5">
                      <div className="text-2xl font-semibold tabular-nums text-[#1859b8]">{stat.value}</div>
                      <div className="text-sm text-[#515154]">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-4">
                  <div className="mb-3 text-sm font-semibold text-[#1d1d1f]">{t('Pipeline bán hàng', 'Sales Pipeline')}</div>
                  <div className="flex gap-1.5">
                    {[
                      { label: 'Lead', count: 45, w: 'w-1/3', c: 'bg-[#515154]' },
                      { label: 'Contact', count: 32, w: 'w-1/4', c: 'bg-[#1e6dda]' },
                      { label: 'Demo', count: 18, w: 'w-[16%]', c: 'bg-[#1e6dda]' },
                      { label: 'Proposal', count: 12, w: 'w-[14%]', c: 'bg-[#1e6dda]' },
                      { label: 'Won', count: 8, w: 'w-[11%]', c: 'bg-[#1859b8]' },
                    ].map((st) => (
                      <div key={st.label} className={`${st.w} ${st.c} rounded-md px-1 py-2 text-center`}>
                        <div className="text-xs font-semibold text-white">{st.count}</div>
                        <div className="hidden text-[10px] text-white sm:block">{st.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CrmVsCdpSection />
        <JourneySection />
        <StorySection />
        <UnifiedSection />

        {/* CDP: khối tối */}
        <section id="cdp" className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#d2d2d7]">
                <BrainCircuit className="h-4 w-4" />
                CDP - CUSTOMER DATA PLATFORM
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-white sm:text-4xl lg:text-5xl">
                {t('Thấu hiểu khách hàng', 'Understand Customers')}{' '}
                <span className="text-[#7db8ff]">{t('ở mức sâu nhất', 'at the deepest level')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#d2d2d7]">
                {t(
                  'CDP giúp định danh, đo lường hành vi và phân tích khách hàng trên không gian số. Tối ưu hoá trải nghiệm cá nhân hoá.',
                  'CDP helps identify, measure behavior and analyze customers in digital space. Optimize personalized experiences.'
                )}
              </p>
            </div>

            <div className="mb-10 grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
              {cdpFeatures.map((feature, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda] [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug text-white">{feature.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#d2d2d7]">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mb-10 rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6 sm:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {t('Lưu ý về chi phí triển khai CDP', 'Note on CDP Implementation Costs')}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-[#d2d2d7]">
                    {t(
                      'CDP là một scope rất lớn của doanh nghiệp, đòi hỏi đầu tư về công nghệ và nhân sự. Chi phí triển khai cao nên doanh nghiệp cần cân nhắc kỹ. ClickStar đề xuất các gói nhỏ để khách hàng có thể bắt đầu và tối ưu dần.',
                      'CDP is a very large scope for businesses, requiring investment in technology and personnel. High implementation costs require careful consideration. ClickStar offers small packages for customers to start and optimize gradually.'
                    )}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      t('Triển khai từng phase', 'Phased implementation'),
                      t('Bắt đầu với gói nhỏ', 'Start with small package'),
                      t('ROI rõ ràng từng bước', 'Clear ROI at each step'),
                    ].map((x) => (
                      <span key={x} className="inline-flex items-center gap-2 text-[15px] text-white">
                        <CheckCircle2 className="h-4 w-4 text-[#7db8ff]" />
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid auto-rows-fr gap-6 md:grid-cols-3">
              {cdpPackages.map((pkg, index) => (
                <div
                  key={index}
                  className={`flex h-full flex-col rounded-[18px] p-7 ${pkg.highlight ? 'border border-white bg-white' : 'border border-white/20 bg-[#1d1d1f]'}`}
                >
                  <h3 className={`text-xl font-semibold ${pkg.highlight ? 'text-[#1d1d1f]' : 'text-white'}`}>{pkg.name}</h3>
                  <div className={`mt-2 text-2xl font-semibold tracking-tight ${pkg.highlight ? 'text-[#1a5cc0]' : 'text-white'}`}>{pkg.price}</div>
                  <p className={`mt-1 text-[15px] ${pkg.highlight ? 'text-[#4a4a4f]' : 'text-[#d2d2d7]'}`}>{pkg.description}</p>
                  <div className={`my-5 h-px w-full ${pkg.highlight ? 'bg-[#e0e0e0]' : 'bg-white/20'}`} />
                  <ul className="mb-8 space-y-3">
                    {pkg.features.map((f, i) => (
                      <li key={i} className={`flex items-center gap-3 text-[15px] ${pkg.highlight ? 'text-[#1d1d1f]' : 'text-white'}`}>
                        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${pkg.highlight ? 'bg-[#eaf2fd]' : 'bg-[#1e6dda]'}`}>
                          <CheckCircle2 className={`h-3.5 w-3.5 ${pkg.highlight ? 'text-[#1a5cc0]' : 'text-white'}`} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-base font-medium transition-transform active:scale-95 ${pkg.highlight ? 'bg-[#1e6dda] text-white' : 'border border-white/50 text-white'}`}
                  >
                    {t('Tư vấn ngay', 'Get Consultation')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CRM: khối trắng */}
        <section id="crm" className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#515154]">
                <Users className="h-4 w-4" />
                CRM - CUSTOMER RELATIONSHIP MANAGEMENT
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Quản trị quan hệ', 'Customer Relationship')}{' '}
                <span className="text-[#1859b8]">{t('Khách hàng', 'Management')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#515154]">
                {t(
                  'Triển khai hệ thống CRM hoàn chỉnh, tuỳ biến theo quy trình kinh doanh, đi vào vận hành ngay.',
                  'Deploy a complete CRM system, customized to business processes, ready for operation.'
                )}
              </p>
            </div>

            <div className="mb-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <CustomerProfileIllustration className="h-auto w-full" />
              </div>
              <div>
                <h3 className="mb-6 text-2xl font-semibold leading-snug text-[#1d1d1f]">
                  {t('Vấn đề & Giải pháp CRM', 'CRM Problems & Solutions')}
                </h3>
                <div className="space-y-4">
                  {crmProblems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-[18px] border border-[#d2d2d7] bg-white p-5">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#eaf2fd] text-[#1859b8]">
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

            <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:gap-8">
              {crmFeatures.map((feature, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7 sm:p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#1e6dda] [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold leading-snug text-[#1d1d1f]">{feature.title}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-[#515154]">{feature.description}</p>
                  <div className="my-5 h-px w-full bg-[#e0e0e0]" />
                  <ul className="space-y-3">
                    {feature.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf2fd]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1859b8]" />
                        </span>
                        <span className="text-base text-[#1d1d1f]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FollowFlowSection />

        {/* Kênh chăm sóc tự động: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl">
                {t('Kênh chăm sóc tự động', 'Automated Care Channels')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[#515154]">
                {t(
                  'Tích hợp đa kênh để chăm sóc khách hàng 24/7 theo kịch bản đã thiết lập',
                  'Multi-channel integration for 24/7 customer care based on preset scenarios'
                )}
              </p>
            </div>
            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Mail />, title: 'Email Marketing', desc: t('Drip campaigns, newsletters', 'Drip campaigns, newsletters') },
                { icon: <MessageSquare />, title: 'Zalo ZNS', desc: t('Thông báo giao dịch', 'Transaction notifications') },
                { icon: <Smartphone />, title: 'SMS Brandname', desc: t('OTP, promotions', 'OTP, promotions') },
                { icon: <Globe />, title: 'Web Push', desc: t('Thông báo real-time', 'Real-time notifications') },
              ].map((channel, i) => (
                <div key={i} className="flex h-full flex-col items-center rounded-[18px] border border-[#d2d2d7] bg-white p-7 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#1e6dda] [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-white">
                    {channel.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#1d1d1f]">{channel.title}</h3>
                  <p className="mt-1 text-[15px] text-[#515154]">{channel.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tích hợp: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#515154]">
                <Workflow className="h-4 w-4" />
                {t('TÍCH HỢP TOÀN DIỆN', 'COMPREHENSIVE INTEGRATION')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Đồng bộ dữ liệu', 'Synchronize Data')}{' '}
                <span className="text-[#1859b8]">{t('CRM - CDP - Website', 'CRM - CDP - Website')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-[#515154]">
                {t(
                  'Kết nối xuyên suốt từ website đến CRM, CDP và dashboard phân tích. Dữ liệu thống nhất, real-time.',
                  'Seamless connection from website to CRM, CDP and analytics dashboard. Unified, real-time data.'
                )}
              </p>
            </div>

            <div className="mb-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {integrationFlow.map((item, index) => (
                <div key={index} className="flex items-center gap-4 sm:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#1e6dda] [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-white">
                      {item.icon}
                    </div>
                    <span className="mt-2 text-sm font-medium text-[#1d1d1f]">{item.title}</span>
                  </div>
                  {index < integrationFlow.length - 1 && <ArrowRight className="h-6 w-6 text-[#1859b8]" />}
                </div>
              ))}
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-3 lg:gap-6">
              {[
                {
                  icon: <Activity />,
                  title: t('Single Customer View', 'Single Customer View'),
                  description: t('Một profile duy nhất cho mỗi khách hàng, tổng hợp từ tất cả các nguồn', 'One unique profile for each customer, aggregated from all sources'),
                },
                {
                  icon: <Target />,
                  title: t('Data-driven Marketing', 'Data-driven Marketing'),
                  description: t('Ra quyết định marketing dựa trên dữ liệu hành vi và phân tích', 'Make marketing decisions based on behavioral data and analysis'),
                },
                {
                  icon: <TrendingUp />,
                  title: t('Tối ưu Conversion', 'Optimize Conversion'),
                  description: t('Cá nhân hoá trải nghiệm website để tăng tỷ lệ chuyển đổi', 'Personalize website experience to increase conversion rate'),
                },
              ].map((benefit, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eaf2fd] [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-[#1859b8]">
                    {benefit.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#1d1d1f]">{benefit.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kết hợp Website UX/UI: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-sm tracking-[-0.016em] text-[#515154]">
                  <Sparkles className="h-4 w-4" />
                  {t('KẾT HỢP WEBSITE UX/UI', 'WEBSITE UX/UI INTEGRATION')}
                </span>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl">
                  {t('Thiết kế Website', 'Website Design')}{' '}
                  <span className="text-[#1859b8]">{t('tối ưu cho CDP', 'optimized for CDP')}</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[#515154]">
                  {t(
                    'Website được thiết kế với tracking events sẵn sàng, tối ưu cho việc thu thập dữ liệu hành vi và tích hợp CDP.',
                    'Website designed with tracking events ready, optimized for behavioral data collection and CDP integration.'
                  )}
                </p>
                <ul className="mt-6 space-y-3.5">
                  {[
                    t('Tracking events cài đặt sẵn', 'Pre-installed tracking events'),
                    t('Page views, scroll, click tracking', 'Page views, scroll, click tracking'),
                    t('Form submission tracking', 'Form submission tracking'),
                    t('E-commerce events (add to cart, purchase)', 'E-commerce events (add to cart, purchase)'),
                    t('Custom events theo yêu cầu', 'Custom events on request'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1e6dda]">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </span>
                      <span className="text-base text-[#1d1d1f]">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/services/website" className="ap-link inline-flex items-center gap-2 font-semibold">
                    {t('Xem dịch vụ thiết kế Website', 'View Website Design service')}
                  </Link>
                </div>
              </div>
              <div className="rounded-[18px] border border-[#d2d2d7] bg-white p-6 shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0]">
                <div className="mb-4 text-sm font-semibold text-[#1d1d1f]">{t('Tracking Events Demo', 'Tracking Events Demo')}</div>
                <div className="space-y-3">
                  {[
                    { event: 'page_view', data: '{ page: "/products" }', time: '2ms ago' },
                    { event: 'scroll_depth', data: '{ depth: 75 }', time: '5ms ago' },
                    { event: 'button_click', data: '{ id: "add-to-cart" }', time: '8ms ago' },
                    { event: 'form_submit', data: '{ form: "contact" }', time: '12ms ago' },
                    { event: 'purchase', data: '{ value: 2500000 }', time: '15ms ago' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-[10px] bg-[#f5f5f7] p-3 font-mono text-xs">
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[#1e6dda]" />
                      <span className="font-semibold text-[#1859b8]">{log.event}</span>
                      <span className="flex-1 truncate text-[#515154]">{log.data}</span>
                      <span className="flex-shrink-0 text-[#515154]">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="ap-tile ap-dark">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display max-w-[820px]">{t('Sẵn sàng triển khai CRM & CDP?', 'Ready to deploy CRM & CDP?')}</h2>
              <p className="ap-lead max-w-[680px]">
                {t(
                  'Liên hệ ngay để được tư vấn giải pháp phù hợp với doanh nghiệp của bạn.',
                  'Contact now for consultation on solutions suitable for your business.'
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">{t('Đặt lịch tư vấn miễn phí', 'Book Free Consultation')}</Link>
                <Link href="/projects" className="ap-btn ap-btn-ghost">{t('Xem case studies', 'View Case Studies')}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
