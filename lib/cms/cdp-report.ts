import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { parseService } from '@/lib/cms/report-data'
import type { TrafficReport } from '@/app/admin-cls/reports/_components/traffic-journey'

/**
 * Số liệu truy cập và hành trình lấy từ CDP Click Star (/v1/report/*), gọi ở máy chủ bằng khoá CDP_REPORT_KEY.
 * CDP đã lọc bot, máy test, trang quản trị. File này ghép thêm dữ liệu của website: tên bài, lead nào đi qua trang nào.
 */

type CdpTraffic = {
  kpis: { humans: number; engaged: number; sessions: number; pageviews: number; bounce_pct: number; filtered_visitors: number }
  sources: { key: string; sessions: number; aids: string[] }[]
  landings: { path: string; title: string | null; sessions: number; bounce_pct: number }[]
  pages: { path: string; title: string | null; views: number; visitors: number; avg_read_sec: number | null; read75_pct: number | null }[]
  transitions: { from: string; from_title: string | null; to: string; to_title: string | null; count: number }[]
}

type CdpStep = {
  ts: string
  name: string
  path: string | null
  title: string | null
  referrer: string | null
  utm: Record<string, string> | null
  active_ms: number | null
  max_scroll: number | null
  to_url: string | null
  text: string | null
}

export type TrafficResult = { ok: true; data: TrafficReport } | { ok: false; reason: string }

const DAY = 86_400_000

async function cdpFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const base = process.env.CDP_REPORT_URL
  const key = process.env.CDP_REPORT_KEY
  if (!base || !key) return null
  const res = await fetch(`${base.replace(/\/$/, '')}${path}`, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`CDP ${path} ${res.status}`)
  return (await res.json()) as T
}

const SOURCE_LABEL: Record<string, string> = {
  direct: 'Vào thẳng (gõ địa chỉ, bookmark, ứng dụng)',
  google: 'Google',
  bing: 'Bing',
  facebook: 'Facebook',
  zalo: 'Zalo',
  internal: 'Từ chính website',
}
function sourceLabel(key: string) {
  if (SOURCE_LABEL[key]) return SOURCE_LABEL[key]
  if (key.startsWith('utm:')) return `Chiến dịch UTM: ${key.slice(4)}`
  if (key.startsWith('ref:')) return key.slice(4)
  return key
}

