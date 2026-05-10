'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Save, Eye, Globe, Lock, Settings, Search, Image, Code,
  ChevronDown, X, RefreshCw, FileText, Link2, Trash2, Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'

// Mock data
const pageData = {
  id: 1,
  name: 'Digital Marketing',
  path: '/services/digital-marketing',
  status: 'published',
  visibility: 'public',
  template: 'service',
  content: '',
  seo: {
    title: 'Digital Marketing | ClickStar',
    description: 'Dịch vụ Digital Marketing chuyên nghiệp - Quảng cáo Google, Facebook, TikTok, SEO và Content Marketing cho doanh nghiệp.',
    keywords: 'digital marketing, quảng cáo, SEO, social media, content marketing',
    canonicalUrl: 'https://clickstar.vn/services/digital-marketing',
    ogTitle: 'Digital Marketing | ClickStar',
    ogDescription: 'Dịch vụ Digital Marketing chuyên nghiệp cho doanh nghiệp',
    ogImage: '/images/og-digital-marketing.jpg',
    noIndex: false,
    noFollow: false,
  },
  schema: {
    type: 'Service',
    enabled: true,
  },
  settings: {
    showInNav: true,
    showInSitemap: true,
    showInSearch: true,
  }
}

const tabs = [
  { id: 'general', label: 'Chung', icon: FileText },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'schema', label: 'Schema', icon: Code },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
]

export default function EditPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(pageData)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  const updateSeo = (field: string, value: string | boolean) => {
    setPage(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }))
  }

  const updateSettings = (field: string, value: boolean) => {
    setPage(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }))
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/pages"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{page.name}</h1>
            <p className="text-[10px] text-slate-500">{page.path}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={page.path}
            target="_blank"
            className="flex items-center gap-1.5 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
            Xem
          </Link>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-[1px]",
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="grid lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Thông tin trang</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Tên trang</label>
                  <input 
                    type="text" 
                    value={page.name}
                    onChange={(e) => setPage({...page, name: e.target.value})}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">URL Path</label>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">clickstar.vn</span>
                    <input 
                      type="text" 
                      value={page.path}
                      onChange={(e) => setPage({...page, path: e.target.value})}
                      className="flex-1 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Template</label>
                  <select 
                    value={page.template}
                    onChange={(e) => setPage({...page, template: e.target.value})}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="default">Default</option>
                    <option value="service">Service Page</option>
                    <option value="landing">Landing Page</option>
                    <option value="blog">Blog Post</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Xuất bản</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Trạng thái</label>
                  <select 
                    value={page.status}
                    onChange={(e) => setPage({...page, status: e.target.value})}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Bản nháp</option>
                    <option value="scheduled">Lên lịch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Hiển thị</label>
                  <select 
                    value={page.visibility}
                    onChange={(e) => setPage({...page, visibility: e.target.value})}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="public">Công khai</option>
                    <option value="private">Riêng tư</option>
                    <option value="password">Mật khẩu</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Hành động</h3>
              <div className="space-y-2">
                <button className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                  <Copy className="w-3.5 h-3.5" />
                  Nhân bản trang
                </button>
                <button className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa trang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="grid lg:grid-cols-2 gap-3">
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Meta Tags</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Title Tag</label>
                  <input 
                    type="text" 
                    value={page.seo.title}
                    onChange={(e) => updateSeo('title', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">{page.seo.title.length}/60 ký tự</p>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Meta Description</label>
                  <textarea 
                    value={page.seo.description}
                    onChange={(e) => updateSeo('description', e.target.value)}
                    rows={3}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900 resize-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">{page.seo.description.length}/160 ký tự</p>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Keywords</label>
                  <input 
                    type="text" 
                    value={page.seo.keywords}
                    onChange={(e) => updateSeo('keywords', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Canonical URL</label>
                  <input 
                    type="text" 
                    value={page.seo.canonicalUrl}
                    onChange={(e) => updateSeo('canonicalUrl', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Indexing</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">No Index</span>
                  <input 
                    type="checkbox" 
                    checked={page.seo.noIndex}
                    onChange={(e) => updateSeo('noIndex', e.target.checked)}
                    className="rounded border-slate-300 w-3.5 h-3.5"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">No Follow</span>
                  <input 
                    type="checkbox" 
                    checked={page.seo.noFollow}
                    onChange={(e) => updateSeo('noFollow', e.target.checked)}
                    className="rounded border-slate-300 w-3.5 h-3.5"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Open Graph</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">OG Title</label>
                  <input 
                    type="text" 
                    value={page.seo.ogTitle}
                    onChange={(e) => updateSeo('ogTitle', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">OG Description</label>
                  <textarea 
                    value={page.seo.ogDescription}
                    onChange={(e) => updateSeo('ogDescription', e.target.value)}
                    rows={2}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">OG Image</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={page.seo.ogImage}
                      onChange={(e) => updateSeo('ogImage', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                    />
                    <button className="px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50">
                      <Image className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Preview Google</h3>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
                <p className="text-xs text-blue-600 hover:underline cursor-pointer truncate">{page.seo.title}</p>
                <p className="text-[10px] text-emerald-700 truncate">{page.seo.canonicalUrl}</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{page.seo.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schema Tab */}
      {activeTab === 'schema' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Schema Markup</h3>
            <label className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Enabled</span>
              <input 
                type="checkbox" 
                checked={page.schema.enabled}
                onChange={(e) => setPage({...page, schema: {...page.schema, enabled: e.target.checked}})}
                className="rounded border-slate-300 w-3.5 h-3.5"
              />
            </label>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Schema Type</label>
              <select 
                value={page.schema.type}
                onChange={(e) => setPage({...page, schema: {...page.schema, type: e.target.value}})}
                className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
              >
                <option value="WebPage">WebPage</option>
                <option value="Service">Service</option>
                <option value="Product">Product</option>
                <option value="Article">Article</option>
                <option value="Organization">Organization</option>
                <option value="FAQPage">FAQPage</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Schema JSON-LD Preview</label>
              <pre className="p-2 bg-slate-900 text-slate-100 rounded text-[10px] overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "${page.schema.type}",
  "name": "${page.name}",
  "description": "${page.seo.description.slice(0, 50)}...",
  "url": "${page.seo.canonicalUrl}"
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Cài đặt trang</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded">
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-white">Hiển thị trong Navigation</p>
                <p className="text-[10px] text-slate-500">Thêm trang vào menu chính</p>
              </div>
              <input 
                type="checkbox" 
                checked={page.settings.showInNav}
                onChange={(e) => updateSettings('showInNav', e.target.checked)}
                className="rounded border-slate-300 w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded">
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-white">Hiển thị trong Sitemap</p>
                <p className="text-[10px] text-slate-500">Thêm vào sitemap.xml</p>
              </div>
              <input 
                type="checkbox" 
                checked={page.settings.showInSitemap}
                onChange={(e) => updateSettings('showInSitemap', e.target.checked)}
                className="rounded border-slate-300 w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded">
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-white">Hiển thị trong Search</p>
                <p className="text-[10px] text-slate-500">Cho phép tìm kiếm nội bộ</p>
              </div>
              <input 
                type="checkbox" 
                checked={page.settings.showInSearch}
                onChange={(e) => updateSettings('showInSearch', e.target.checked)}
                className="rounded border-slate-300 w-4 h-4"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
