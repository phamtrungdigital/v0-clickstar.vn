'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  FileText,
  Bell,
  Bot
} from 'lucide-react'

// Portal Features Illustration SVG
function PortalIllustration() {
  return (
    <svg viewBox="0 0 500 400" className="w-full h-auto max-w-lg">
      {/* Background Elements */}
      <defs>
        <linearGradient id="portalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B7BFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3B5FFF" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <filter id="portalShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1B7BFF" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      {/* Main Dashboard Card */}
      <g filter="url(#portalShadow)">
        <rect x="50" y="50" width="400" height="280" rx="16" fill="url(#cardGradient)" stroke="#e2e8f0" strokeWidth="1"/>
        
        {/* Header Bar */}
        <rect x="50" y="50" width="400" height="50" rx="16" fill="#1B7BFF"/>
        <rect x="50" y="84" width="400" height="16" fill="#1B7BFF"/>
        
        {/* Window Controls */}
        <circle cx="75" cy="75" r="6" fill="#ff5f57"/>
        <circle cx="95" cy="75" r="6" fill="#febc2e"/>
        <circle cx="115" cy="75" r="6" fill="#28c840"/>
        
        {/* Header Text */}
        <text x="250" y="80" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">ClickStar Portal</text>
      </g>
      
      {/* Sidebar */}
      <rect x="50" y="100" width="80" height="230" fill="#f8fafc"/>
      <rect x="50" y="100" width="80" height="1" fill="#e2e8f0"/>
      
      {/* Sidebar Items */}
      <rect x="60" y="115" width="60" height="8" rx="4" fill="#1B7BFF"/>
      <rect x="60" y="135" width="50" height="6" rx="3" fill="#cbd5e1"/>
      <rect x="60" y="155" width="55" height="6" rx="3" fill="#cbd5e1"/>
      <rect x="60" y="175" width="45" height="6" rx="3" fill="#cbd5e1"/>
      <rect x="60" y="195" width="50" height="6" rx="3" fill="#cbd5e1"/>
      
      {/* Main Content Area */}
      {/* Stats Cards */}
      <g>
        {/* Card 1 - Users */}
        <rect x="145" y="115" width="90" height="60" rx="8" fill="white" stroke="#e2e8f0"/>
        <circle cx="165" cy="135" r="12" fill="#EEF3FF"/>
        <text x="165" y="140" textAnchor="middle" fill="#1B7BFF" fontSize="12" fontWeight="bold">
          <tspan>U</tspan>
        </text>
        <text x="165" y="160" textAnchor="middle" fill="#64748b" fontSize="8">Khách hàng</text>
        <text x="210" y="145" textAnchor="middle" fill="#1e293b" fontSize="16" fontWeight="bold">1,247</text>
        
        {/* Card 2 - Projects */}
        <rect x="245" y="115" width="90" height="60" rx="8" fill="white" stroke="#e2e8f0"/>
        <circle cx="265" cy="135" r="12" fill="#dcfce7"/>
        <text x="265" y="140" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="bold">P</text>
        <text x="265" y="160" textAnchor="middle" fill="#64748b" fontSize="8">Dự án</text>
        <text x="310" y="145" textAnchor="middle" fill="#1e293b" fontSize="16" fontWeight="bold">89</text>
        
        {/* Card 3 - Support */}
        <rect x="345" y="115" width="90" height="60" rx="8" fill="white" stroke="#e2e8f0"/>
        <circle cx="365" cy="135" r="12" fill="#fef3c7"/>
        <text x="365" y="140" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold">S</text>
        <text x="365" y="160" textAnchor="middle" fill="#64748b" fontSize="8">Hỗ trợ</text>
        <text x="410" y="145" textAnchor="middle" fill="#1e293b" fontSize="16" fontWeight="bold">24/7</text>
      </g>
      
      {/* Chart Area */}
      <rect x="145" y="190" width="140" height="100" rx="8" fill="white" stroke="#e2e8f0"/>
      <text x="155" y="210" fill="#64748b" fontSize="9">Phân tích AI</text>
      
      {/* Chart Bars */}
      <rect x="160" y="260" width="15" height="20" rx="2" fill="#EEF3FF"/>
      <rect x="180" y="245" width="15" height="35" rx="2" fill="#1B7BFF"/>
      <rect x="200" y="255" width="15" height="25" rx="2" fill="#EEF3FF"/>
      <rect x="220" y="235" width="15" height="45" rx="2" fill="#1B7BFF"/>
      <rect x="240" y="250" width="15" height="30" rx="2" fill="#3B5FFF"/>
      <rect x="260" y="240" width="15" height="40" rx="2" fill="#1B7BFF"/>
      
      {/* Activity Feed */}
      <rect x="295" y="190" width="140" height="100" rx="8" fill="white" stroke="#e2e8f0"/>
      <text x="305" y="210" fill="#64748b" fontSize="9">Hoạt động gần đây</text>
      
      {/* Activity Items */}
      <circle cx="310" cy="230" r="4" fill="#1B7BFF"/>
      <rect x="320" y="227" width="100" height="6" rx="3" fill="#e2e8f0"/>
      
      <circle cx="310" cy="250" r="4" fill="#16a34a"/>
      <rect x="320" y="247" width="80" height="6" rx="3" fill="#e2e8f0"/>
      
      <circle cx="310" cy="270" r="4" fill="#d97706"/>
      <rect x="320" y="267" width="90" height="6" rx="3" fill="#e2e8f0"/>
      
      {/* AI Robot Icon - Floating */}
      <g className="animate-bounce" style={{ animationDuration: '3s' }}>
        <circle cx="420" cy="340" r="25" fill="#1B7BFF" opacity="0.1"/>
        <circle cx="420" cy="340" r="18" fill="#1B7BFF"/>
        {/* Robot Face */}
        <rect x="410" y="333" width="6" height="6" rx="1" fill="white"/>
        <rect x="424" y="333" width="6" height="6" rx="1" fill="white"/>
        <rect x="414" y="345" width="12" height="3" rx="1" fill="white"/>
        {/* Antenna */}
        <line x1="420" y1="322" x2="420" y2="316" stroke="#1B7BFF" strokeWidth="2"/>
        <circle cx="420" cy="314" r="3" fill="#3B5FFF"/>
      </g>
      
      {/* Decorative Elements */}
      <circle cx="80" cy="350" r="40" fill="url(#portalGradient)" opacity="0.5"/>
      <circle cx="450" cy="80" r="30" fill="url(#portalGradient)" opacity="0.3"/>
    </svg>
  )
}