const PAGE_NAME: Record<string, string> = {
  '/': 'Trang chủ',
  '/en': 'Trang chủ (EN)',
  '/about': 'Giới thiệu',
  '/pricing': 'Bảng giá',
  '/contact': 'Liên hệ',
  '/blog': 'Blog',
  '/en/blog': 'Blog (EN)',
  '/projects': 'Dự án',
}
const cleanTitle = (t: string | null) => (t ? t.replace(/\s*\|\s*Click Star\s*$/i, '').trim() : '')
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export async function loadTraffic(days: number): Promise<TrafficResult> {
  if (!process.env.CDP_REPORT_URL || !process.env.CDP_REPORT_KEY) {
    return { ok: false, reason: 'Chưa cấu hình kết nối CDP (CDP_REPORT_URL, CDP_REPORT_KEY).' }
  }
  const to = new Date()
  const from = new Date(to.getTime() - days * DAY)
  const supabase = await createClient()

  try {
    const [traffic, postsRes, leadsRes] = await Promise.all([
      cdpFetch<CdpTraffic>(`/v1/report/traffic?from=${from.toISOString()}&to=${to.toISOString()}`),
      supabase.from('posts').select('slug, title'),
      supabase
        .from('leads')
        .select('id, name, message, created_at, cdp_anonymous_id')
        .not('cdp_anonymous_id', 'is', null)
        .gte('created_at', from.toISOString())
        .order('created_at', { ascending: false })
        .limit(50),
    ])
    if (!traffic) return { ok: false, reason: 'Chưa cấu hình kết nối CDP.' }

    // Tên trang: bài viết lấy tên trong CMS (đúng hơn tiêu đề CDP ghi được), trang khác theo bảng tên, cuối cùng là tiêu đề CDP.
    const postTitle = new Map<string, string>()
    for (const p of (postsRes.data ?? []) as { slug: string; title: { vi?: string; en?: string } | null }[]) {
      if (p.title?.vi) postTitle.set(`/blog/${p.slug}`, p.title.vi)
      if (p.title?.en || p.title?.vi) postTitle.set(`/en/blog/${p.slug}`, p.title?.en || p.title?.vi || '')
    }
    const nameOf = (path: string, cdpTitle?: string | null) =>
      postTitle.get(path) || PAGE_NAME[path] || cleanTitle(cdpTitle ?? null) || path

    // Hành trình các lead trong kỳ (đã lưu mã khách CDP).
    const leads = (leadsRes.data ?? []) as { id: string; name: string; message: string | null; created_at: string; cdp_anonymous_id: string }[]
    const journeysRaw = leads.length
      ? await cdpFetch<Record<string, CdpStep[]>>('/v1/report/journeys', {
          method: 'POST',
          body: JSON.stringify({ anonymous_ids: leads.map((l) => l.cdp_anonymous_id), until: to.toISOString() }),
        })
      : {}
    const stepsBefore = (lead: (typeof leads)[number]) =>
      (journeysRaw?.[lead.cdp_anonymous_id] ?? []).filter((s) => Date.parse(s.ts) <= Date.parse(lead.created_at) + 60_000)

    // Lead theo nguồn (nguồn của các phiên khách đó) và theo bài đã đọc trước khi gửi form.
    const leadAids = new Set(leads.map((l) => l.cdp_anonymous_id))
    const leadsByPath = new Map<string, number>()
    for (const l of leads) {
      for (const path of new Set(stepsBefore(l).filter((s) => s.name === 'pageview' && s.path).map((s) => s.path as string))) {
        leadsByPath.set(path, (leadsByPath.get(path) ?? 0) + 1)
      }
    }

    const isArticle = (p: string) => /^\/(en\/)?blog\/[^/]+$/.test(p)

    const data: TrafficReport = {
      periodLabel: `${days} ngày qua (${from.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} đến ${to.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })})`,
      kpis: {
        humans: traffic.kpis.humans,
        engaged: traffic.kpis.engaged,
        sessions: traffic.kpis.sessions,
        pageviews: traffic.kpis.pageviews,
        bouncePct: traffic.kpis.bounce_pct,
        pagesPerSession: traffic.kpis.sessions ? Math.round((traffic.kpis.pageviews / traffic.kpis.sessions) * 10) / 10 : 0,
        filteredVisitors: traffic.kpis.filtered_visitors,
        leadsLinked: leads.length,
      },
      sources: traffic.sources.map((s) => ({
        label: sourceLabel(s.key),
        sessions: s.sessions,
        leads: s.aids.filter((a) => leadAids.has(a)).length,
      })),
      landings: traffic.landings.map((l) => ({ path: l.path, title: nameOf(l.path, l.title), sessions: l.sessions, bouncePct: l.bounce_pct })),
      articles: traffic.pages
        .filter((p) => isArticle(p.path))
        .slice(0, 15)
        .map((p) => ({
          path: p.path,
          title: nameOf(p.path, p.title),
          views: p.views,
          avgReadSec: p.avg_read_sec ?? 0,
          readThroughPct: p.read75_pct ?? 0,
          leads: leadsByPath.get(p.path) ?? 0,
        })),
      transitions: traffic.transitions.map((t) => ({
        from: { path: t.from, title: nameOf(t.from, t.from_title) },
        to: { path: t.to, title: nameOf(t.to, t.to_title) },
        count: t.count,
      })),
      journeys: leads.map((l) => {
        const steps = stepsBefore(l)
        const visits = new Set(steps.filter((s) => s.name === 'session_start').map((s) => s.ts.slice(0, 10))).size
        const first = steps.find((s) => s.name === 'session_start' || s.name === 'pageview')
        const exits = steps.filter((s) => s.name === 'page_exit')
        const service = parseService(l.message)
        return {
          id: l.id,
          who: `${l.name} · ${fmtTime(l.created_at)}`,
          when: visits > 1 ? `${visits} ngày ghé trước khi gửi form` : steps.length ? 'Gửi form trong lần ghé đầu' : 'CDP chưa ghi được bước nào',
          source: first ? sourceLabel(classify(first)) : 'Không rõ',
          steps: [
            ...steps
              .filter((s) => s.name === 'pageview' || (s.name === 'click' && s.text))
              .map((s) => {
                if (s.name === 'click') return { time: fmtTime(s.ts), kind: 'click' as const, label: `Bấm "${s.text}"` }
                const exit = exits.find((e) => e.path === s.path && Date.parse(e.ts) >= Date.parse(s.ts))
                return {
                  time: fmtTime(s.ts),
                  kind: 'page' as const,
                  label: nameOf(s.path ?? '', s.title),
                  path: s.path ?? undefined,
                  readSec: exit?.active_ms != null ? Math.round(Number(exit.active_ms) / 1000) : undefined,
                  scroll: exit?.max_scroll != null ? Number(exit.max_scroll) : undefined,
                }
              }),
            { time: fmtTime(l.created_at), kind: 'form' as const, label: `Gửi form liên hệ${service ? ` · quan tâm ${service}` : ''}`, path: '/contact' },
          ],
        }
      }),
    }
    return { ok: true, data }
  } catch (e) {
    console.error('[reports] CDP', e instanceof Error ? e.message : e)
    return { ok: false, reason: 'Không gọi được CDP Click Star, thử tải lại sau.' }
  }
}

function classify(s: CdpStep): string {
  if (s.utm && Object.keys(s.utm).length) return `utm:${s.utm.utm_source ?? 'khac'}`
  const r = s.referrer ?? ''
  if (!r) return 'direct'
  if (/google\./i.test(r)) return 'google'
  if (/(facebook\.|fb\.)/i.test(r)) return 'facebook'
  if (/zalo/i.test(r)) return 'zalo'
  if (/bing\./i.test(r)) return 'bing'
  if (/clickstar\.vn/i.test(r)) return 'internal'
  try {
    return `ref:${new URL(r).hostname}`
  } catch {
    return 'direct'
  }
}
