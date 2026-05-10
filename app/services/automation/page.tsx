"use client"

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { 
  Sparkles, 
  Brain, 
  Zap,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Play,
  ChevronRight,
  Bot,
  Cpu,
  Layers,
  Bell,
  MessageSquare,
  BarChart3,
  Workflow,
  RefreshCcw,
  Settings,
  Database,
  Globe,
  Star,
  Rocket,
  FileText
} from 'lucide-react'

// Robot SVG Component
const RobotSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Robot Head */}
    <rect x="50" y="30" width="100" height="80" rx="12" fill="url(#robotGradient)" />
    <rect x="55" y="35" width="90" height="70" rx="8" fill="#1A1A2E" opacity="0.1" />
    
    {/* Eyes */}
    <circle cx="80" cy="65" r="12" fill="white" />
    <circle cx="120" cy="65" r="12" fill="white" />
    <circle cx="82" cy="67" r="6" fill="#1B7BFF">
      <animate attributeName="cx" values="82;78;82;86;82" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="122" cy="67" r="6" fill="#1B7BFF">
      <animate attributeName="cx" values="122;118;122;126;122" dur="3s" repeatCount="indefinite" />
    </circle>
    
    {/* Antenna */}
    <line x1="100" y1="30" x2="100" y2="15" stroke="url(#robotGradient)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="100" cy="12" r="6" fill="#1B7BFF">
      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
    
    {/* Mouth - LED display */}
    <rect x="75" y="85" width="50" height="10" rx="3" fill="#1A1A2E" opacity="0.3" />
    <rect x="78" y="87" width="8" height="6" rx="1" fill="#10B981">
      <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
    </rect>
    <rect x="88" y="87" width="8" height="6" rx="1" fill="#10B981">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
    </rect>
    <rect x="98" y="87" width="8" height="6" rx="1" fill="#10B981">
      <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
    </rect>
    <rect x="108" y="87" width="8" height="6" rx="1" fill="#10B981">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
    </rect>
    
    {/* Neck */}
    <rect x="85" y="110" width="30" height="15" fill="url(#robotGradient)" />
    
    {/* Body */}
    <rect x="45" y="125" width="110" height="60" rx="10" fill="url(#robotGradient)" />
    <rect x="55" y="135" width="90" height="40" rx="6" fill="#1A1A2E" opacity="0.1" />
    
    {/* Chest display */}
    <rect x="70" y="140" width="60" height="30" rx="4" fill="#1A1A2E" opacity="0.3" />
    <circle cx="85" cy="155" r="8" fill="#1B7BFF" opacity="0.8">
      <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="100" cy="155" r="4" fill="#10B981" />
    <circle cx="115" cy="155" r="4" fill="#F59E0B" />
    
    {/* Arms */}
    <rect x="25" y="130" width="20" height="50" rx="8" fill="url(#robotGradient)" />
    <rect x="155" y="130" width="20" height="50" rx="8" fill="url(#robotGradient)" />
    <circle cx="35" cy="185" r="10" fill="url(#robotGradient)" />
    <circle cx="165" cy="185" r="10" fill="url(#robotGradient)" />
    
    <defs>
      <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1B7BFF" />
        <stop offset="100%" stopColor="#3B5FFF" />
      </linearGradient>
    </defs>
  </svg>
)

