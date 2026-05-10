'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  FileText,
  Image,
  Link2,
  Type,
  Globe,
  Smartphone,
  Zap,
  BarChart3,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

const seoOverview = {
  score: 78,
  issues: { critical: 3, warnings: 8, passed: 45 },
  lastScan: '15/01/2024 10:30',
}

const pagesSeo = [
  {
    id: 1,
    name: 'Trang chủ',
    path: '/',
    score: 92,
    title: 'ClickStar - Digital Marketing & AI Solutions',
    titleLength: 42,
    description: 'Giải pháp Digital Marketing, CRM, Dashboard dữ liệu và AI cho doanh nghiệp Việt Nam. Tối ưu chuyển đổi với công nghệ hiện đại.',
    descriptionLength: 128,
    h1: 'Tăng trưởng doanh thu với Digital Marketing & AI',
    issues: []
  },
  {
    id: 2,
    name: 'Digital Marketing',
    path: '/services/digital-marketing',
    score: 88,
    title: 'Dịch vụ Digital Marketing - ClickStar',
    titleLength: 38,
    description: 'Dịch vụ Digital Marketing toàn diện: Google Ads, Facebook Ads, SEO, Content Marketing. Tăng leads và doanh thu.',
    descriptionLength: 110,
    h1: 'Tăng trưởng doanh thu với Digital Marketing',
    issues: ['Meta description có thể dài hơn']
  },
  {
    id: 3,
    name: 'Thiết kế Website',
    path: '/services/website',
    score: 85,
    title: 'Thiết kế Website chuyên nghiệp - ClickStar',
    titleLength: 42,
    description: 'Thiết kế website chuẩn UX/UI, tối ưu chuyển đổi và SEO. Hơn 200 dự án thành công.',
    descriptionLength: 85,
    h1: 'Thiết kế Website chuyên nghiệp',
    issues: ['Thiếu alt text cho 3 hình ảnh', 'Meta description ngắn']
  },
  {
    id: 4,
    name: 'Dashboard Dữ liệu',
    path: '/services/dashboard',
    score: 90,
    title: 'Dashboard Dữ liệu & AI Analytics - ClickStar',
    titleLength: 45,
    description: 'Dashboard dữ liệu real-time với AI Claude 4.7. Tích hợp Google Analytics, Ads, CRM. Bảo mật AES-256.',
    descriptionLength: 105,
    h1: 'Dashboard Dữ liệu thông minh',
    issues: []
  },
  {
    id: 5,
    name: 'CRM & CDP',
    path: '/services/crm-cdp',
    score: 45,
    title: 'CRM CDP',
    titleLength: 7,
    description: '',
    descriptionLength: 0,
    h1: '',
    issues: ['Title quá ngắn', 'Thiếu meta description', 'Không có H1 tag', 'Thiếu canonical URL']
  },
  {
    id: 6,
    name: 'Bảng giá',
    path: '/pricing',
    score: 78,
    title: 'Bảng giá dịch vụ - ClickStar',
    titleLength: 28,
    description: 'Bảng giá dịch vụ Digital Marketing, Website, Dashboard. Liên hệ để nhận báo giá chi tiết.',
    descriptionLength: 92,
    h1: 'Bảng giá dịch vụ',
    issues: ['Title tag trùng với trang khác']
  },
]

const seoChecklist = [
  { category: 'Meta Tags', items: [
    { name: 'Title tag (50-60 ký tự)', status: 'passed', count: '6/8' },
    { name: 'Meta description (150-160 ký tự)', status: 'warning', count: '5/8' },
    { name: 'Canonical URL', status: 'error', count: '7/8' },
    { name: 'Open Graph tags', status: 'passed', count: '8/8' },
  ]},
  { category: 'Content', items: [
    { name: 'H1 tag duy nhất', status: 'error', count: '7/8' },
    { name: 'Cấu trúc heading hợp lý', status: 'passed', count: '8/8' },
    { name: 'Alt text cho hình ảnh', status: 'warning', count: '85%' },
    { name: 'Internal links', status: 'passed', count: '100%' },
  ]},
  { category: 'Technical', items: [
    { name: 'Mobile responsive', status: 'passed', count: '8/8' },
    { name: 'Page speed (>80)', status: 'warning', count: '6/8' },
    { name: 'HTTPS', status: 'passed', count: '8/8' },
    { name: 'Sitemap.xml', status: 'passed', count: 'OK' },
    { name: 'Robots.txt', status: 'passed', count: 'OK' },
  ]},
]

const keywords = [
  { keyword: 'digital marketing việt nam', position: 8, change: 3, volume: 2400, difficulty: 45 },
  { keyword: 'thiết kế website', position: 12, change: -2, volume: 8100, difficulty: 62 },
  { keyword: 'crm cho doanh nghiệp', position: 15, change: 5, volume: 1300, difficulty: 38 },
  { keyword: 'dashboard dữ liệu', position: 6, change: 1, volume: 720, difficulty: 25 },
  { keyword: 'ai marketing', position: 4, change: 2, volume: 3200, difficulty: 52 },
]

