import Link from 'next/link'
import {
  Users,
  FileText,
  Globe,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  UserPlus,
  Edit3,
  Plus,
  Activity,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getStats() {
  const supabase = await createClient()
  const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  const since7d = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()

  const [leadsAll, leadsNew, leadsWon, leads7d, posts, pages, users] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', since24h),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'won'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', since7d),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('pages').select('*', { count: 'exact', head: true }),
    supabase.from('admin_users').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  return {
    leadsTotal: leadsAll.count ?? 0,
    leadsNew24h: leadsNew.count ?? 0,
    leadsWon: leadsWon.count ?? 0,
    leads7d: leads7d.count ?? 0,
    posts: posts.count ?? 0,
    pages: pages.count ?? 0,
    users: users.count ?? 0,
  }
}

type ActivityItem = {
  id: string
  type: 'lead' | 'post' | 'page'
  title: string
  subtitle: string
  href: string
  ts: string
}

async function getRecentActivity(): Promise<ActivityItem[]> {
  const supabase = await createClient()

  const [leads, posts, pages] = await Promise.all([
    supabase
      .from('leads')
      .select('id, name, email, phone, status, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('posts')
      .select('id, slug, title, status, updated_at, published_at')
      .order('updated_at', { ascending: false })
      .limit(8),
    supabase
      .from('pages')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })
      .limit(8),
  ])

  const items: ActivityItem[] = []

  for (const l of leads.data || []) {
    items.push({
      id: `lead-${l.id}`,
      type: 'lead',
      title: l.name || l.email || l.phone || 'Lead mới',
      subtitle: `${STATUS_LABEL[l.status] || l.status} • ${l.email || l.phone || ''}`,
      href: '/admin/leads',
      ts: l.created_at,
    })
  }
  for (const p of posts.data || []) {
    const title =
      typeof p.title === 'object' && p.title
        ? (p.title as any).vi || (p.title as any).en
        : 'Bài viết'
    items.push({
      id: `post-${p.id}`,
      type: 'post',
      title: title || '(chưa có tiêu đề)',
      subtitle: p.status === 'published' ? 'Đã xuất bản' : 'Bản nháp',
      href: `/admin/posts/${p.id}/edit`,
      ts: p.updated_at,
    })
  }
  for (const p of pages.data || []) {
    items.push({
      id: `page-${p.slug}`,
      type: 'page',
      title: `Trang ${p.slug}`,
      subtitle: 'Đã chỉnh sửa',
      href: `/admin/pages/${p.slug.replace(/\//g, '__')}/edit`,
      ts: p.updated_at,
    })
  }

  return items.sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 12)
}

