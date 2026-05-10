'use client'

import { useState } from 'react'
import { 
  Search, Plus, Filter, MoreHorizontal, Play, Pause, Eye, Edit2, Trash2,
  TrendingUp, TrendingDown, DollarSign, Users, MousePointer, Target,
  Calendar, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Campaign = {
  id: number
  name: string
  platform: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
  startDate: string
  endDate: string
}

const campaigns: Campaign[] = [
  { id: 1, name: 'Tết Nguyên Đán 2024', platform: 'Google Ads', status: 'active', budget: 50000000, spent: 32500000, impressions: 125000, clicks: 4500, conversions: 120, ctr: 3.6, cpc: 7222, roas: 4.2, startDate: '2024-01-15', endDate: '2024-02-15' },
  { id: 2, name: 'Brand Awareness Q1', platform: 'Meta Ads', status: 'active', budget: 30000000, spent: 18000000, impressions: 320000, clicks: 8500, conversions: 85, ctr: 2.66, cpc: 2118, roas: 3.1, startDate: '2024-01-01', endDate: '2024-03-31' },
  { id: 3, name: 'Remarketing Website', platform: 'Google Ads', status: 'active', budget: 15000000, spent: 9800000, impressions: 45000, clicks: 2100, conversions: 95, ctr: 4.67, cpc: 4667, roas: 5.8, startDate: '2024-01-10', endDate: '2024-02-28' },
  { id: 4, name: 'Flash Sale 12.12', platform: 'TikTok Ads', status: 'completed', budget: 20000000, spent: 20000000, impressions: 580000, clicks: 15000, conversions: 210, ctr: 2.59, cpc: 1333, roas: 6.5, startDate: '2023-12-10', endDate: '2023-12-13' },
  { id: 5, name: 'Lead Gen B2B', platform: 'LinkedIn Ads', status: 'paused', budget: 25000000, spent: 12500000, impressions: 35000, clicks: 1200, conversions: 45, ctr: 3.43, cpc: 10417, roas: 2.8, startDate: '2024-01-05', endDate: '2024-02-05' },
  { id: 6, name: 'Summer Sale 2024', platform: 'Meta Ads', status: 'draft', budget: 40000000, spent: 0, impressions: 0, clicks: 0, conversions: 0, ctr: 0, cpc: 0, roas: 0, startDate: '2024-06-01', endDate: '2024-06-30' },
]

const platforms = ['Tất cả', 'Google Ads', 'Meta Ads', 'TikTok Ads', 'LinkedIn Ads']

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('Tất cả')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPlatform = selectedPlatform === 'Tất cả' || campaign.platform === selectedPlatform
    const matchStatus = selectedStatus === 'all' || campaign.status === selectedStatus
    return matchSearch && matchPlatform && matchStatus
  })

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgRoas = campaigns.filter(c => c.roas > 0).reduce((sum, c) => sum + c.roas, 0) / campaigns.filter(c => c.roas > 0).length

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Chiến dịch</h1>
          <p className="text-xs text-slate-500">Quản lý chiến dịch quảng cáo đa nền tảng</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
          <Plus className="w-3.5 h-3.5" />
          Tạo chiến dịch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+12%
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{formatCurrency(totalBudget)}</p>
          <p className="text-[10px] text-slate-500">Tổng ngân sách</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+8%
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{formatCurrency(totalSpent)}</p>
          <p className="text-[10px] text-slate-500">Đã chi tiêu</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+25%
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{totalConversions}</p>
          <p className="text-[10px] text-slate-500">Chuyển đổi</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-md flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+0.5
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{avgRoas.toFixed(1)}x</p>
          <p className="text-[10px] text-slate-500">ROAS trung bình</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
          />
        </div>
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
        >
          {platforms.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang chạy</option>
          <option value="paused">Tạm dừng</option>
          <option value="completed">Hoàn thành</option>
          <option value="draft">Bản nháp</option>
        </select>
      </div>

      {/* Campaigns table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Chiến dịch</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Nền tảng</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Trạng thái</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Ngân sách</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Đã chi</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Clicks</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">CTR</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Conv.</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">ROAS</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredCampaigns.map(campaign => (
              <tr key={campaign.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{campaign.name}</p>
                    <p className="text-[10px] text-slate-500">{campaign.startDate} - {campaign.endDate}</p>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "px-1.5 py-0.5 text-[10px] font-medium rounded",
                    campaign.platform === 'Google Ads' && "bg-blue-100 text-blue-700",
                    campaign.platform === 'Meta Ads' && "bg-indigo-100 text-indigo-700",
                    campaign.platform === 'TikTok Ads' && "bg-pink-100 text-pink-700",
                    campaign.platform === 'LinkedIn Ads' && "bg-sky-100 text-sky-700"
                  )}>
                    {campaign.platform}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "px-1.5 py-0.5 text-[10px] font-medium rounded flex items-center gap-1 w-fit",
                    campaign.status === 'active' && "bg-emerald-100 text-emerald-700",
                    campaign.status === 'paused' && "bg-amber-100 text-amber-700",
                    campaign.status === 'completed' && "bg-slate-100 text-slate-700",
                    campaign.status === 'draft' && "bg-slate-100 text-slate-500"
                  )}>
                    {campaign.status === 'active' && <Play className="w-2.5 h-2.5" />}
                    {campaign.status === 'paused' && <Pause className="w-2.5 h-2.5" />}
                    {campaign.status === 'active' ? 'Đang chạy' : campaign.status === 'paused' ? 'Tạm dừng' : campaign.status === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                  {formatCurrency(campaign.budget)}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="text-xs text-slate-900 dark:text-white">{formatCurrency(campaign.spent)}</div>
                  <div className="w-16 h-1 bg-slate-100 dark:bg-slate-700 rounded-full ml-auto mt-1">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                  {campaign.clicks.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                  {campaign.ctr}%
                </td>
                <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                  {campaign.conversions}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={cn(
                    "text-xs font-medium",
                    campaign.roas >= 4 ? "text-emerald-600" : campaign.roas >= 2 ? "text-amber-600" : "text-slate-500"
                  )}>
                    {campaign.roas > 0 ? `${campaign.roas}x` : '-'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    {campaign.status === 'active' ? (
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Tạm dừng">
                        <Pause className="w-3 h-3 text-slate-400" />
                      </button>
                    ) : campaign.status !== 'completed' && (
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Bắt đầu">
                        <Play className="w-3 h-3 text-slate-400" />
                      </button>
                    )}
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Chỉnh sửa">
                      <Edit2 className="w-3 h-3 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Xem báo cáo">
                      <BarChart3 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
