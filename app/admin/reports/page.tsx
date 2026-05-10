'use client'

import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, Users, Eye, MousePointer, Clock,
  Globe, Smartphone, Monitor, Download, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const overviewStats = [
  { label: 'Lượt xem', value: '124,589', change: '+12.5%', trend: 'up', icon: Eye },
  { label: 'Người dùng', value: '45,231', change: '+8.2%', trend: 'up', icon: Users },
  { label: 'Chuyển đổi', value: '3.24%', change: '-0.4%', trend: 'down', icon: MousePointer },
  { label: 'Avg. time', value: '2m 45s', change: '+15s', trend: 'up', icon: Clock },
]

const topPages = [
  { path: '/', name: 'Trang chủ', views: 32450, bounceRate: 32.5 },
  { path: '/services/digital-marketing', name: 'Digital Marketing', views: 18234, bounceRate: 28.4 },
  { path: '/pricing', name: 'Bảng giá', views: 15678, bounceRate: 25.2 },
  { path: '/blog', name: 'Tin tức', views: 12345, bounceRate: 35.8 },
  { path: '/services/website', name: 'Website', views: 9876, bounceRate: 30.1 },
]

const trafficSources = [
  { name: 'Organic', sessions: 45230, percentage: 42, color: 'bg-emerald-500' },
  { name: 'Paid', sessions: 23456, percentage: 22, color: 'bg-blue-500' },
  { name: 'Social', sessions: 18234, percentage: 17, color: 'bg-purple-500' },
  { name: 'Direct', sessions: 12345, percentage: 11, color: 'bg-orange-500' },
  { name: 'Referral', sessions: 8567, percentage: 8, color: 'bg-pink-500' },
]

const devices = [
  { name: 'Mobile', percentage: 58, icon: Smartphone },
  { name: 'Desktop', percentage: 35, icon: Monitor },
  { name: 'Tablet', percentage: 7, icon: Monitor },
]

const chartData = [
  { day: 'T2', views: 4500 },
  { day: 'T3', views: 5200 },
  { day: 'T4', views: 4800 },
  { day: 'T5', views: 6100 },
  { day: 'T6', views: 5800 },
  { day: 'T7', views: 7200 },
  { day: 'CN', views: 6800 },
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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Báo cáo</h1>
          <p className="text-xs text-slate-500">Phân tích và thống kê website</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-0.5">
            {['today', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-2 py-1 text-[10px] font-medium rounded transition-colors",
                  dateRange === range 
                    ? "bg-primary text-white" 
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                )}
              >
                {range === 'today' ? 'Hôm nay' : range === '7d' ? '7 ngày' : range === '30d' ? '30 ngày' : '90 ngày'}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-slate-500", refreshing && "animate-spin")} />
          </button>
          <button className="flex items-center gap-1 px-2 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">{stat.label}</span>
              <stat.icon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</span>
              <span className={cn(
                "flex items-center text-[10px] font-medium mb-0.5",
                stat.trend === 'up' ? "text-emerald-600" : "text-red-600"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Lượt xem theo ngày</h3>
          <div className="flex items-end gap-2 h-32">
            {chartData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                  style={{ height: `${(item.views / maxViews) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-[10px] text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Nguồn traffic</h3>
          <div className="space-y-2">
            {trafficSources.map((source) => (
              <div key={source.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">{source.name}</span>
                  <span className="text-[10px] font-medium text-slate-900 dark:text-white">{source.percentage}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", source.color)} style={{ width: `${source.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        {/* Top pages */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Top trang được xem</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="text-left px-3 py-1.5 text-[10px] font-semibold text-slate-500">Trang</th>
                <th className="text-right px-3 py-1.5 text-[10px] font-semibold text-slate-500">Views</th>
                <th className="text-right px-3 py-1.5 text-[10px] font-semibold text-slate-500">Bounce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {topPages.map((page) => (
                <tr key={page.path} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-3 py-2">
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{page.name}</p>
                    <p className="text-[10px] text-slate-500">{page.path}</p>
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                    {page.bounceRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Devices */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Thiết bị</h3>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.name} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                  <device.icon className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-900 dark:text-white">{device.name}</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${device.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
