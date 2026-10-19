"use client"

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { ServiceAnswer, ServiceReadMore } from '@/components/seo/service-answer'
import { Footer } from '@/components/layout/footer'
import Link from '@/components/app-link'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Database,
  Shield,
  Zap,
  Brain,
  Target,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowUpRight,
  Layers,
  LineChart,
  Activity,
  Eye,
  Lock,
  RefreshCw,
  Sparkles,
  Bot,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  Play,
  Globe,
  Smartphone
} from 'lucide-react'
import { DashboardPreviewIllustration } from '@/components/illustrations/ai-service-illustrations'

export default function DashboardServicePage() {
  const { language } = useLanguage()
  
  const t = (vi: string, en: string) => language === 'vi' ? vi : en

  // Problems data
  const problems = [
    {
      icon: <Database className="w-5 h-5" />,
      problem: t('Dữ liệu nằm rải rác trên nhiều nền tảng khác nhau', 'Data scattered across multiple platforms'),
      solution: t('Tích hợp tất cả nguồn dữ liệu vào một dashboard duy nhất', 'Integrate all data sources into a single dashboard')
    },
    {
      icon: <Clock className="w-5 h-5" />,
      problem: t('Mất hàng giờ để tổng hợp báo cáo thủ công', 'Spending hours compiling manual reports'),
      solution: t('Báo cáo tự động real-time, tiết kiệm 90% thời gian', 'Automated real-time reports, save 90% time')
    },
    {
      icon: <Target className="w-5 h-5" />,
      problem: t('Không biết chiến dịch nào đang hiệu quả', 'Not knowing which campaigns are effective'),
      solution: t('Phân tích ROI theo từng kênh, từng chiến dịch chi tiết', 'ROI analysis by channel, detailed campaign breakdown')
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      problem: t('Ra quyết định dựa trên cảm tính, không có dữ liệu', 'Making decisions based on gut feeling, not data'),
      solution: t('AI phân tích và đề xuất chiến lược dựa trên data', 'AI analyzes and recommends data-driven strategies')
    }
  ]

  // Dashboard templates
  const dashboardTemplates = [
    {
      title: t('Dashboard Quảng cáo', 'Advertising Dashboard'),
      description: t('Theo dõi hiệu quả quảng cáo đa nền tảng: Google, Meta, TikTok, Zalo', 'Track multi-platform ad performance: Google, Meta, TikTok, Zalo'),
      color: 'from-[#1e6dda] to-[#1e6dda]',
      bgColor: 'bg-[#eaf2fd]',
      metrics: [
        { label: 'ROAS', value: '4.2x' },
        { label: 'CPA', value: '-35%' },
        { label: 'CTR', value: '+28%' }
      ],
      features: [
        t('Chi phí & ngân sách real-time', 'Real-time cost & budget'),
        t('So sánh hiệu quả các kênh', 'Cross-channel comparison'),
        t('Phân tích từ khóa & đối tượng', 'Keyword & audience analysis'),
        t('Cảnh báo bất thường', 'Anomaly alerts')
      ],
      platforms: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Zalo Ads']
    },
    {
      title: t('Dashboard CRM & Sales', 'CRM & Sales Dashboard'),
      description: t('Quản lý pipeline bán hàng, theo dõi khách hàng từ lead đến chốt deal', 'Manage sales pipeline, track customers from lead to closed deal'),
      color: 'from-[#1e6dda] to-[#1e6dda]',
      bgColor: 'bg-[#f5f5f7]',
      metrics: [
        { label: t('Tỷ lệ chốt', 'Close Rate'), value: '+45%' },
        { label: t('Thời gian', 'Cycle Time'), value: '-30%' },
        { label: 'LTV', value: '+60%' }
      ],
      features: [
        t('Pipeline trực quan', 'Visual pipeline'),
        t('Dự báo doanh thu', 'Revenue forecasting'),
        t('Phân tích nguồn lead', 'Lead source analysis'),
        t('Theo dõi KPI nhân viên', 'Employee KPI tracking')
      ],
      platforms: ['HubSpot', 'Salesforce', 'Zoho', 'Custom CRM']
    },
    {
      title: t('Dashboard GA4 & Website', 'GA4 & Website Dashboard'),
      description: t('Phân tích hành vi người dùng, tối ưu conversion funnel', 'Analyze user behavior, optimize conversion funnel'),
      color: 'from-[#1e6dda] to-[#1e6dda]',
      bgColor: 'bg-[#f5f5f7]',
      metrics: [
        { label: t('Conversion', 'Conversion'), value: '+52%' },
        { label: t('Bounce', 'Bounce'), value: '-40%' },
        { label: t('Session', 'Session'), value: '+85%' }
      ],
      features: [
        t('User journey mapping', 'User journey mapping'),
        t('Funnel conversion analysis', 'Funnel conversion analysis'),
        t('Heatmap & scroll depth', 'Heatmap & scroll depth'),
        t('A/B testing results', 'A/B testing results')
      ],
      platforms: ['Google Analytics 4', 'Hotjar', 'Mixpanel', 'Amplitude']
    }
  ]

  // AI Features
  const aiFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: t('Phân tích dự đoán', 'Predictive Analytics'),
      description: t('AI dự đoán xu hướng doanh thu, hành vi khách hàng dựa trên dữ liệu lịch sử', 'AI predicts revenue trends, customer behavior based on historical data')
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('Chat với dữ liệu', 'Chat with Data'),
      description: t('Hỏi đáp bằng ngôn ngữ tự nhiên: "Chiến dịch nào có ROI cao nhất tháng này?"', 'Natural language Q&A: "Which campaign has the highest ROI this month?"')
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t('Đề xuất thông minh', 'Smart Recommendations'),
      description: t('AI tự động đề xuất tối ưu ngân sách, điều chỉnh chiến dịch', 'AI automatically suggests budget optimization, campaign adjustments')
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: t('Phát hiện bất thường', 'Anomaly Detection'),
      description: t('Cảnh báo ngay khi có biến động bất thường về chi phí, hiệu quả', 'Alert immediately when abnormal fluctuations in cost, performance')
    }
  ]

  // Security features
  const securityFeatures = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: t('Mã hóa end-to-end', 'End-to-end Encryption'),
      description: t('Dữ liệu được mã hóa AES-256', 'AES-256 encrypted data')
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: t('Phân quyền chi tiết', 'Granular Permissions'),
      description: t('Kiểm soát ai xem được gì', 'Control who sees what')
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: t('Backup tự động', 'Auto Backup'),
      description: t('Sao lưu dữ liệu hàng ngày', 'Daily data backup')
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: t('Audit log', 'Audit Log'),
      description: t('Theo dõi mọi thao tác', 'Track all activities')
    }
  ]

  // Process steps
  const processSteps = [
    {
      step: '01',
      title: t('Khảo sát & phân tích', 'Discovery & Analysis'),
      description: t('Đánh giá nguồn dữ liệu, xác định KPIs quan trọng, thiết kế data flow', 'Assess data sources, identify key KPIs, design data flow'),
      duration: t('1-2 tuần', '1-2 weeks')
    },
    {
      step: '02',
      title: t('Thiết kế Dashboard', 'Dashboard Design'),
      description: t('Wireframe, mockup giao diện, xác nhận với stakeholders', 'Wireframe, UI mockup, stakeholder approval'),
      duration: t('1 tuần', '1 week')
    },
    {
      step: '03',
      title: t('Tích hợp dữ liệu', 'Data Integration'),
      description: t('Kết nối APIs, ETL pipeline, đồng bộ dữ liệu real-time', 'Connect APIs, ETL pipeline, real-time data sync'),
      duration: t('2-3 tuần', '2-3 weeks')
    },
    {
      step: '04',
      title: t('Cài đặt AI', 'AI Setup'),
      description: t('Tích hợp Claude, điều chỉnh theo ngành nghề', 'Integrate Claude, tuned to your industry'),
      duration: t('1-2 tuần', '1-2 weeks')
    },
    {
      step: '05',
      title: t('Go-live & Training', 'Go-live & Training'),
      description: t('Deploy, đào tạo team sử dụng, hỗ trợ 24/7', 'Deploy, team training, 24/7 support'),
      duration: t('1 tuần', '1 week')
    }
  ]

  const CONTACT = '/contact?service=Dashboard%20d%E1%BB%AF%20li%E1%BB%87u'

  return (
    <div className="theme-apple">
      <MainNav />

      <main>
        {/* Hero: khối trắng, căn giữa, bảng điều khiển làm ảnh sản phẩm */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <p className="text-sm uppercase tracking-[-0.016em] text-[#515154]">{t('DASHBOARD DỮ LIỆU', 'DATA DASHBOARD')}</p>
              <h1 className="ap-hero-title">
                {t('Biến dữ liệu thành quyết định', 'Transform data into decisions')}
              </h1>
              <p className="ap-lead max-w-[760px]">
                {t('Toàn bộ hoạt động kinh doanh trên một màn hình.', 'Your whole business on one screen.')}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/projects" className="ap-btn ap-btn-primary">{t('Xem demo', 'View Demo')}</Link>
                <Link href={CONTACT} className="ap-btn ap-btn-ghost">{t('Đặt lịch tư vấn', 'Book Consultation')}</Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { v: '50+', l: t('Nguồn tích hợp', 'Integrations') },
                { v: 'Real-time', l: t('Cập nhật', 'Updates') },
                { v: 'AI', l: 'Claude' },
              ].map((x) => (
                <div key={x.l}>
                  <div className="text-[clamp(28px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f]">{x.v}</div>
                  <div className="mt-1 text-[15px] text-[#515154]">{x.l}</div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-14 max-w-[640px]">
              <DashboardPreviewIllustration t={t} />
            </div>
          </div>
        </section>

        <ServiceAnswer slug="dashboard" />

        {/* Tại sao cần dashboard: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                  <Target className="h-4 w-4" />
                  {t('TẠI SAO CẦN DASHBOARD?', 'WHY DASHBOARD?')}
                </span>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-[44px]">
                  {t('Dữ liệu của bạn đang', 'Your data is')}{' '}
                  <span className="text-[#1859b8]">{t('nằm rải rác?', 'scattered everywhere?')}</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[#515154]">
                  {t(
                    'Hầu hết doanh nghiệp đang mất hàng giờ mỗi tuần để tổng hợp báo cáo từ nhiều nguồn khác nhau. Dashboard giúp bạn có cái nhìn toàn diện trong vài giây.',
                    'Most businesses spend hours each week compiling reports from multiple sources. Dashboard gives you a comprehensive view in seconds.'
                  )}
                </p>

                <div className="mt-8 rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">{t('Dữ liệu của bạn đang ở đâu?', 'Where is your data?')}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { icon: <Globe className="h-4 w-4" />, name: 'Google Analytics' },
                      { icon: <DollarSign className="h-4 w-4" />, name: 'Google/Meta Ads' },
                      { icon: <Users className="h-4 w-4" />, name: 'CRM System' },
                      { icon: <Database className="h-4 w-4" />, name: 'Excel/Sheets' },
                      { icon: <Smartphone className="h-4 w-4" />, name: 'Social Media' },
                      { icon: <BarChart3 className="h-4 w-4" />, name: 'POS/ERP' },
                    ].map((source, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[15px] text-[#1d1d1f]">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#eaf2fd] text-[#1859b8]">{source.icon}</span>
                        {source.name}
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/contact" className="ap-link mt-6 inline-flex items-center gap-2 font-semibold">
                  {t('Tích hợp dữ liệu của bạn ngay', 'Integrate your data now')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {problems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-[18px] border border-[#d2d2d7] bg-white p-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#eaf2fd] text-[#1859b8]">{item.icon}</div>
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
        </section>

        {/* Mẫu dashboard: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                <Layers className="h-4 w-4" />
                {t('MẪU DASHBOARD', 'DASHBOARD TEMPLATES')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Dashboard cho mọi nhu cầu', 'Dashboard for every need')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#515154]">
                {t(
                  'Chọn mẫu phù hợp hoặc để chúng tôi thiết kế riêng cho doanh nghiệp bạn',
                  'Choose a suitable template or let us design one specifically for your business'
                )}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 lg:grid-cols-3 lg:gap-6">
              {dashboardTemplates.map((template, index) => (
                <div key={index} className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d2d2d7] bg-white">
                  <div className="bg-[#1e6dda] p-7 text-white">
                    <h3 className="text-xl font-semibold leading-snug">{template.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-white">{template.description}</p>
                    <div className="mt-5 flex gap-6">
                      {template.metrics.map((metric, i) => (
                        <div key={i}>
                          <div className="text-[22px] font-semibold leading-none tracking-[-0.02em]">{metric.value}</div>
                          <div className="mt-1 text-[13px] text-white">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex flex-wrap gap-2">
                      {template.platforms.map((platform, i) => (
                        <span key={i} className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[13px] font-medium text-[#1d1d1f]">{platform}</span>
                      ))}
                    </div>
                    <ul className="mt-5 space-y-3">
                      {template.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-[15px] text-[#1d1d1f]">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf2fd]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#1859b8]" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/projects" className="ap-btn ap-btn-ghost mt-auto w-full justify-center">
                      {t('Xem chi tiết', 'View Details')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tích hợp AI: khối tối */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#d2d2d7]">
                  <Brain className="h-4 w-4" />
                  {t('TÍCH HỢP AI', 'AI INTEGRATION')}
                </span>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-white sm:text-4xl lg:text-5xl">
                  {t('Phân tích nâng cao với', 'Advanced analytics with')} <span className="text-[#7db8ff]">Claude</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[#d2d2d7]">
                  {t(
                    'Không chỉ hiển thị số liệu, dashboard của chúng tôi còn tích hợp Claude, mô hình AI hàng đầu của Anthropic, để phân tích, dự đoán và đề xuất chiến lược kinh doanh.',
                    "Beyond displaying metrics, our dashboards integrate Claude, Anthropic's leading AI model, to analyze, predict and recommend business strategy."
                  )}
                </p>

                <div className="mt-7 rounded-[18px] border border-white/20 bg-[#1d1d1f] p-5">
                  <div className="flex items-center gap-2.5">
                    <Bot className="h-5 w-5 text-[#7db8ff]" />
                    <span className="text-sm font-semibold text-white">AI Assistant</span>
                    <span className="rounded-full border border-white/30 px-2.5 py-0.5 text-xs text-white">Claude</span>
                  </div>
                  <p className="mt-4 rounded-[12px] bg-white/10 px-4 py-3 text-[15px] italic text-white">
                    {t('"Phân tích hiệu quả quảng cáo tháng này"', '"Analyze this month\'s ad performance"')}
                  </p>
                  <div className="mt-3 rounded-[12px] border border-[#1e6dda] px-4 py-3 text-[15px] leading-relaxed text-white">
                    <p className="font-semibold">{t('Tổng chi phí: ₫180M · ROAS: 4.2x', 'Total spend: ₫180M · ROAS: 4.2x')}</p>
                    <p className="mt-1.5 text-[#d2d2d7]">
                      {t(
                        'Google Ads đang có CPA thấp nhất (₫45K). Đề xuất tăng 20% ngân sách để tối ưu conversion.',
                        'Google Ads has the lowest CPA (₫45K). Recommend increasing the budget by 20% to improve conversion.'
                      )}
                    </p>
                  </div>
                </div>

                <Link href={CONTACT} className="ap-btn ap-btn-primary mt-7 inline-flex">
                  {t('Trải nghiệm AI ngay', 'Experience AI Now')}
                </Link>
              </div>

              <div className="grid auto-rows-fr gap-5 sm:grid-cols-2">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda] text-white">{feature.icon}</div>
                    <h3 className="mt-5 text-lg font-semibold leading-snug text-white">{feature.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#d2d2d7]">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bảo mật và thời gian thực: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <div className="rounded-[18px] bg-[#1d1d1f] p-7 text-white sm:p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{t('Bảo mật cấp doanh nghiệp', 'Enterprise-grade Security')}</h3>
                      <p className="text-[14px] text-[#d2d2d7]">{t('Dữ liệu của bạn được bảo vệ nhiều lớp', 'Your data is protected in layers')}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="rounded-[14px] border border-white/20 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1e6dda] text-white">{feature.icon}</div>
                        <h4 className="mt-3 text-[15px] font-semibold text-white">{feature.title}</h4>
                        <p className="mt-1 text-[13.5px] leading-snug text-[#d2d2d7]">{feature.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/20 pt-5">
                    <p className="text-[13px] text-[#d2d2d7]">{t('Thiết kế theo các chuẩn', 'Designed around')}</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {['OWASP Top 10', 'Row Level Security', 'TLS 1.2+', 'RBAC', t('Nghị định 13/2023/NĐ-CP', 'Decree 13/2023/ND-CP')].map((s) => (
                        <span key={s} className="rounded-md border border-white/30 px-2.5 py-1 text-[12.5px] text-white">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                  <Zap className="h-4 w-4" />
                  {t('AN TOÀN & REAL-TIME', 'SECURE & REAL-TIME')}
                </span>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-[44px]">
                  {t('Dữ liệu bảo mật,', 'Secure data,')} <span className="text-[#1859b8]">{t('cập nhật tức thì', 'instant updates')}</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[#515154]">
                  {t(
                    'Dashboard được thiết kế với tiêu chuẩn bảo mật cao nhất, đồng thời đảm bảo dữ liệu luôn được cập nhật real-time để bạn không bỏ lỡ bất kỳ cơ hội nào.',
                    "Dashboards are built to the highest security standards while keeping data updated in real time, so you never miss an opportunity."
                  )}
                </p>

                <div className="mt-7 space-y-4">
                  {[
                    { icon: <RefreshCw className="h-5 w-5" />, title: t('Real-time sync', 'Real-time sync'), desc: t('Dữ liệu đồng bộ mỗi 30 giây, không delay', 'Data syncs every 30 seconds, no delay') },
                    { icon: <Smartphone className="h-5 w-5" />, title: t('Mobile-ready', 'Mobile-ready'), desc: t('Truy cập mọi lúc mọi nơi từ điện thoại', 'Access anytime anywhere from your phone') },
                    { icon: <Activity className="h-5 w-5" />, title: t('99.9% Uptime', '99.9% Uptime'), desc: t('Hệ thống ổn định, không gián đoạn', 'Stable system, no interruption') },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-[18px] border border-[#d2d2d7] bg-white p-5">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#1e6dda] text-white">{item.icon}</div>
                      <div>
                        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{item.title}</h3>
                        <p className="mt-0.5 text-[15px] text-[#515154]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quy trình: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                <Layers className="h-4 w-4" />
                {t('QUY TRÌNH TRIỂN KHAI', 'IMPLEMENTATION PROCESS')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('5 bước đến Dashboard hoàn hảo', '5 steps to the perfect Dashboard')}
              </h2>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-5">
              {processSteps.map((step, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e6dda] text-[15px] font-semibold text-white">{index + 1}</span>
                  <h3 className="mt-5 text-lg font-semibold leading-snug text-[#1d1d1f]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{step.description}</p>
                  <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eaf2fd] px-3 py-1 text-[13px] font-medium text-[#1859b8]">
                    <Clock className="h-3.5 w-3.5" />
                    {step.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kêu gọi hành động: khối tối */}
        <section id="contact" className="ap-tile ap-dark scroll-mt-16">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display max-w-[820px]">{t('Bứt phá với dữ liệu ngay hôm nay', 'Break through with data today')}</h2>
              <p className="ap-lead max-w-[680px]">
                {t(
                  'Đặt lịch demo miễn phí để xem dashboard hoạt động thực tế và nhận tư vấn từ chuyên gia.',
                  'Schedule a free demo to see the dashboard in action and get expert consultation.'
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href={CONTACT} className="ap-btn ap-btn-primary">{t('Đặt lịch demo miễn phí', 'Book Free Demo')}</Link>
                <Link href="/projects" className="ap-btn ap-btn-ghost">{t('Xem dự án mẫu', 'View sample projects')}</Link>
              </div>
            </div>
          </div>
        </section>
      <ServiceReadMore slug="dashboard" />
      </main>

      <Footer />
    </div>
  )
}
