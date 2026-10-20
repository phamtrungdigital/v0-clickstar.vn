'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, BarChart3, Minus } from 'lucide-react'
import type { ReportData, ReportLead } from '@/lib/cms/report-data'
import { Card, Chip, PageHeader, SectionCard, StatCard, btn } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'

type Period = '30' | '90' | '365' | 'all'

const DAY = 86_400_000
const VN = 7 * 3_600_000

/** Tháng theo giờ Việt Nam cố định (không phụ thuộc múi giờ máy chủ hay trình duyệt). */
const monthKey = (ms: number) => new Date(ms + VN).toISOString().slice(0, 7)
const monthLabel = (key: string) => `${Number(key.slice(5, 7))}/${key.slice(2, 4)}`
const fmtNum = (n: number) => n.toLocaleString('vi-VN')
const fmtMoney = (n: number) =>
  n >= 1_000_000_000
    ? `${(n / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ`
    : n >= 1_000_000
      ? `${Math.round(n / 1_000_000).toLocaleString('vi-VN')} triệu`
      : fmtNum(n)

const STATUS_ORDER = ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost'] as const
const STATUS_LABEL: Record<string, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  qualified: 'Đủ điều kiện',
  quoted: 'Đã báo giá',
  won: 'Thành công',
  lost: 'Thất bại',
}
const SOURCE_LABEL: Record<string, string> = {
  contact_form: 'Form liên hệ',
  website: 'Website',
  google_ads: 'Google Ads',
  facebook: 'Facebook',
  facebook_ads: 'Facebook Ads',
  zalo: 'Zalo',
  referral: 'Giới thiệu',
  chatbot: 'Chatbot',
  khac: 'Khác',
}

const PERIODS: { id: Period; label: string; days: number | null; prev: string }[] = [
  { id: '30', label: '30 ngày', days: 30, prev: '30 ngày trước đó' },
  { id: '90', label: '90 ngày', days: 90, prev: '90 ngày trước đó' },
  { id: '365', label: '12 tháng', days: 365, prev: '12 tháng trước đó' },
  { id: 'all', label: 'Tất cả', days: null, prev: '' },
]

