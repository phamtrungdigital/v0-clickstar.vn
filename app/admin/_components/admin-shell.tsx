'use client'

import { useState } from 'react'
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
  LogOut,
  User,
  Moon,
  Sun,
  Globe,
  Megaphone,
  Mail,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '../login/actions'

const sidebarItems = [
  {
    title: 'Tổng quan',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    title: 'Nội dung',
    items: [
      { label: 'Quản lý trang', href: '/admin/pages', icon: FileText },
      { label: 'Bài viết', href: '/admin/posts', icon: FileText },
      { label: 'SEO', href: '/admin/seo', icon: Search },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Chiến dịch', href: '/admin/campaigns', icon: Megaphone },
      { label: 'Email Marketing', href: '/admin/email-marketing', icon: Mail },
      { label: 'Leads', href: '/admin/leads', icon: Users },
    ],
  },
  {
    title: 'Phân tích',
    items: [
      { label: 'Báo cáo', href: '/admin/reports', icon: BarChart3 },
      { label: 'Tích hợp dữ liệu', href: '/admin/integrations', icon: Database },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { label: 'Người dùng', href: '/admin/users', icon: Users },
      { label: 'Phân quyền', href: '/admin/roles', icon: Shield },
      { label: 'Cài đặt', href: '/admin/settings', icon: Settings },
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const pathname = usePathname()

  const initial = (user.full_name || user.email).charAt(0).toUpperCase()
  const displayName = user.full_name || user.email.split('@')[0]

  return (
    <div className={cn('min-h-screen bg-slate-100', darkMode && 'dark bg-slate-900')}>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-slate-900 text-white transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-12 flex items-center justify-between px-3 border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">CS</span>
            </div>
            {sidebarOpen && <span className="font-bold text-sm">ClickStar</span>}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-2 space-y-4 overflow-y-auto h-[calc(100vh-3rem)]">
          {sidebarItems.map((section, idx) => (
            <div key={idx}>
              {sidebarOpen && (
                <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-[13px]',
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        )}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-900 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white"
        >
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              sidebarOpen ? '-rotate-90' : 'rotate-90'
            )}
          />
        </button>
      </aside>

      <div className={cn('transition-all duration-300', sidebarOpen ? 'lg:ml-64' : 'lg:ml-20')}>
        <header className="sticky top-0 z-30 h-11 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-3 lg:px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <Link href="/admin" className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
                Admin
              </Link>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {pathname === '/admin'
                  ? 'Dashboard'
                  : sidebarItems.flatMap((s) => s.items).find((i) => i.href === pathname)?.label ||
                    'Trang'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Xem website</span>
            </Link>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-slate-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <button className="relative p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
              <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{initial}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-slate-900 dark:text-white">
                    {displayName}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                      {user.email}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 capitalize">{user.role}</p>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Settings className="w-4 h-4" />
                    Cài đặt
                  </Link>
                  <hr className="my-1 border-slate-200 dark:border-slate-700" />
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
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

        <main className="p-3 lg:p-4">{children}</main>
      </div>
    </div>
  )
}
