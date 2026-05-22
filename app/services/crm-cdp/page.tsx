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
      color: 'bg-blue-500'
    },
    {
      title: t('CDP', 'CDP'),
      icon: <BrainCircuit className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      title: t('CRM', 'CRM'),
      icon: <Users className="w-5 h-5" />,
      color: 'bg-emerald-500'
    },
    {
      title: t('Dashboard', 'Dashboard'),
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-orange-500'
    }
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
          
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-6 shadow-lg shadow-primary/25">
                <Users className="w-4 h-4" />
                CRM & CDP
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                {t('Quản trị & Thấu hiểu', 'Manage & Understand')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                  {t('Khách hàng', 'Customers')}
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t(
                  'Triển khai CRM để quản lý khách hàng hiệu quả, kết hợp CDP để thấu hiểu hành vi và tối ưu trải nghiệm. Đồng bộ dữ liệu xuyên suốt từ marketing đến sales và chăm sóc.',
                  'Deploy CRM for effective customer management, combined with CDP to understand behavior and optimize experience. Synchronize data throughout from marketing to sales and care.'
                )}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-foreground">50+</div>
                  <div className="text-sm text-muted-foreground">{t('Dự án CRM', 'CRM Projects')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">3x</div>
                  <div className="text-sm text-muted-foreground">{t('Tăng retention', 'Retention increase')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">40%</div>
                  <div className="text-sm text-muted-foreground">{t('Tiết kiệm chi phí', 'Cost savings')}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {t('Tư vấn triển khai', 'Get Consultation')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="#crm"
                  className="inline-flex items-center gap-2 bg-white text-foreground font-semibold px-6 py-3 rounded-full border border-border hover:border-primary hover:text-primary transition-all"
                >
                  {t('Tìm hiểu CRM', 'Learn about CRM')}
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              {/* CRM Dashboard Preview */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-muted-foreground">
                      crm.clickstar.vn/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-semibold text-foreground">{t('Tổng quan khách hàng', 'Customer Overview')}</div>
                      <div className="text-xs text-muted-foreground">{t('Cập nhật real-time', 'Real-time update')}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: t('Tổng KH', 'Total'), value: '2,456', color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: t('Mới tháng này', 'New this month'), value: '+124', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: t('Hot leads', 'Hot leads'), value: '45', color: 'text-orange-600', bg: 'bg-orange-50' },
                      { label: t('Chờ chăm sóc', 'Need care'), value: '18', color: 'text-purple-600', bg: 'bg-purple-50' }
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.bg} rounded-lg p-3`}>
                        <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Pipeline */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">{t('Pipeline bán hàng', 'Sales Pipeline')}</div>
                    <div className="flex gap-1">
                      {[
                        { label: 'Lead', count: 45, width: 'w-1/4', color: 'bg-slate-300' },
                        { label: 'Contact', count: 32, width: 'w-1/5', color: 'bg-blue-400' },
                        { label: 'Demo', count: 18, width: 'w-[15%]', color: 'bg-purple-400' },
                        { label: 'Proposal', count: 12, width: 'w-[12%]', color: 'bg-orange-400' },
                        { label: 'Won', count: 8, width: 'w-[10%]', color: 'bg-emerald-500' }
                      ].map((stage, i) => (
                        <div key={i} className={`${stage.width} ${stage.color} rounded-md p-2 text-center`}>
                          <div className="text-xs font-bold text-white">{stage.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                {t('Automation', 'Automation')}
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {t('Real-time Sync', 'Real-time Sync')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRM Section */}
      <section id="crm" className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
              <Users className="w-4 h-4" />
              CRM - CUSTOMER RELATIONSHIP MANAGEMENT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              {t('Quản trị quan hệ', 'Customer Relationship')}{' '}
              <span className="text-emerald-600">{t('Khách hàng', 'Management')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t(
                'Triển khai hệ thống CRM hoàn chỉnh, tuỳ biến theo quy trình kinh doanh, đi vào vận hành ngay.',
                'Deploy a complete CRM system, customized to business processes, ready for operation.'
              )}
            </p>
          </div>

          {/* Problems & Solutions */}
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
            {/* SVG Illustration */}
            <div className="relative">
              <svg viewBox="0 0 500 400" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background */}
                <circle cx="250" cy="200" r="180" fill="#ECFDF5" opacity="0.5"/>
                <circle cx="250" cy="200" r="120" fill="#D1FAE5" opacity="0.5"/>
                
                {/* Central CRM hub */}
                <circle cx="250" cy="200" r="60" fill="white" stroke="#10B981" strokeWidth="3"/>
                <text x="250" y="195" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="bold">CRM</text>
                <text x="250" y="212" textAnchor="middle" fill="#6B7280" fontSize="10">Central Hub</text>
                
                {/* Connected nodes */}
                <g>
                  <circle cx="120" cy="120" r="35" fill="white" stroke="#3B82F6" strokeWidth="2"/>
                  <text x="120" y="115" textAnchor="middle" fill="#3B82F6" fontSize="20">📧</text>
                  <text x="120" y="135" textAnchor="middle" fill="#6B7280" fontSize="8">Email</text>
                  <line x1="155" y1="155" x2="200" y2="160" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4"/>
                </g>
                
                <g>
                  <circle cx="380" cy="120" r="35" fill="white" stroke="#8B5CF6" strokeWidth="2"/>
                  <text x="380" y="115" textAnchor="middle" fill="#8B5CF6" fontSize="20">📱</text>
                  <text x="380" y="135" textAnchor="middle" fill="#6B7280" fontSize="8">SMS/ZNS</text>
                  <line x1="345" y1="155" x2="300" y2="160" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4"/>
                </g>
                
                <g>
                  <circle cx="100" cy="280" r="35" fill="white" stroke="#F59E0B" strokeWidth="2"/>
                  <text x="100" y="275" textAnchor="middle" fill="#F59E0B" fontSize="20">📊</text>
                  <text x="100" y="295" textAnchor="middle" fill="#6B7280" fontSize="8">Analytics</text>
                  <line x1="135" y1="260" x2="195" y2="230" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4"/>
                </g>
                
                <g>
                  <circle cx="400" cy="280" r="35" fill="white" stroke="#EF4444" strokeWidth="2"/>
                  <text x="400" y="275" textAnchor="middle" fill="#EF4444" fontSize="20">🎯</text>
                  <text x="400" y="295" textAnchor="middle" fill="#6B7280" fontSize="8">Ads</text>
                  <line x1="365" y1="260" x2="305" y2="230" stroke="#EF4444" strokeWidth="2" strokeDasharray="4"/>
                </g>
                
                <g>
                  <circle cx="250" cy="350" r="35" fill="white" stroke="#06B6D4" strokeWidth="2"/>
                  <text x="250" y="345" textAnchor="middle" fill="#06B6D4" fontSize="20">🌐</text>
                  <text x="250" y="365" textAnchor="middle" fill="#6B7280" fontSize="8">Website</text>
                  <line x1="250" y1="315" x2="250" y2="265" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4"/>
                </g>
                
                {/* Decorative elements */}
                <circle cx="180" cy="80" r="5" fill="#10B981" opacity="0.5"/>
                <circle cx="320" cy="80" r="4" fill="#8B5CF6" opacity="0.5"/>
                <circle cx="450" cy="200" r="6" fill="#F59E0B" opacity="0.5"/>
                <circle cx="50" cy="200" r="5" fill="#3B82F6" opacity="0.5"/>
              </svg>
            </div>

            {/* Problems list */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {t('Vấn đề & Giải pháp CRM', 'CRM Problems & Solutions')}
              </h3>
              <div className="space-y-4">
                {crmProblems.map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-xl p-4 border border-border hover:border-emerald-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="w-4 h-4 text-rose-500" />
                          <p className="text-foreground font-medium text-sm line-through decoration-rose-300">{item.problem}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <p className="text-muted-foreground text-sm">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CRM Features */}
          <div className="grid md:grid-cols-2 gap-6">
            {crmFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-xl hover:border-emerald-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Channels */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {t('Kênh chăm sóc tự động', 'Automated Care Channels')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Tích hợp đa kênh để chăm sóc khách hàng 24/7 theo kịch bản đã thiết lập',
                'Multi-channel integration for 24/7 customer care based on preset scenarios'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Mail className="w-8 h-8" />, title: 'Email Marketing', desc: t('Drip campaigns, newsletters', 'Drip campaigns, newsletters'), color: 'bg-blue-500' },
              { icon: <MessageSquare className="w-8 h-8" />, title: 'Zalo ZNS', desc: t('Thông báo giao dịch', 'Transaction notifications'), color: 'bg-blue-600' },
              { icon: <Smartphone className="w-8 h-8" />, title: 'SMS Brandname', desc: t('OTP, promotions', 'OTP, promotions'), color: 'bg-purple-500' },
              { icon: <Globe className="w-8 h-8" />, title: 'Web Push', desc: t('Thông báo real-time', 'Real-time notifications'), color: 'bg-orange-500' }
            ].map((channel, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center border border-border hover:shadow-lg transition-all group">
                <div className={`w-16 h-16 ${channel.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {channel.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1">{channel.title}</h3>
                <p className="text-sm text-muted-foreground">{channel.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CDP Section */}
      <section id="cdp" className="py-12 lg:py-16 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
              <BrainCircuit className="w-4 h-4" />
              CDP - CUSTOMER DATA PLATFORM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              {t('Thấu hiểu khách hàng', 'Understand Customers')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {t('ở mức sâu nhất', 'at the deepest level')}
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              {t(
                'CDP giúp định danh, đo lường hành vi và phân tích khách hàng trên không gian số. Tối ưu hoá trải nghiệm cá nhân hoá.',
                'CDP helps identify, measure behavior and analyze customers in digital space. Optimize personalized experiences.'
              )}
            </p>
          </div>

          {/* CDP Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {cdpFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CDP Warning */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('Lưu ý về chi phí triển khai CDP', 'Note on CDP Implementation Costs')}
                </h3>
                <p className="text-white/70 mb-4">
                  {t(
                    'CDP là một scope rất lớn của doanh nghiệp, đòi hỏi đầu tư về công nghệ và nhân sự. Chi phí triển khai cao nên doanh nghiệp cần cân nhắc kỹ. ClickStar đề xuất các gói nhỏ để khách hàng có thể bắt đầu và tối ưu dần.',
                    'CDP is a very large scope for businesses, requiring investment in technology and personnel. High implementation costs require careful consideration. ClickStar offers small packages for customers to start and optimize gradually.'
                  )}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 text-sm text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('Triển khai từng phase', 'Phased implementation')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('Bắt đầu với gói nhỏ', 'Start with small package')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('ROI rõ ràng từng bước', 'Clear ROI at each step')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CDP Packages */}
          <div className="grid md:grid-cols-3 gap-6">
            {cdpPackages.map((pkg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 ${pkg.highlight ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-0' : 'bg-white/5 border border-white/10'}`}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <div className="text-2xl font-extrabold text-white mt-2">{pkg.price}</div>
                  <p className="text-white/60 text-sm mt-1">{pkg.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${pkg.highlight ? 'bg-white text-purple-600 hover:bg-white/90' : 'bg-transparent border border-white/30 text-white hover:bg-white/10'}`}
                >
                  {t('Tư vấn ngay', 'Get Consultation')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Flow */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
              <Workflow className="w-4 h-4" />
              {t('TÍCH HỢP TOÀN DIỆN', 'COMPREHENSIVE INTEGRATION')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('Đồng bộ dữ liệu', 'Synchronize Data')}{' '}
              <span className="text-primary">{t('CRM - CDP - Website', 'CRM - CDP - Website')}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Kết nối xuyên suốt từ website đến CRM, CDP và dashboard phân tích. Dữ liệu thống nhất, real-time.',
                'Seamless connection from website to CRM, CDP and analytics dashboard. Unified, real-time data.'
              )}
            </p>
          </div>

          {/* Flow diagram */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            {integrationFlow.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground mt-2">{item.title}</span>
                </div>
                {index < integrationFlow.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Activity className="w-6 h-6" />,
                title: t('Single Customer View', 'Single Customer View'),
                description: t('Một profile duy nhất cho mỗi khách hàng, tổng hợp từ tất cả các nguồn', 'One unique profile for each customer, aggregated from all sources')
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: t('Data-driven Marketing', 'Data-driven Marketing'),
                description: t('Ra quyết định marketing dựa trên dữ liệu hành vi và phân tích', 'Make marketing decisions based on behavioral data and analysis')
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: t('Tối ưu Conversion', 'Optimize Conversion'),
                description: t('Cá nhân hoá trải nghiệm website để tăng tỷ lệ chuyển đổi', 'Personalize website experience to increase conversion rate')
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UX/UI Website Connection */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold text-sm px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                {t('KẾT HỢP WEBSITE UX/UI', 'WEBSITE UX/UI INTEGRATION')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t('Thiết kế Website', 'Website Design')}{' '}
                <span className="text-blue-600">{t('tối ưu cho CDP', 'optimized for CDP')}</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                {t(
                  'Website được thiết kế với tracking events sẵn sàng, tối ưu cho việc thu thập dữ liệu hành vi và tích hợp CDP.',
                  'Website designed with tracking events ready, optimized for behavioral data collection and CDP integration.'
                )}
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  t('Tracking events cài đặt sẵn', 'Pre-installed tracking events'),
                  t('Page views, scroll, click tracking', 'Page views, scroll, click tracking'),
                  t('Form submission tracking', 'Form submission tracking'),
                  t('E-commerce events (add to cart, purchase)', 'E-commerce events (add to cart, purchase)'),
                  t('Custom events theo yêu cầu', 'Custom events on request')
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/services/website"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
              >
                {t('Xem dịch vụ thiết kế Website', 'View Website Design service')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-border p-6">
              <div className="text-sm font-medium text-muted-foreground mb-4">{t('Tracking Events Demo', 'Tracking Events Demo')}</div>
              <div className="space-y-3">
                {[
                  { event: 'page_view', data: '{ page: "/products" }', time: '2ms ago' },
                  { event: 'scroll_depth', data: '{ depth: 75 }', time: '5ms ago' },
                  { event: 'button_click', data: '{ id: "add-to-cart" }', time: '8ms ago' },
                  { event: 'form_submit', data: '{ form: "contact" }', time: '12ms ago' },
                  { event: 'purchase', data: '{ value: 2500000 }', time: '15ms ago' }
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 font-mono text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-purple-600 font-semibold">{log.event}</span>
                    <span className="text-muted-foreground flex-1 truncate">{log.data}</span>
                    <span className="text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-12 lg:py-16 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t('Sẵn sàng triển khai CRM & CDP?', 'Ready to deploy CRM & CDP?')}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            {t(
              'Liên hệ ngay để được tư vấn giải pháp phù hợp với doanh nghiệp của bạn.',
              'Contact now for consultation on solutions suitable for your business.'
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90 font-semibold">
              {t('Đặt lịch tư vấn miễn phí', 'Book Free Consultation')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white">
              {t('Xem case studies', 'View Case Studies')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  )
}