// Automation Flow SVG Component
const AutomationFlowSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 600 350" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Grid */}
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.5" opacity="0.5" />
    </pattern>
    <rect width="600" height="350" fill="url(#grid)" />
    
    {/* Connection Lines with animation */}
    <path d="M 120 100 Q 180 100 180 175 Q 180 250 240 250" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="1s" repeatCount="indefinite" />
    </path>
    <path d="M 330 250 L 390 250" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="1s" repeatCount="indefinite" />
    </path>
    <path d="M 480 250 Q 530 250 530 175 Q 530 100 480 100" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="1s" repeatCount="indefinite" />
    </path>
    <path d="M 390 100 L 330 100" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="1s" repeatCount="indefinite" />
    </path>
    
    {/* Central Hub - N8N */}
    <g>
      <circle cx="300" cy="175" r="55" fill="url(#hubGradient)" />
      <circle cx="300" cy="175" r="45" fill="white" />
      <text x="300" y="170" textAnchor="middle" fill="#1A1A2E" fontSize="14" fontWeight="bold">N8N</text>
      <text x="300" y="188" textAnchor="middle" fill="#64748B" fontSize="10">Automation Hub</text>
      {/* Rotating ring */}
      <circle cx="300" cy="175" r="50" fill="none" stroke="#1B7BFF" strokeWidth="2" strokeDasharray="10 5" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 300 175" to="360 300 175" dur="10s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* Node 1 - Claude */}
    <g>
      <rect x="30" y="60" width="90" height="80" rx="12" fill="white" stroke="#D97757" strokeWidth="2" />
      <rect x="40" y="70" width="70" height="30" rx="6" fill="#D97757" opacity="0.1" />
      <text x="75" y="90" textAnchor="middle" fill="#D97757" fontSize="12" fontWeight="bold">Claude</text>
      <text x="75" y="115" textAnchor="middle" fill="#64748B" fontSize="9">Phân tích</text>
      <text x="75" y="127" textAnchor="middle" fill="#64748B" fontSize="9">& Content</text>
    </g>
    
    {/* Node 2 - GPT */}
    <g>
      <rect x="240" y="210" width="90" height="80" rx="12" fill="white" stroke="#10A37F" strokeWidth="2" />
      <rect x="250" y="220" width="70" height="30" rx="6" fill="#10A37F" opacity="0.1" />
      <text x="285" y="240" textAnchor="middle" fill="#10A37F" fontSize="12" fontWeight="bold">GPT-4o</text>
      <text x="285" y="265" textAnchor="middle" fill="#64748B" fontSize="9">Creative</text>
      <text x="285" y="277" textAnchor="middle" fill="#64748B" fontSize="9">& Chatbot</text>
    </g>
    
    {/* Node 3 - Data Analytics */}
    <g>
      <rect x="390" y="210" width="90" height="80" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="2" />
      <rect x="400" y="220" width="70" height="30" rx="6" fill="#8B5CF6" opacity="0.1" />
      <text x="435" y="240" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="bold">Analytics</text>
      <text x="435" y="265" textAnchor="middle" fill="#64748B" fontSize="9">Phân tích</text>
      <text x="435" y="277" textAnchor="middle" fill="#64748B" fontSize="9">dữ liệu</text>
    </g>
    
    {/* Node 4 - Webapp */}
    <g>
      <rect x="390" y="60" width="90" height="80" rx="12" fill="white" stroke="#1B7BFF" strokeWidth="2" />
      <rect x="400" y="70" width="70" height="30" rx="6" fill="#1B7BFF" opacity="0.1" />
      <text x="435" y="90" textAnchor="middle" fill="#1B7BFF" fontSize="11" fontWeight="bold">WebApp</text>
      <text x="435" y="115" textAnchor="middle" fill="#64748B" fontSize="9">Dashboard</text>
      <text x="435" y="127" textAnchor="middle" fill="#64748B" fontSize="9">& CRM</text>
    </g>
    
    {/* Floating data particles */}
    <circle cx="150" cy="130" r="4" fill="#1B7BFF">
      <animate attributeName="cy" values="130;175;220" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.5;0" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="450" cy="220" r="4" fill="#8B5CF6">
      <animate attributeName="cy" values="220;175;130" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.5;0" dur="2s" repeatCount="indefinite" />
    </circle>
    
    {/* Output indicators */}
    <g>
      <rect x="520" y="155" width="70" height="40" rx="8" fill="#10B981" opacity="0.1" stroke="#10B981" strokeWidth="1" />
      <text x="555" y="173" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">OUTPUT</text>
      <text x="555" y="185" textAnchor="middle" fill="#10B981" fontSize="8">Auto Tasks</text>
    </g>
    
    {/* Input indicators */}
    <g>
      <rect x="10" y="155" width="70" height="40" rx="8" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" strokeWidth="1" />
      <text x="45" y="173" textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold">INPUT</text>
      <text x="45" y="185" textAnchor="middle" fill="#F59E0B" fontSize="8">Triggers</text>
    </g>
    
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1B7BFF" />
        <stop offset="100%" stopColor="#3B5FFF" />
      </linearGradient>
      <linearGradient id="hubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1B7BFF" />
        <stop offset="100%" stopColor="#3B5FFF" />
      </linearGradient>
    </defs>
  </svg>
)

