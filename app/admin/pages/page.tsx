'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Copy,
  ExternalLink, CheckCircle2, Clock, Lock, Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'

const pages = [
  { id: 1, name: 'Trang chủ', path: '/', status: 'published', views: 8234, seoScore: 92, visibility: 'public' },
  { id: 2, name: 'Digital Marketing', path: '/services/digital-marketing', status: 'published', views: 3421, seoScore: 88, visibility: 'public' },
  { id: 3, name: 'Thiết kế Website', path: '/services/website', status: 'published', views: 2876, seoScore: 85, visibility: 'public' },
  { id: 4, name: 'Dashboard Dữ liệu', path: '/services/dashboard', status: 'published', views: 2145, seoScore: 90, visibility: 'public' },
  { id: 5, name: 'CRM & CDP', path: '/services/crm-cdp', status: 'draft', views: 0, seoScore: 45, visibility: 'private' },
  { id: 6, name: 'Giới thiệu', path: '/about', status: 'published', views: 1654, seoScore: 82, visibility: 'public' },
  { id: 7, name: 'Bảng giá', path: '/pricing', status: 'published', views: 4521, seoScore: 78, visibility: 'public' },
  { id: 8, name: 'Tin tức', path: '/blog', status: 'published', views: 3287, seoScore: 95, visibility: 'public' },
]

export default function AdminPages() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [showActions, setShowActions] = useState<number | null>(null)

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([])
    } else {
      setSelectedPages(filteredPages.map(p => p.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedPages(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30'
    if (score >= 60) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
    return 'text-red-600 bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Quản lý trang</h1>
          <p className="text-xs text-slate-500">Quản lý các trang trên website</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-1.5 px-2 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm trang
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
          >
            <option value="all">Tất cả</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        {selectedPages.length > 0 && (
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-600">Đã chọn {selectedPages.length}</span>
            <button className="text-[10px] text-primary hover:underline">Xuất bản</button>
            <button className="text-[10px] text-amber-600 hover:underline">Nháp</button>
            <button className="text-[10px] text-red-600 hover:underline">Xóa</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <th className="text-left px-3 py-2 w-8">
                <input
                  type="checkbox"
                  checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 w-3.5 h-3.5"
                />
              </th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Tên trang</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase hidden sm:table-cell">Trạng thái</th>
              <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase hidden md:table-cell">SEO</th>
              <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase hidden lg:table-cell">Views</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredPages.map((page) => (
              <tr 
                key={page.id} 
                className={cn(
                  "hover:bg-slate-50 dark:hover:bg-slate-700/50",
                  selectedPages.includes(page.id) && "bg-primary/5"
                )}
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page.id)}
                    onChange={() => toggleSelect(page.id)}
                    className="rounded border-slate-300 w-3.5 h-3.5"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3 h-3 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{page.name}</p>
                        {page.visibility === 'private' && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{page.path}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 hidden sm:table-cell">
                  <span className={cn(
                    "inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded",
                    page.status === 'published' 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {page.status === 'published' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {page.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-3 py-2 text-center hidden md:table-cell">
                  <span className={cn("px-1.5 py-0.5 text-[10px] font-semibold rounded", getSeoScoreColor(page.seoScore))}>
                    {page.seoScore}
                  </span>
                </td>
                <td className="px-3 py-2 text-center hidden lg:table-cell">
                  <span className="text-[10px] text-slate-500">{page.views.toLocaleString()}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-0.5">
                    <Link
                      href={page.path}
                      target="_blank"
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="Xem"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="Sửa"
                    >
                      <Edit className="w-3 h-3 text-slate-400" />
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === page.id ? null : page.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      >
                        <MoreHorizontal className="w-3 h-3 text-slate-400" />
                      </button>
                      {showActions === page.id && (
                        <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-slate-800 rounded shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                          <button className="flex items-center gap-1.5 w-full px-2 py-1 text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Copy className="w-3 h-3" />
                            Nhân bản
                          </button>
                          <button className="flex items-center gap-1.5 w-full px-2 py-1 text-[10px] text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Trash2 className="w-3 h-3" />
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <p className="text-[10px] text-slate-500">{filteredPages.length} / {pages.length} trang</p>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-2 py-1 text-[10px] bg-primary text-white rounded">1</button>
            <button className="px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
