"use client"

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
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
import { Button } from '@/components/ui/button'

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
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
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
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
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
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
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
      description: t('Tích hợp Claude 4.7, training model theo ngành nghề', 'Integrate Claude 4.7, industry-specific model training'),
      duration: t('1-2 tuần', '1-2 weeks')
    },
    {
      step: '05',
      title: t('Go-live & Training', 'Go-live & Training'),
      description: t('Deploy, đào tạo team sử dụng, hỗ trợ 24/7', 'Deploy, team training, 24/7 support'),
      duration: t('1 tuần', '1 week')
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-6 shadow-lg">
                  <BarChart3 className="w-4 h-4" />
                  {t('DASHBOARD DỮ LIỆU', 'DATA DASHBOARD')}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                  {t('Biến dữ liệu thành', 'Transform data into')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                    {t('quyết định', 'decisions')}
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  {t(
                    'Dashboard thông minh tích hợp AI, giúp bạn nắm bắt toàn bộ hoạt động kinh doanh trong một màn hình.',
                    'AI-integrated smart dashboard helps you capture all business activities in one screen.'
                  )}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground">50+</div>
                    <div className="text-sm text-muted-foreground">{t('Nguồn tích hợp', 'Integrations')}</div>
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground">Real-time</div>
                    <div className="text-sm text-muted-foreground">{t('Cập nhật', 'Updates')}</div>
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground">AI</div>
                    <div className="text-sm text-muted-foreground">Claude 4.7</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/25">
                    {t('Xem demo', 'View Demo')}
                    <Play className="w-4 h-4 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                    {t('Đặt lịch tư vấn', 'Book Consultation')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative">
                <div className="relative bg-foreground/95 backdrop-blur rounded-2xl border border-border p-4 shadow-2xl">
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-white/10 rounded-full h-6 flex items-center px-3">
                      <span className="text-xs text-gray-400">dashboard.clickstar.vn</span>
                    </div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="space-y-3">
                    {/* Top metrics */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: t('Doanh thu', 'Revenue'), value: '₫2.4B', change: '+18%', color: 'text-emerald-400' },
                        { label: t('Chi phí ADS', 'Ad Spend'), value: '₫180M', change: '-12%', color: 'text-blue-400' },
                        { label: 'ROAS', value: '4.2x', change: '+25%', color: 'text-purple-400' },
                        { label: t('Leads', 'Leads'), value: '1,247', change: '+32%', color: 'text-amber-400' }
                      ].map((metric, i) => (
                        <div key={i} className="bg-slate-700/50 rounded-lg p-2">
                          <div className="text-[10px] text-slate-400">{metric.label}</div>
                          <div className={`text-sm font-bold ${metric.color}`}>{metric.value}</div>
                          <div className="text-[10px] text-emerald-400">{metric.change}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart placeholder */}
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-300">{t('Hiệu quả theo kênh', 'Channel Performance')}</span>
                        <span className="text-[10px] text-slate-400">{t('7 ngày qua', 'Last 7 days')}</span>
                      </div>
                      <div className="flex items-end gap-1 h-20">
                        {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-primary to-primary-dark rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Bottom cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-700/30 rounded-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-slate-300">AI Insights</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {t('"Tăng ngân sách Google Ads 20% để tối ưu ROAS"', '"Increase Google Ads budget 20% to optimize ROAS"')}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-slate-300">{t('Live', 'Live')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] text-slate-400">{t('23 người online', '23 users online')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Real-time
                </div>
                <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  AI Powered
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Dashboard Section */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Content */}
              <div>
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-6">
                  <Target className="w-4 h-4" />
                  {t('TẠI SAO CẦN DASHBOARD?', 'WHY DASHBOARD?')}
                </span>
                
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-6">
                  {t('Dữ liệu của bạn đang', 'Your data is')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                    {t('nằm rải rác?', 'scattered everywhere?')}
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {t(
                    'Hầu hết doanh nghiệp đang mất hàng giờ mỗi tuần để tổng hợp báo cáo từ nhiều nguồn khác nhau. Dashboard giúp bạn có cái nhìn toàn diện trong vài giây.',
                    'Most businesses spend hours each week compiling reports from multiple sources. Dashboard gives you a comprehensive view in seconds.'
                  )}
                </p>

                {/* Data Sources */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-foreground mb-4">{t('Dữ liệu của bạn đang ở đâu?', 'Where is your data?')}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <Globe className="w-4 h-4" />, name: 'Google Analytics' },
                      { icon: <DollarSign className="w-4 h-4" />, name: 'Google/Meta Ads' },
                      { icon: <Users className="w-4 h-4" />, name: 'CRM System' },
                      { icon: <Database className="w-4 h-4" />, name: 'Excel/Sheets' },
                      { icon: <Smartphone className="w-4 h-4" />, name: 'Social Media' },
                      { icon: <BarChart3 className="w-4 h-4" />, name: 'POS/ERP' }
                    ].map((source, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                          {source.icon}
                        </div>
                        {source.name}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  {t('Tích hợp dữ liệu của bạn ngay', 'Integrate your data now')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Right: Problems & Solutions */}
              <div className="space-y-4">
                {problems.map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
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
                      
                      <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Templates */}
        <section className="py-12 lg:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Layers className="w-4 h-4" />
                {t('MẪU DASHBOARD', 'DASHBOARD TEMPLATES')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                {t('Dashboard cho mọi nhu cầu', 'Dashboard for every need')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Chọn mẫu phù hợp hoặc để chúng tôi thiết kế riêng cho doanh nghiệp bạn',
                  'Choose a suitable template or let us design one specifically for your business'
                )}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {dashboardTemplates.map((template, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${template.color} p-6 text-white`}>
                    <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                    <p className="text-sm text-white/80">{template.description}</p>
                    
                    {/* Metrics */}
                    <div className="flex gap-4 mt-4">
                      {template.metrics.map((metric, i) => (
                        <div key={i} className="text-center">
                          <div className="text-lg font-bold">{metric.value}</div>
                          <div className="text-xs text-white/70">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Platforms */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.platforms.map((platform, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {platform}
                        </span>
                      ))}
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-2">
                      {template.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA */}
                    <Button className="w-full mt-6 bg-transparent border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors">
                      {t('Xem chi tiết', 'View Details')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Integration Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-purple-900 via-slate-900 to-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <span className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 font-semibold text-sm px-5 py-2.5 rounded-full mb-6 backdrop-blur">
                  <Brain className="w-4 h-4" />
                  {t('TÍCH HỢP AI', 'AI INTEGRATION')}
                </span>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                  {t('Phân tích nâng cao với', 'Advanced analytics with')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Claude 4.7
                  </span>
                </h2>
                
                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                  {t(
                    'Không chỉ hiển thị số liệu, dashboard của chúng tôi còn tích hợp Claude 4.7 - AI mạnh mẽ nhất hiện nay - để phân tích, dự đoán và đề xuất chiến lược kinh doanh.',
                    'Not just displaying metrics, our dashboard integrates Claude 4.7 - the most powerful AI today - to analyze, predict and recommend business strategies.'
                  )}
                </p>

                {/* AI Demo */}
                <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium text-slate-300">AI Assistant</span>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Claude 4.7</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-slate-300 italic">{t('"Phân tích hiệu quả quảng cáo tháng này"', '"Analyze this month\'s ad performance"')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {t(
                        '📊 Tổng chi phí: ₫180M | ROAS: 4.2x\n\n💡 Insight: Google Ads đang có CPA thấp nhất (₫45K). Đề xuất tăng 20% ngân sách để tối ưu conversion.',
                        '📊 Total spend: ₫180M | ROAS: 4.2x\n\n💡 Insight: Google Ads has the lowest CPA (₫45K). Recommend increasing budget by 20% to optimize conversion.'
                      )}
                    </p>
                  </div>
                </div>

                <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
                  {t('Trải nghiệm AI ngay', 'Experience AI Now')}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* AI Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {aiFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-5 hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 mb-4">
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security & Real-time Section */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Security Features */}
              <div className="order-2 lg:order-1">
                <div className="bg-slate-900 rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t('Bảo mật cấp doanh nghiệp', 'Enterprise-grade Security')}</h3>
                      <p className="text-sm text-slate-400">{t('Dữ liệu của bạn được bảo vệ tuyệt đối', 'Your data is absolutely protected')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-xl p-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                          {feature.icon}
                        </div>
                        <h4 className="font-semibold text-sm text-white mb-1">{feature.title}</h4>
                        <p className="text-xs text-slate-400">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {['ISO 27001', 'GDPR', 'SOC 2'].map((cert, i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-300 border-2 border-slate-800">
                            {cert.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-slate-400">{t('Tuân thủ chuẩn bảo mật quốc tế', 'International security compliance')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-6">
                  <Zap className="w-4 h-4" />
                  {t('AN TOÀN & REAL-TIME', 'SECURE & REAL-TIME')}
                </span>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-6">
                  {t('Dữ liệu bảo mật,', 'Secure data,')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                    {t('cập nhật tức thì', 'instant updates')}
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {t(
                    'Dashboard được thiết kế với tiêu chuẩn bảo mật cao nhất, đồng thời đảm bảo dữ liệu luôn được cập nhật real-time để bạn không bỏ lỡ bất kỳ cơ hội nào.',
                    'Dashboard is designed with the highest security standards, while ensuring data is always updated real-time so you don\'t miss any opportunity.'
                  )}
                </p>

                <div className="space-y-4">
                  {[
                    {
                      icon: <RefreshCw className="w-5 h-5" />,
                      title: t('Real-time sync', 'Real-time sync'),
                      desc: t('Dữ liệu đồng bộ mỗi 30 giây, không delay', 'Data syncs every 30 seconds, no delay')
                    },
                    {
                      icon: <Smartphone className="w-5 h-5" />,
                      title: t('Mobile-ready', 'Mobile-ready'),
                      desc: t('Truy cập mọi lúc mọi nơi từ điện thoại', 'Access anytime anywhere from your phone')
                    },
                    {
                      icon: <Activity className="w-5 h-5" />,
                      title: t('99.9% Uptime', '99.9% Uptime'),
                      desc: t('Hệ thống ổn định, không gián đoạn', 'Stable system, no interruption')
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="pt-12 pb-20 lg:pt-16 lg:pb-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Layers className="w-4 h-4" />
                {t('QUY TRÌNH TRIỂN KHAI', 'IMPLEMENTATION PROCESS')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                {t('5 bước đến Dashboard hoàn hảo', '5 steps to the perfect Dashboard')}
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2" />
              
              <div className="grid lg:grid-cols-5 gap-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Step circle */}
                    <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:-top-4 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mb-4 lg:mb-0 z-10">
                      {index + 1}
                    </div>
                    
                    <div className="lg:pt-10 bg-white rounded-xl p-5 border border-border hover:shadow-lg transition-shadow h-full">
                      <div className="text-xs text-primary font-semibold mb-2">{step.duration}</div>
                      <h4 className="font-bold text-foreground mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-12 lg:py-16 bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t('Bứt phá với dữ liệu ngay hôm nay', 'Break through with data today')}
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {t(
                'Đặt lịch demo miễn phí để xem dashboard hoạt động thực tế và nhận tư vấn từ chuyên gia.',
                'Schedule a free demo to see the dashboard in action and get expert consultation.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 shadow-xl">
                {t('Đặt lịch demo miễn phí', 'Book Free Demo')}
                <Play className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white">
                {t('Tải brochure', 'Download Brochure')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
