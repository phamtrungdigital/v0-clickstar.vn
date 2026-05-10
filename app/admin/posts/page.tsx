'use client'

import { useState } from 'react'
import { 
  Search, Plus, Filter, MoreHorizontal, Eye, Edit2, Trash2, 
  Calendar, Clock, Tag, Image, FileText, CheckCircle, XCircle,
  ArrowUpDown, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const posts = [
  { id: 1, title: '10 xu hướng Digital Marketing 2024', slug: 'xu-huong-digital-marketing-2024', status: 'published', category: 'Digital Marketing', author: 'Nguyễn Văn A', views: 1250, date: '2024-01-15', featured: true, image: '/blog/post1.jpg' },
  { id: 2, title: 'Hướng dẫn tối ưu SEO website từ A-Z', slug: 'huong-dan-toi-uu-seo', status: 'published', category: 'SEO', author: 'Trần Thị B', views: 890, date: '2024-01-12', featured: true, image: '/blog/post2.jpg' },
  { id: 3, title: 'Case study: Tăng 300% doanh thu với Google Ads', slug: 'case-study-google-ads', status: 'published', category: 'Quảng cáo', author: 'Lê Văn C', views: 650, date: '2024-01-10', featured: false, image: '/blog/post3.jpg' },
  { id: 4, title: 'Chiến lược Content Marketing hiệu quả', slug: 'chien-luoc-content-marketing', status: 'draft', category: 'Content', author: 'Nguyễn Văn A', views: 0, date: '2024-01-08', featured: false, image: null },
  { id: 5, title: 'Phân tích đối thủ cạnh tranh online', slug: 'phan-tich-doi-thu', status: 'pending', category: 'Phân tích', author: 'Trần Thị B', views: 0, date: '2024-01-05', featured: false, image: null },
  { id: 6, title: 'Remarketing: Cách tiếp cận khách hàng hiệu quả', slug: 'remarketing-tiep-can-khach-hang', status: 'published', category: 'Quảng cáo', author: 'Lê Văn C', views: 420, date: '2024-01-03', featured: false, image: '/blog/post6.jpg' },
]

const categories = ['Tất cả', 'Digital Marketing', 'SEO', 'Quảng cáo', 'Content', 'Phân tích']
const statuses = [
  { id: 'all', label: 'Tất cả', count: 6 },
  { id: 'published', label: 'Đã xuất bản', count: 4 },
  { id: 'draft', label: 'Bản nháp', count: 1 },
  { id: 'pending', label: 'Chờ duyệt', count: 1 },
]

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])

  const filteredPosts = posts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = selectedStatus === 'all' || post.status === selectedStatus
    const matchCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory
    return matchSearch && matchStatus && matchCategory
  })

  const toggleSelect = (id: number) => {
    setSelectedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id))
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Bài viết</h1>
          <p className="text-xs text-slate-500">Quản lý tất cả bài viết trên website</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm bài viết
        </Link>
      </div>

      {/* Stats tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {statuses.map(status => (
          <button
            key={status.id}
            onClick={() => setSelectedStatus(status.id)}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors",
              selectedStatus === status.id
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-xs text-blue-700 dark:text-blue-300">Đã chọn {selectedPosts.length} bài viết</span>
          <button className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">Xuất bản</button>
          <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Xóa</button>
        </div>
      )}

      {/* Posts table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <th className="w-8 px-3 py-2">
                <input 
                  type="checkbox"
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 w-3 h-3"
                />
              </th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Bài viết</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Danh mục</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Tác giả</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Trạng thái</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Lượt xem</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredPosts.map(post => (
              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-3 py-2">
                  <input 
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => toggleSelect(post.id)}
                    className="rounded border-slate-300 w-3 h-3"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                      {post.image ? (
                        <Image className="w-4 h-4 text-slate-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{post.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {post.date}
                        </span>
                        {post.featured && (
                          <span className="px-1 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px]">Nổi bật</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded">
                    {post.category}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">{post.author}</td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "px-1.5 py-0.5 text-[10px] font-medium rounded",
                    post.status === 'published' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                    post.status === 'draft' && "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400",
                    post.status === 'pending' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {post.status === 'published' ? 'Đã xuất bản' : post.status === 'draft' ? 'Bản nháp' : 'Chờ duyệt'}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="text-xs text-slate-600 dark:text-slate-400">{post.views.toLocaleString()}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Xem">
                      <Eye className="w-3 h-3 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Chỉnh sửa">
                      <Edit2 className="w-3 h-3 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Xóa">
                      <Trash2 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500">Hiển thị 1-{filteredPosts.length} của {posts.length} bài viết</span>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50">Trước</button>
          <button className="px-2 py-1 text-xs bg-primary text-white rounded">1</button>
          <button className="px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50">Sau</button>
        </div>
      </div>
    </div>
  )
}
