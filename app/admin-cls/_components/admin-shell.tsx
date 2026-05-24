'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Search,
  BarChart3,
  Database,
  Settings,
  Users,
  Menu,
  X,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  Megaphone,
  Mail,
  Shield,
  Sparkles,
  Plus,
  HelpCircle,
  ExternalLink,
  Briefcase,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSiteBranding } from '@/contexts/site-branding-context'
import { logout } from '../login/actions'

const sidebarItems = [
  {
    title: 'Tổng quan',
    items: [{ label: 'Dashboard', href: '/admin-cls', icon: LayoutDashboard }],
  },
  {
    title: 'Nội dung',
    items: [
      { label: 'Quản lý trang', href: '/admin-cls/pages', icon: FileText },
      { label: 'Bài viết', href: '/admin-cls/posts', icon: FileText },
      { label: 'Dự án', href: '/admin-cls/projects', icon: Briefcase },
      { label: 'Đội ngũ', href: '/admin-cls/team', icon: Users },
      { label: 'SEO', href: '/admin-cls/seo', icon: Search },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Chiến dịch', href: '/admin-cls/campaigns', icon: Megaphone },
      { label: 'Email Marketing', href: '/admin-cls/email-marketing', icon: Mail },
      { label: 'Leads', href: '/admin-cls/leads', icon: Users },
      { label: 'Cá nhân hóa', href: '/admin-cls/personalize', icon: Target },
    ],
  },
  {
    title: 'Phân tích',
    items: [
      { label: 'Báo cáo', href: '/admin-cls/reports', icon: BarChart3 },
      { label: 'Tích hợp dữ liệu', href: '/admin-cls/integrations', icon: Database },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { label: 'Người dùng', href: '/admin-cls/users', icon: Users },
      { label: 'Phân quyền', href: '/admin-cls/roles', icon: Shield },
      { label: 'AI Assistant', href: '/admin-cls/ai', icon: Sparkles },
      { label: 'Cài đặt', href: '/admin-cls/settings', icon: Settings },
    ],
  },
]

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

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved === '1') setSidebarCollapsed(true)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed((c) => {
      const next = !c
      localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0')
      return next
    })
  }

  const initial = (user.full_name || user.email).charAt(0).toUpperCase()
  const displayName = user.full_name || user.email.split('@')[0]
  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-60'
  const contentOffset = sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ───── TOP HEADER: black bar full width ───── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-zinc-950 text-white flex items-center justify-between px-3 lg:px-4 border-b border-zinc-800">
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 hover:bg-zinc-800 rounded text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin-cls" className="flex items-center gap-2.5 group">
            {branding.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={branding.logoUrl}
                alt={branding.siteName}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">
                  {branding.siteName.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30 group-hover:bg-orange-500/25 transition-colors">
              Admin
            </span>
          </Link>
        </div>

        {/* Global search — centered, HubSpot style */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm hoặc hỏi…"
              className="w-full pl-10 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            href="/admin-cls/posts/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm
          </Link>
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 p-1.5 hover:bg-zinc-800 rounded text-zinc-300"
            title="Xem website"
          >
            <Globe className="w-4 h-4" />
          </Link>
          <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-300" title="Trợ giúp">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="relative p-1.5 hover:bg-zinc-800 rounded text-zinc-300">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 p-1 hover:bg-zinc-800 rounded ml-1"
            >
              <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{initial}</span>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user.email}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
                    {user.role}
                  </p>
                </div>
                <Link
                  href="/admin-cls/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="w-4 h-4" />
                  Cài đặt
                </Link>
                <hr className="my-1 border-slate-100" />
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50 w-full"
                  >
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

      {/* ───── SIDEBAR: white, collapsible ───── */}
      <aside
        className={cn(
          'fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] bg-white border-r border-slate-200 transition-all duration-200',
          sidebarWidth,
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-2 right-2 p-1 hover:bg-slate-100 rounded"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>

        <nav className="py-3 px-2 space-y-4 overflow-y-auto h-[calc(100%-3rem)]">
          {sidebarItems.map((section, idx) => (
            <div key={idx}>
              {!sidebarCollapsed && (
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin-cls' && pathname.startsWith(item.href))
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-[13px] font-medium relative',
                          isActive
                            ? 'bg-orange-50 text-orange-700'
                            : 'text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-orange-500 rounded-r" />
                        )}
                        <item.icon
                          className={cn(
                            'w-4 h-4 flex-shrink-0',
                            isActive ? 'text-orange-600' : 'text-slate-500'
                          )}
                        />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle — bottom of sidebar */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute bottom-3 right-3 w-7 h-7 bg-white border border-slate-200 hover:bg-slate-100 rounded-full items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm"
          title={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* ───── MAIN CONTENT ───── */}
      <div className={cn('pt-14 transition-all duration-200', contentOffset)}>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