// Small Robot Icon SVG
const SmallRobotSVG = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="3" fill="currentColor" />
    <circle cx="9" cy="11" r="2" fill="white" />
    <circle cx="15" cy="11" r="2" fill="white" />
    <rect x="8" y="15" width="8" height="2" rx="1" fill="white" opacity="0.5" />
    <line x1="12" y1="6" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1.5" fill="currentColor" />
    <rect x="2" y="10" width="2" height="6" rx="1" fill="currentColor" />
    <rect x="20" y="10" width="2" height="6" rx="1" fill="currentColor" />
  </svg>
)

// Automation benefits
const automationBenefits = [
  {
    icon: Clock,
    title: 'Tiết kiệm 80% thời gian',
    description: 'Tự động hóa các tác vụ lặp đi lặp lại: nhập liệu, gửi email, cập nhật CRM, tạo báo cáo...'
  },
  {
    icon: Zap,
    title: 'Phản hồi tức thì 24/7',
    description: 'Hệ thống tự động xử lý yêu cầu, chăm sóc khách hàng, gửi thông báo không cần can thiệp.'
  },
  {
    icon: TrendingUp,
    title: 'Tận dụng xu hướng AI',
    description: 'Kết hợp sức mạnh của Claude, GPT, và các AI hàng đầu vào quy trình kinh doanh.'
  },
  {
    icon: Shield,
    title: 'Giảm thiểu sai sót',
    description: 'Loại bỏ lỗi do con người, đảm bảo quy trình chạy chính xác và nhất quán.'
  },
  {
    icon: RefreshCcw,
    title: 'Tích hợp đa nền tảng',
    description: 'Kết nối tất cả tools: CRM, Email, Social, Analytics... thành một hệ thống thống nhất.'
  },
  {
    icon: Database,
    title: 'Data-driven decisions',
    description: 'Tự động thu thập, phân tích dữ liệu và đưa ra insights, đề xuất hành động.'
  }
]

// Automation use cases
const automationUseCases = [
  {
    icon: MessageSquare,
    title: 'Chăm sóc khách hàng tự động',
    description: 'Chatbot AI trả lời 24/7, phân loại ticket, escalate khi cần thiết',
    flow: ['Khách hàng nhắn tin', 'AI phân tích intent', 'Trả lời hoặc chuyển đến nhân viên', 'Lưu vào CRM'],
    stats: '90%',
    statsLabel: 'Tự động hóa'
  },
  {
    icon: Bell,
    title: 'Thông báo & Alerts thông minh',
    description: 'Nhận thông báo quan trọng từ mọi nguồn, AI lọc và ưu tiên',
    flow: ['Monitor đa kênh', 'AI đánh giá mức độ', 'Gửi thông báo phù hợp', 'Đề xuất hành động'],
    stats: '24/7',
    statsLabel: 'Giám sát'
  },
  {
    icon: FileText,
    title: 'Content Workflow',
    description: 'Tự động tạo, review, publish content theo lịch',
    flow: ['Lên ý tưởng AI', 'Viết draft', 'Review & edit', 'Auto publish'],
    stats: '10x',
    statsLabel: 'Nhanh hơn'
  },
  {
    icon: BarChart3,
    title: 'Báo cáo & Analytics tự động',
    description: 'Thu thập data từ mọi nguồn, AI phân tích và gửi insights',
    flow: ['Collect data', 'AI phân tích', 'Tạo báo cáo', 'Gửi định kỳ'],
    stats: '100%',
    statsLabel: 'Tự động'
  }
]

