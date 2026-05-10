'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ArrowUpDown,
  Globe,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const pages = [
  { 
    id: 1, 
    name: 'Trang chủ', 
    path: '/', 
    status: 'published', 
    author: 'Admin',
    lastModified: '2024-01-15 10:30',
    views: 8234,
    seoScore: 92,
    visibility: 'public'
  },
  { 
    id: 2, 
    name: 'Digital Marketing', 
    path: '/services/digital-marketing', 
    status: 'published', 
    author: 'Admin',
    lastModified: '2024-01-14 15:45',
    views: 3421,
    seoScore: 88,
    visibility: 'public'
  },
  { 
    id: 3, 
    name: 'Thiết kế Website', 
    path: '/services/website', 
    status: 'published', 
    author: 'Admin',
    lastModified: '2024-01-14 09:20',
    views: 2876,
    seoScore: 85,
    visibility: 'public'
  },
  { 
    id: 4, 
    name: 'Dashboard Dữ liệu', 
    path: '/services/dashboard', 
    status: 'published', 
    author: 'Admin',
    lastModified: '2024-01-13 14:10',
    views: 2145,
    seoScore: 90,
    visibility: 'public'
  },
  { 
    id: 5, 
    name: 'CRM & CDP', 
    path: '/services/crm-cdp', 
    status: 'draft', 
    author: 'Admin',
    lastModified: '2024-01-12 11:30',
    views: 0,
    seoScore: 45,
    visibility: 'private'
  },
  { 
    id: 6, 
    name: 'Giới thiệu', 
    path: '/about', 
    status: 'published', 
    author: 'Admin',
    lastModified: '2024-01-11 16:00',
    views: 1654,
    seoScore: 82,
    visibility: 'public'
  },
  { 
    id: 7, 
    name: 'Bảng giá', 
    path: '/pricing', 
    status: 'published', 
    author: 'Admin',
    lastModified: '2024-01-10 13:25',
    views: 4521,
    seoScore: 78,
    visibility: 'public'
  },
  { 
    id: 8, 
    name: 'Tin tức', 
    path: '/blog', 
    status: 'published', 
    author: 'Admin',
    lastModified: '2024-01-09 08:45',
    views: 3287,
    seoScore: 95,
    visibility: 'public'
  },
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
    if (score >= 80) return 'text-emerald-600 bg-emerald-100'
    if (score >= 60) return 'text-amber-600 bg-amber-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý trang</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý tất cả các trang trên website</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm trang mới
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedPages.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Đã chọn {selectedPages.length} trang
            </span>
            <button className="text-sm text-primary hover:underline">Xuất bản</button>
            <button className="text-sm text-amber-600 hover:underline">Chuyển nháp</button>
            <button className="text-sm text-red-600 hover:underline">Xóa</button>
          </div>
        )}
      </div>

      {/* Pages table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <th className="text-left px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-slate-900">
                    Tên trang
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SEO</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-slate-900">
                    Lượt xem
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cập nhật</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredPages.map((page) => (
                <tr 
                  key={page.id} 
                  className={cn(
                    "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors",
                    selectedPages.includes(page.id) && "bg-primary/5"
                  )}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(page.id)}
                      onChange={() => toggleSelect(page.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{page.name}</p>
                          {page.visibility === 'private' && (
                            <Lock className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{page.path}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                      page.status === 'published' 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {page.status === 'published' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
                      getSeoScoreColor(page.seoScore)
                    )}>
                      {page.seoScore}/100
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                      <Eye className="w-4 h-4 text-slate-400" />
                      {page.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-500">{page.lastModified}</p>
                    <p className="text-xs text-slate-400">bởi {page.author}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={page.path}
                        target="_blank"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Xem trang"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                      </Link>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4 text-slate-500" />
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === page.id ? null : page.id)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                        {showActions === page.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                              <Copy className="w-4 h-4" />
                              Nhân bản
                            </button>
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                              <Trash2 className="w-4 h-4" />
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
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {filteredPages.length} / {pages.length} trang
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
            <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
