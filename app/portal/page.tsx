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

// Compact Portal Illustration SVG
function PortalIllustration() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto max-w-sm">
      <defs>
        <linearGradient id="portalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B7BFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3B5FFF" stopOpacity="0.1" />
        </linearGradient>
        <filter id="portalShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1B7BFF" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      {/* Main Card */}
      <g filter="url(#portalShadow)">
        <rect x="20" y="20" width="280" height="140" rx="10" fill="white" stroke="#e2e8f0"/>
        <rect x="20" y="20" width="280" height="28" rx="10" fill="#1B7BFF"/>
        <rect x="20" y="38" width="280" height="10" fill="#1B7BFF"/>
        <circle cx="36" cy="34" r="4" fill="#ff5f57"/>
        <circle cx="48" cy="34" r="4" fill="#febc2e"/>
        <circle cx="60" cy="34" r="4" fill="#28c840"/>
        <text x="160" y="38" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">ClickStar Portal</text>
      </g>
      
      {/* Stats Row */}
      <rect x="30" y="58" width="75" height="35" rx="5" fill="#EEF3FF"/>
      <text x="67" y="78" textAnchor="middle" fill="#1B7BFF" fontSize="11" fontWeight="bold">1,247</text>
      <text x="67" y="88" textAnchor="middle" fill="#64748b" fontSize="6">Khách hàng</text>
      
      <rect x="115" y="58" width="75" height="35" rx="5" fill="#dcfce7"/>
      <text x="152" y="78" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="bold">89</text>
      <text x="152" y="88" textAnchor="middle" fill="#64748b" fontSize="6">Dự án</text>
      
      <rect x="200" y="58" width="90" height="35" rx="5" fill="#fef3c7"/>
      <text x="245" y="78" textAnchor="middle" fill="#d97706" fontSize="11" fontWeight="bold">24/7</text>
      <text x="245" y="88" textAnchor="middle" fill="#64748b" fontSize="6">Hỗ trợ AI</text>
      
      {/* Chart */}
      <rect x="30" y="100" width="120" height="50" rx="5" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="38" y="112" fill="#64748b" fontSize="6">Phân tích AI</text>
      <rect x="40" y="135" width="10" height="10" rx="1" fill="#EEF3FF"/>
      <rect x="55" y="125" width="10" height="20" rx="1" fill="#1B7BFF"/>
      <rect x="70" y="130" width="10" height="15" rx="1" fill="#EEF3FF"/>
      <rect x="85" y="120" width="10" height="25" rx="1" fill="#1B7BFF"/>
      <rect x="100" y="128" width="10" height="17" rx="1" fill="#3B5FFF"/>
      <rect x="115" y="122" width="10" height="23" rx="1" fill="#1B7BFF"/>
      
      {/* Activity */}
      <rect x="160" y="100" width="130" height="50" rx="5" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="168" y="112" fill="#64748b" fontSize="6">Hoạt động</text>
      <circle cx="170" y="125" r="3" fill="#1B7BFF"/>
      <rect x="178" y="122" width="100" height="4" rx="2" fill="#e2e8f0"/>
      <circle cx="170" y="138" r="3" fill="#16a34a"/>
      <rect x="178" y="135" width="80" height="4" rx="2" fill="#e2e8f0"/>
      
      {/* Robot */}
      <circle cx="290" cy="155" r="12" fill="#1B7BFF"/>
      <rect x="284" y="151" width="4" height="4" rx="1" fill="white"/>
      <rect x="292" y="151" width="4" height="4" rx="1" fill="white"/>
      <rect x="286" y="159" width="8" height="2" rx="1" fill="white"/>
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
    <div className="h-screen bg-foreground flex overflow-hidden">
      {/* Left Side - Features & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-8 xl:p-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[200px] h-[200px] bg-primary-dark/10 rounded-full blur-3xl" />
        </div>
        
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ClickStar</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
            Cổng thông tin{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              khách hàng
            </span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Quản lý dự án, theo dõi tiến độ và tương tác với đội ngũ ClickStar.
          </p>

          {/* Illustration */}
          <div className="mb-6">
            <PortalIllustration />
          </div>
        </div>

        {/* Features Grid - Compact */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-white font-medium text-xs">{feature.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ClickStar</span>
            </Link>
          </div>

          {/* Login Header */}
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
              Chào mừng trở lại
            </h2>
            <p className="text-muted-foreground text-sm">
              Đăng nhập để truy cập portal
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-secondary rounded-lg p-1 mb-5">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'customer'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Khách hàng
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'staff'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Nhân viên
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                placeholder="email@company.com"
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pr-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-border text-primary" />
                <span className="text-muted-foreground">Ghi nhớ</span>
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-primary-dark">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-background text-muted-foreground">hoặc</span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2.5 rounded-lg border border-border hover:border-primary/30 transition-all text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#1877f2]/90 text-white font-medium py-2.5 rounded-lg transition-all text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Support Info - Compact */}
          <div className="mt-5 p-3 bg-secondary/50 rounded-lg border border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ 24/7: <span className="text-primary font-medium">1900 xxxx</span>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Chưa có tài khoản?{' '}
            <Link href="/contact" className="text-primary hover:text-primary-dark font-medium">
              Liên hệ ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
