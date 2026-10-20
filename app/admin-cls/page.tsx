import { AI_MODULE_ENABLED } from '@/lib/ai/module-flag'
import Link from 'next/link'
import { Users, FileText, Edit3, Plus, Activity, UserPlus, ExternalLink, ChevronRight, Bot } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAdminProfile } from '@/lib/admin-cls/auth'
import { Card, SectionCard, StatCard, EmptyState, btn } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

type Stats = {
  leadsTotal: number
  leadsNew24h: number
  leadsWon: number
  leads7d: number
  posts: number
  pages: number
  users: number
}

type ActivityItem = {
  id: string
  type: 'lead' | 'post' | 'page'
  title: string
  subtitle: string
  href: string
  ts: string
}

const STATUS_LABEL: Record<string, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  qualified: 'Đủ điều kiện',
  quoted: 'Đã báo giá',
  won: 'Thành công',
  lost: 'Thất bại',
}

function getGreeting(): string {
  const hour = (new Date().getUTCHours() + 7) % 24
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'vừa xong'
  if (min < 60) return `${min} phút trước`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} giờ trước`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} ngày trước`
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Parallel: 1 RPC stats + 1 RPC activity + admin profile (cached from headers, 0ms)
  const [statsRes, activityRes, profile] = await Promise.all([
    supabase.rpc('get_admin_dashboard_stats'),
    supabase.rpc('get_admin_recent_activity'),
    getAdminProfile(),
  ])

  const stats = (statsRes.data as Stats | null) || {
    leadsTotal: 0,
    leadsNew24h: 0,
    leadsWon: 0,
    leads7d: 0,
    posts: 0,
    pages: 0,
    users: 0,
  }

  const rawActivity = (activityRes.data as ActivityItem[] | null) || []
  // Localize subtitle for leads (RPC returns raw status string)
  const activity = rawActivity.slice(0, 12).map((a) => ({
    ...a,
    subtitle:
      a.type === 'lead' && STATUS_LABEL[a.subtitle] ? STATUS_LABEL[a.subtitle] : a.subtitle,
  }))

  const userName = profile?.full_name || profile?.email?.split('@')[0] || 'bạn'
  const conversionRate =
    stats.leadsTotal > 0 ? ((stats.leadsWon / stats.leadsTotal) * 100).toFixed(1) : '0.0'

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-[14px] capitalize text-[var(--ad-fg-3)]">{today}</p>
        <h1 className="mt-1 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--ad-fg)] lg:text-[36px]">
          {getGreeting()}, {userName}
        </h1>
      </header>

      <section aria-label="Số liệu tổng quan" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Tổng leads"
          value={stats.leadsTotal}
          href="/admin-cls/leads"
        />
        <StatCard
          label="Leads 24 giờ"
          value={stats.leadsNew24h}
          note={stats.leadsNew24h > 0 ? 'Có khách mới' : undefined}
          tone="ok"
          href="/admin-cls/leads"
        />
        <StatCard label="Leads 7 ngày" value={stats.leads7d} href="/admin-cls/leads" />
        <StatCard label="Tỷ lệ chuyển đổi" value={`${conversionRate}%`} note={`${stats.leadsWon} thành công`} />
        <StatCard label="Bài viết đã đăng" value={stats.posts} href="/admin-cls/posts" />
        <StatCard label="Trang CMS" value={stats.pages} href="/admin-cls/pages" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard
          title="Hoạt động gần đây"
          description={`${activity.length} mục mới nhất`}
          bodyClassName="px-0 pb-2 pt-2"
        >
          {activity.length === 0 ? (
            <EmptyState icon={<Activity className="h-5 w-5" />} title="Chưa có hoạt động nào" description="Khi có khách để lại thông tin hoặc có bài viết mới, mục này sẽ hiện ở đây." />
          ) : (
            <ul>
              {activity.map((a) => (
                <li key={a.id} className="border-t border-[var(--ad-line)] first:border-t-0">
                  <Link
                    href={a.href}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--ad-fill-soft)]"
                  >
                    <ActivityIcon type={a.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14.5px] font-medium text-[var(--ad-fg)]">{a.title}</p>
                      <p className="mt-0.5 truncate text-[13px] text-[var(--ad-fg-3)]">{a.subtitle}</p>
                    </div>
                    <span className="flex-shrink-0 whitespace-nowrap text-[12.5px] text-[var(--ad-fg-3)]">
                      {relativeTime(a.ts)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <Card className="h-fit p-5">
          <h2 className="text-[16px] font-semibold tracking-[-0.018em] text-[var(--ad-fg)]">Lối tắt</h2>
          <Link href="/admin-cls/posts/new" className={btn('primary', 'lg') + ' mt-3 w-full'}>
            <Plus className="h-4 w-4" />
            Viết bài mới
          </Link>
          <div className="mt-2 -mx-2">
            <QuickAction href="/admin-cls/pages/home/edit" icon={<Edit3 className="h-4 w-4" />} label="Sửa trang chủ" />
            <QuickAction href="/admin-cls/users/new" icon={<UserPlus className="h-4 w-4" />} label="Thêm quản trị viên" />
            <QuickAction href="/admin-cls/ai" icon={<Bot className="h-4 w-4" />} label={AI_MODULE_ENABLED ? 'AI Assistant' : 'Chatbot website'} />
            <QuickAction href="/" icon={<ExternalLink className="h-4 w-4" />} label="Xem website" external />
          </div>
        </Card>
      </div>
    </div>
  )
}

function ActivityIcon({ type }: { type: 'lead' | 'post' | 'page' }) {
  const map = {
    lead: { icon: <Users className="h-4 w-4" />, bg: 'rgba(30,109,218,.10)', fg: '#1e6dda' },
    post: { icon: <FileText className="h-4 w-4" />, bg: 'rgba(175,82,222,.12)', fg: '#8944ab' },
    page: { icon: <Edit3 className="h-4 w-4" />, bg: 'rgba(52,199,89,.14)', fg: '#248a3d' },
  }
  const cfg = map[type]
  return (
    <div
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      {cfg.icon}
    </div>
  )
}

function QuickAction({
  href,
  icon,
  label,
  external,
}: {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="flex items-center justify-between gap-2 rounded-xl px-2 py-2.5 text-[14.5px] text-[var(--ad-fg)] transition-colors hover:bg-[var(--ad-fill-soft)]"
    >
      <span className="flex items-center gap-2.5 text-[var(--ad-fg-2)]">
        {icon}
        <span className="text-[var(--ad-fg)]">{label}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-[var(--ad-fg-3)]" />
    </Link>
  )
}
