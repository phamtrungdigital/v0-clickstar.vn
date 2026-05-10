'use client'

import { useState } from 'react'
import { 
  Search, Plus, Filter, MoreHorizontal, Phone, Mail, MessageSquare,
  User, Calendar, Tag, Star, StarOff, CheckCircle, Clock, XCircle,
  ArrowUpRight, ArrowDownRight, Download, Upload, Eye, Edit2, Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Lead = {
  id: number
  name: string
  email: string
  phone: string
  company?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  value?: number
  score: number
  starred: boolean
  createdAt: string
  lastContact?: string
  notes?: string
}

const leads: Lead[] = [
  { id: 1, name: 'Nguyễn Văn Minh', email: 'minh.nguyen@company.vn', phone: '0912345678', company: 'ABC Corp', source: 'Website', status: 'new', value: 50000000, score: 85, starred: true, createdAt: '2024-01-20 14:30', notes: 'Quan tâm gói Digital Marketing' },
  { id: 2, name: 'Trần Thị Hoa', email: 'hoa.tran@startup.vn', phone: '0987654321', company: 'Startup XYZ', source: 'Google Ads', status: 'contacted', value: 30000000, score: 72, starred: false, createdAt: '2024-01-19 09:15', lastContact: '2024-01-20' },
  { id: 3, name: 'Lê Hoàng Nam', email: 'nam.le@enterprise.vn', phone: '0909123456', company: 'Enterprise Ltd', source: 'Referral', status: 'qualified', value: 150000000, score: 92, starred: true, createdAt: '2024-01-18 16:45', lastContact: '2024-01-19' },
  { id: 4, name: 'Phạm Minh Tâm', email: 'tam.pham@sme.vn', phone: '0911222333', company: 'SME Việt Nam', source: 'Facebook', status: 'proposal', value: 80000000, score: 88, starred: false, createdAt: '2024-01-15 11:00', lastContact: '2024-01-20' },
  { id: 5, name: 'Đỗ Thành Long', email: 'long.do@tech.vn', phone: '0922333444', company: 'Tech Solutions', source: 'Website', status: 'won', value: 120000000, score: 95, starred: true, createdAt: '2024-01-10 08:30', lastContact: '2024-01-18' },
  { id: 6, name: 'Vũ Thị Mai', email: 'mai.vu@retail.vn', phone: '0933444555', source: 'Google Ads', status: 'lost', value: 25000000, score: 45, starred: false, createdAt: '2024-01-08 13:20', lastContact: '2024-01-12' },
  { id: 7, name: 'Hoàng Đức Anh', email: 'anh.hoang@media.vn', phone: '0944555666', company: 'Media Group', source: 'LinkedIn', status: 'new', value: 45000000, score: 68, starred: false, createdAt: '2024-01-20 16:00' },
  { id: 8, name: 'Ngô Thị Lan', email: 'lan.ngo@fashion.vn', phone: '0955666777', company: 'Fashion Store', source: 'Instagram', status: 'contacted', value: 35000000, score: 75, starred: false, createdAt: '2024-01-19 10:45', lastContact: '2024-01-20' },
]

const statusConfig = {
  new: { label: 'Mới', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Đã liên hệ', color: 'bg-amber-100 text-amber-700' },
  qualified: { label: 'Đủ điều kiện', color: 'bg-purple-100 text-purple-700' },
  proposal: { label: 'Báo giá', color: 'bg-indigo-100 text-indigo-700' },
  won: { label: 'Thành công', color: 'bg-emerald-100 text-emerald-700' },
  lost: { label: 'Thất bại', color: 'bg-red-100 text-red-700' },
}

const sources = ['Tất cả', 'Website', 'Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Referral']

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState('Tất cả')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [leadList, setLeadList] = useState(leads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filteredLeads = leadList.filter(lead => {
    const matchSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchSource = selectedSource === 'Tất cả' || lead.source === selectedSource
    const matchStatus = selectedStatus === 'all' || lead.status === selectedStatus
    return matchSearch && matchSource && matchStatus
  })

  const toggleStar = (id: number) => {
    setLeadList(prev => prev.map(l => l.id === id ? { ...l, starred: !l.starred } : l))
  }

  const totalValue = leads.filter(l => l.status !== 'lost').reduce((sum, l) => sum + (l.value || 0), 0)
  const wonValue = leads.filter(l => l.status === 'won').reduce((sum, l) => sum + (l.value || 0), 0)
  const conversionRate = leads.length > 0 ? ((leads.filter(l => l.status === 'won').length / leads.length) * 100).toFixed(1) : 0

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} tỷ`
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)} triệu`
    return `${(value / 1000).toFixed(0)}K`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Leads</h1>
          <p className="text-xs text-slate-500">Quản lý khách hàng tiềm năng</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50">
            <Download className="w-3 h-3" />
            Xuất file
          </button>
          <button className="inline-flex items-center gap-1.5 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50">
            <Upload className="w-3 h-3" />
            Nhập file
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5" />
            Thêm lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+15%
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{leads.length}</p>
          <p className="text-[10px] text-slate-500">Tổng leads</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
              <Tag className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{formatCurrency(totalValue)}</p>
          <p className="text-[10px] text-slate-500">Giá trị tiềm năng</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{formatCurrency(wonValue)}</p>
          <p className="text-[10px] text-slate-500">Đã chốt</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-md flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{conversionRate}%</p>
          <p className="text-[10px] text-slate-500">Tỷ lệ chuyển đổi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, công ty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
          />
        </div>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
        >
          {sources.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
        >
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(statusConfig).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Pipeline view */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
        {Object.entries(statusConfig).map(([key, val]) => {
          const count = leads.filter(l => l.status === key).length
          return (
            <button
              key={key}
              onClick={() => setSelectedStatus(selectedStatus === key ? 'all' : key)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap",
                selectedStatus === key
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              {val.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Leads table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <th className="w-8 px-3 py-2"></th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Khách hàng</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Công ty</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Nguồn</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Trạng thái</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Giá trị</th>
              <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Điểm</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Ngày tạo</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-3 py-2">
                  <button onClick={() => toggleStar(lead.id)}>
                    {lead.starred ? (
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Star className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{lead.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <Mail className="w-2.5 h-2.5" />
                        {lead.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
                  {lead.company || '-'}
                </td>
                <td className="px-3 py-2">
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded">
                    {lead.source}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "px-1.5 py-0.5 text-[10px] font-medium rounded",
                    statusConfig[lead.status].color
                  )}>
                    {statusConfig[lead.status].label}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-xs text-slate-600 dark:text-slate-400">
                  {lead.value ? formatCurrency(lead.value) : '-'}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={cn(
                    "px-1.5 py-0.5 text-[10px] font-medium rounded",
                    lead.score >= 80 ? "bg-emerald-100 text-emerald-700" :
                    lead.score >= 60 ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {lead.score}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {lead.createdAt}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Gọi điện">
                      <Phone className="w-3 h-3 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Gửi email">
                      <Mail className="w-3 h-3 text-slate-400" />
                    </button>
                    <button 
                      onClick={() => setSelectedLead(lead)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Chi tiết Lead</h3>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <XCircle className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-lg font-semibold">{selectedLead.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedLead.name}</p>
                  <p className="text-xs text-slate-500">{selectedLead.company || 'Cá nhân'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <p className="text-[10px] text-slate-500 mb-0.5">Email</p>
                  <p className="text-xs text-slate-900 dark:text-white">{selectedLead.email}</p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <p className="text-[10px] text-slate-500 mb-0.5">Điện thoại</p>
                  <p className="text-xs text-slate-900 dark:text-white">{selectedLead.phone}</p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <p className="text-[10px] text-slate-500 mb-0.5">Nguồn</p>
                  <p className="text-xs text-slate-900 dark:text-white">{selectedLead.source}</p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <p className="text-[10px] text-slate-500 mb-0.5">Giá trị</p>
                  <p className="text-xs text-slate-900 dark:text-white">{selectedLead.value ? formatCurrency(selectedLead.value) : '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 mb-1">Trạng thái</p>
                <select 
                  value={selectedLead.status}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                >
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 mb-1">Ghi chú</p>
                <textarea 
                  defaultValue={selectedLead.notes || ''}
                  rows={3}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900 resize-none"
                  placeholder="Thêm ghi chú..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-100"
              >
                Đóng
              </button>
              <button className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
