'use client'

import { useState } from 'react'
import { 
  Search, Globe, FileText, AlertTriangle, CheckCircle, XCircle,
  TrendingUp, TrendingDown, ExternalLink, RefreshCw, Settings,
  Image, Link2, Code, Save, Eye, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'overview', label: 'Tổng quan', icon: Globe },
  { id: 'pages', label: 'Theo trang', icon: FileText },
  { id: 'settings', label: 'Cấu hình', icon: Settings },
  { id: 'sitemap', label: 'Sitemap', icon: Link2 },
  { id: 'robots', label: 'Robots.txt', icon: Code },
]

const seoScore = 78
const issues = { critical: 2, warnings: 5, passed: 23 }

type PageSeoType = {
  path: string
  title: string
  score: number
  issues: number
  indexed: boolean
  metaTitle?: string
  metaDesc?: string
  keywords?: string
  canonical?: string
  ogTitle?: string
  ogDesc?: string
  noIndex?: boolean
  noFollow?: boolean
}

const initialPagesSeo: PageSeoType[] = [
  { path: '/', title: 'Trang chủ', score: 92, issues: 0, indexed: true, metaTitle: 'ClickStar - Digital Marketing Solutions', metaDesc: 'Giải pháp Digital Marketing toàn diện', keywords: 'digital marketing, seo', canonical: 'https://clickstar.vn/', ogTitle: 'ClickStar - Home', ogDesc: 'Digital Marketing Solutions', noIndex: false, noFollow: false },
  { path: '/services/digital-marketing', title: 'Digital Marketing', score: 85, issues: 1, indexed: true, metaTitle: 'Digital Marketing | ClickStar', metaDesc: 'Dịch vụ Digital Marketing chuyên nghiệp', keywords: 'digital marketing, quảng cáo', canonical: 'https://clickstar.vn/services/digital-marketing', noIndex: false, noFollow: false },
  { path: '/services/website', title: 'Thiết kế Website', score: 78, issues: 2, indexed: true, metaTitle: 'Thiết kế Website | ClickStar', metaDesc: 'Dịch vụ thiết kế website chuyên nghiệp', keywords: 'thiết kế web, website', canonical: 'https://clickstar.vn/services/website', noIndex: false, noFollow: false },
  { path: '/services/dashboard', title: 'Dashboard Dữ liệu', score: 65, issues: 3, indexed: true, metaTitle: 'Dashboard Dữ liệu | ClickStar', metaDesc: '', keywords: '', canonical: '', noIndex: false, noFollow: false },
  { path: '/blog', title: 'Tin tức', score: 88, issues: 1, indexed: true, metaTitle: 'Blog & Tin tức | ClickStar', metaDesc: 'Cập nhật tin tức Digital Marketing', keywords: 'blog, tin tức', canonical: 'https://clickstar.vn/blog', noIndex: false, noFollow: false },
  { path: '/about', title: 'Giới thiệu', score: 72, issues: 2, indexed: true, metaTitle: 'Về chúng tôi | ClickStar', metaDesc: '', keywords: '', canonical: '', noIndex: false, noFollow: false },
  { path: '/pricing', title: 'Bảng giá', score: 55, issues: 4, indexed: false, metaTitle: '', metaDesc: '', keywords: '', canonical: '', noIndex: true, noFollow: false },
]

const seoChecklist = [
  { category: 'Meta Tags', items: [
    { name: 'Title tag', status: 'pass', desc: '50-60 ký tự' },
    { name: 'Meta description', status: 'warning', desc: 'Một số trang thiếu' },
    { name: 'Canonical URL', status: 'pass', desc: 'Đã cấu hình' },
    { name: 'Open Graph', status: 'pass', desc: 'og:title, og:image' },
    { name: 'Twitter Cards', status: 'warning', desc: 'Thiếu twitter:image' },
  ]},
  { category: 'Nội dung', items: [
    { name: 'H1 heading', status: 'pass', desc: 'Mỗi trang 1 H1' },
    { name: 'Alt text', status: 'error', desc: '12 hình thiếu' },
    { name: 'Internal links', status: 'pass', desc: 'Cấu trúc tốt' },
    { name: 'Keywords', status: 'warning', desc: 'Một số trang thấp' },
  ]},
  { category: 'Technical', items: [
    { name: 'Mobile friendly', status: 'pass', desc: 'Responsive' },
    { name: 'Page speed', status: 'warning', desc: 'LCP cần cải thiện' },
    { name: 'SSL/HTTPS', status: 'pass', desc: 'Enabled' },
    { name: 'XML Sitemap', status: 'pass', desc: 'Đã submit' },
    { name: 'Robots.txt', status: 'pass', desc: 'OK' },
    { name: 'Schema', status: 'error', desc: 'Thiếu markup' },
  ]},
]