// Automation tools ecosystem
const automationTools = [
  {
    name: 'N8N',
    category: 'Workflow Engine',
    description: 'Nền tảng automation no-code/low-code mạnh mẽ',
    logoColor: 'from-[#EA4B71] to-[#FF6B6B]',
    letter: 'N8N'
  },
  {
    name: 'Claude',
    category: 'AI Agent',
    description: 'Xử lý ngôn ngữ tự nhiên, phân tích sâu',
    logoColor: 'from-[#D97757] to-[#C4653F]',
    letter: 'C'
  },
  {
    name: 'GPT-4o',
    category: 'AI Agent',
    description: 'Sáng tạo content, đa năng',
    logoColor: 'from-[#10A37F] to-[#0D8F6F]',
    letter: 'GPT'
  },
  {
    name: 'Zapier',
    category: 'Integration',
    description: 'Kết nối 5000+ ứng dụng',
    logoColor: 'from-[#FF4A00] to-[#FF6B35]',
    letter: 'Z'
  },
  {
    name: 'Make',
    category: 'Integration',
    description: 'Visual automation builder',
    logoColor: 'from-[#6D28D9] to-[#8B5CF6]',
    letter: 'M'
  },
  {
    name: 'Webhook',
    category: 'Trigger',
    description: 'Real-time event triggers',
    logoColor: 'from-[#1B7BFF] to-[#3B5FFF]',
    letter: 'WH'
  }
]

// Process steps
const automationProcess = [
  {
    step: '01',
    title: 'Phân tích quy trình',
    description: 'Xác định các tác vụ lặp lại, thủ công có thể tự động hóa',
    duration: '1 tuần'
  },
  {
    step: '02',
    title: 'Thiết kế workflow',
    description: 'Vẽ sơ đồ automation, chọn tools và AI phù hợp',
    duration: '1 tuần'
  },
  {
    step: '03',
    title: 'Xây dựng & Kết nối',
    description: 'Setup N8N, tích hợp AI, kết nối các nền tảng',
    duration: '2-3 tuần'
  },
  {
    step: '04',
    title: 'Test & Tối ưu',
    description: 'Chạy thử, fix bugs, tối ưu performance liên tục',
    duration: 'Liên tục'
  }
]

