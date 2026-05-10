'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Search,
  BarChart3,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const statsCards = [
  {
    title: 'Lượt truy cập',
    value: '24,589',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
    color: 'bg-blue-500'
  },
  {
    title: 'Người dùng mới',
    value: '1,245',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'bg-emerald-500'
  },
  {
    title: 'Tỷ lệ chuyển đổi',
    value: '3.24%',
    change: '-0.4%',
    trend: 'down',
    icon: MousePointer,
    color: 'bg-purple-500'
  },
  {
    title: 'Leads mới',
    value: '156',
    change: '+23.1%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-orange-500'
  }
]

const recentPages = [
  { name: 'Trang chủ', path: '/', views: 8234, status: 'published' },
  { name: 'Digital Marketing', path: '/services/digital-marketing', views: 3421, status: 'published' },
  { name: 'Thiết kế Website', path: '/services/website', views: 2876, status: 'published' },
  { name: 'Dashboard Dữ liệu', path: '/services/dashboard', views: 2145, status: 'published' },
  { name: 'CRM & CDP', path: '/services/crm-cdp', views: 1987, status: 'draft' },
  { name: 'Giới thiệu', path: '/about', views: 1654, status: 'published' },
]

const seoIssues = [
  { page: 'Blog - AI Marketing', issue: 'Meta description quá dài', severity: 'warning' },
  { page: 'Dịch vụ Dashboard', issue: 'Thiếu alt text cho 3 hình ảnh', severity: 'warning' },
  { page: 'Trang Pricing', issue: 'Title tag trùng lặp', severity: 'error' },
  { page: 'CRM & CDP', issue: 'Không có H1 tag', severity: 'error' },
]

const recentLeads = [
  { name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', source: 'Google Ads', time: '5 phút trước' },
  { name: 'Trần Thị B', email: 'tranthib@company.vn', source: 'Facebook', time: '23 phút trước' },
  { name: 'Lê Văn C', email: 'levanc@business.com', source: 'Organic', time: '1 giờ trước' },
  { name: 'Phạm Thị D', email: 'phamthid@corp.vn', source: 'Referral', time: '2 giờ trước' },
]

const trafficSources = [
  { name: 'Google', value: 45, color: 'bg-blue-500' },
  { name: 'Facebook', value: 25, color: 'bg-indigo-500' },
  { name: 'Direct', value: 15, color: 'bg-emerald-500' },
  { name: 'Referral', value: 10, color: 'bg-orange-500' },
  { name: 'Others', value: 5, color: 'bg-slate-400' },
]

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Tổng quan hoạt động website</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
          >
            <option value="today">Hôm nay</option>
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
          </select>
          <button className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-700">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", stat.color)}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                stat.trend === 'up' ? "text-emerald-600" : "text-red-600"
              )}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-3">
        {/* Traffic chart placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Lưu lượng truy cập</h2>
            <button className="text-xs text-primary hover:underline">Xem chi tiết</button>
          </div>
          
          {/* Simple chart representation */}
          <div className="h-40 flex items-end gap-1">
            {[35, 45, 30, 55, 40, 65, 50, 70, 45, 80, 60, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-primary/20 rounded-t hover:bg-primary/30 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t transition-all"
                    style={{ height: `${height * 0.7}%` }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(height * 100)}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2', 'T3', 'T4', 'T5', 'T6'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Nguồn truy cập</h2>
          
          <div className="space-y-2.5">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600 dark:text-slate-300">{source.name}</span>
                  <span className="text-xs font-medium text-slate-900 dark:text-white">{source.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", source.color)}
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Link href="/admin/reports" className="text-xs text-primary hover:underline flex items-center gap-1">
              Xem báo cáo đầy đủ
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid lg:grid-cols-2 gap-3">
        {/* Pages performance */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Hiệu suất trang</h2>
            <Link href="/admin/pages" className="text-xs text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {recentPages.map((page, index) => (
              <div key={index} className="px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                    <FileText className="w-3 h-3 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{page.name}</p>
                    <p className="text-[10px] text-slate-500">{page.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{page.views.toLocaleString()}</p>
                  </div>
                  <span className={cn(
                    "px-1.5 py-0.5 text-[10px] font-medium rounded",
                    page.status === 'published' 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {page.status === 'published' ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Issues */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Vấn đề SEO</h2>
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">
                {seoIssues.length}
              </span>
            </div>
            <Link href="/admin/seo" className="text-xs text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {seoIssues.map((issue, index) => (
              <div key={index} className="px-3 py-2 flex items-start gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                {issue.severity === 'error' ? (
                  <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-white">{issue.page}</p>
                  <p className="text-[10px] text-slate-500">{issue.issue}</p>
                </div>
                <button className="text-xs text-primary hover:underline">Sửa</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Leads mới nhất</h2>
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <Link href="/admin/leads" className="text-xs text-primary hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tên</th>
                <th className="text-left px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Nguồn</th>
                <th className="text-left px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Thời gian</th>
                <th className="text-right px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentLeads.map((lead, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-[10px] font-medium">{lead.name.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300">{lead.email}</td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-500 dark:text-slate-400">
                    {lead.time}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          { label: 'Thêm trang mới', href: '/admin/pages/new', icon: FileText, color: 'bg-blue-500' },
          { label: 'Kiểm tra SEO', href: '/admin/seo', icon: Search, color: 'bg-emerald-500' },
          { label: 'Xem báo cáo', href: '/admin/reports', icon: BarChart3, color: 'bg-purple-500' },
          { label: 'Tích hợp dữ liệu', href: '/admin/integrations', icon: Globe, color: 'bg-orange-500' },
        ].map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-sm transition-all group"
          >
            <div className={cn("w-7 h-7 rounded flex items-center justify-center", action.color)}>
              <action.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
