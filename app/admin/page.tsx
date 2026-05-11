import Link from 'next/link'
import {
  Users,
  FileText,
  Globe,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getStats() {
  const supabase = await createClient()
  const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString()

  const [leadsAll, leadsNew, leadsWon, posts, pages, users] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', since24h),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'won'),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('pages').select('*', { count: 'exact', head: true }),
    supabase.from('admin_users').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  return {
    leadsTotal: leadsAll.count ?? 0,
    leadsNew24h: leadsNew.count ?? 0,
    leadsWon: leadsWon.count ?? 0,
    posts: posts.count ?? 0,
    pages: pages.count ?? 0,
    users: users.count ?? 0,
  }
}

async function getRecentLeads() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('leads')
    .select('id, name, email, phone, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

const STATUS_LABEL: Record<string, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  qualified: 'Đủ điều kiện',
  quoted: 'Đã báo giá',
  won: 'Thành công',
  lost: 'Thất bại',
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-purple-100 text-purple-700',
  quoted: 'bg-cyan-100 text-cyan-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-slate-200 text-slate-600',
}

export default async function AdminDashboard() {
  const [stats, recentLeads] = await Promise.all([getStats(), getRecentLeads()])
  const conversionRate =
    stats.leadsTotal > 0 ? ((stats.leadsWon / stats.leadsTotal) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-xs text-slate-500">Tổng quan hệ thống CMS + Leads</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Tổng leads" value={stats.leadsTotal} icon={<Users className="w-4 h-4" />} accent="blue" href="/admin/leads" />
        <StatCard label="Leads 24h" value={stats.leadsNew24h} icon={<TrendingUp className="w-4 h-4" />} accent="amber" href="/admin/leads" />
        <StatCard
          label="Chuyển đổi"
          value={`${conversionRate}%`}
          icon={<TrendingUp className="w-4 h-4" />}
          accent="emerald"
        />
        <StatCard label="Bài viết" value={stats.posts} icon={<FileText className="w-4 h-4" />} accent="purple" href="/admin/posts" />
        <StatCard label="Trang" value={stats.pages} icon={<Globe className="w-4 h-4" />} accent="cyan" href="/admin/pages" />
        <StatCard label="Admin users" value={stats.users} icon={<Users className="w-4 h-4" />} accent="pink" href="/admin/users" />
      </div>

      {/* Recent leads + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Leads gần đây</h2>
            <Link href="/admin/leads" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">Chưa có lead nào</p>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentLeads.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-slate-900 dark:text-white text-sm">{l.name}</div>
                      <div className="text-[11px] text-slate-500">{l.email || l.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          STATUS_COLOR[l.status]
                        }`}
                      >
                        {STATUS_LABEL[l.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500 text-right">
                      {new Date(l.created_at).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Shortcuts</h2>
          <QuickLink href="/admin/pages/home/edit" label="Edit Trang chủ" />
          <QuickLink href="/admin/posts/new" label="Viết bài mới" />
          <QuickLink href="/admin/users/new" label="Thêm admin user" />
          <QuickLink href="/admin/settings" label="Cài đặt website" />
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Xem website public
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

const ACCENT_CLASSES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  pink: 'bg-pink-50 text-pink-600',
}

function StatCard({
  label,
  value,
  icon,
  accent,
  href,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  accent: string
  href?: string
}) {
  const inner = (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:shadow-md transition-shadow">
      <div className={`w-8 h-8 ${ACCENT_CLASSES[accent]} rounded-md flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{label}</div>
    </div>
  )
  if (href) return <Link href={href}>{inner}</Link>
  return inner
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
    >
      <span>{label}</span>
      <ArrowRight className="w-3 h-3" />
    </Link>
  )
}
