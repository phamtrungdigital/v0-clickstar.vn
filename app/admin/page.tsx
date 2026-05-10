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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tổng quan hoạt động website</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          >
            <option value="today">Hôm nay</option>
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                stat.trend === 'up' ? "text-emerald-600" : "text-red-600"
              )}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic chart placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Lưu lượng truy cập</h2>
            <button className="text-sm text-primary hover:underline">Xem chi tiết</button>
          </div>
          
          {/* Simple chart representation */}
          <div className="h-64 flex items-end gap-2">
            {[35, 45, 30, 55, 40, 65, 50, 70, 45, 80, 60, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 rounded-t hover:bg-primary/30 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t transition-all"
                    style={{ height: `${height * 0.7}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(height * 100)} visits
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2', 'T3', 'T4', 'T5', 'T6'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Nguồn truy cập</h2>
          
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{source.name}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{source.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", source.color)}
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/admin/reports" className="text-sm text-primary hover:underline flex items-center gap-1">
              Xem báo cáo đầy đủ
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pages performance */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hiệu suất trang</h2>
            <Link href="/admin/pages" className="text-sm text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {recentPages.map((page, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{page.name}</p>
                    <p className="text-xs text-slate-500">{page.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{page.views.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">lượt xem</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    page.status === 'published' 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Issues */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vấn đề SEO</h2>
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {seoIssues.length}
              </span>
            </div>
            <Link href="/admin/seo" className="text-sm text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {seoIssues.map((issue, index) => (
              <div key={index} className="p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                {issue.severity === 'error' ? (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{issue.page}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{issue.issue}</p>
                </div>
                <button className="text-sm text-primary hover:underline">Sửa</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Leads mới nhất</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <Link href="/admin/leads" className="text-sm text-primary hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nguồn</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thời gian</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentLeads.map((lead, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-medium">{lead.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.email}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lead.time}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Thêm trang mới', href: '/admin/pages/new', icon: FileText, color: 'bg-blue-500' },
          { label: 'Kiểm tra SEO', href: '/admin/seo', icon: Search, color: 'bg-emerald-500' },
          { label: 'Xem báo cáo', href: '/admin/reports', icon: BarChart3, color: 'bg-purple-500' },
          { label: 'Tích hợp dữ liệu', href: '/admin/integrations', icon: Globe, color: 'bg-orange-500' },
        ].map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", action.color)}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
