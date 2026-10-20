'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, Copy, ExternalLink, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD } from './seo-panel'
import {
  KINDS,
  SERVICE_SHORT,
  STAGES,
  type ContentAnalysis,
  type EnState,
  type PillarId,
  type StageId,
  type Suggestion,
} from '@/lib/seo/content-plan'

const stageLabel = (id: StageId | null) => STAGES.find((s) => s.id === id)?.label ?? ''

const CHIP = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap'

function CardHead({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-4 pt-3.5 pb-2">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

function StatBox({ label, value, suffix, note }: { label: string; value: string; suffix?: string; note?: string }) {
  return (
    <div className={cn(CARD, 'px-3.5 py-3')}>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</span>
        {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
      </div>
      {note && <div className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{note}</div>}
    </div>
  )
}

function GapBadge({ n }: { n: number }) {
  if (n === 0)
    return <span className={cn(CHIP, 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300')}>Ô này chưa có bài nào</span>
  if (n === 1)
    return <span className={cn(CHIP, 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300')}>Mới có 1 bài</span>
  return <span className={cn(CHIP, 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>Đã có {n} bài</span>
}

function SuggestionRow({ s, rank }: { s: Suggestion; rank?: number }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(s.title)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* trình duyệt chặn clipboard: bỏ qua, người dùng tự chọn chữ */
    }
  }
  return (
    <li className={cn('flex gap-3 px-4 py-3', s.done && 'opacity-60')}>
      {rank !== undefined && (
        <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary tabular-nums">
          {rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="text-sm font-medium text-slate-900 dark:text-white">{s.title}</p>
          <button
            type="button"
            onClick={copy}
            title="Chép tiêu đề"
            aria-label="Chép tiêu đề"
            className="mt-0.5 flex-none rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={cn(CHIP, 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300')}>{s.serviceLabel}</span>
          <span className={cn(CHIP, 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>{stageLabel(s.stage)}</span>
          <span className={cn(CHIP, 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>{s.pillarLabel}</span>
          {s.done ? (
            <Link
              href={`/blog/${s.slug}`}
              target="_blank"
              className={cn(CHIP, 'gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300')}
            >
              Đã viết <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            <GapBadge n={s.cellCount} />
          )}
        </div>
        <p className="mt-1.5 text-xs text-slate-500">{s.why}</p>
        {!s.done && <p className="mt-1 font-mono text-[11px] text-slate-400">/blog/{s.slug}</p>}
      </div>
    </li>
  )
}

const CELL_TONE = (n: number) =>
  n === 0
    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
    : n === 1
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'

const EN_BADGE: Record<EnState, { text: string; cls: string }> = {
  ok: { text: 'Có EN', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  short: { text: 'EN ngắn', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  none: { text: 'Chưa có EN', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' },
}

export function SeoContent({ data }: { data: ContentAnalysis }) {
  const { totals, pillars, matrix, stageTotals, cadence, suggestions, issues, tags, rows } = data
  const [showAllSug, setShowAllSug] = useState(false)
  const [openIssue, setOpenIssue] = useState<string | null>(null)
  const [pillarFilter, setPillarFilter] = useState<PillarId | 'all'>('all')

  const top = suggestions.filter((s) => s.top)
  const rest = suggestions.filter((s) => !s.top)
  const maxWeek = Math.max(1, ...cadence.weeks.map((w) => w.count))
  const maxPct = Math.max(30, ...pillars.map((p) => Math.max(p.pct, p.targetPct)))
  const visibleRows = useMemo(
    () =>
      rows
        .filter((r) => pillarFilter === 'all' || r.pillar === pillarFilter)
        .sort(
          (a, b) =>
            Number(b.status === 'published') - Number(a.status === 'published') ||
            (a.ageDays ?? 9999) - (b.ageDays ?? 9999)
        ),
    [rows, pillarFilter]
  )

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Số liệu tính đến {data.asOf}, từ {totals.published} bài đã đăng. Gợi ý dựa trên khoảng trống giữa bài đã có với từng dịch vụ và giai đoạn
        mua của khách. Chưa nối Search Console nên chưa có số lượt tìm kiếm thật; khi có, danh sách sẽ xếp lại theo nhu cầu tìm kiếm.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatBox label="Bài đã đăng" value={String(totals.published)} suffix={`+ ${totals.drafts} nháp`} />
        <StatBox label="Có bản tiếng Anh đủ" value={String(totals.enOk)} suffix={`/ ${totals.published}`} />
        <StatBox
          label="Bài lâu hết hạn"
          value={`${totals.evergreenPct}%`}
          suffix="là hướng dẫn, quan điểm"
          note={`${100 - totals.evergreenPct}% là tin, cập nhật`}
        />
        <StatBox
          label="Bài mới nhất"
          value={totals.newestDays === null ? '-' : String(totals.newestDays)}
          suffix="ngày trước"
          note={`${totals.last30} bài trong 30 ngày`}
        />
      </div>

      <section className={CARD}>
        <CardHead
          title="Nên viết tiếp"
          hint="Xếp theo ô còn trống (dịch vụ × giai đoạn mua), ưu tiên bài giúp khách chọn và triển khai, và nhóm chủ đề đang thiếu."
        />
        {data.gapSummary && (
          <div className="mx-4 mb-2 flex gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-none" />
            <span>{data.gapSummary}</span>
          </div>
        )}
        <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {top.map((s, i) => (
            <SuggestionRow key={s.id} s={s} rank={i + 1} />
          ))}
        </ul>
        {rest.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-700/60 px-4 py-2">
            <button
              type="button"
              onClick={() => setShowAllSug((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showAllSug && 'rotate-180')} />
              {showAllSug ? 'Ẩn bớt' : `Xem thêm ${rest.length} gợi ý khác và bài đã viết`}
            </button>
          </div>
        )}
        {showAllSug && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/60 border-t border-slate-100 dark:border-slate-700/60">
            {rest.map((s) => (
              <SuggestionRow key={s.id} s={s} />
            ))}
          </ul>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-3">
        <section className={CARD}>
          <CardHead title="Phân bố theo nhóm chủ đề" hint="Vạch đứng là tỷ trọng gợi ý. Chỉnh tỷ trọng trong lib/seo/content-plan.ts." />
          <ul className="px-4 pb-4 space-y-3">
            {pillars.map((p) => {
              const tone = p.delta <= -1 ? 'text-amber-700 dark:text-amber-300' : p.delta >= 1.5 ? 'text-slate-500' : 'text-emerald-700 dark:text-emerald-300'
              const note =
                p.delta <= -1 ? `Thiếu khoảng ${Math.round(-p.delta)} bài` : p.delta >= 1.5 ? `Dư khoảng ${Math.round(p.delta)} bài` : 'Vừa đủ'
              return (
                <li key={p.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-slate-800 dark:text-slate-200">{p.label}</span>
                    <span className="text-xs tabular-nums text-slate-500">
                      {p.count} bài ({p.pct}%) · gợi ý {p.targetPct}% · <span className={tone}>{note}</span>
                    </span>
                  </div>
                  <div className="relative mt-1.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-700/60">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(p.pct / maxPct) * 100}%` }} />
                    <div
                      className="absolute top-[-3px] h-[16px] w-[2px] rounded bg-slate-500 dark:bg-slate-300"
                      style={{ left: `${(p.targetPct / maxPct) * 100}%` }}
                      title={`Gợi ý ${p.targetPct}%`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">{p.hint}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section className={CARD}>
          <CardHead title="Nhịp đăng bài" hint="Số bài đăng mỗi tuần trong 12 tuần gần nhất (nhãn là ngày đầu tuần)." />
          <div className="px-4">
            <div className="flex h-32 items-end gap-1.5">
              {cadence.weeks.map((w, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[10px] tabular-nums text-slate-500">{w.count || ''}</span>
                  <div
                    className={cn('w-full rounded-t', w.count ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700')}
                    style={{ height: w.count ? `${Math.max(8, (w.count / maxWeek) * 80)}%` : '3px' }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 flex gap-1.5">
              {cadence.weeks.map((w, i) => (
                <span key={i} className="flex-1 text-center text-[10px] tabular-nums text-slate-400">
                  {i % 2 === 0 ? w.label : ''}
                </span>
              ))}
            </div>
          </div>
          <div className="m-4 mt-3 flex gap-2 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
            <span>{cadence.insight}</span>
          </div>
        </section>
      </div>

      <section className={CARD}>
        <CardHead
          title="Dịch vụ × giai đoạn mua"
          hint="Số bài đã đăng liên quan đến từng dịch vụ, theo giai đoạn khách đang ở. Ô đỏ là chưa có bài nào."
        />
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
                <th className="py-2 pr-3">Dịch vụ</th>
                {STAGES.map((s) => (
                  <th key={s.id} className="px-2 py-2 text-center" title={s.hint}>
                    {s.label}
                  </th>
                ))}
                <th className="px-2 py-2 text-center">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((m) => (
                <tr key={m.service} className="border-t border-slate-100 dark:border-slate-700/60">
                  <td className="py-1.5 pr-3 text-slate-800 dark:text-slate-200">{m.label}</td>
                  {STAGES.map((s) => (
                    <td key={s.id} className="px-1 py-1">
                      <div className={cn('rounded-md py-1.5 text-center font-semibold tabular-nums', CELL_TONE(m.cells[s.id]))}>
                        {m.cells[s.id]}
                      </div>
                    </td>
                  ))}
                  <td className="px-2 py-1.5 text-center tabular-nums text-slate-500">{m.total}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 dark:border-slate-600 text-xs text-slate-500">
                <td className="py-2 pr-3">Số bài theo giai đoạn</td>
                {STAGES.map((s) => (
                  <td key={s.id} className="px-2 py-2 text-center tabular-nums">
                    {stageTotals[s.id]}
                  </td>
                ))}
                <td />
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-slate-500">
            Một bài có thể tính cho hai dịch vụ (theo khối "Dịch vụ liên quan" cuối bài, cấu hình ở lib/seo/post-services.ts).
          </p>
        </div>
      </section>

      {issues.length > 0 && (
        <section className={CARD}>
          <CardHead title="Cần xử lý" hint="Những chỗ làm giảm hiệu quả của kho bài viết hiện có." />
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {issues.map((is) => {
              const open = openIssue === is.id
              return (
                <li key={is.id}>
                  <button
                    type="button"
                    onClick={() => setOpenIssue(open ? null : is.id)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
                    aria-expanded={open}
                  >
                    <span
                      className={cn(
                        'h-2 w-2 flex-none rounded-full',
                        is.level === 'warn' ? 'bg-amber-500' : 'bg-slate-400'
                      )}
                    />
                    <span className="flex-1 text-sm text-slate-800 dark:text-slate-200">{is.title}</span>
                    <span className="text-xs tabular-nums text-slate-500">{is.items.length}</span>
                    <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', open && 'rotate-180')} />
                  </button>
                  {open && (
                    <div className="px-4 pb-3">
                      <p className="text-xs text-slate-500">{is.detail}</p>
                      <ul className="mt-2 space-y-1">
                        {is.items.map((it) => (
                          <li key={it.id} className="flex items-center gap-2 text-sm">
                            <Link
                              href={`/admin-cls/posts/${it.id}/edit`}
                              className="min-w-0 flex-1 truncate text-primary hover:underline"
                            >
                              {it.label}
                            </Link>
                            {it.note && <span className="flex-none text-[11px] text-slate-500">{it.note}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className={CARD}>
        <CardHead title="Nhãn đang dùng" hint="Nhãn nhập tự do trong trình sửa bài nên dễ lệch nhau. Chấm xanh là nhãn đã quy về một nhóm chủ đề." />
        <div className="flex flex-wrap gap-1.5 px-4 pb-4">
          {tags.map((t) => (
            <span
              key={t.tag}
              className={cn(
                CHIP,
                'gap-1.5 border',
                t.pillar
                  ? 'border-slate-200 text-slate-700 dark:border-slate-600 dark:text-slate-200'
                  : 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300'
              )}
              title={t.pillar ? `Thuộc nhóm ${pillars.find((p) => p.id === t.pillar)?.label}` : 'Chưa quy về nhóm chủ đề nào'}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', t.pillar ? 'bg-emerald-500' : 'bg-amber-500')} />
              {t.tag}
              <span className="tabular-nums text-slate-400">{t.count}</span>
            </span>
          ))}
        </div>
      </section>

      <section className={CARD}>
        <CardHead title="Toàn bộ bài viết" hint="Bấm tên bài để mở trình sửa." />
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {([{ id: 'all', label: 'Tất cả' }, ...pillars] as { id: PillarId | 'all'; label: string }[]).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPillarFilter(p.id)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border',
                pillarFilter === p.id
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-700">
              <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
                <th className="px-4 py-2">Bài</th>
                <th className="px-3 py-2">Nhóm</th>
                <th className="px-3 py-2">Dịch vụ</th>
                <th className="px-3 py-2">Giai đoạn</th>
                <th className="px-3 py-2">Loại</th>
                <th className="px-3 py-2">Đăng</th>
                <th className="px-3 py-2 text-right">Số từ</th>
                <th className="px-3 py-2">Tiếng Anh</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 dark:border-slate-700/60 align-top">
                  <td className="px-4 py-2 max-w-[340px]">
                    <Link href={`/admin-cls/posts/${r.id}/edit`} className="font-medium text-slate-900 dark:text-white hover:text-primary line-clamp-2">
                      {r.title}
                    </Link>
                    {r.status !== 'published' && (
                      <span className={cn(CHIP, 'mt-1 bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400')}>Nháp</span>
                    )}
                    {!r.classified && r.status === 'published' && (
                      <span className={cn(CHIP, 'mt-1 ml-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300')}>Chưa xếp nhóm</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                    {pillars.find((p) => p.id === r.pillar)?.label ?? '-'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {r.services.map((s) => (
                        <span key={s} className={cn(CHIP, 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300')}>
                          {SERVICE_SHORT[s]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300">{stageLabel(r.stage) || '-'}</td>
                  <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300">{r.kind ? KINDS[r.kind] : '-'}</td>
                  <td className="px-3 py-2 text-xs tabular-nums text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {r.publishedLabel || '-'}
                  </td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-slate-600 dark:text-slate-300">
                    {String(r.viWords).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn(CHIP, EN_BADGE[r.enState].cls)}>{EN_BADGE[r.enState].text}</span>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-xs text-slate-500">
                    Chưa có bài nào trong nhóm này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
