'use client'

import { useState } from 'react'
import { ArrowRight, FileText, Globe, MousePointerClick, Send, ShieldOff } from 'lucide-react'
import { Card, Chip, SectionCard, StatCard } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'

/**
 * Màn Truy cập và Hành trình (đọc từ CDP Click Star). Kiểu dữ liệu dưới đây là "hợp đồng" giữa
 * website và API báo cáo của CDP: CDP tính sẵn (đã lọc bot, máy test, trang quản trị), website chỉ hiển thị.
 */
export type PageRef = { path: string; title: string }
export type TrafficReport = {
  periodLabel: string
  kpis: { humans: number; sessions: number; pageviews: number; bouncePct: number; pagesPerSession: number; filteredVisitors: number }
  sources: { label: string; sessions: number; leads: number }[]
  landings: (PageRef & { sessions: number; bouncePct: number })[]
  articles: (PageRef & { views: number; avgReadSec: number; readThroughPct: number; leads: number })[]
  transitions: { from: PageRef; to: PageRef; count: number }[]
  journeys: {
    id: string
    who: string
    when: string
    source: string
    steps: { time: string; kind: 'page' | 'click' | 'form'; label: string; path?: string; readSec?: number; scroll?: number }[]
  }[]
}

type Tab = 'traffic' | 'flow' | 'journeys'

const sec = (s: number) => (s >= 60 ? `${Math.floor(s / 60)} phút ${s % 60 ? `${s % 60} giây` : ''}`.trim() : `${s} giây`)
const n = (x: number) => x.toLocaleString('vi-VN')

