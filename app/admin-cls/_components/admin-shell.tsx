'use client'

import { AI_MODULE_ENABLED } from '@/lib/ai/module-flag'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { roadmapCounts } from '@/lib/seo/roadmap'
import { createClient } from '@/lib/supabase/client'
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
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSiteBranding } from '@/contexts/site-branding-context'
import { logout } from '../login/actions'

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; badge?: number }
type NavSection = { title: string; items: NavItem[] }

/** Số việc quản trị còn mở trong Lộ trình SEO (hiện cạnh mục SEO). */
const SEO_OPEN_TASKS = roadmapCounts().mine

/** Menu trái: một cột, chia nhóm. Thêm mục mới ở đây (thanh tìm nhanh và đường dẫn trang tự lấy từ danh sách này). */
const sidebarItems: NavSection[] = [
  {
    title: 'Tổng quan',
    items: [{ label: 'Tổng quan', href: '/admin-cls', icon: LayoutDashboard }],
  },
  {
    title: 'Nội dung',
    items: [
      { label: 'Quản lý trang', href: '/admin-cls/pages', icon: FileText },
      { label: 'Bài viết', href: '/admin-cls/posts', icon: FileText },
      { label: 'Quản trị bài viết', href: '/admin-cls/content', icon: ClipboardList },
      { label: 'Dự án', href: '/admin-cls/projects', icon: Briefcase },
      { label: 'Đội ngũ', href: '/admin-cls/team', icon: Users },
      { label: 'Footer & CTA', href: '/admin-cls/footer-cta', icon: PanelBottom },
      { label: 'SEO', href: '/admin-cls/seo', icon: Search, badge: SEO_OPEN_TASKS },
    ],
  },
  {
    title: 'Marketing',
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
      { label: AI_MODULE_ENABLED ? 'AI Assistant' : 'Chatbot website', href: '/admin-cls/ai', icon: Sparkles },
      { label: 'Cài đặt', href: '/admin-cls/settings', icon: Settings },
    ],
  },
]

export type AdminUser = {
  email: string
  full_name: string | null
  role: string
}

/* Kiểu dùng lại trong khung: màu và bóng lấy từ biến --ad-* (định nghĩa ở admin-theme.tsx). */
const ICON_BTN =
  'relative grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-2)] transition-colors hover:bg-[var(--ad-fill)] focus-visible:outline-none'
const PANEL =
  'absolute right-0 z-50 mt-2 rounded-2xl border border-[var(--ad-line)] bg-[var(--ad-surface)] p-1.5 text-[var(--ad-fg)] shadow-[0_16px_48px_-12px_rgba(0,0,0,.24)]'
const PANEL_ITEM =
  'flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[14px] transition-colors hover:bg-[var(--ad-fill)]'
