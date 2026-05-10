'use client'

import { useState } from 'react'
import { 
  Search, Plus, Mail, Send, Clock, CheckCircle, XCircle, Users,
  Eye, Edit2, Trash2, Copy, BarChart3, ArrowUpRight, ArrowDownRight,
  MousePointer, RefreshCw, Calendar, FileText, Zap, Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

const campaigns = [
  { id: 1, name: 'Newsletter tháng 1/2024', status: 'sent', type: 'newsletter', recipients: 12500, sent: 12350, opened: 4520, clicked: 1250, bounced: 150, sentDate: '2024-01-15 09:00' },
  { id: 2, name: 'Khuyến mãi Tết 2024', status: 'sent', type: 'promotion', recipients: 8500, sent: 8420, opened: 3890, clicked: 2150, bounced: 80, sentDate: '2024-01-20 10:30' },
  { id: 3, name: 'Chào mừng khách hàng mới', status: 'active', type: 'automation', recipients: 0, sent: 3250, opened: 2100, clicked: 890, bounced: 45, sentDate: 'Tự động' },
  { id: 4, name: 'Nhắc giỏ hàng bỏ quên', status: 'active', type: 'automation', recipients: 0, sent: 1850, opened: 1200, clicked: 650, bounced: 30, sentDate: 'Tự động' },
  { id: 5, name: 'Flash Sale tháng 2', status: 'scheduled', type: 'promotion', recipients: 15000, sent: 0, opened: 0, clicked: 0, bounced: 0, sentDate: '2024-02-01 08:00' },
  { id: 6, name: 'Khảo sát hài lòng', status: 'draft', type: 'survey', recipients: 5000, sent: 0, opened: 0, clicked: 0, bounced: 0, sentDate: '-' },
]

const templates = [
  { id: 1, name: 'Newsletter cơ bản', category: 'Newsletter', uses: 45 },
  { id: 2, name: 'Khuyến mãi đặc biệt', category: 'Promotion', uses: 32 },
  { id: 3, name: 'Chào mừng khách mới', category: 'Welcome', uses: 28 },
  { id: 4, name: 'Thông báo sản phẩm', category: 'Product', uses: 15 },
]

const audiences = [
  { id: 1, name: 'Tất cả subscribers', count: 15420 },
  { id: 2, name: 'Khách hàng VIP', count: 2350 },
  { id: 3, name: 'Đã mua hàng 30 ngày', count: 1820 },
  { id: 4, name: 'Chưa mua hàng', count: 8500 },
  { id: 5, name: 'Bỏ giỏ hàng', count: 650 },
]

export default function EmailMarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [searchQuery, setSearchQuery] = useState('')

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0)
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0
  const clickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Email Marketing</h1>
          <p className="text-xs text-slate-500">Quản lý chiến dịch email và automation</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
          <Plus className="w-3.5 h-3.5" />
          Tạo chiến dịch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{totalSent.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500">Đã gửi</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{openRate}%</p>
              <p className="text-[10px] text-slate-500">Tỷ lệ mở</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
              <MousePointer className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{clickRate}%</p>
              <p className="text-[10px] text-slate-500">Tỷ lệ click</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">15,420</p>
              <p className="text-[10px] text-slate-500">Subscribers</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-pink-100 dark:bg-pink-900/30 rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-pink-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">4</p>
              <p className="text-[10px] text-slate-500">Automation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {[
          { id: 'campaigns', label: 'Chiến dịch' },
          { id: 'automation', label: 'Automation' },
          { id: 'templates', label: 'Mẫu email' },
          { id: 'audiences', label: 'Đối tượng' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'campaigns' && (
        <>
          {/* Search */}
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chiến dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
            />
          </div>

          {/* Campaigns table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Chiến dịch</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Loại</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Trạng thái</th>
                  <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Đã gửi</th>
                  <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Mở</th>
                  <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Click</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Ngày gửi</th>
                  <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-3 py-2">
                      <p className="text-xs font-medium text-slate-900 dark:text-white">{campaign.name}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn(
                        "px-1.5 py-0.5 text-[10px] font-medium rounded",
                        campaign.type === 'newsletter' && "bg-blue-100 text-blue-700",
                        campaign.type === 'promotion' && "bg-purple-100 text-purple-700",
                        campaign.type === 'automation' && "bg-pink-100 text-pink-700",
                        campaign.type === 'survey' && "bg-amber-100 text-amber-700"
                      )}>
                        {campaign.type === 'newsletter' ? 'Newsletter' : campaign.type === 'promotion' ? 'Khuyến mãi' : campaign.type === 'automation' ? 'Tự động' : 'Khảo sát'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn(
                        "px-1.5 py-0.5 text-[10px] font-medium rounded flex items-center gap-1 w-fit",
                        campaign.status === 'sent' && "bg-emerald-100 text-emerald-700",
                        campaign.status === 'active' && "bg-blue-100 text-blue-700",
                        campaign.status === 'scheduled' && "bg-amber-100 text-amber-700",
                        campaign.status === 'draft' && "bg-slate-100 text-slate-600"
                      )}>
                        {campaign.status === 'sent' && <CheckCircle className="w-2.5 h-2.5" />}
                        {campaign.status === 'active' && <RefreshCw className="w-2.5 h-2.5" />}
                        {campaign.status === 'scheduled' && <Clock className="w-2.5 h-2.5" />}
                        {campaign.status === 'sent' ? 'Đã gửi' : campaign.status === 'active' ? 'Đang chạy' : campaign.status === 'scheduled' ? 'Lên lịch' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                      {campaign.sent.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-xs text-slate-900 dark:text-white">{campaign.opened.toLocaleString()}</span>
                      {campaign.sent > 0 && (
                        <span className="text-[10px] text-slate-500 ml-1">
                          ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-xs text-slate-900 dark:text-white">{campaign.clicked.toLocaleString()}</span>
                      {campaign.opened > 0 && (
                        <span className="text-[10px] text-slate-500 ml-1">
                          ({((campaign.clicked / campaign.opened) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">{campaign.sentDate}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Xem báo cáo">
                          <BarChart3 className="w-3 h-3 text-slate-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Nhân bản">
                          <Copy className="w-3 h-3 text-slate-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Chỉnh sửa">
                          <Edit2 className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map(template => (
            <div key={template.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-primary transition-colors">
              <div className="w-full h-24 bg-slate-100 dark:bg-slate-700 rounded mb-2 flex items-center justify-center">
                <Mail className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-xs font-medium text-slate-900 dark:text-white">{template.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-500">{template.category}</span>
                <span className="text-[10px] text-slate-500">Đã dùng: {template.uses}</span>
              </div>
              <div className="flex gap-1 mt-2">
                <button className="flex-1 px-2 py-1 text-[10px] bg-primary text-white rounded hover:bg-primary/90">Sử dụng</button>
                <button className="px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50">Sửa</button>
              </div>
            </div>
          ))}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer min-h-[180px]">
            <Plus className="w-6 h-6 text-slate-400 mb-1" />
            <p className="text-xs text-slate-500">Tạo mẫu mới</p>
          </div>
        </div>
      )}

      {activeTab === 'audiences' && (
        <div className="space-y-3">
          {audiences.map(audience => (
            <div key={audience.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-white">{audience.name}</p>
                  <p className="text-[10px] text-slate-500">{audience.count.toLocaleString()} subscribers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-[10px] bg-primary text-white rounded hover:bg-primary/90">Gửi email</button>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                  <Edit2 className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="space-y-3">
          {campaigns.filter(c => c.type === 'automation').map(automation => (
            <div key={automation.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{automation.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">Đang hoạt động</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50">Tạm dừng</button>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                    <Edit2 className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{automation.sent.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">Đã gửi</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{automation.opened.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">Đã mở</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{automation.clicked.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">Đã click</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-emerald-600">{((automation.clicked / automation.opened) * 100).toFixed(1)}%</p>
                  <p className="text-[10px] text-slate-500">Tỷ lệ click</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