export function TrafficJourney({ data }: { data: TrafficReport }) {
  const [tab, setTab] = useState<Tab>('traffic')
  const [article, setArticle] = useState(data.articles[0]?.path ?? '')
  const k = data.kpis

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          ariaLabel="Chọn phần báo cáo truy cập"
          value={tab}
          onChange={setTab}
          options={[
            { id: 'traffic', label: 'Nguồn và trang' },
            { id: 'flow', label: 'Luồng giữa các trang' },
            { id: 'journeys', label: 'Hành trình lead' },
          ]}
        />
        <span className="text-[13px] text-[var(--ad-fg-3)]">{data.periodLabel}</span>
        <Chip className="ml-auto" tone="neutral">
          <ShieldOff className="h-3.5 w-3.5" /> Đã loại {n(k.filteredVisitors)} lượt bot, máy test, quản trị
        </Chip>
      </div>

      {tab === 'traffic' && (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Người truy cập thật" value={n(k.humans)} note={`${n(k.sessions)} phiên`} />
            <StatCard label="Lượt xem trang" value={n(k.pageviews)} note={`${k.pagesPerSession.toLocaleString('vi-VN')} trang mỗi phiên`} />
            <StatCard label="Rời sau một trang" value={`${k.bouncePct}%`} note="Vào một trang rồi thoát" tone={k.bouncePct > 70 ? 'warn' : 'neutral'} />
            <StatCard
              label="Để lại thông tin"
              value={n(data.sources.reduce((s, x) => s + x.leads, 0))}
              note={`${((data.sources.reduce((s, x) => s + x.leads, 0) / Math.max(1, k.sessions)) * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% số phiên`}
            />
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionCard title="Khách đến từ đâu" description="Theo phiên truy cập; cột phải là số lead của nguồn đó.">
              <Rows
                rows={data.sources.map((s) => ({ key: s.label, label: s.label, value: s.sessions, extra: s.leads ? `${s.leads} lead` : '' }))}
              />
            </SectionCard>
            <SectionCard title="Trang vào đầu tiên" description="Trang khách mở đầu tiên trong phiên, kèm tỷ lệ rời luôn.">
              <Rows
                rows={data.landings.map((l) => ({ key: l.path, label: l.title, sub: l.path, value: l.sessions, extra: `rời ${l.bouncePct}%` }))}
              />
            </SectionCard>
          </div>

          <SectionCard title="Bài viết được đọc" description="Thời gian đọc là thời gian khách thật sự ở trên trang; đọc hết là cuộn tới 90% bài.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--ad-line)] text-left">
                    <th className="py-2.5 pr-3">Bài viết</th>
                    <th className="px-3 py-2.5 text-right">Lượt xem</th>
                    <th className="px-3 py-2.5 text-right">Đọc trung bình</th>
                    <th className="px-3 py-2.5 text-right">Đọc hết</th>
                    <th className="py-2.5 pl-3 text-right">Dẫn ra lead</th>
                  </tr>
                </thead>
                <tbody>
                  {data.articles.map((a) => (
                    <tr key={a.path} className="border-t border-[var(--ad-line)] first:border-t-0">
                      <td className="py-2.5 pr-3">
                        <div className="max-w-[420px] truncate text-[14px] font-medium text-[var(--ad-fg)]">{a.title}</div>
                        <div className="text-[12px] text-[var(--ad-fg-3)]">{a.path}</div>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{n(a.views)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{sec(a.avgReadSec)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{a.readThroughPct}%</td>
                      <td className="py-2.5 pl-3 text-right">{a.leads ? <Chip tone="ok">{a.leads}</Chip> : <span className="text-[var(--ad-fg-3)]">0</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}

      {tab === 'flow' && <Flow data={data} article={article} setArticle={setArticle} />}

      {tab === 'journeys' && (
        <div className="space-y-4">
          <p className="text-[13.5px] text-[var(--ad-fg-3)]">
            Mỗi thẻ là đường đi của một khách trước khi để lại thông tin, theo đúng thứ tự thời gian. Chỉ nối được khi khách gửi form liên hệ.
          </p>
          {data.journeys.map((j) => (
            <Card key={j.id} className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h3 className="text-[15.5px] font-semibold text-[var(--ad-fg)]">{j.who}</h3>
                <Chip tone="blue">{j.source}</Chip>
                <span className="text-[13px] text-[var(--ad-fg-3)]">{j.when}</span>
              </div>
              <ol className="relative ml-2 space-y-3 border-l border-[var(--ad-line-2)] pl-5">
                {j.steps.map((s, i) => (
                  <li key={i} className="relative">
                    <span
                      className={`absolute -left-[31px] top-0.5 grid h-5 w-5 place-items-center rounded-full ring-4 ring-[var(--ad-surface)] ${
                        s.kind === 'form' ? 'bg-[#34c759] text-white' : s.kind === 'click' ? 'bg-[var(--ad-fill-2)] text-[var(--ad-fg-2)]' : 'bg-[var(--ad-accent)] text-white'
                      }`}
                    >
                      {s.kind === 'form' ? <Send className="h-3 w-3" /> : s.kind === 'click' ? <MousePointerClick className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[12.5px] tabular-nums text-[var(--ad-fg-3)]">{s.time}</span>
                      <span className={`text-[14px] ${s.kind === 'form' ? 'font-semibold text-[#248a3d]' : 'text-[var(--ad-fg)]'}`}>{s.label}</span>
                    </div>
                    {(s.path || s.readSec !== undefined) && (
                      <div className="text-[12.5px] text-[var(--ad-fg-3)]">
                        {s.path}
                        {s.readSec !== undefined ? ` · đọc ${sec(s.readSec)}` : ''}
                        {s.scroll !== undefined ? ` · cuộn ${s.scroll}%` : ''}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function Flow({ data, article, setArticle }: { data: TrafficReport; article: string; setArticle: (p: string) => void }) {
  const before = data.transitions.filter((t) => t.to.path === article).sort((a, b) => b.count - a.count).slice(0, 5)
  const after = data.transitions.filter((t) => t.from.path === article).sort((a, b) => b.count - a.count).slice(0, 5)
  const cur = data.articles.find((a) => a.path === article)
  const maxB = Math.max(1, ...before.map((t) => t.count))
  const maxA = Math.max(1, ...after.map((t) => t.count))
  const top = [...data.transitions].sort((a, b) => b.count - a.count).slice(0, 8)
  const maxT = Math.max(1, ...top.map((t) => t.count))

  return (
    <div className="space-y-4">
      <SectionCard title="Đường đi phổ biến nhất" description="Khách mở trang bên trái rồi bấm sang trang bên phải.">
        <ul className="space-y-2.5">
          {top.map((t, i) => (
            <li key={i} className="grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)_minmax(60px,160px)] items-center gap-2.5">
              <PageChip p={t.from} />
              <ArrowRight className="h-4 w-4 text-[var(--ad-fg-3)]" />
              <PageChip p={t.to} />
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-[var(--ad-fill)]">
                  <div className="h-full rounded-full bg-[var(--ad-accent)]" style={{ width: `${(t.count / maxT) * 100}%` }} />
                </div>
                <span className="w-8 text-right text-[13px] tabular-nums text-[var(--ad-fg-2)]">{t.count}</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Trước và sau một bài"
        description="Chọn một bài để xem khách đến bài đó từ đâu và đọc xong đi tiếp tới đâu."
        actions={
          <select
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className="h-8 max-w-[280px] rounded-[10px] border border-[var(--ad-line-2)] bg-[var(--ad-surface)] px-2.5 text-[13px]"
            aria-label="Chọn bài viết"
          >
            {data.articles.map((a) => (
              <option key={a.path} value={a.path}>
                {a.title}
              </option>
            ))}
          </select>
        }
      >
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_240px_minmax(0,1fr)]">
          <FlowList title="Đến từ" rows={before.map((t) => ({ p: t.from, c: t.count }))} max={maxB} align="right" empty="Chủ yếu vào thẳng từ ngoài (Google, Zalo, Facebook)." />
          <div className="rounded-2xl border border-[var(--ad-accent)] bg-[var(--ad-accent-soft)] p-4 text-center">
            <Globe className="mx-auto mb-1.5 h-5 w-5 text-[var(--ad-accent)]" />
            <div className="text-[14px] font-semibold text-[var(--ad-fg)]">{cur?.title}</div>
            {cur ? (
              <div className="mt-1 text-[12.5px] text-[var(--ad-fg-2)]">
                {n(cur.views)} lượt xem · đọc {sec(cur.avgReadSec)} · {cur.readThroughPct}% đọc hết
              </div>
            ) : null}
          </div>
          <FlowList title="Đi tiếp tới" rows={after.map((t) => ({ p: t.to, c: t.count }))} max={maxA} align="left" empty="Phần lớn khách rời trang sau bài này." />
        </div>
      </SectionCard>
    </div>
  )
}

function FlowList({ title, rows, max, align, empty }: { title: string; rows: { p: PageRef; c: number }[]; max: number; align: 'left' | 'right'; empty: string }) {
  return (
    <div>
      <div className="mb-2 text-[12.5px] font-medium text-[var(--ad-fg-3)]">{title}</div>
      {rows.length === 0 ? (
        <p className="text-[13px] text-[var(--ad-fg-3)]">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.p.path}>
              <div className="flex items-center justify-between gap-2 text-[13.5px]">
                <span className="truncate text-[var(--ad-fg)]" title={r.p.path}>
                  {r.p.title}
                </span>
                <span className="tabular-nums text-[var(--ad-fg-2)]">{r.c}</span>
              </div>
              <div className={`mt-1 flex h-1.5 rounded-full bg-[var(--ad-fill)] ${align === 'right' ? 'justify-end' : ''}`}>
                <div className="h-full rounded-full bg-[var(--ad-accent)]" style={{ width: `${(r.c / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PageChip({ p }: { p: PageRef }) {
  return (
    <span className="truncate rounded-lg bg-[var(--ad-fill-soft)] px-2.5 py-1.5 text-[13px] text-[var(--ad-fg)]" title={p.path}>
      {p.title}
    </span>
  )
}

function Rows({ rows }: { rows: { key: string; label: string; sub?: string; value: number; extra?: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.key} className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)_96px] items-center gap-3">
          <div className="min-w-0">
            <div className="truncate text-[13.5px] text-[var(--ad-fg)]" title={r.label}>
              {r.label}
            </div>
            {r.sub ? <div className="truncate text-[11.5px] text-[var(--ad-fg-3)]">{r.sub}</div> : null}
          </div>
          <div className="h-2.5 rounded-full bg-[var(--ad-fill)]">
            <div className="h-full rounded-full bg-[var(--ad-accent)]" style={{ width: `${Math.max(3, (r.value / max) * 100)}%` }} />
          </div>
          <span className="text-right text-[13px] tabular-nums text-[var(--ad-fg-2)]">
            <b className="font-semibold text-[var(--ad-fg)]">{n(r.value)}</b>
            {r.extra ? <span className="block text-[11.5px] text-[var(--ad-fg-3)]">{r.extra}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  )
}