function getGreeting(): string {
  // Vietnam time (UTC+7)
  const hour = (new Date().getUTCHours() + 7) % 24
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

const STATUS_LABEL: Record<string, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  qualified: 'Đủ điều kiện',
  quoted: 'Đã báo giá',
  won: 'Thành công',
  lost: 'Thất bại',
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let userName = 'bạn'
  if (user) {
    const { data: profile } = await supabase
      .from('admin_users')
      .select('full_name, email')
      .eq('user_id', user.id)
      .maybeSingle()
    if (profile) userName = profile.full_name || profile.email.split('@')[0]
  }

  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()])
  const conversionRate =
    stats.leadsTotal > 0 ? ((stats.leadsWon / stats.leadsTotal) * 100).toFixed(1) : '0.0'

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ───── Greeting header (HubSpot style) ───── */}
      <div>
        <p className="text-sm text-slate-500 capitalize">{today}</p>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
          {getGreeting()}, <span className="text-slate-900">{userName}</span>
        </h1>
      </div>

      {/* ───── Stats grid ───── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
          Tổng quan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Tổng leads"
            value={stats.leadsTotal}
            icon={<Users className="w-4 h-4" />}
            href="/admin/leads"
          />
          <StatCard
            label="Leads 24h"
            value={stats.leadsNew24h}
            icon={<TrendingUp className="w-4 h-4" />}
            href="/admin/leads"
            highlight={stats.leadsNew24h > 0}
          />
          <StatCard
            label="Leads 7 ngày"
            value={stats.leads7d}
            icon={<Activity className="w-4 h-4" />}
            href="/admin/leads"
          />
          <StatCard
            label="Tỷ lệ chuyển đổi"
            value={`${conversionRate}%`}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Bài viết đã đăng"
            value={stats.posts}
            icon={<FileText className="w-4 h-4" />}
            href="/admin/posts"
          />
          <StatCard
            label="Trang CMS"
            value={stats.pages}
            icon={<Globe className="w-4 h-4" />}
            href="/admin/pages"
          />
        </div>
      </div>

      {/* ───── Activity feed + Quick actions ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Activity feed */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900">Hoạt động gần đây</h2>
            </div>
            <span className="text-xs text-slate-500">{activity.length} mục mới nhất</span>
          </div>
          {activity.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-12">Chưa có hoạt động nào</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activity.map((a) => (
                <li key={a.id}>
                  <Link
                    href={a.href}
                    className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <ActivityIcon type={a.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{a.subtitle}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 flex-shrink-0 whitespace-nowrap">
                      {relativeTime(a.ts)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Lối tắt</h2>
          <div className="space-y-1">
            <QuickAction
              href="/admin/posts/new"
              icon={<Plus className="w-4 h-4" />}
              label="Viết bài mới"
              orange
            />
            <QuickAction
              href="/admin/pages/home/edit"
              icon={<Edit3 className="w-4 h-4" />}
              label="Sửa trang chủ"
            />
            <QuickAction
              href="/admin/users/new"
              icon={<UserPlus className="w-4 h-4" />}
              label="Thêm admin user"
            />
            <QuickAction
              href="/admin/ai"
              icon={<Activity className="w-4 h-4" />}
              label="AI Assistant"
            />
            <QuickAction
              href="/"
              icon={<ExternalLink className="w-4 h-4" />}
              label="Xem website public"
              external
            />
          </div>
        </div>
      </div>
    </div>
  )
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

function StatCard({
  label,
  value,
  icon,
  href,
  highlight,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  href?: string
  highlight?: boolean
}) {
  const inner = (
    <div
      className={
        'bg-white rounded-xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ' +
        (highlight ? 'border-orange-300 ring-1 ring-orange-100' : 'border-slate-200')
      }
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
          {label}
        </span>
        <div
          className={
            'w-7 h-7 rounded-md flex items-center justify-center ' +
            (highlight ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-500')
          }
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  )
  if (href) return <Link href={href}>{inner}</Link>
  return inner
}

function ActivityIcon({ type }: { type: 'lead' | 'post' | 'page' }) {
  const map = {
    lead: { icon: <Users className="w-3.5 h-3.5" />, bg: 'bg-blue-100', text: 'text-blue-600' },
    post: { icon: <FileText className="w-3.5 h-3.5" />, bg: 'bg-purple-100', text: 'text-purple-600' },
    page: { icon: <Edit3 className="w-3.5 h-3.5" />, bg: 'bg-emerald-100', text: 'text-emerald-600' },
  }
  const cfg = map[type]
  return (
    <div
      className={`w-7 h-7 rounded-full ${cfg.bg} ${cfg.text} flex items-center justify-center flex-shrink-0`}
    >
      {cfg.icon}
    </div>
  )
}

function QuickAction({
  href,
  icon,
  label,
  orange,
  external,
}: {
  href: string
  icon: React.ReactNode
  label: string
  orange?: boolean
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className={
        'flex items-center justify-between gap-2 px-3 py-2.5 text-sm rounded-md transition-colors ' +
        (orange
          ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 font-medium'
          : 'text-slate-700 hover:bg-slate-100')
      }
    >
      <span className="flex items-center gap-2.5">
        {icon}
        {label}
      </span>
      <ArrowRight className="w-3.5 h-3.5 opacity-50" />
    </Link>
  )
}
