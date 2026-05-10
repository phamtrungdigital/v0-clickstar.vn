'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

const overviewStats = [
  { label: 'Tổng lượt xem', value: '124,589', change: '+12.5%', trend: 'up', icon: Eye },
  { label: 'Người dùng', value: '45,231', change: '+8.2%', trend: 'up', icon: Users },
  { label: 'Tỷ lệ chuyển đổi', value: '3.24%', change: '-0.4%', trend: 'down', icon: MousePointer },
  { label: 'Thời gian trung bình', value: '2m 45s', change: '+15s', trend: 'up', icon: Clock },
]

const topPages = [
  { path: '/', name: 'Trang chủ', views: 32450, users: 28340, bounceRate: 32.5, avgTime: '1:45' },
  { path: '/services/digital-marketing', name: 'Digital Marketing', views: 18234, users: 15678, bounceRate: 28.4, avgTime: '2:30' },
  { path: '/pricing', name: 'Bảng giá', views: 15678, users: 12456, bounceRate: 25.2, avgTime: '3:15' },
  { path: '/blog', name: 'Tin tức', views: 12345, users: 10234, bounceRate: 35.8, avgTime: '4:20' },
  { path: '/services/website', name: 'Thiết kế Website', views: 9876, users: 8234, bounceRate: 30.1, avgTime: '2:10' },
]

const trafficSources = [
  { name: 'Organic Search', sessions: 45230, percentage: 42, icon: Globe, color: 'bg-emerald-500' },
  { name: 'Paid Search', sessions: 23456, percentage: 22, icon: MousePointer, color: 'bg-blue-500' },
  { name: 'Social', sessions: 18234, percentage: 17, icon: Users, color: 'bg-purple-500' },
  { name: 'Direct', sessions: 12345, percentage: 11, icon: Monitor, color: 'bg-orange-500' },
  { name: 'Referral', sessions: 8567, percentage: 8, icon: TrendingUp, color: 'bg-pink-500' },
]

const devices = [
  { name: 'Mobile', percentage: 58, sessions: 62340, icon: Smartphone },
  { name: 'Desktop', percentage: 35, sessions: 37620, icon: Monitor },
  { name: 'Tablet', percentage: 7, sessions: 7520, icon: Monitor },
]

const chartData = [
  { day: 'T2', views: 4500, users: 3200 },
  { day: 'T3', views: 5200, users: 3800 },
  { day: 'T4', views: 4800, users: 3400 },
  { day: 'T5', views: 6100, users: 4500 },
  { day: 'T6', views: 5800, users: 4200 },
  { day: 'T7', views: 7200, users: 5100 },
  { day: 'CN', views: 6800, users: 4800 },
]

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('7d')
  const [refreshing, setRefreshing] = useState(false)

  const maxViews = Math.max(...chartData.map(d => d.views))

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Báo cáo</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Phân tích và thống kê website</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            {['today', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  dateRange === range 
                    ? "bg-primary text-white" 
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {range === 'today' ? 'Hôm nay' : range === '7d' ? '7 ngày' : range === '30d' ? '30 ngày' : '90 ngày'}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4 text-slate-600", refreshing && "animate-spin")} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
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
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Lưu lượng truy cập</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-slate-600 dark:text-slate-400">Lượt xem</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-slate-600 dark:text-slate-400">Người dùng</span>
              </div>
            </div>
          </div>
          
          {/* Simple bar chart */}
          <div className="h-64 flex items-end gap-4">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end justify-center" style={{ height: '200px' }}>
                  <div 
                    className="w-5 bg-primary rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                    style={{ height: `${(data.views / maxViews) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {data.views.toLocaleString()} views
                    </div>
                  </div>
                  <div 
                    className="w-5 bg-emerald-500 rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                    style={{ height: `${(data.users / maxViews) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {data.users.toLocaleString()} users
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{data.day}</span>
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
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", source.color)}>
                      <source.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", source.color)}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{source.sessions.toLocaleString()} sessions</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top pages */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Trang phổ biến nhất</h2>
            <button className="text-sm text-primary hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trang</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lượt xem</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Người dùng</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bounce Rate</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thời gian TB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{page.name}</p>
                        <p className="text-xs text-slate-500">{page.path}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-slate-700 dark:text-slate-300">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-slate-700 dark:text-slate-300">
                      {page.users.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={cn(
                        "text-sm font-medium",
                        page.bounceRate < 30 ? "text-emerald-600" : page.bounceRate < 40 ? "text-amber-600" : "text-red-600"
                      )}>
                        {page.bounceRate}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-slate-700 dark:text-slate-300">
                      {page.avgTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Thiết bị</h2>
          
          {/* Donut chart representation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {devices.reduce((acc, device, i) => {
                  const offset = acc.offset
                  const circumference = 2 * Math.PI * 40
                  const strokeDasharray = (device.percentage / 100) * circumference
                  const colors = ['#3b82f6', '#10b981', '#f59e0b']
                  
                  acc.elements.push(
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[i]}
                      strokeWidth="12"
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={-offset}
                      className="transition-all"
                    />
                  )
                  acc.offset += strokeDasharray
                  return acc
                }, { elements: [] as JSX.Element[], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {devices.reduce((sum, d) => sum + d.sessions, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">sessions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    index === 0 && "bg-blue-100 text-blue-600",
                    index === 1 && "bg-emerald-100 text-emerald-600",
                    index === 2 && "bg-amber-100 text-amber-600"
                  )}>
                    <device.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{device.name}</p>
                    <p className="text-xs text-slate-500">{device.sessions.toLocaleString()} sessions</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{device.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
