'use client'

import { AI_MODULE_ENABLED } from '@/lib/ai/module-flag'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { roadmapCounts } from '@/lib/seo/roadmap'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Search,
  BarChart3,
  Database,
  Settings,
  Users,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  Megaphone,
  Mail,
  Shield,
  Sparkles,
  Plus,
  ChevronDown,
  UserPlus,
  ExternalLink,
  Briefcase,
  Target,
  PanelBottom,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSiteBranding } from '@/contexts/site-branding-context'
import { logout } from '../login/actions'

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; badge?: number }
type NavSection = { title: string; icon: NavItem['icon']; items: NavItem[] }

/** Số việc quản trị còn mở trong Lộ trình SEO (hiện cạnh mục SEO). */
const SEO_OPEN_TASKS = roadmapCounts().mine

const sidebarItems: NavSection[] = [
  {
    title: 'Tổng quan',
    icon: LayoutDashboard,
    items: [{ label: 'Dashboard', href: '/admin-cls', icon: LayoutDashboard }],
  },
  {
    title: 'Nội dung',
    icon: FolderOpen,
    items: [
      { label: 'Quản lý trang', href: '/admin-cls/pages', icon: FileText },
      { label: 'Bài viết', href: '/admin-cls/posts', icon: FileText },
      { label: 'Dự án', href: '/admin-cls/projects', icon: Briefcase },
      { label: 'Đội ngũ', href: '/admin-cls/team', icon: Users },
      { label: 'Footer & CTA', href: '/admin-cls/footer-cta', icon: PanelBottom },
      { label: 'SEO', href: '/admin-cls/seo', icon: Search, badge: SEO_OPEN_TASKS },
    ],
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    items: [
      { label: 'Chiến dịch', href: '/admin-cls/campaigns', icon: Megaphone },
      { label: 'Email Marketing', href: '/admin-cls/email-marketing', icon: Mail },
      { label: 'Thông báo', href: '/admin-cls/announcements', icon: Bell },
      { label: 'Leads', href: '/admin-cls/leads', icon: Users },
      { label: 'Cá nhân hóa', href: '/admin-cls/personalize', icon: Target },
    ],
  },
  {
    title: 'Phân tích',
    icon: BarChart3,
    items: [
      { label: 'Báo cáo', href: '/admin-cls/reports', icon: BarChart3 },
      { label: 'Tích hợp dữ liệu', href: '/admin-cls/integrations', icon: Database },
    ],
  },
  {
    title: 'Hệ thống',
    icon: Settings,
    items: [
      { label: 'Người dùng', href: '/admin-cls/users', icon: Users },
      { label: 'Phân quyền', href: '/admin-cls/roles', icon: Shield },
      { label: AI_MODULE_ENABLED ? 'AI Assistant' : 'Chatbot website', href: '/admin-cls/ai', icon: Sparkles },
      { label: 'Cài đặt', href: '/admin-cls/settings', icon: Settings },
    ],
  },
]

/** Chỉ số nhóm chứa route đang xem (để accordion mở đúng nhóm). -1 nếu không khớp. */
function sectionIndexOfPath(pathname: string): number {
  return sidebarItems.findIndex((s) =>
    s.items.some(
      (it) => pathname === it.href || (it.href !== '/admin-cls' && pathname.startsWith(it.href)),
    ),
  )
}