const keywords = [
  { keyword: 'digital marketing việt nam', position: 8, change: 3, volume: '2.4K' },
  { keyword: 'thiết kế website', position: 12, change: -2, volume: '8.1K' },
  { keyword: 'crm cho doanh nghiệp', position: 15, change: 5, volume: '1.3K' },
  { keyword: 'dashboard dữ liệu', position: 6, change: 1, volume: '720' },
  { keyword: 'ai marketing', position: 4, change: 2, volume: '3.2K' },
]

export default function AdminSEO() {
  const [activeTab, setActiveTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [pagesSeo, setPagesSeo] = useState(initialPagesSeo)
  const [editingPage, setEditingPage] = useState<PageSeoType | null>(null)
  const [editPageForm, setEditPageForm] = useState<Partial<PageSeoType>>({})
  const [settings, setSettings] = useState({
    siteTitle: 'ClickStar - Digital Marketing & AI Solutions',
    titleSeparator: '|',
    defaultDescription: 'ClickStar cung cấp giải pháp Digital Marketing, thiết kế Website, CRM và AI automation cho doanh nghiệp vừa và nhỏ tại Việt Nam.',
    ogImage: '/images/og-default.jpg',
    twitterHandle: '@clickstarvn',
    googleVerification: 'abc123xyz',
    bingVerification: '',
    indexing: true,
    followLinks: true,
    maxImagePreview: 'large',
  })
  const [sitemapContent] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://clickstar.vn/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://clickstar.vn/services/digital-marketing</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clickstar.vn/blog</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`)

  const [robotsContent, setRobotsContent] = useState(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Sitemaps
Sitemap: https://clickstar.vn/sitemap.xml

# Crawl-delay
Crawl-delay: 1`)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  const startEditPage = (page: PageSeoType) => {
    setEditingPage(page)
    setEditPageForm({ ...page })
  }

  const savePageSeo = () => {
    if (!editingPage) return
    setPagesSeo(prev => prev.map(p => 
      p.path === editingPage.path ? { ...p, ...editPageForm } as PageSeoType : p
    ))
    setEditingPage(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-900/30'
    if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">SEO Management</h1>
          <p className="text-xs text-slate-500">Tối ưu hóa công cụ tìm kiếm</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-700">
            <RefreshCw className="w-3.5 h-3.5" />
            Quét lại
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Đang lưu...' : 'Lưu'}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          {/* Score cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
              <div className={cn("text-2xl font-bold", getScoreColor(seoScore))}>{seoScore}</div>
              <div className="text-[10px] text-slate-500">Điểm SEO</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{issues.critical}</div>
              <div className="text-[10px] text-slate-500">Nghiêm trọng</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">{issues.warnings}</div>
              <div className="text-[10px] text-slate-500">Cảnh báo</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{issues.passed}</div>
              <div className="text-[10px] text-slate-500">Đạt</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-3">
            {/* Checklist */}
            {seoChecklist.map((section) => (
              <div key={section.category} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-2">{section.category}</h3>
                <div className="space-y-1.5">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      {item.status === 'pass' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />}
                      {item.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />}
                      {item.status === 'error' && <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Keywords */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Từ khóa đang theo dõi</h3>
              <button className="text-[10px] text-primary hover:underline">+ Thêm</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <th className="text-left px-3 py-1.5 text-[10px] font-semibold text-slate-500">Từ khóa</th>
                  <th className="text-center px-3 py-1.5 text-[10px] font-semibold text-slate-500">Vị trí</th>
                  <th className="text-center px-3 py-1.5 text-[10px] font-semibold text-slate-500">Thay đổi</th>
                  <th className="text-center px-3 py-1.5 text-[10px] font-semibold text-slate-500">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {keywords.map((kw, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-3 py-2 text-xs text-slate-900 dark:text-white">{kw.keyword}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={cn(
                        "px-1.5 py-0.5 text-[10px] font-semibold rounded",
                        kw.position <= 3 ? "bg-emerald-100 text-emerald-700" :
                        kw.position <= 10 ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-700"
                      )}>{kw.position}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-0.5 text-[10px] font-medium",
                        kw.change > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {kw.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(kw.change)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center text-[10px] text-slate-500">{kw.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Trang</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Điểm</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Vấn đề</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Index</th>
                <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {pagesSeo.map((page, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-3 py-2">
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{page.title}</p>
                    <p className="text-[10px] text-slate-500">{page.path}</p>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={cn("px-1.5 py-0.5 text-xs font-semibold rounded", getScoreBg(page.score), getScoreColor(page.score))}>
                      {page.score}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={cn(
                      "px-1.5 py-0.5 text-[10px] font-medium rounded",
                      page.issues === 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {page.issues}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {page.indexed ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button 
                      onClick={() => startEditPage(page)}
                      className="text-xs text-primary hover:underline"
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid lg:grid-cols-2 gap-3">
          {/* General */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Cài ��ặt chung</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Site Title</label>
                <input 
                  type="text" 
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Title Separator</label>
                <select 
                  value={settings.titleSeparator}
                  onChange={(e) => setSettings({...settings, titleSeparator: e.target.value})}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                >
                  <option value="|">| (Pipe)</option>
                  <option value="-">- (Dash)</option>
                  <option value="–">– (En dash)</option>
                  <option value="•">• (Bullet)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Default Meta Description</label>
                <textarea 
                  value={settings.defaultDescription}
                  onChange={(e) => setSettings({...settings, defaultDescription: e.target.value})}
                  rows={3}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900 resize-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">{settings.defaultDescription.length}/160 ký tự</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Default OG Image</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={settings.ogImage}
                    onChange={(e) => setSettings({...settings, ogImage: e.target.value})}
                    className="flex-1 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  />
                  <button className="px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50">
                    <Image className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Verification */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Xác minh & Social</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Twitter Handle</label>
                <input 
                  type="text" 
                  value={settings.twitterHandle}
                  onChange={(e) => setSettings({...settings, twitterHandle: e.target.value})}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Google Search Console</label>
                <input 
                  type="text" 
                  value={settings.googleVerification}
                  onChange={(e) => setSettings({...settings, googleVerification: e.target.value})}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  placeholder="google-site-verification=xxx"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Bing Webmaster</label>
                <input 
                  type="text" 
                  value={settings.bingVerification}
                  onChange={(e) => setSettings({...settings, bingVerification: e.target.value})}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                  placeholder="msvalidate.01=xxx"
                />
              </div>
            </div>
          </div>

          {/* Indexing */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Cài đặt Index</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded cursor-pointer">
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-white">Cho phép Index</p>
                  <p className="text-[10px] text-slate-500">Search engines có thể index site</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.indexing}
                  onChange={(e) => setSettings({...settings, indexing: e.target.checked})}
                  className="w-4 h-4 text-primary rounded"
                />
              </label>
              <label className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded cursor-pointer">
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-white">Follow Links</p>
                  <p className="text-[10px] text-slate-500">Cho phép crawl các link</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.followLinks}
                  onChange={(e) => setSettings({...settings, followLinks: e.target.checked})}
                  className="w-4 h-4 text-primary rounded"
                />
              </label>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Max Image Preview</label>
                <select 
                  value={settings.maxImagePreview}
                  onChange={(e) => setSettings({...settings, maxImagePreview: e.target.value})}
                  className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                >
                  <option value="large">Large</option>
                  <option value="standard">Standard</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Google Preview</h3>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
              <div className="text-primary text-sm hover:underline cursor-pointer truncate">
                {settings.siteTitle}
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 text-[10px] mt-0.5">
                https://clickstar.vn
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {settings.defaultDescription}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Tab */}
      {activeTab === 'sitemap' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">sitemap.xml</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded">
                <CheckCircle className="w-2.5 h-2.5" />
                Đã submit Google
              </span>
              <button className="text-xs text-primary hover:underline">Tạo lại</button>
            </div>
          </div>
          <textarea 
            value={sitemapContent}
            readOnly
            rows={15}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono bg-slate-50 dark:bg-slate-900 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-slate-500">Cập nhật: 15/01/2024</p>
            <a href="/sitemap.xml" target="_blank" className="flex items-center gap-1 text-xs text-primary hover:underline">
              <ExternalLink className="w-3 h-3" />
              Xem sitemap.xml
            </a>
          </div>
        </div>
      )}

      {/* Robots Tab */}
      {activeTab === 'robots' && (
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">robots.txt</h3>
              <a href="/robots.txt" target="_blank" className="flex items-center gap-1 text-xs text-primary hover:underline">
                <ExternalLink className="w-3 h-3" />
                Xem file
              </a>
            </div>
            <textarea 
              value={robotsContent}
              onChange={(e) => setRobotsContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono bg-slate-50 dark:bg-slate-900 resize-none"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-800 dark:text-amber-400">Lưu ý</p>
                <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-0.5">
                  Thay đổi robots.txt ảnh hưởng đến crawl và index. Hãy cẩn thận khi chỉnh sửa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Page SEO Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Chỉnh sửa SEO: {editingPage.title}</h3>
                <p className="text-[10px] text-slate-500">{editingPage.path}</p>
              </div>
              <button 
                onClick={() => setEditingPage(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <XCircle className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="p-3 overflow-y-auto max-h-[calc(90vh-120px)] space-y-4">
              {/* Meta Tags */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Meta Tags</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Meta Title</label>
                    <input 
                      type="text" 
                      value={editPageForm.metaTitle || ''}
                      onChange={(e) => setEditPageForm({...editPageForm, metaTitle: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" 
                      placeholder="Tiêu đề hiển thị trên Google"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">{(editPageForm.metaTitle || '').length}/60 ký tự</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Meta Description</label>
                    <textarea 
                      value={editPageForm.metaDesc || ''}
                      onChange={(e) => setEditPageForm({...editPageForm, metaDesc: e.target.value})}
                      rows={2}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900 resize-none" 
                      placeholder="Mô tả ngắn hiển thị trên Google"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">{(editPageForm.metaDesc || '').length}/160 ký tự</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Keywords</label>
                    <input 
                      type="text" 
                      value={editPageForm.keywords || ''}
                      onChange={(e) => setEditPageForm({...editPageForm, keywords: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" 
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Canonical URL</label>
                    <input 
                      type="text" 
                      value={editPageForm.canonical || ''}
                      onChange={(e) => setEditPageForm({...editPageForm, canonical: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" 
                      placeholder="https://clickstar.vn/..."
                    />
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Open Graph</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">OG Title</label>
                    <input 
                      type="text" 
                      value={editPageForm.ogTitle || ''}
                      onChange={(e) => setEditPageForm({...editPageForm, ogTitle: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">OG Description</label>
                    <textarea 
                      value={editPageForm.ogDesc || ''}
                      onChange={(e) => setEditPageForm({...editPageForm, ogDesc: e.target.value})}
                      rows={2}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900 resize-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Indexing */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Indexing</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">No Index</p>
                      <p className="text-[10px] text-slate-500">Không cho Google index trang này</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={editPageForm.noIndex || false}
                      onChange={(e) => setEditPageForm({...editPageForm, noIndex: e.target.checked})}
                      className="rounded border-slate-300 w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">No Follow</p>
                      <p className="text-[10px] text-slate-500">Không follow links trong trang này</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={editPageForm.noFollow || false}
                      onChange={(e) => setEditPageForm({...editPageForm, noFollow: e.target.checked})}
                      className="rounded border-slate-300 w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Preview Google</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-blue-600 hover:underline cursor-pointer truncate">{editPageForm.metaTitle || 'Chưa có tiêu đề'}</p>
                  <p className="text-[10px] text-emerald-700 truncate">{editPageForm.canonical || `https://clickstar.vn${editingPage.path}`}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{editPageForm.metaDesc || 'Chưa có mô tả'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <button 
                onClick={() => setEditingPage(null)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-100"
              >
                Hủy
              </button>
              <button 
                onClick={savePageSeo}
                className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
