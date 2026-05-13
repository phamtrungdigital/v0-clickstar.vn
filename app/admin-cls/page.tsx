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
import { getAdminProfile } from '@/lib/admin-cls/auth'

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <p className="text-sm text-slate-500 capitalize">{today}</p>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
          {getGreeting()}, <span className="text-slate-900">{userName}</span>
        </h1>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
          Tổng quan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Tổng leads" value={stats.leadsTotal} icon={<Users className="w-4 h-4" />} href="/admin-cls/leads" />
          <StatCard label="Leads 24h" value={stats.leadsNew24h} icon={<TrendingUp className="w-4 h-4" />} href="/admin-cls/leads" highlight={stats.leadsNew24h > 0} />
          <StatCard label="Leads 7 ngày" value={stats.leads7d} icon={<Activity className="w-4 h-4" />} href="/admin-cls/leads" />
          <StatCard label="Tỷ lệ chuyển đổi" value={`${conversionRate}%`} icon={<TrendingUp className="w-4 h-4" />} />
          <StatCard label="Bài viết đã đăng" value={stats.posts} icon={<FileText className="w-4 h-4" />} href="/admin-cls/posts" />
          <StatCard label="Trang CMS" value={stats.pages} icon={<Globe className="w-4 h-4" />} href="/admin-cls/pages" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
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

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Lối tắt</h2>
          <div className="space-y-1">
            <QuickAction href="/admin-cls/posts/new" icon={<Plus className="w-4 h-4" />} label="Viết bài mới" orange />
            <QuickAction href="/admin-cls/pages/home/edit" icon={<Edit3 className="w-4 h-4" />} label="Sửa trang chủ" />
            <QuickAction href="/admin-cls/users/new" icon={<UserPlus className="w-4 h-4" />} label="Thêm admin user" />
            <QuickAction href="/admin-cls/ai" icon={<Activity className="w-4 h-4" />} label="AI Assistant" />
            <QuickAction href="/" icon={<ExternalLink className="w-4 h-4" />} label="Xem website public" external />
          </div>
        </div>
      </div>
    </div>
  )
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