function countBy<T>(rows: T[], key: (r: T) => string) {
  const m = new Map<string, number>()
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

export function ReportsDashboard({ data }: { data: ReportData }) {
  const [period, setPeriod] = useState<Period>('90')
  const p = PERIODS.find((x) => x.id === period)!
  const now = data.nowMs

  const { cur, prev } = useMemo(() => {
    if (!p.days) return { cur: data.leads, prev: null as ReportLead[] | null }
    const start = now - p.days * DAY
    const prevStart = start - p.days * DAY
    return {
      cur: data.leads.filter((l) => Date.parse(l.createdAt) >= start),
      prev: data.leads.filter((l) => {
        const t = Date.parse(l.createdAt)
        return t >= prevStart && t < start
      }),
    }
  }, [data.leads, p.days, now])

  const won = cur.filter((l) => l.status === 'won').length
  const pipeline = cur.filter((l) => l.status !== 'lost').reduce((s, l) => s + l.value, 0)
  const synced = cur.filter((l) => l.crmSynced).length
  const withValue = cur.filter((l) => l.value > 0).length

  // 12 tháng gần nhất (luôn đủ 12 cột, tháng không có thì 0)
  const months = useMemo(() => {
    const keys: string[] = []
    const d = new Date(now + VN)
    for (let i = 11; i >= 0; i--) {
      const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1))
      keys.push(x.toISOString().slice(0, 7))
    }
    const leadMap = new Map(countBy(data.leads, (l) => monthKey(Date.parse(l.createdAt))))
    const postMap = new Map(countBy(data.postDates, (iso) => monthKey(Date.parse(iso))))
    return keys.map((k) => ({ key: k, leads: leadMap.get(k) ?? 0, posts: postMap.get(k) ?? 0 }))
  }, [data.leads, data.postDates, now])

  const funnel = STATUS_ORDER.map((s) => ({ id: s, label: STATUS_LABEL[s], value: cur.filter((l) => l.status === s).length }))
  const bySource = countBy(cur, (l) => l.source).map(([k, v]) => ({ id: k, label: SOURCE_LABEL[k] ?? k, value: v }))
  const byService = countBy(cur, (l) => l.service ?? '__none').map(([k, v]) => ({
    id: k,
    label: k === '__none' ? 'Không ghi dịch vụ' : k,
    value: v,
    muted: k === '__none',
  }))

  const postsInPeriod = p.days ? data.postDates.filter((iso) => Date.parse(iso) >= now - p.days! * DAY).length : data.postDates.length

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        className="mb-0"
        title="Báo cáo"
        description="Khách tiềm năng từ website và nhịp đăng bài, tính theo giờ Việt Nam. Số liệu truy cập xem ở Google Analytics."
        actions={
          <Segmented ariaLabel="Chọn kỳ báo cáo" value={period} onChange={setPeriod} options={PERIODS.map((x) => ({ id: x.id, label: x.label }))} />
        }
      />

      <section aria-label="Số liệu chính" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Lead mới"
          value={fmtNum(cur.length)}
          note={<Delta cur={cur.length} prev={prev?.length ?? null} label={p.prev} />}
          href="/admin-cls/leads"
        />
        <StatCard
          label="Tỷ lệ thành công"
          value={cur.length ? `${Math.round((won / cur.length) * 100)}%` : '—'}
          note={cur.length ? `${won} trên ${cur.length} lead` : 'Chưa có lead trong kỳ'}
        />
        <StatCard
          label="Giá trị dự kiến"
          value={pipeline ? fmtMoney(pipeline) : '—'}
          note={withValue ? `${withValue} lead có ghi giá trị, không tính lead thất bại` : 'Chưa lead nào ghi giá trị'}
        />
        <StatCard
          label="Đã đẩy sang CRM"
          value={cur.length ? `${synced}/${cur.length}` : '—'}
          note={cur.length && synced < cur.length ? `${cur.length - synced} lead chưa có hồ sơ CRM` : cur.length ? 'Đủ cả' : undefined}
          tone={cur.length && synced < cur.length ? 'warn' : 'neutral'}
        />
      </section>

      <SectionCard
        title="Lead theo tháng"
        description="12 tháng gần nhất, không phụ thuộc kỳ đang chọn."
        actions={<Chip>{fmtNum(months.reduce((s, m) => s + m.leads, 0))} lead</Chip>}
      >
        <MonthBars rows={months.map((m) => ({ key: m.key, value: m.leads }))} unit="lead" />
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Phễu trạng thái" description={`Lead tạo trong ${p.id === 'all' ? 'toàn bộ thời gian' : p.label + ' qua'}, theo trạng thái hiện tại.`}>
          <HBars rows={funnel} total={cur.length} emptyText="Chưa có lead trong kỳ." />
        </SectionCard>
        <SectionCard title="Nguồn lead" description="Lead đến từ kênh nào.">
          <HBars rows={bySource} total={cur.length} emptyText="Chưa có lead trong kỳ." />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Dịch vụ khách quan tâm" description="Lấy từ ô Dịch vụ trên form liên hệ.">
          <HBars rows={byService} total={cur.length} emptyText="Chưa có lead trong kỳ." />
        </SectionCard>
        <SectionCard
          title="Bài viết đã đăng"
          description="12 tháng gần nhất."
          actions={
            <Link href="/admin-cls/content" className={btn('ghost', 'sm')}>
              Quản trị bài viết
            </Link>
          }
        >
          <div className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-[13.5px] text-[var(--ad-fg-2)]">
            <span>
              <b className="text-[18px] font-semibold text-[var(--ad-fg)] tabular-nums">{fmtNum(postsInPeriod)}</b> bài trong kỳ
            </span>
            <span>
              <b className="text-[18px] font-semibold text-[var(--ad-fg)] tabular-nums">{fmtNum(data.postDates.length)}</b> bài đã đăng
            </span>
            <span>
              <b className="text-[18px] font-semibold text-[var(--ad-fg)] tabular-nums">{fmtNum(data.draftPosts)}</b> bản nháp
            </span>
          </div>
          <MonthBars rows={months.map((m) => ({ key: m.key, value: m.posts }))} unit="bài" compact />
        </SectionCard>
      </div>

      <Card className="flex flex-wrap items-center gap-4 p-5">
        <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[var(--ad-fill)] text-[var(--ad-fg-3)]">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[16px] font-semibold text-[var(--ad-fg)]">Lượt truy cập website</h2>
            {data.ga4Id ? <Chip tone="ok">Đã gắn {data.ga4Id}</Chip> : <Chip tone="warn">Chưa gắn Google Analytics</Chip>}
          </div>
          <p className="mt-1 text-[13.5px] leading-snug text-[var(--ad-fg-3)]">
            {data.ga4Id
              ? 'Website đang gửi số liệu truy cập về Google Analytics. Màn này chưa kéo số đó về; xem trực tiếp ở Google Analytics, hoặc nối sau để hiện lượt xem, nguồn truy cập và tỷ lệ để lại thông tin ngay tại đây.'
              : 'Website chưa có mã Google Analytics nên chưa có số liệu lượt xem. Gắn mã ở mục SEO, sau đó có thể nối số liệu về màn này.'}
          </p>
        </div>
        {data.ga4Id ? (
          <a href="https://analytics.google.com/" target="_blank" rel="noreferrer" className={btn('secondary')}>
            Mở Google Analytics
          </a>
        ) : (
          <Link href="/admin-cls/seo" className={btn('primary')}>
            Gắn mã ở mục SEO
          </Link>
        )}
      </Card>
    </div>
  )
}