export default function AdminSEO() {
  const [activeTab, setActiveTab] = useState('overview')
  const [scanning, setScanning] = useState(false)

  const runScan = () => {
    setScanning(true)
    setTimeout(() => setScanning(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SEO</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tối ưu SEO cho website</p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", scanning && "animate-spin")} />
          {scanning ? 'Đang quét...' : 'Quét lại'}
        </button>
      </div>

      {/* Overview cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Điểm SEO tổng</span>
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-3">
            <span className={cn("text-4xl font-bold", getScoreColor(seoOverview.score))}>
              {seoOverview.score}
            </span>
            <span className="text-slate-400 mb-1">/100</span>
          </div>
          <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", getScoreBg(seoOverview.score))}
              style={{ width: `${seoOverview.score}%` }}
            />
          </div>
        </div>

        {/* Critical issues */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Lỗi nghiêm trọng</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-4xl font-bold text-red-600">{seoOverview.issues.critical}</span>
          <p className="text-sm text-slate-500 mt-2">Cần sửa ngay</p>
        </div>

        {/* Warnings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Cảnh báo</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-4xl font-bold text-amber-600">{seoOverview.issues.warnings}</span>
          <p className="text-sm text-slate-500 mt-2">Nên cải thiện</p>
        </div>

        {/* Passed */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Đạt yêu cầu</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-4xl font-bold text-emerald-600">{seoOverview.issues.passed}</span>
          <p className="text-sm text-slate-500 mt-2">Tốt</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-6">
          {[
            { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
            { id: 'pages', label: 'Theo trang', icon: FileText },
            { id: 'keywords', label: 'Từ khóa', icon: Search },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Danh sách kiểm tra</h2>
            </div>
            <div className="p-5 space-y-6">
              {seoChecklist.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{section.category}</h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {item.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                          <span className="text-sm text-slate-700 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded",
                          item.status === 'passed' && "bg-emerald-100 text-emerald-700",
                          item.status === 'warning' && "bg-amber-100 text-amber-700",
                          item.status === 'error' && "bg-red-100 text-red-700"
                        )}>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick fixes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cần sửa ngay</h2>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {seoOverview.issues.critical} lỗi
              </span>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {pagesSeo.filter(p => p.issues.length > 0).slice(0, 5).map((page, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <Link 
                        href={`/admin/seo/${page.id}`}
                        className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary"
                      >
                        {page.name}
                      </Link>
                      <ul className="mt-1 space-y-1">
                        {page.issues.map((issue, i) => (
                          <li key={i} className="text-sm text-slate-500 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={`/admin/seo/${page.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Sửa
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trang</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vấn đề</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {pagesSeo.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{page.name}</p>
                        <p className="text-xs text-slate-500">{page.path}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
                        page.score >= 80 && "bg-emerald-100 text-emerald-700",
                        page.score >= 60 && page.score < 80 && "bg-amber-100 text-amber-700",
                        page.score < 60 && "bg-red-100 text-red-700"
                      )}>
                        {page.score}/100
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{page.title || '-'}</p>
                        <p className={cn(
                          "text-xs",
                          page.titleLength >= 50 && page.titleLength <= 60 ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {page.titleLength} ký tự
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{page.description || '-'}</p>
                        <p className={cn(
                          "text-xs",
                          page.descriptionLength >= 150 && page.descriptionLength <= 160 ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {page.descriptionLength} ký tự
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {page.issues.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {page.issues.length}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/seo/${page.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Theo dõi từ khóa</h2>
            <button className="text-sm text-primary hover:underline">+ Thêm từ khóa</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Từ khóa</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vị trí</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thay đổi</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lượt tìm/tháng</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Độ khó</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {keywords.map((kw, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{kw.keyword}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "text-sm font-bold",
                        kw.position <= 3 && "text-emerald-600",
                        kw.position > 3 && kw.position <= 10 && "text-blue-600",
                        kw.position > 10 && "text-slate-600"
                      )}>
                        #{kw.position}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-sm font-medium",
                        kw.change > 0 && "text-emerald-600",
                        kw.change < 0 && "text-red-600",
                        kw.change === 0 && "text-slate-500"
                      )}>
                        {kw.change > 0 ? (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            +{kw.change}
                          </>
                        ) : kw.change < 0 ? (
                          <>
                            <TrendingDown className="w-4 h-4" />
                            {kw.change}
                          </>
                        ) : (
                          '—'
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {kw.volume.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              kw.difficulty <= 30 && "bg-emerald-500",
                              kw.difficulty > 30 && kw.difficulty <= 60 && "bg-amber-500",
                              kw.difficulty > 60 && "bg-red-500"
                            )}
                            style={{ width: `${kw.difficulty}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{kw.difficulty}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