const PANEL_LABEL = 'px-2.5 pb-1 pt-1.5 text-[12px] font-medium text-[var(--ad-fg-3)]'

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser
  children: React.ReactNode
}) {
  // Thu gọn menu trái: nhớ lựa chọn trong localStorage.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const branding = useSiteBranding()

  const router = useRouter()
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

  // Sang trang khác thì xóa ô tìm và đóng menu điện thoại.
  useEffect(() => {
    setQuery('')
    setMobileMenuOpen(false)
  }, [pathname])

  // Ctrl K (hoặc Cmd K): đặt con trỏ vào ô tìm nhanh.
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

  // Tìm nhanh không phân biệt hoa thường và dấu tiếng Việt.
  const fold = (t: string) => t.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').toLowerCase().trim()
  const allItems = sidebarItems.flatMap((sec) => sec.items.map((it) => ({ ...it, group: sec.title })))
  const results = fold(query) ? allItems.filter((it) => fold(it.label).includes(fold(query))) : allItems.slice(0, 6)

  const isOn = (href: string) => pathname === href || (href !== '/admin-cls' && pathname.startsWith(href))

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
  const closeAll = () => {
    setAddOpen(false)
    setBellOpen(false)
    setUserMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[var(--ad-bg)] text-[var(--ad-fg)]">
      {/* ───── THANH TRÊN: kính mờ sáng, logo, đường dẫn, tìm nhanh, thêm mới, thông báo, tài khoản ───── */}
      <header ref={headerRef} className="ad-glass fixed inset-x-0 top-0 z-40 flex h-[52px] items-center gap-3 border-b border-[var(--ad-line)] px-3 lg:px-4">
        <button onClick={() => setMobileMenuOpen(true)} className={cn(ICON_BTN, 'lg:hidden')} aria-label="Mở menu">
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin-cls" className="flex shrink-0 items-center gap-2.5" aria-label="Trang tổng quan">
          {branding.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logoUrl} alt={branding.siteName} className="h-[22px] w-auto object-contain" />
          ) : (
            <span className="text-[17px] font-bold tracking-tight text-[var(--ad-accent)]">{branding.siteName}</span>
          )}
        </Link>
        <span className="hidden h-5 shrink-0 items-center rounded-full bg-[var(--ad-fill)] px-2 text-[11.5px] font-medium text-[var(--ad-fg-2)] sm:inline-flex">
          Quản trị
        </span>
        {here && (
          <nav aria-label="Vị trí hiện tại" className="hidden min-w-0 items-center gap-1.5 whitespace-nowrap text-[13px] text-[var(--ad-fg-3)] md:flex">
            <span>{here.group}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate font-medium text-[var(--ad-fg)]">{here.label}</span>
          </nav>
        )}

        {/* Tìm nhanh (⌘K hoặc Ctrl K): nhảy tới mục menu */}
        <div className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[var(--ad-fg-3)]" />
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
            className="h-8 w-full rounded-[10px] border-0 bg-[var(--ad-fill)] pl-9 pr-14 text-[13.5px] text-[var(--ad-fg)] placeholder:text-[var(--ad-fg-3)] focus:bg-[var(--ad-surface)]"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-[var(--ad-line)] bg-[var(--ad-surface)] px-1.5 text-[11px] text-[var(--ad-fg-3)]">⌘K</kbd>
          {searchOpen && (
            <div className={cn(PANEL, 'left-0 right-0')}>
              <p className={PANEL_LABEL}>{fold(query) ? 'Kết quả' : 'Gợi ý'}</p>
              {results.length === 0 && <p className="px-2.5 py-2 text-[14px] text-[var(--ad-fg-3)]">Không có mục nào khớp.</p>}
              {results.slice(0, 8).map((it, i) => (
                <button
                  key={it.href}
                  type="button"
                  onMouseEnter={() => setSel(i)}
                  onClick={() => go(it.href)}
                  className={cn(PANEL_ITEM, i === sel && 'bg-[var(--ad-fill)]')}
                >
                  <it.icon className="h-4 w-4 text-[var(--ad-fg-2)]" strokeWidth={1.8} />
                  <span className="flex-1 truncate">{it.label}</span>
                  <span className="text-[12px] text-[var(--ad-fg-3)]">{it.group}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setAddOpen((v) => !v)
                setBellOpen(false)
                setUserMenuOpen(false)
              }}
              aria-expanded={addOpen}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[var(--ad-accent)] px-3 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ad-accent-d)] sm:px-3.5"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
              <span className="hidden sm:inline">Thêm</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>
            {addOpen && (
              <div className={cn(PANEL, 'w-56')}>
                <p className={PANEL_LABEL}>Tạo mới</p>
                {[
                  { label: 'Bài viết mới', href: '/admin-cls/posts/new', icon: FileText },
                  { label: 'Dự án mới', href: '/admin-cls/projects/new', icon: Briefcase },
                  { label: 'Thành viên đội ngũ', href: '/admin-cls/team/new', icon: UserPlus },
                  { label: 'Thông báo', href: '/admin-cls/announcements', icon: Bell },
                ].map((it) => (
                  <Link key={it.href} href={it.href} onClick={() => setAddOpen(false)} className={PANEL_ITEM}>
                    <it.icon className="h-4 w-4 text-[var(--ad-fg-2)]" strokeWidth={1.8} />
                    {it.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/" target="_blank" className={cn(ICON_BTN, 'hidden sm:grid')} title="Xem website" aria-label="Xem website">
            <ExternalLink className="h-[17px] w-[17px]" />
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
              className={ICON_BTN}
            >
              <Bell className="h-[18px] w-[18px]" />
              {bellCount > 0 && (
                <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#ff3b30] px-1 text-[10.5px] font-semibold text-white">
                  {bellCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className={cn(PANEL, 'w-72')}>
                <p className={PANEL_LABEL}>Thông báo</p>
                {leads24h ? (
                  <Link href="/admin-cls/leads" onClick={() => setBellOpen(false)} className={PANEL_ITEM}>
                    <Target className="h-4 w-4 text-[var(--ad-fg-2)]" strokeWidth={1.8} />
                    <span className="flex-1">{leads24h} lead mới trong 24 giờ</span>
                  </Link>
                ) : null}
                {SEO_OPEN_TASKS ? (
                  <Link href="/admin-cls/seo" onClick={() => setBellOpen(false)} className={PANEL_ITEM}>
                    <Search className="h-4 w-4 text-[var(--ad-fg-2)]" strokeWidth={1.8} />
                    <span className="flex-1">{SEO_OPEN_TASKS} việc quản trị SEO còn mở</span>
                  </Link>
                ) : null}
                {bellCount === 0 && <p className="px-2.5 py-2 text-[14px] text-[var(--ad-fg-3)]">Chưa có thông báo mới.</p>}
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
              className="ml-0.5 flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-1 transition-colors hover:bg-[var(--ad-fill)] lg:pr-2.5"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#5ac8fa] to-[var(--ad-accent)] text-[12.5px] font-semibold text-white">
                {initial}
              </span>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block max-w-[120px] truncate text-[13px] font-medium text-[var(--ad-fg)]">{displayName}</span>
                <span className="block text-[11.5px] text-[var(--ad-fg-3)]">{roleLabel}</span>
              </span>
            </button>

            {userMenuOpen && (
              <div className={cn(PANEL, 'w-60')}>
                <div className="mb-1 border-b border-[var(--ad-line)] px-2.5 pb-2 pt-1.5">
                  <p className="truncate text-[13px] font-semibold">{user.email}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--ad-fg-3)]">{roleLabel}</p>
                </div>
                <Link href="/admin-cls/settings" onClick={closeAll} className={PANEL_ITEM}>
                  <Settings className="h-4 w-4 text-[var(--ad-fg-2)]" strokeWidth={1.8} />
                  Cài đặt
                </Link>
                <Link href="/" target="_blank" onClick={closeAll} className={PANEL_ITEM}>
                  <Globe className="h-4 w-4 text-[var(--ad-fg-2)]" strokeWidth={1.8} />
                  Xem website
                </Link>
                <hr className="my-1 border-[var(--ad-line)]" />
                <form action={logout}>
                  <button type="submit" className={cn(PANEL_ITEM, 'text-[#d70015]')}>
                    <LogOut className="h-4 w-4" strokeWidth={1.8} />
                    Đăng xuất
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ───── LỚP PHỦ MENU ĐIỆN THOẠI ───── */}
      {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* ───── MENU TRÁI: một cột, chia nhóm; thu gọn thành cột biểu tượng ───── */}
      <aside
        className={cn(
          'fixed left-0 top-[52px] z-40 flex h-[calc(100vh-52px)] w-[264px] flex-col border-r border-[var(--ad-line)] bg-[var(--ad-surface-2)] transition-[width,transform] duration-200 lg:z-30',
          sidebarCollapsed ? 'lg:w-[68px]' : 'lg:w-[248px]',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className={cn(ICON_BTN, 'absolute right-2 top-2 lg:hidden')}
          aria-label="Đóng menu"
        >
          <X className="h-4 w-4" />
        </button>

        <nav className="flex-1 overflow-y-auto px-3 pb-3 pt-4" aria-label="Menu quản trị">
          {sidebarItems.map((section, idx) => (
            <div key={section.title} className={cn(idx > 0 && 'mt-5')}>
              <h2 className={cn('mb-1 px-2.5 text-[12px] font-semibold text-[var(--ad-fg-3)]', sidebarCollapsed && 'lg:hidden')}>{section.title}</h2>
              {idx > 0 && sidebarCollapsed && <hr className="-mt-3 mb-2 hidden border-[var(--ad-line)] lg:block" />}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isOn(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        title={sidebarCollapsed ? item.label : undefined}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group relative flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] transition-colors focus-visible:outline-none',
                          sidebarCollapsed && 'lg:justify-center lg:px-0',
                          active
                            ? 'bg-[var(--ad-accent-soft)] font-medium text-[var(--ad-accent)]'
                            : 'text-[var(--ad-fg)] hover:bg-[var(--ad-fill)]'
                        )}
                      >
                        <item.icon
                          className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-[var(--ad-accent)]' : 'text-[var(--ad-fg-2)]')}
                          strokeWidth={1.7}
                        />
                        <span className={cn('flex-1 truncate', sidebarCollapsed && 'lg:hidden')}>{item.label}</span>
                        {item.badge ? (
                          <span
                            className={cn(
                              'shrink-0 rounded-full bg-[var(--ad-accent)] px-1.5 text-center text-[11px] font-medium leading-[18px] text-white',
                              sidebarCollapsed && 'lg:absolute lg:right-1.5 lg:top-1.5 lg:h-2 lg:w-2 lg:min-w-0 lg:px-0 lg:text-[0px]'
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="hidden border-t border-[var(--ad-line)] p-2 lg:block">
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              'flex h-9 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-[13.5px] text-[var(--ad-fg-2)] transition-colors hover:bg-[var(--ad-fill)] focus-visible:outline-none',
              sidebarCollapsed && 'justify-center px-0'
            )}
            title={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            aria-label={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-[18px] w-[18px]" /> : <ChevronLeft className="h-[18px] w-[18px]" />}
            {!sidebarCollapsed && <span>Thu gọn</span>}
          </button>
        </div>
      </aside>

      {/* ───── NỘI DUNG ───── */}
      <div className={cn('pt-[52px] transition-[margin] duration-200', sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[248px]')}>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