export type AdminUser = {
  email: string
  full_name: string | null
  role: string
}

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser
  children: React.ReactNode
}) {
  // Sidebar collapse state — persist in localStorage so user preference sticks
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const branding = useSiteBranding()

  const router = useRouter()
  // Nhóm đang hiện ở bảng con: mặc định là nhóm chứa trang đang xem, đổi khi bấm biểu tượng ở thanh bên trái.
  const [activeGroup, setActiveGroup] = useState(() => {
    const i = sectionIndexOfPath(pathname)
    return i >= 0 ? i : 0
  })
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [leads24h, setLeads24h] = useState<number | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved === '1') setSidebarCollapsed(true)
  }, [])

  // Sang trang khác thì bảng con chuyển sang nhóm chứa trang đó và xóa ô tìm.
  useEffect(() => {
    const i = sectionIndexOfPath(pathname)
    if (i >= 0) setActiveGroup(i)
    setQuery('')
  }, [pathname])

  // Ctrl K (hoặc Cmd K): mở rộng menu và đặt con trỏ vào ô tìm nhanh.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed((c) => {
      const next = !c
      localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0')
      return next
    })
  }

  // Đóng các bảng xổ khi bấm ra ngoài hoặc nhấn Esc.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setAddOpen(false)
        setBellOpen(false)
        setUserMenuOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setAddOpen(false)
        setBellOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  // Số lead mới trong 24 giờ cho chuông thông báo: chỉ đọc, tải sau khi trang đã hiện (RLS chỉ cho admin đọc).
  useEffect(() => {
    let alive = true
    createClient()
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 3600 * 1000).toISOString())
      .then(({ count, error }) => {
        if (alive && !error) setLeads24h(count ?? 0)
      })
    return () => {
      alive = false
    }
  }, [])

  const initial = (user.full_name || user.email).charAt(0).toUpperCase()
  const displayName = user.full_name || user.email.split('@')[0]
  const contentOffset = sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[264px]'

  // Tìm nhanh không phân biệt hoa thường và dấu tiếng Việt.
  const fold = (t: string) => t.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').toLowerCase().trim()
  const allItems = sidebarItems.flatMap((sec) => sec.items.map((it) => ({ ...it, group: sec.title })))
  const results = fold(query) ? allItems.filter((it) => fold(it.label).includes(fold(query))) : allItems.slice(0, 6)

  // Đường dẫn trang đang xem (nhóm / mục) ở header: mục có href dài nhất khớp với đường dẫn hiện tại.
  const here = useMemo(() => {
    let best: { group: string; label: string; len: number } | null = null
    for (const sec of sidebarItems)
      for (const it of sec.items) {
        const hit = pathname === it.href || (it.href !== '/admin-cls' && pathname.startsWith(it.href))
        if (hit && (!best || it.href.length > best.len)) best = { group: sec.title, label: it.label, len: it.href.length }
      }
    return best
  }, [pathname])

  const go = (href: string) => {
    router.push(href)
    setSearchOpen(false)
    setQuery('')
    searchRef.current?.blur()
    setMobileMenuOpen(false)
  }
  const roleLabel = user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Biên tập' : user.role === 'viewer' ? 'Chỉ xem' : user.role
  const bellCount = (leads24h ? 1 : 0) + (SEO_OPEN_TASKS ? 1 : 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ───── TOP HEADER: thanh tối, logo, đường dẫn trang, tìm nhanh, thêm mới, thông báo, tài khoản ───── */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40 h-14 bg-zinc-950 text-white flex items-center gap-3 px-3 lg:px-4 border-b border-zinc-800"
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-1.5 hover:bg-zinc-800 rounded text-white"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin-cls" className="flex items-center gap-2.5 shrink-0" aria-label="Trang tổng quan">
          {branding.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logoUrl} alt={branding.siteName} className="h-6 w-auto object-contain" />
          ) : (
            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">{branding.siteName.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
        </Link>
        <span className="hidden sm:inline-flex items-center text-[10px] font-medium tracking-[0.08em] px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 shrink-0">
          ADMIN
        </span>
        <span className="hidden md:block w-px h-5 bg-zinc-700 shrink-0" />
        {here && (
          <nav aria-label="Vị trí hiện tại" className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 min-w-0 whitespace-nowrap">
            <span>{here.group}</span>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-white font-medium truncate">{here.label}</span>
          </nav>
        )}

        {/* Tìm nhanh (Ctrl K): nhảy tới mục menu */}
        <div className="relative flex-1 max-w-md mx-auto hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSel(0)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSel((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSel((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter' && results[sel]) {
                go(results[sel].href)
              }
            }}
            placeholder="Tìm trang, bài viết, cài đặt"
            aria-label="Tìm nhanh"
            autoComplete="off"
            className="w-full pl-10 pr-14 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 border border-zinc-700 rounded px-1">Ctrl K</kbd>
          {searchOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 p-1.5 z-50">
              <p className="px-2.5 py-1.5 text-[11px] text-slate-400">{fold(query) ? 'Kết quả' : 'Gợi ý'}</p>
              {results.length === 0 && <p className="px-2.5 py-2 text-sm text-slate-500">Không có mục nào khớp.</p>}
              {results.slice(0, 8).map((it, i) => (
                <button
                  key={it.href}
                  type="button"
                  onMouseEnter={() => setSel(i)}
                  onClick={() => go(it.href)}
                  className={cn('w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left', i === sel ? 'bg-slate-100' : '')}
                >
                  <it.icon className="w-4 h-4 text-slate-500" strokeWidth={1.9} />
                  <span className="flex-1 truncate">{it.label}</span>
                  <span className="text-[11px] text-slate-400">{it.group}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-auto md:ml-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setAddOpen((v) => !v)
                setBellOpen(false)
                setUserMenuOpen(false)
              }}
              aria-expanded={addOpen}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thêm</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>
            {addOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-1.5 z-50">
                <p className="px-2.5 py-1.5 text-[11px] text-slate-400">Tạo mới</p>
                {[
                  { label: 'Bài viết mới', href: '/admin-cls/posts/new', icon: FileText },
                  { label: 'Dự án mới', href: '/admin-cls/projects/new', icon: Briefcase },
                  { label: 'Thành viên đội ngũ', href: '/admin-cls/team/new', icon: UserPlus },
                  { label: 'Thông báo', href: '/admin-cls/announcements', icon: Bell },
                ].map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => setAddOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-slate-100"
                  >
                    <it.icon className="w-4 h-4 text-slate-500" strokeWidth={1.9} />
                    {it.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center p-2 hover:bg-zinc-800 rounded-lg text-zinc-300"
            title="Xem website"
            aria-label="Xem website"
          >
            <ExternalLink className="w-[18px] h-[18px]" />
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setBellOpen((v) => !v)
                setAddOpen(false)
                setUserMenuOpen(false)
              }}
              aria-label="Thông báo"
              aria-expanded={bellOpen}
              className="relative p-2 hover:bg-zinc-800 rounded-lg text-zinc-300"
            >
              <Bell className="w-[18px] h-[18px]" />
              {bellCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] font-semibold flex items-center justify-center">
                  {bellCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-1.5 z-50">
                <p className="px-2.5 py-1.5 text-[11px] text-slate-400">Thông báo</p>
                {leads24h ? (
                  <Link href="/admin-cls/leads" onClick={() => setBellOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-slate-100">
                    <Target className="w-4 h-4 text-slate-500" strokeWidth={1.9} />
                    <span className="flex-1">{leads24h} lead mới trong 24 giờ</span>
                  </Link>
                ) : null}
                {SEO_OPEN_TASKS ? (
                  <Link href="/admin-cls/seo" onClick={() => setBellOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-slate-100">
                    <Search className="w-4 h-4 text-slate-500" strokeWidth={1.9} />
                    <span className="flex-1">{SEO_OPEN_TASKS} việc quản trị SEO còn mở</span>
                  </Link>
                ) : null}
                {bellCount === 0 && <p className="px-2.5 py-2 text-sm text-slate-500">Chưa có thông báo mới.</p>}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen((v) => !v)
                setAddOpen(false)
                setBellOpen(false)
              }}
              aria-expanded={userMenuOpen}
              className="flex items-center gap-2 pl-1.5 pr-1 py-1 hover:bg-zinc-800 rounded-lg ml-0.5"
            >
              <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{initial}</span>
              </div>
              <span className="hidden lg:block text-left leading-tight">
                <span className="block text-xs font-medium text-white max-w-[120px] truncate">{displayName}</span>
                <span className="block text-[10px] text-zinc-400">{roleLabel}</span>
              </span>
              <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-zinc-500" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-1.5 z-50">
                <div className="px-2.5 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user.email}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{roleLabel}</p>
                </div>
                <Link
                  href="/admin-cls/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-slate-100"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Cài đặt
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-slate-100"
                >
                  <Globe className="w-4 h-4 text-slate-500" />
                  Xem website
                </Link>
                <hr className="my-1 border-slate-100" />
                <form action={logout}>
                  <button type="submit" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-red-600 hover:bg-slate-100 w-full">
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ───── MOBILE OVERLAY ───── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ───── SIDEBAR: thanh biểu tượng các nhóm (trái) + bảng mục của nhóm đang chọn (phải) ───── */}
      <aside
        className={cn(
          'fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-[264px] flex bg-white border-r border-slate-200 transition-all duration-200',
          sidebarCollapsed && 'lg:w-14',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="w-14 shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-3 gap-1.5">
          {sidebarItems.map((section, idx) => {
            const on = idx === activeGroup
            const hasBadge = section.items.some((i) => i.badge)
            return (
              <button
                key={section.title}
                type="button"
                title={section.title}
                aria-label={section.title}
                aria-current={on ? 'true' : undefined}
                onClick={() => {
                  setActiveGroup(idx)
                  setQuery('')
                  if (section.items.length === 1) {
                    router.push(section.items[0].href)
                    setMobileMenuOpen(false)
                  } else if (sidebarCollapsed) toggleSidebar()
                }}
                className={cn(
                  'relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3687FC]/50',
                  on ? 'bg-[#E8F1FF] text-[#3687FC]' : 'text-slate-500 hover:bg-white hover:text-slate-900'
                )}
              >
                <section.icon className="w-5 h-5" strokeWidth={1.9} />
                {hasBadge && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3687FC] ring-2 ring-slate-50" />}
              </button>
            )
          })}
          <button
            type="button"
            onClick={toggleSidebar}
            className="mt-auto hidden lg:flex w-8 h-8 rounded-full items-center justify-center text-slate-500 hover:bg-white hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3687FC]/50"
            title={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            aria-label={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className={cn('flex-1 min-w-0 flex flex-col', sidebarCollapsed && 'lg:hidden')}>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute top-2 right-2 p-1 hover:bg-slate-100 rounded"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>

          <nav className="flex-1 overflow-y-auto px-3 pt-3 pb-3">
            <h2 className="px-2.5 pt-1 pb-1.5 text-[13px] font-semibold text-[#0F172A]">{sidebarItems[activeGroup].title}</h2>
            <ul className="space-y-0.5">
              {sidebarItems[activeGroup].items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin-cls' && pathname.startsWith(item.href))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'group flex items-center gap-[11px] px-2.5 py-[9px] rounded-xl transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3687FC]/50',
                        isActive ? 'bg-[#E8F1FF] text-[#3687FC] font-semibold' : 'font-normal text-[#0F172A] hover:bg-[#F5F7FA]'
                      )}
                    >
                      <item.icon
                        className={cn('h-5 w-5 flex-shrink-0 transition-colors', isActive ? 'text-[#3687FC]' : 'text-[#6B7280] group-hover:text-[#0F172A]')}
                        strokeWidth={1.9}
                      />
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="text-[11px] font-medium rounded-full px-1.5 min-w-[18px] text-center bg-[#E8F1FF] text-[#3687FC] shrink-0">{item.badge}</span>
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* ───── MAIN CONTENT ───── */}
      <div className={cn('pt-14 transition-all duration-200', contentOffset)}>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
