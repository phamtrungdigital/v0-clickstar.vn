'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, Copy, ExternalLink, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD, TONE_TEXT } from '@/app/admin-cls/seo/_components/seo-panel'
import { scoreTone } from '@/lib/seo/admin-seo'
import { Segmented } from '@/components/admin/segmented'
import {
  KINDS,
  KIND_LIST,
  SERVICE_SHORT,
  STAGES,
  type ContentAnalysis,
  type EnState,
  type PillarId,
  type PillarStat,
  type StageId,
  type Suggestion,
} from '@/lib/cms/content-plan'

const stageLabel = (id: StageId | null) => STAGES.find((s) => s.id === id)?.label ?? ''
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const CHIP = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap'
const CHIP_MUTED = 'bg-[var(--ad-fill)] text-[var(--ad-fg-2)]'

function CardHead({ title, hint, children }: { title: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-4 pb-2">
      <div>
        <h2 className="text-[16px] font-semibold tracking-[-0.018em] text-[var(--ad-fg)]">{title}</h2>
        {hint && <p className="mt-0.5 text-[13px] text-[var(--ad-fg-3)]">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-[12px] font-medium text-[var(--ad-fg-3)]">{children}</p>
}

const Seg = Segmented

function StatBox({ label, value, suffix, note }: { label: string; value: string; suffix?: string; note?: string }) {
  return (
    <div className={cn(CARD, 'px-5 py-4')}>
      <div className="text-[13px] text-[var(--ad-fg-2)]">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] tabular-nums text-[var(--ad-fg)]">{value}</span>
        {suffix && <span className="text-[13px] text-[var(--ad-fg-3)]">{suffix}</span>}
      </div>
      {note && <div className="mt-1 line-clamp-1 text-[12.5px] text-[var(--ad-fg-3)]">{note}</div>}
    </div>
  )
}

function GapBadge({ n }: { n: number }) {
  if (n === 0)
    return <span className={cn(CHIP, 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300')}>Ô này chưa có bài nào</span>
  if (n === 1)
    return <span className={cn(CHIP, 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300')}>Mới có 1 bài</span>
  return <span className={cn(CHIP, CHIP_MUTED)}>Đã có {n} bài</span>
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
          <span className={cn(CHIP, CHIP_MUTED)}>{stageLabel(s.stage)}</span>
          <span className={cn(CHIP, CHIP_MUTED)}>{s.pillarLabel}</span>
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

/* ------------------------------ Biểu đồ chỉ số theo chủ đề ------------------------------ */

type MetricId = 'count' | 'words' | 'avg' | 'en' | 'seo' | 'views'
type SplitId = 'none' | 'stage' | 'kind'

const METRICS: { id: MetricId; label: string; title?: string }[] = [
  { id: 'count', label: 'Số bài' },
  { id: 'words', label: 'Tổng số từ' },
  { id: 'avg', label: 'Số từ mỗi bài' },
  { id: 'en', label: 'Có bản EN đủ' },
  { id: 'seo', label: 'Điểm SEO' },
  { id: 'views', label: 'Lượt xem *', title: 'Chưa có dữ liệu, cần nối GA4 hoặc Search Console' },
]

function metricValue(p: PillarStat, m: MetricId): number {
  switch (m) {
    case 'count':
      return p.count
    case 'words':
      return p.words
    case 'avg':
      return p.avgWords
    case 'en':
      return p.enPct
    case 'seo':
      return p.seoAvg ?? 0
    default:
      return 0
  }
}

function metricInsight(pillars: PillarStat[], m: MetricId): React.ReactNode {
  const live = pillars.filter((p) => p.count > 0)
  if (!live.length) return 'Chưa có bài nào để thống kê.'
  if (m === 'views')
    return (
      <>
        Chưa có dữ liệu lượt xem. Nối GA4 hoặc Search Console thì biểu đồ này cho biết <b>chủ đề nào thật sự được đọc</b>, để quyết định
        viết thêm hay thôi.
      </>
    )
  if (m === 'count') {
    const top = [...live].sort((a, b) => b.count - a.count)[0]
    const low = [...pillars].sort((a, b) => a.delta - b.delta)[0]
    return (
      <>
        <b>{top.label}</b> nhiều bài nhất ({top.count}).{' '}
        {low.delta <= -1 ? (
          <>
            <b>{low.label}</b> thiếu nhất so với gợi ý (thiếu khoảng {Math.round(-low.delta)} bài).
          </>
        ) : (
          'Các chủ đề đang cân đối với tỷ trọng gợi ý.'
        )}
      </>
    )
  }
  if (m === 'words') {
    const s = [...live].sort((a, b) => b.words - a.words)
    return (
      <>
        <b>{s[0].label}</b> chiếm nhiều nội dung nhất ({fmt(s[0].words)} từ); <b>{s[s.length - 1].label}</b> ít nhất ({fmt(s[s.length - 1].words)} từ).
      </>
    )
  }
  if (m === 'avg') {
    const s = [...live].sort((a, b) => b.avgWords - a.avgWords)
    return (
      <>
        Bài dài nhất trung bình: <b>{s[0].label}</b> ({fmt(s[0].avgWords)} từ). Ngắn nhất: <b>{s[s.length - 1].label}</b> ({fmt(s[s.length - 1].avgWords)} từ).
      </>
    )
  }
  if (m === 'seo') {
    const scored = live.filter((p) => p.seoAvg !== null).sort((a, b) => (a.seoAvg as number) - (b.seoAvg as number))
    if (!scored.length) return 'Chưa chấm được điểm SEO.'
    const low = scored[0]
    return (
      <>
        Điểm SEO trung bình thấp nhất: <b>{low.label}</b> ({low.seoAvg}/100). Điểm lấy từ cùng bộ chấm ở mục SEO (tiêu đề, mô tả, ảnh chia sẻ); vào mục SEO để sửa từng bài.
      </>
    )
  }
  const weak = live.filter((p) => p.enPct < 100)
  return weak.length ? (
    <>
      Bản tiếng Anh chưa đủ ở: <b>{weak.map((p) => `${p.label} (${p.enPct}%)`).join(', ')}</b>.
    </>
  ) : (
    'Mọi chủ đề đều đã có bản tiếng Anh đủ nội dung.'
  )
}

function Donut({ pillars, total }: { pillars: PillarStat[]; total: number }) {
  const R = 62
  const C = 2 * Math.PI * R
  let off = 0
  return (
    <div className="relative mx-auto h-[170px] w-[170px]">
      <svg width="170" height="170" viewBox="0 0 170 170" role="img" aria-label="Tỷ trọng số bài theo chủ đề" className="-rotate-90">
        <circle r={R} cx="85" cy="85" fill="none" className="stroke-slate-100 dark:stroke-slate-700/60" strokeWidth="22" />
        {pillars.map((p) => {
          const len = total ? (p.count / total) * C : 0
          const el = (
            <circle
              key={p.id}
              r={R}
              cx="85"
              cy="85"
              fill="none"
              stroke={p.color}
              strokeWidth="22"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-off}
            />
          )
          off += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <b className="text-2xl leading-none text-slate-900 dark:text-white">{total}</b>
        <span className="text-[11px] text-slate-500">bài đã đăng</span>
      </div>
    </div>
  )
}

function TopicChart({ pillars, total }: { pillars: PillarStat[]; total: number }) {
  const [metric, setMetric] = useState<MetricId>('count')
  const [split, setSplit] = useState<SplitId>('none')
  const canSplit = metric === 'count' || metric === 'words'
  const activeSplit: SplitId = canSplit ? split : 'none'
  const groups = activeSplit === 'stage' ? STAGES : activeSplit === 'kind' ? KIND_LIST : null

  const values = pillars.map((p) => metricValue(p, metric))
  let max = metric === 'en' || metric === 'seo' ? 100 : Math.max(1, ...values)
  if (metric === 'count') max = Math.max(max, ...pillars.map((p) => (p.targetPct / 100) * total))

  const pick = (p: PillarStat, id: string) =>
    activeSplit === 'stage'
      ? p.byStage[id as StageId]
      : activeSplit === 'kind'
        ? p.byKind[id as keyof PillarStat['byKind']]
        : { count: 0, words: 0 }

  return (
    <section className={CARD}>
      <CardHead title="Chỉ số bài đã viết theo chủ đề" hint="Mỗi dòng là một chủ đề. Vạch đứng là tỷ trọng gợi ý.">
        <div className="flex flex-wrap gap-3.5">
          <div>
            <Label>Chỉ số</Label>
            <Seg value={metric} options={METRICS} onChange={setMetric} />
          </div>
          <div>
            <Label>Chia theo</Label>
            <Seg
              value={activeSplit}
              onChange={setSplit}
              options={[
                { id: 'none', label: 'Không chia' },
                { id: 'stage', label: 'Giai đoạn mua', disabled: !canSplit },
                { id: 'kind', label: 'Loại bài', disabled: !canSplit },
              ]}
            />
          </div>
        </div>
      </CardHead>

      <div className="grid gap-5 px-4 pb-4 pt-1 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div>
          <ul className="space-y-3">
            {pillars.map((p, i) => {
              const v = values[i]
              const views = metric === 'views'
              const label = views ? 'Chưa có' : metric === 'en' ? `${v}%` : metric === 'seo' ? (p.seoAvg === null ? '-' : String(v)) : fmt(v)
              const sub =
                metric === 'count'
                  ? `${p.pct}% · gợi ý ${p.targetPct}%`
                  : metric === 'words'
                    ? `${fmt(p.avgWords)} từ/bài`
                    : metric === 'seo' && p.seoAvg !== null
                      ? scoreTone(p.seoAvg) === 'ok'
                        ? 'Đạt'
                        : 'Cần sửa'
                      : ''
              return (
                <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_96px] items-center gap-x-2.5 gap-y-1 sm:grid-cols-[185px_minmax(0,1fr)_84px]">
                  <div className="col-span-2 flex min-w-0 items-center gap-2 text-[13px] font-semibold text-slate-800 dark:text-slate-100 sm:col-span-1">
                    <span className="h-2.5 w-2.5 flex-none rounded-[3px]" style={{ background: p.color }} />
                    <span className="truncate">{p.label}</span>
                  </div>
                  <div className="relative flex h-[22px] rounded-md bg-slate-100 dark:bg-slate-700/50">
                    {views ? (
                      <div
                        className="h-full w-full rounded-md opacity-70"
                        style={{
                          background:
                            'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(148,163,184,.35) 6px, rgba(148,163,184,.35) 7px)',
                        }}
                      />
                    ) : groups ? (
                      groups.map((g) => {
                        const gv = metric === 'count' ? pick(p, g.id).count : pick(p, g.id).words
                        return gv ? (
                          <div
                            key={g.id}
                            title={`${g.label}: ${fmt(gv)}`}
                            className="h-full first:rounded-l-md last:rounded-r-md only:rounded-md"
                            style={{ width: `${(gv / max) * 100}%`, background: g.color }}
                          />
                        ) : null
                      })
                    ) : (
                      <div className="h-full rounded-md" style={{ width: `${(v / max) * 100}%`, background: p.color }} />
                    )}
                    {metric === 'count' && (
                      <div
                        className="absolute -bottom-1 -top-1 w-0.5 rounded bg-slate-600 opacity-60 dark:bg-slate-200"
                        style={{ left: `${(((p.targetPct / 100) * total) / max) * 100}%` }}
                        title={`Gợi ý ${p.targetPct}%`}
                      />
                    )}
                  </div>
                  <div className="text-right text-[13px] font-bold tabular-nums text-slate-900 dark:text-white">
                    <span className={cn(metric === 'seo' && p.seoAvg !== null && TONE_TEXT[scoreTone(p.seoAvg)])}>{label}</span>
                    {sub && <div className="text-[10.5px] font-medium text-slate-500">{sub}</div>}
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-slate-500">
            {groups ? (
              groups.map((g) => (
                <span key={g.id} className="inline-flex items-center gap-1.5">
                  <i className="inline-block h-2 w-2 rounded-[3px]" style={{ background: g.color }} />
                  {g.label}
                </span>
              ))
            ) : metric === 'count' ? (
              <span className="inline-flex items-center gap-1.5">
                <i className="inline-block h-3 w-0.5 bg-slate-600 opacity-60 dark:bg-slate-200" />
                Tỷ trọng gợi ý
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
            <span>{metricInsight(pillars, metric)}</span>
          </div>
        </div>

        <div>
          <Label>Tỷ trọng số bài</Label>
          <Donut pillars={pillars} total={total} />
          <ul className="mt-3 space-y-1.5 text-xs">
            {pillars.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <span className="h-2.5 w-2.5 flex-none rounded-[3px]" style={{ background: p.color }} />
                <span className="truncate">{p.label}</span>
                <b className="ml-auto flex-none tabular-nums">
                  {p.count} · {p.pct}%
                </b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function MetricsTable({ pillars, data }: { pillars: PillarStat[]; data: ContentAnalysis }) {
  const t = data.totals
  const th = 'px-3 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider text-slate-500'
  const td = 'px-3 py-2 text-right text-xs tabular-nums text-slate-700 dark:text-slate-200'
  return (
    <section className={CARD}>
      <CardHead title="Bảng chỉ số theo chủ đề" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-y border-slate-200 dark:border-slate-700">
            <tr>
              <th className={cn(th, 'pl-4 text-left')}>Chủ đề</th>
              <th className={th}>Số bài</th>
              <th className={th}>Tổng số từ</th>
              <th className={th}>Từ mỗi bài</th>
              <th className={th}>EN đủ</th>
              <th className={th}>Điểm SEO</th>
              <th className={th}>Bài mới nhất</th>
              <th className={th}>Tuổi TB</th>
              <th className={cn(th, 'pr-4')} title="Chưa có dữ liệu, cần nối GA4 hoặc Search Console">
                Lượt xem *
              </th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700/60">
                <td className="py-2 pl-4 pr-3 text-left text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-[3px] align-middle" style={{ background: p.color }} />
                  {p.label}
                </td>
                <td className={td}>{p.count}</td>
                <td className={td}>{fmt(p.words)}</td>
                <td className={td}>{p.count ? fmt(p.avgWords) : '-'}</td>
                <td className={td}>
                  {p.count === 0 ? (
                    '-'
                  ) : p.enPct === 100 ? (
                    <span className={cn(CHIP, 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300')}>100%</span>
                  ) : (
                    <span className={cn(CHIP, 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300')}>{p.enPct}%</span>
                  )}
                </td>
                <td className={td}>
                  {p.seoAvg === null ? '-' : <span className={cn('font-semibold', TONE_TEXT[scoreTone(p.seoAvg)])}>{p.seoAvg}</span>}
                </td>
                <td className={td}>{p.newestDays === null ? '-' : `${p.newestDays} ngày trước`}</td>
                <td className={td}>{p.avgAgeDays === null ? '-' : `${p.avgAgeDays} ngày`}</td>
                <td className={cn(td, 'pr-4 text-slate-400')}>chờ GA4</td>
              </tr>
            ))}
            <tr className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              <td className="py-2 pl-4 text-left">Tổng</td>
              <td className={td}>{t.published}</td>
              <td className={td}>{fmt(t.totalWords)}</td>
              <td className={td}>{fmt(t.avgWords)}</td>
              <td className={td} />
              <td className={td}>
                {t.seoAvg === null ? '-' : <span className={TONE_TEXT[scoreTone(t.seoAvg)]}>{t.seoAvg}</span>}
              </td>
              <td className={td} />
              <td className={td} />
              <td className={td} />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="px-4 pb-3 pt-2 text-[11px] text-slate-500">
        Điểm SEO là điểm trung bình của các bài đã đăng, chấm bằng bộ chấm ở mục SEO. * Lượt xem cần nối GA4 hoặc Search Console; khi có, cột này và nút
        "Lượt xem" ở biểu đồ sẽ có số thật.
      </p>
    </section>
  )
}

function Cadence({ data }: { data: ContentAnalysis }) {
  const { weeks, hole, insight } = data.cadence
  const W = weeks.length
  const mx = Math.max(1, ...weeks.map((w) => w.total))
  return (
    <section className={CARD}>
      <CardHead title="Nhịp đăng bài theo chủ đề" hint={`Số bài mỗi tuần, tô màu theo chủ đề (${W} tuần gần nhất, nhãn là ngày đầu tuần).`} />
      <div className="px-4">
        <div className="relative flex h-[150px] items-end gap-[5px] pt-2.5">
          {weeks.map((w, i) => (
            <div key={i} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="text-center text-[10px] tabular-nums text-slate-500">{w.total || ''}</div>
              <div className="flex flex-col-reverse gap-px">
                {data.pillars.map((p) =>
                  w.byPillar[p.id] ? (
                    <i
                      key={p.id}
                      title={`${p.label}: ${w.byPillar[p.id]}`}
                      className="block rounded-[2px]"
                      style={{ height: (w.byPillar[p.id] / mx) * 112, background: p.color }}
                    />
                  ) : null
                )}
                {w.total === 0 && <i className="block h-[3px] rounded bg-slate-200 dark:bg-slate-700" />}
              </div>
            </div>
          ))}
          {hole && (
            <div
              className="absolute bottom-0 grid place-items-center rounded-md border border-dashed border-red-400 bg-red-50 p-1 text-center text-[11.5px] font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300"
              style={{
                left: `calc(${(hole.start / W) * 100}% + 3px)`,
                width: `calc(${(hole.len / W) * 100}% - 8px)`,
                height: 56,
              }}
            >
              {hole.label}
            </div>
          )}
        </div>
        <div className="mt-1 flex gap-[5px]">
          {weeks.map((w, i) => (
            <span key={i} className="min-w-0 flex-1 whitespace-nowrap text-center text-[10px] tabular-nums text-slate-400">
              {i % 3 === 0 ? w.label : ''}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-slate-500">
          {data.pillars.map((p) => (
            <span key={p.id} className="inline-flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-[3px]" style={{ background: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
      </div>
      <div className="m-4 mt-3 flex gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
        <span>{insight}</span>
      </div>
    </section>
  )
}

/* ------------------------------ Trang ------------------------------ */

export function ContentDashboard({ data }: { data: ContentAnalysis }) {
  const { totals, pillars, matrix, stageTotals, suggestions, issues, tags, rows } = data
  const [showAllSug, setShowAllSug] = useState(false)
  const [openIssue, setOpenIssue] = useState<string | null>(null)
  const [pillarFilter, setPillarFilter] = useState<PillarId | 'all'>('all')

  const top = suggestions.filter((s) => s.top)
  const rest = suggestions.filter((s) => !s.top)
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
        Số liệu tính đến {data.asOf}, từ {totals.published} bài đã đăng. Chưa nối Search Console nên chưa có số lượt tìm kiếm thật; khi có, phần gợi ý sẽ
        xếp lại theo nhu cầu tìm kiếm.
      </p>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatBox label="Bài đã đăng" value={String(totals.published)} suffix={`+ ${totals.drafts} nháp`} />
        <StatBox label="Tổng số từ" value={fmt(totals.totalWords)} suffix="từ" note={`TB ${fmt(totals.avgWords)} từ mỗi bài`} />
        <StatBox
          label="Chủ đề đang thiếu"
          value={String(totals.shortPillars.length)}
          suffix={`/ ${pillars.length}`}
          note={totals.shortPillars.join(', ') || 'Đủ'}
        />
        <StatBox
          label="Bài mới nhất"
          value={totals.newestDays === null ? '-' : String(totals.newestDays)}
          suffix="ngày trước"
          note={`${totals.last30} bài trong 30 ngày`}
        />
      </div>

      <TopicChart pillars={pillars} total={totals.published} />
      <MetricsTable pillars={pillars} data={data} />
      <Cadence data={data} />

      <section className={CARD}>
        <CardHead
          title="Khoảng trống: dịch vụ × giai đoạn mua"
          hint="Số bài đã đăng liên quan đến từng dịch vụ, theo giai đoạn khách đang ở. Ô đỏ là chưa có bài nào."
        />
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase text-slate-500">
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
              <tr className="border-t border-slate-200 text-xs text-slate-500 dark:border-slate-600">
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

      <section className={CARD}>
        <CardHead
          title="Gợi ý bài nên viết"
          hint="Xếp theo ô còn trống ở bảng trên, ưu tiên bài giúp khách chọn và triển khai, và nhóm chủ đề đang thiếu."
        />
        {data.gapSummary && (
          <div className="mx-4 mb-2 flex gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
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
          <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-700/60">
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
          <ul className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-700/60 dark:border-slate-700/60">
            {rest.map((s) => (
              <SuggestionRow key={s.id} s={s} />
            ))}
          </ul>
        )}
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
                    <span className={cn('h-2 w-2 flex-none rounded-full', is.level === 'warn' ? 'bg-amber-500' : 'bg-slate-400')} />
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
                            <Link href={`/admin-cls/posts/${it.id}/edit`} className="min-w-0 flex-1 truncate text-primary hover:underline">
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
        <div className="px-5 pb-3">
          <Seg
            ariaLabel="Lọc theo nhóm chủ đề"
            value={pillarFilter}
            onChange={setPillarFilter}
            options={([{ id: 'all', label: 'Tất cả' }, ...pillars] as { id: PillarId | 'all'; label: string }[]).map((p) => ({
              id: p.id,
              label: p.label,
            }))}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
              <tr className="text-left text-[11px] font-semibold uppercase text-slate-500">
                <th className="px-4 py-2">Bài</th>
                <th className="px-3 py-2">Nhóm</th>
                <th className="px-3 py-2">Dịch vụ</th>
                <th className="px-3 py-2">Giai đoạn</th>
                <th className="px-3 py-2">Loại</th>
                <th className="px-3 py-2">Đăng</th>
                <th className="px-3 py-2 text-right">Số từ</th>
                <th className="px-3 py-2 text-right">Điểm SEO</th>
                <th className="px-3 py-2">Tiếng Anh</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 align-top dark:border-slate-700/60">
                  <td className="max-w-[340px] px-4 py-2">
                    <Link href={`/admin-cls/posts/${r.id}/edit`} className="line-clamp-2 font-medium text-slate-900 hover:text-primary dark:text-white">
                      {r.title}
                    </Link>
                    {r.status !== 'published' && (
                      <span className={cn(CHIP, 'mt-1 bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400')}>Nháp</span>
                    )}
                    {!r.classified && r.status === 'published' && (
                      <span className={cn(CHIP, 'ml-1 mt-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300')}>Chưa xếp nhóm</span>
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
                  <td className="whitespace-nowrap px-3 py-2 text-xs tabular-nums text-slate-600 dark:text-slate-300">{r.publishedLabel || '-'}</td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-slate-600 dark:text-slate-300">{fmt(r.viWords)}</td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    {r.seoScore === null ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <span className={cn('font-semibold', TONE_TEXT[scoreTone(r.seoScore)])}>{r.seoScore}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn(CHIP, EN_BADGE[r.enState].cls)}>{EN_BADGE[r.enState].text}</span>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-xs text-slate-500">
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