export default function PortalPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'customer' | 'staff'>('customer')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000)
  }

  const features = [
    {
      icon: Users,
      title: 'Chăm sóc khách hàng',
      description: 'Theo dõi tiến độ dự án, yêu cầu hỗ trợ mọi lúc'
    },
    {
      icon: BarChart3,
      title: 'AI phân tích dữ liệu',
      description: 'Báo cáo thông minh, insight tự động từ AI'
    },
    {
      icon: FileText,
      title: 'Quy trình minh bạch',
      description: 'Mọi bước triển khai đều được cập nhật realtime'
    },
    {
      icon: Bell,
      title: 'Thông báo tức thì',
      description: 'Nhận thông báo ngay khi có cập nhật mới'
    }
  ]

  return (
    <div className="min-h-screen bg-foreground flex">
      {/* Left Side - Features & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-primary-dark/10 rounded-full blur-3xl" />
        </div>
        
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ClickStar</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Cổng thông tin
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                khách hàng thông minh
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Quản lý dự án, theo dõi tiến độ và tương tác với đội ngũ ClickStar - tất cả trong một nền tảng duy nhất.
            </p>
          </div>

          {/* Illustration */}
          <div className="relative">
            <PortalIllustration />
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">ClickStar</span>
            </Link>
          </div>

          {/* Login Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Chào mừng trở lại
            </h2>
            <p className="text-muted-foreground">
              Đăng nhập để truy cập portal của bạn
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'customer'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              Khách hàng
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'staff'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-4 h-4" />
              Nhân viên
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="email@company.com"
                className="w-full px-4 py-3.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-muted-foreground">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary-dark transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">hoặc</span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-3.5 rounded-xl border border-border hover:border-primary/30 transition-all duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng nhập với Google
            </button>
            
            <button className="w-full flex items-center justify-center gap-3 bg-[#1877f2] hover:bg-[#1877f2]/90 text-white font-medium py-3.5 rounded-xl transition-all duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Đăng nhập với Facebook
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Cần hỗ trợ?</p>
                <p className="text-xs text-muted-foreground">
                  Liên hệ hotline <span className="text-primary font-medium">1900 xxxx</span> hoặc chat với AI Assistant 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Chưa có tài khoản?{' '}
            <Link href="/contact" className="text-primary hover:text-primary-dark font-medium transition-colors">
              Liên hệ ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