export default function AIAutomationPage() {
  const { t } = useLanguage()

  return (
    <>
      <MainNav />
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full mb-6 shadow-sm">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Automation 2026</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                  Tự động hóa với{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                    AI Automation
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Kết hợp sức mạnh của Claude, GPT, N8N và các công nghệ AI hàng đầu để 
                  tự động hóa mọi quy trình kinh doanh. Tiết kiệm thời gian, tối ưu chi phí, 
                  tận dụng xu hướng công nghệ lớn.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 text-white font-semibold px-8 py-4 rounded-full transition-all"
                  >
                    Tư vấn miễn phí
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#workflow"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-secondary text-primary font-medium px-8 py-4 rounded-full transition-all border border-primary/20 shadow-sm"
                  >
                    <Play className="w-5 h-5" />
                    Xem workflow
                  </Link>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">80%</p>
                      <p className="text-xs text-muted-foreground">Tiết kiệm thời gian</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">24/7</p>
                      <p className="text-xs text-muted-foreground">Hoạt động liên tục</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">100+</p>
                      <p className="text-xs text-muted-foreground">Workflows đã triển khai</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Robot Illustration */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-72 h-72 md:w-80 md:h-80">
                  <RobotSVG />
                  
                  {/* Floating elements around robot */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg border border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#D97757] to-[#C4653F] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">C</span>
                      </div>
                      <span className="text-xs font-medium text-foreground">Claude</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg border border-slate-100 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#10A37F] to-[#0D8F6F] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">GPT</span>
                      </div>
                      <span className="text-xs font-medium text-foreground">GPT-4o</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 -right-8 bg-white rounded-xl p-3 shadow-lg border border-slate-100 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#EA4B71] to-[#FF6B6B] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-[10px]">N8N</span>
                      </div>
                      <span className="text-xs font-medium text-foreground">N8N</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Automation - Dark */}
        <section className="py-16 lg:py-20 bg-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4 backdrop-blur">
                <SmallRobotSVG className="w-4 h-4" />
                TẠI SAO CẦN AUTOMATION
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Tự động h��a là <span className="text-primary">xu hướng tất yếu</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Doanh nghiệp không tự động hóa sẽ lãng phí thời gian vào các tác vụ lặp lại, 
                bỏ lỡ cơ hội tận dụng sức mạnh của công nghệ AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automationBenefits.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-all">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Automation Flow Diagram - Light */}
        <section id="workflow" className="relative py-16 lg:py-20 bg-gradient-to-br from-secondary via-white to-background-soft overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-primary/15 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-[250px] h-[250px] bg-gradient-to-br from-primary-dark/10 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                Workflow Automation
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Sơ đồ Automation với AI
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Kết hợp N8N, Claude, GPT và các công cụ khác thành một hệ thống tự động hóa hoàn chỉnh
              </p>
            </div>

            {/* Flow Diagram */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-primary/10 mb-12">
              <AutomationFlowSVG className="w-full h-auto" />
            </div>

            {/* Flow explanation */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: Globe, title: 'Input Triggers', desc: 'Webhook, Schedule, Events', color: 'from-amber-500 to-orange-400' },
                { icon: Brain, title: 'AI Processing', desc: 'Claude + GPT phân tích', color: 'from-primary to-primary-dark' },
                { icon: Workflow, title: 'N8N Orchestration', desc: 'Điều phối workflow', color: 'from-pink-500 to-rose-400' },
                { icon: Rocket, title: 'Auto Actions', desc: 'Thực thi tự động', color: 'from-emerald-500 to-teal-400' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases - White */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                Use Cases
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ứng dụng AI Automation
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Các trường hợp sử dụng phổ biến của AI Automation trong doanh nghiệp
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {automationUseCases.map((useCase, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-secondary to-white rounded-2xl p-6 border border-primary/10 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <useCase.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{useCase.stats}</p>
                      <p className="text-xs text-muted-foreground">{useCase.statsLabel}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{useCase.description}</p>
                  
                  {/* Flow steps */}
                  <div className="flex flex-wrap items-center gap-2">
                    {useCase.flow.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                          {step}
                        </span>
                        {i < useCase.flow.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Ecosystem - Dark */}
        <section className="py-16 lg:py-20 bg-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4 backdrop-blur">
                <Layers className="w-4 h-4" />
                TECH STACK
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Công nghệ <span className="text-primary">Automation</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Bộ công cụ automation và AI hàng đầu được ClickStar sử dụng
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {automationTools.map((tool, index) => (
                <div key={index} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${tool.logoColor} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">{tool.letter}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <p className="text-xs text-gray-400">{tool.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process - Light */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-br from-secondary via-white to-background-soft overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-primary/15 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-[250px] h-[250px] bg-gradient-to-br from-primary-dark/10 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                Quy trình
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Triển khai AI Automation
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                4 bước để xây dựng hệ thống automation cho doanh nghiệp
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {automationProcess.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-all">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                    <div className="pt-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  {index < automationProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-6 h-6 text-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Light */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6">
              <RobotSVG />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sẵn sàng tự động hóa?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Để AI và automation làm việc thay bạn. Liên hệ ngay để được tư vấn 
              giải pháp phù hợp với doanh nghiệp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services/ai-integration"
                className="inline-flex items-center gap-2 bg-white text-foreground font-medium px-8 py-4 rounded-full hover:bg-secondary transition-all border border-border shadow-sm"
              >
                Xem dịch vụ AI
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