function Delta({ cur, prev, label }: { cur: number; prev: number | null; label: string }) {
  if (prev === null) return null
  if (prev === 0 && cur === 0) return <span className="text-[var(--ad-fg-3)]">Bằng {label}</span>
  if (prev === 0) return <span className="text-[#248a3d]">Tăng so với {label} (0)</span>
  const diff = cur - prev
  const pct = Math.round((diff / prev) * 100)
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus
  return (
    <span className={`inline-flex items-center gap-0.5 ${diff > 0 ? 'text-[#248a3d]' : diff < 0 ? 'text-[#d70015]' : 'text-[var(--ad-fg-3)]'}`}>
      <Icon className="h-3.5 w-3.5" />
      {diff === 0 ? `Bằng ${label}` : `${diff > 0 ? '+' : ''}${pct}% so với ${label} (${prev})`}
    </span>
  )
}

/** Cột theo tháng: một chuỗi số liệu, một màu nhấn, số ghi trên đầu cột, rê chuột hiện chi tiết. */
function MonthBars({ rows, unit, compact = false }: { rows: { key: string; value: number }[]; unit: string; compact?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  const h = compact ? 110 : 170
  return (
    <div>
      <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: h + 22 }} role="img" aria-label={`Số ${unit} theo tháng`}>
        {rows.map((r) => (
          <div key={r.key} className="group flex h-full min-w-0 flex-1 flex-col justify-end" title={`Tháng ${monthLabel(r.key)}: ${r.value} ${unit}`}>
            <div className="mb-1 text-center text-[12px] tabular-nums text-[var(--ad-fg-2)]">{r.value || ''}</div>
            <div
              className={`rounded-t-[4px] transition-colors ${r.value ? 'bg-[var(--ad-accent)] group-hover:bg-[var(--ad-accent-d)]' : 'bg-[var(--ad-fill)]'}`}
              style={{ height: r.value ? Math.max(4, (r.value / max) * h) : 3 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5 border-t border-[var(--ad-line)] pt-1.5 sm:gap-2">
        {rows.map((r, i) => (
          <span key={r.key} className="min-w-0 flex-1 truncate text-center text-[11.5px] tabular-nums text-[var(--ad-fg-3)]">
            {compact && i % 2 === 1 ? '' : monthLabel(r.key)}
          </span>
        ))}
      </div>
      {/* Bảng số cho trình đọc màn hình */}
      <table className="sr-only">
        <caption>Số {unit} theo tháng</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <th>{monthLabel(r.key)}</th>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Thanh ngang: tên, thanh tỷ lệ, số và phần trăm. Một màu nhấn; dòng "không rõ" màu xám. */
function HBars({
  rows,
  total,
  emptyText,
}: {
  rows: { id: string; label: string; value: number; muted?: boolean }[]
  total: number
  emptyText: string
}) {
  if (!total) return <p className="py-6 text-center text-[13.5px] text-[var(--ad-fg-3)]">{emptyText}</p>
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.id} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)_72px] items-center gap-3 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)_84px]">
          <span className={`truncate text-[13.5px] ${r.muted ? 'text-[var(--ad-fg-3)]' : 'text-[var(--ad-fg)]'}`} title={r.label}>
            {r.label}
          </span>
          <div className="h-2.5 rounded-full bg-[var(--ad-fill)]" title={`${r.label}: ${r.value}`}>
            <div
              className={`h-full rounded-full ${r.muted ? 'bg-[rgba(0,0,0,.22)]' : 'bg-[var(--ad-accent)]'}`}
              style={{ width: r.value ? `${Math.max(3, (r.value / max) * 100)}%` : 0 }}
            />
          </div>
          <span className="text-right text-[13px] tabular-nums text-[var(--ad-fg-2)]">
            <b className="font-semibold text-[var(--ad-fg)]">{r.value}</b> · {Math.round((r.value / total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  )
}
