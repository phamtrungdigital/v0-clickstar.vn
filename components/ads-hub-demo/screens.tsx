'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Check, Copy, Download, Loader2, RefreshCw, Send, Sparkles, TriangleAlert } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import {
  ACCOUNT_DAYS,
  ADS,
  ADSETS,
  AUDIENCE_AGE,
  CAMPAIGNS,
  CAMPAIGN_DAYS,
  PIPELINE_STEPS,
  PIPELINE_TESTS,
  RECENT_SYNC,
  STREAMS,
  axisMoney,
  change,
  dateAt,
  fmtDay,
  fmtFull,
  money,
  num,
  pct,
  rangeLabel,
  windowOf,
  type Lang,
} from './data'
import {
  C,
  Card,
  Delta,
  Donut,
  Kpi,
  Legend,
  LineChart,
  Pill,
  Segmented,
  Spark,
  Table,
  td,
  th,
  useReducedMotion,
  type LineSeries,
} from './ui'

function useLang() {
  const { t, language } = useLanguage()
  return { t, lang: language as Lang }
}

function Head({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-[17px] font-semibold leading-tight" style={{ color: C.ink }}>{title}</h3>
        <p className="mt-0.5 text-[12px]" style={{ color: C.muted }}>{sub}</p>
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  )
}

function SyncButton({ label }: { label: string }) {
  const { t } = useLang()
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')
  useEffect(() => {
    if (state !== 'busy') return
    const id = setTimeout(() => setState('done'), 1200)
    return () => clearTimeout(id)
  }, [state])
  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 text-[11.5px] sm:inline-flex" style={{ color: C.greenText }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.green }} />
        {state === 'done' ? t('Đã đồng bộ · vừa xong', 'Synced · just now') : t('Đã đồng bộ · 2 phút trước', 'Synced · 2 min ago')}
      </span>
      <button
        type="button"
        onClick={() => state !== 'busy' && setState('busy')}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
        style={{ background: C.blue }}
      >
        <RefreshCw className={`h-3.5 w-3.5 ${state === 'busy' ? 'animate-spin' : ''}`} aria-hidden="true" />
        {label}
      </button>
    </div>
  )
}

/* ================================ 1. TỔNG QUAN ================================ */

export function OverviewScreen() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const [range, setRange] = useState<7 | 14 | 30>(7)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all')
  const [on, setOn] = useState<Set<string>>(new Set(['spend', 'leads']))
  const { cur, curT, prevT } = windowOf(ACCOUNT_DAYS, range)

  const labels = cur.map((_, i) => fmtDay(dateAt(range - 1 - i), lang))
  const all: LineSeries[] = [
    { key: 'spend', name: t('Chi tiêu', 'Spend'), color: C.blue, values: cur.map((r) => r.spend), axis: 'l', fmt: (v) => money(v, lang), area: true },
    { key: 'leads', name: 'Leads', color: C.green, values: cur.map((r) => r.leads), axis: 'r', fmt: (v) => num(v, lang), area: true },
  ]
  const toggle = (k: string) =>
    setOn((s) => {
      const n = new Set(s)
      if (n.has(k) && n.size === 1) return n
      n.has(k) ? n.delete(k) : n.add(k)
      return n
    })

  const rows = CAMPAIGNS.filter((c) => (filter === 'all' ? true : filter === 'active' ? c.active : !c.active))
    .map((c) => ({ ...c, cpl: c.spend / c.leads }))
    .sort((a, b) => a.cpl - b.cpl)

  const slowCtr = 2

  return (
    <div className="h-full overflow-y-auto overscroll-contain p-4">
      <Head
        title={t('Tổng quan', 'Overview')}
        sub={`${t('Hiệu suất tài khoản FB Ads', 'Facebook Ads account performance')} · ${rangeLabel(range, lang)}`}
        right={<SyncButton label={t('Sync ngay', 'Sync now')} />}
      />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Segmented
          label={t('Khoảng thời gian', 'Date range')}
          value={range}
          onChange={setRange}
          options={[
            { value: 7, label: t('7 ngày', '7 days') },
            { value: 14, label: t('14 ngày', '14 days') },
            { value: 30, label: t('30 ngày', '30 days') },
          ]}
        />
        <span className="text-[11.5px]" style={{ color: C.muted }}>{t(`So với ${range} ngày trước đó`, `vs the previous ${range} days`)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
        <Kpi label={t('Chi tiêu', 'Spend')} value={money(curT.spend, lang)} delta={<Delta v={change(curT.spend, prevT.spend)} lang={lang} />} />
        <Kpi label="Clicks" value={num(curT.clicks, lang)} delta={<Delta v={change(curT.clicks, prevT.clicks)} lang={lang} />} />
        <Kpi label={t('CPC TB', 'Avg CPC')} value={money(curT.cpc, lang)} delta={<Delta v={change(curT.cpc, prevT.cpc)} goodWhenDown lang={lang} />} />
        <Kpi label={t('CPM TB', 'Avg CPM')} value={money(curT.cpm, lang)} delta={<Delta v={change(curT.cpm, prevT.cpm)} goodWhenDown lang={lang} />} />
        <Kpi label="Leads" value={num(curT.leads, lang)} delta={<Delta v={change(curT.leads, prevT.leads)} lang={lang} />} />
        <Kpi label={t('CPL TB', 'Avg CPL')} value={money(curT.cpl, lang)} delta={<Delta v={change(curT.cpl, prevT.cpl)} goodWhenDown lang={lang} />} />
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-[12px]" style={{ background: '#fff7ed', borderColor: '#fed7aa', color: C.ink }}>
        <TriangleAlert className="h-4 w-4 shrink-0" style={{ color: '#c2410c' }} aria-hidden="true" />
        <span className="min-w-0">
          <b style={{ color: '#9a3412' }}>{t('Cảnh báo tài khoản', 'Account alert')}</b>{' '}
          {t(
            `Phát hiện ${slowCtr} chiến dịch có CTR thấp hơn 0,5% trong 3 ngày liên tiếp.`,
            `${slowCtr} campaigns have had a CTR below 0.5% for 3 days in a row.`
          )}
        </span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_250px]">
        <Card title={t('Chi tiêu & Leads theo ngày', 'Spend & leads by day')} right={<Legend items={all} on={on} toggle={toggle} />}>
          <LineChart
            key={`${range}-${Array.from(on).join()}`}
            gid="ov"
            mode="dual"
            labels={labels}
            series={all.filter((s) => on.has(s.key))}
            fmtL={(v) => axisMoney(v, lang)}
            fmtR={(v) => String(Math.round(v))}
            animate={!reduced}
          />
        </Card>
        <Card title={t('Phân bổ Leads', 'Lead sources')}>
          <div className="flex items-center gap-4 lg:flex-col lg:items-stretch">
            <div className="flex justify-center">
              <Donut
                parts={[
                  { label: 'Form', value: curT.form, color: C.blue },
                  { label: 'Messenger', value: curT.messenger, color: C.violet },
                ]}
                centerBig={num(curT.leads, lang)}
                centerSmall={t('Tổng leads', 'Total leads')}
              />
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5 text-[12px]">
              {[
                ['Form', curT.form, C.blue],
                ['Messenger', curT.messenger, C.violet],
              ].map(([n, v, c]) => (
                <li key={n as string} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c as string }} />
                  <span style={{ color: C.muted }}>{n}</span>
                  <b className="ml-auto tabular-nums" style={{ color: C.ink }}>{num(v as number, lang)}</b>
                  <span className="w-12 text-right tabular-nums" style={{ color: C.faint }}>({pct(((v as number) / curT.leads) * 100, lang, 1)})</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card
        className="mt-3"
        title={t('Chiến dịch hiệu quả nhất', 'Best-performing campaigns')}
        right={
          <Segmented
            label={t('Lọc trạng thái', 'Status filter')}
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: t('Tất cả', 'All') },
              { value: 'active', label: t('Đang chạy', 'Active') },
              { value: 'paused', label: t('Tạm dừng', 'Paused') },
            ]}
          />
        }
      >
        <Table min={640}>
          <thead>
            <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th className={th}>#</th>
              <th className={th}>{t('Chiến dịch', 'Campaign')}</th>
              <th className={th}>{t('Chi tiêu', 'Spend')}</th>
              <th className={th}>Leads</th>
              <th className={th}>CPL</th>
              <th className={th}>CPC</th>
              <th className={th}>CTR</th>
              <th className={th}>CPM</th>
              <th className={th}>{t('Trạng thái', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.name.en} style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                <td className={td} style={{ color: C.faint }}>{i + 1}</td>
                <td className={`${td} max-w-[220px] truncate`}>{t(c.name.vi, c.name.en)}</td>
                <td className={`${td} tabular-nums`}>{money(c.spend, lang)}</td>
                <td className={`${td} tabular-nums`}>{c.leads}</td>
                <td className={`${td} font-semibold tabular-nums`}>{money(c.cpl, lang)}</td>
                <td className={`${td} tabular-nums`}>{money(c.cpc, lang)}</td>
                <td className={`${td} tabular-nums`}>{pct(c.ctr, lang)}</td>
                <td className={`${td} tabular-nums`}>{money(c.cpm, lang)}</td>
                <td className={td}>{c.active ? <Pill tone="green">{t('Hoạt động', 'Active')}</Pill> : <Pill tone="gray">{t('Tạm dừng', 'Paused')}</Pill>}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

/* ============================ 2. TUYẾN NỘI DUNG ============================ */

type SortKey = 'spend' | 'leads' | 'cpl'

export function StreamsScreen() {
  const { t, lang } = useLang()
  const [range, setRange] = useState<7 | 30>(7)
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'spend', dir: -1 })
  const [picked, setPicked] = useState<number | null>(null)

  const rows = useMemo(
    () =>
      STREAMS.map((s, i) => {
        const k = range === 7 ? { spend: 1, leads: 1 } : s.k30
        const spend = s.spend * k.spend
        const leads = Math.round(s.leads * k.leads)
        return { ...s, i, spend, leads, cpl: spend / leads }
      }).sort((a, b) => (a[sort.key] - b[sort.key]) * sort.dir),
    [range, sort]
  )
  const maxSpend = Math.max(...rows.map((r) => r.spend))
  const totalSpend = rows.reduce((a, r) => a + r.spend, 0)
  const totalLeads = rows.reduce((a, r) => a + r.leads, 0)
  const best = [...rows].filter((r) => r.level === 'high').sort((a, b) => a.cpl - b.cpl)[0]

  const head = (key: SortKey, label: string) => (
    <th className={th} aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        className="inline-flex items-center gap-1 font-medium"
        style={{ color: sort.key === key ? C.blueDeep : C.muted }}
        onClick={() => setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === 'cpl' ? 1 : -1 }))}
      >
        {label}
        {sort.key === key && (sort.dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </button>
    </th>
  )
  const level = (l: 'high' | 'mid' | 'low') =>
    l === 'high' ? <Pill tone="green">{t('Hiệu quả cao', 'High')}</Pill> : l === 'mid' ? <Pill tone="amber">{t('Trung bình', 'Medium')}</Pill> : <Pill tone="red">{t('Thấp', 'Low')}</Pill>

  return (
    <div className="h-full overflow-y-auto overscroll-contain p-4">
      <Head
        title={t('Tuyến nội dung', 'Content streams')}
        sub={`${t('Phân tích chi phí & leads theo tuyến', 'Cost & leads by content stream')} · ${rangeLabel(range, lang)}`}
        right={
          <Segmented
            label={t('Khoảng thời gian', 'Date range')}
            value={range}
            onChange={setRange}
            options={[
              { value: 7, label: t('7 ngày', '7 days') },
              { value: 30, label: t('30 ngày', '30 days') },
            ]}
          />
        }
      />
      <Card>
        <Table min={720}>
          <thead>
            <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th className={th}>{t('Tuyến nội dung', 'Stream')}</th>
              <th className={th}>{t('Trạng thái', 'Status')}</th>
              {head('spend', t('Chi tiêu', 'Spend'))}
              {head('leads', 'Leads')}
              {head('cpl', 'CPL')}
              <th className={th}>CPC</th>
              <th className={th}>CTR</th>
              <th className={th}>CPM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.name.en}
                onClick={() => setPicked(picked === r.i ? null : r.i)}
                className="cursor-pointer"
                style={{ borderBottom: `1px solid ${C.line}`, color: C.ink, background: picked === r.i ? C.blueBg : undefined }}
              >
                <td className={td}>{t(r.name.vi, r.name.en)}</td>
                <td className={td}>{level(r.level)}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <span className="w-14 tabular-nums">{money(r.spend, lang)}</span>
                    <span className="hidden h-1.5 w-20 overflow-hidden rounded-full sm:block" style={{ background: '#eef1f5' }}>
                      <span className="block h-full rounded-full" style={{ width: `${(r.spend / maxSpend) * 100}%`, background: C.blue, transition: 'width .5s ease' }} />
                    </span>
                  </div>
                </td>
                <td className={`${td} tabular-nums`}>{r.leads}</td>
                <td className={`${td} font-semibold tabular-nums`}>{money(r.cpl, lang)}</td>
                <td className={`${td} tabular-nums`}>{money(r.cpc, lang)}</td>
                <td className={`${td} tabular-nums`}>{pct(r.ctr, lang)}</td>
                <td className={`${td} tabular-nums`}>{money(r.cpm, lang)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-3" style={{ borderColor: C.line }}>
          <div className="text-[11.5px]" style={{ color: C.muted }}>{t('Tổng chi tiêu', 'Total spend')}</div>
          <div className="text-[20px] font-semibold tabular-nums" style={{ color: C.ink }}>{money(totalSpend, lang)}</div>
          <Spark values={[5, 7, 6, 8, 7, 9, 8, 10]} color={C.blue} />
        </div>
        <div className="rounded-xl border bg-white p-3" style={{ borderColor: C.line }}>
          <div className="text-[11.5px]" style={{ color: C.muted }}>{t('Tổng leads', 'Total leads')}</div>
          <div className="text-[20px] font-semibold tabular-nums" style={{ color: C.ink }}>{num(totalLeads, lang)}</div>
          <Spark values={[4, 5, 5, 7, 6, 8, 8, 9]} color={C.green} />
        </div>
        <div className="rounded-xl border bg-white p-3" style={{ borderColor: C.line }}>
          <div className="text-[11.5px]" style={{ color: C.muted }}>{t('CPL trung bình', 'Average CPL')}</div>
          <div className="text-[20px] font-semibold tabular-nums" style={{ color: C.ink }}>{money(totalSpend / totalLeads, lang)}</div>
          <Spark values={[9, 8, 8, 7, 8, 6, 6, 5]} color={C.violet} />
        </div>
        <div className="rounded-xl border bg-white p-3" style={{ borderColor: C.line }}>
          <div className="text-[11.5px]" style={{ color: C.muted }}>{t('Tuyến hiệu quả nhất', 'Most efficient stream')}</div>
          <div className="truncate text-[14px] font-semibold leading-snug" style={{ color: C.ink }}>{t(best.name.vi, best.name.en)}</div>
          <div className="mt-1 text-[18px] font-semibold tabular-nums" style={{ color: C.greenText }}>
            {money(best.cpl, lang)} <span className="text-[11px] font-normal" style={{ color: C.muted }}>CPL</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11.5px]" style={{ color: C.faint }}>
        {t('Bấm tiêu đề cột để sắp xếp, bấm một dòng để đánh dấu.', 'Click a column header to sort, click a row to highlight it.')}
      </p>
    </div>
  )
}

/* ========================= 3. CHI TIẾT CHIẾN DỊCH ========================= */

type DetailTab = 'perf' | 'adsets' | 'ads' | 'audience'

export function CampaignScreen() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const [range, setRange] = useState<14 | 30>(14)
  const [tab, setTab] = useState<DetailTab>('perf')
  const [on, setOn] = useState<Set<string>>(new Set(['spend', 'clicks', 'ctr', 'cpm']))
  const [exported, setExported] = useState(false)
  useEffect(() => {
    if (!exported) return
    const id = setTimeout(() => setExported(false), 1800)
    return () => clearTimeout(id)
  }, [exported])

  const { cur, curT, prevT } = windowOf(CAMPAIGN_DAYS, range)
  const labels = cur.map((_, i) => fmtDay(dateAt(range - 1 - i), lang))
  const all: LineSeries[] = [
    { key: 'spend', name: t('Chi tiêu', 'Spend'), color: C.blue, values: cur.map((r) => r.spend), fmt: (v) => money(v, lang), area: true },
    { key: 'clicks', name: 'Clicks', color: C.green, values: cur.map((r) => r.clicks), fmt: (v) => num(v, lang) },
    { key: 'ctr', name: 'CTR', color: C.violet, values: cur.map((r) => (r.clicks / r.impressions) * 100), fmt: (v) => pct(v, lang) },
    { key: 'cpm', name: 'CPM', color: C.orange, values: cur.map((r) => (r.spend / r.impressions) * 1000), fmt: (v) => money(v, lang) },
  ]
  const toggle = (k: string) =>
    setOn((s) => {
      const n = new Set(s)
      if (n.has(k) && n.size === 1) return n
      n.has(k) ? n.delete(k) : n.add(k)
      return n
    })

  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'perf', label: t('Hiệu suất', 'Performance') },
    { id: 'adsets', label: t('Nhóm quảng cáo', 'Ad sets') },
    { id: 'ads', label: t('Quảng cáo', 'Ads') },
    { id: 'audience', label: t('Đối tượng', 'Audience') },
  ]
  const recent = [...cur].reverse().slice(0, 7)

  return (
    <div className="h-full overflow-y-auto overscroll-contain p-4">
      <Head
        title={t('Chi tiết chiến dịch', 'Campaign detail')}
        sub={t('Phân tích hiệu suất chiến dịch theo thời gian thực', 'Real-time campaign performance analysis')}
        right={
          <Segmented
            label={t('Khoảng thời gian', 'Date range')}
            value={range}
            onChange={setRange}
            options={[
              { value: 14, label: t('14 ngày', '14 days') },
              { value: 30, label: t('30 ngày', '30 days') },
            ]}
          />
        }
      />

      <div className="grid gap-3 xl:grid-cols-[250px_1fr]">
        <div className="rounded-xl border bg-white p-3" style={{ borderColor: C.line }}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 text-[13px] font-semibold leading-snug" style={{ color: C.ink }}>{t('Lead Gen · Webinar 2026', 'Lead Gen · Webinar 2026')}</div>
            <Pill tone="green">{t('Hoạt động', 'Active')}</Pill>
          </div>
          <dl className="mt-2 space-y-1 text-[11.5px]" style={{ color: C.muted }}>
            <div className="flex justify-between gap-2"><dt>ID</dt><dd className="tabular-nums">2389••••••489</dd></div>
            <div className="flex justify-between gap-2"><dt>{t('Mục tiêu', 'Objective')}</dt><dd>{t('Khách hàng tiềm năng', 'Lead generation')}</dd></div>
            <div className="flex justify-between gap-2"><dt>{t('Ngân sách', 'Budget')}</dt><dd>{t('500.000đ/ngày', '₫500K / day')}</dd></div>
          </dl>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
          <Kpi label={t('Chi tiêu', 'Spend')} value={money(curT.spend, lang)} delta={<Delta v={change(curT.spend, prevT.spend)} lang={lang} />} />
          <Kpi label="Clicks" value={num(curT.clicks, lang)} delta={<Delta v={change(curT.clicks, prevT.clicks)} lang={lang} />} />
          <Kpi label="CTR" value={pct(curT.ctr, lang)} delta={<Delta v={change(curT.ctr, prevT.ctr)} lang={lang} />} />
          <Kpi label="CPM" value={money(curT.cpm, lang)} delta={<Delta v={change(curT.cpm, prevT.cpm)} goodWhenDown lang={lang} />} />
          <Kpi label="Leads" value={num(curT.leads, lang)} delta={<Delta v={change(curT.leads, prevT.leads)} lang={lang} />} />
          <Kpi label="CPL" value={money(curT.cpl, lang)} delta={<Delta v={change(curT.cpl, prevT.cpl)} goodWhenDown lang={lang} />} />
        </div>
      </div>

      <div role="tablist" aria-label={t('Chi tiết chiến dịch', 'Campaign detail')} className="mt-3 flex gap-1 overflow-x-auto border-b" style={{ borderColor: C.line }}>
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className="whitespace-nowrap border-b-2 px-3 py-2 text-[12.5px] font-medium"
            style={tab === x.id ? { borderColor: C.blue, color: C.blueDeep } : { borderColor: 'transparent', color: C.muted }}
          >
            {x.label}
          </button>
        ))}
      </div>

      {tab === 'perf' && (
        <div className="mt-3 space-y-3">
          <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
            <Card title={t('Hiệu suất theo ngày', 'Daily performance')} right={<Legend items={all} on={on} toggle={toggle} />}>
              <LineChart key={`${range}-${Array.from(on).join()}`} gid="cd" mode="norm" labels={labels} series={all.filter((s) => on.has(s.key))} height={200} animate={!reduced} />
            </Card>
            <Card title={t('Phân bổ Leads', 'Lead sources')}>
              <div className="flex items-center gap-4 lg:flex-col lg:items-stretch">
                <div className="flex justify-center">
                  <Donut
                    parts={[
                      { label: 'Form', value: curT.form, color: C.blue },
                      { label: 'Messenger', value: curT.messenger, color: C.violet },
                    ]}
                    centerBig={num(curT.leads, lang)}
                    centerSmall={t('Tổng leads', 'Total leads')}
                  />
                </div>
                <ul className="min-w-0 flex-1 space-y-1.5 text-[12px]">
                  {[
                    ['Form', curT.form, C.blue],
                    ['Messenger', curT.messenger, C.violet],
                  ].map(([n, v, c]) => (
                    <li key={n as string} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c as string }} />
                      <span style={{ color: C.muted }}>{n}</span>
                      <b className="ml-auto tabular-nums" style={{ color: C.ink }}>{v as number}</b>
                      <span className="w-12 text-right tabular-nums" style={{ color: C.faint }}>({pct(((v as number) / curT.leads) * 100, lang, 1)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
          <Card
            title={t('Chi tiết theo ngày', 'Daily breakdown')}
            right={
              <button
                type="button"
                onClick={() => setExported(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium"
                style={{ borderColor: C.line, color: exported ? C.greenText : C.ink }}
              >
                {exported ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Download className="h-3.5 w-3.5" aria-hidden="true" />}
                {exported ? t('Đã tạo báo cáo', 'Report ready') : t('Xuất báo cáo', 'Export report')}
              </button>
            }
          >
            <Table min={600}>
              <thead>
                <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th className={th}>{t('Ngày', 'Date')}</th>
                  <th className={th}>{t('Chi tiêu', 'Spend')}</th>
                  <th className={th}>Clicks</th>
                  <th className={th}>CTR</th>
                  <th className={th}>CPM</th>
                  <th className={th}>Leads</th>
                  <th className={th}>CPL</th>
                  <th className={th}>Form</th>
                  <th className={th}>Messenger</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                    <td className={`${td} tabular-nums`}>{fmtFull(dateAt(i), lang)}</td>
                    <td className={`${td} tabular-nums`}>{money(r.spend, lang)}</td>
                    <td className={`${td} tabular-nums`}>{num(r.clicks, lang)}</td>
                    <td className={`${td} tabular-nums`}>{pct((r.clicks / r.impressions) * 100, lang)}</td>
                    <td className={`${td} tabular-nums`}>{money((r.spend / r.impressions) * 1000, lang)}</td>
                    <td className={`${td} tabular-nums`}>{r.leads}</td>
                    <td className={`${td} tabular-nums`}>{money(r.spend / r.leads, lang)}</td>
                    <td className={`${td} tabular-nums`}>{r.form}</td>
                    <td className={`${td} tabular-nums`}>{r.messenger}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </div>
      )}

      {tab === 'adsets' && (
        <Card className="mt-3">
          <Table min={520}>
            <thead>
              <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th className={th}>{t('Nhóm quảng cáo', 'Ad set')}</th>
                <th className={th}>{t('Chi tiêu', 'Spend')}</th>
                <th className={th}>Leads</th>
                <th className={th}>CPL</th>
                <th className={th}>CTR</th>
                <th className={th}>{t('Trạng thái', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {ADSETS.map((a) => (
                <tr key={a.name.en} style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                  <td className={td}>{t(a.name.vi, a.name.en)}</td>
                  <td className={`${td} tabular-nums`}>{money(a.spend, lang)}</td>
                  <td className={`${td} tabular-nums`}>{a.leads}</td>
                  <td className={`${td} font-semibold tabular-nums`}>{money(a.spend / a.leads, lang)}</td>
                  <td className={`${td} tabular-nums`}>{pct(a.ctr, lang)}</td>
                  <td className={td}>{a.active ? <Pill tone="green">{t('Hoạt động', 'Active')}</Pill> : <Pill tone="gray">{t('Tạm dừng', 'Paused')}</Pill>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {tab === 'ads' && (
        <Card className="mt-3">
          <Table min={520}>
            <thead>
              <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th className={th}>{t('Quảng cáo', 'Ad')}</th>
                <th className={th}>{t('Định dạng', 'Format')}</th>
                <th className={th}>{t('Chi tiêu', 'Spend')}</th>
                <th className={th}>Leads</th>
                <th className={th}>CPL</th>
                <th className={th}>CTR</th>
              </tr>
            </thead>
            <tbody>
              {ADS.map((a) => (
                <tr key={a.name.en} style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                  <td className={td}>{t(a.name.vi, a.name.en)}</td>
                  <td className={td}><Pill tone="blue">{a.format}</Pill></td>
                  <td className={`${td} tabular-nums`}>{money(a.spend, lang)}</td>
                  <td className={`${td} tabular-nums`}>{a.leads}</td>
                  <td className={`${td} font-semibold tabular-nums`}>{money(a.spend / a.leads, lang)}</td>
                  <td className={`${td} tabular-nums`}>{pct(a.ctr, lang)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {tab === 'audience' && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Card title={t('Leads theo độ tuổi', 'Leads by age')}>
            <div className="space-y-2">
              {AUDIENCE_AGE.map((a) => (
                <div key={a.label} className="flex items-center gap-2 text-[12px]">
                  <span className="w-12 tabular-nums" style={{ color: C.muted }}>{a.label}</span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: '#eef1f5' }}>
                    <span className="block h-full rounded-full" style={{ width: `${a.value * 2.2}%`, background: C.blue }} />
                  </span>
                  <b className="w-9 text-right tabular-nums" style={{ color: C.ink }}>{a.value}%</b>
                </div>
              ))}
            </div>
          </Card>
          <Card title={t('Giới tính & thiết bị', 'Gender & device')}>
            <div className="flex items-center gap-5">
              <Donut
                size={120}
                parts={[
                  { label: t('Nữ', 'Female'), value: 61, color: C.violet },
                  { label: t('Nam', 'Male'), value: 39, color: C.blue },
                ]}
                centerBig="61%"
                centerSmall={t('Nữ', 'Female')}
              />
              <ul className="space-y-1.5 text-[12px]" style={{ color: C.muted }}>
                <li>{t('Di động', 'Mobile')}: <b style={{ color: C.ink }}>86%</b></li>
                <li>{t('Máy tính', 'Desktop')}: <b style={{ color: C.ink }}>12%</b></li>
                <li>{t('Máy tính bảng', 'Tablet')}: <b style={{ color: C.ink }}>2%</b></li>
              </ul>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ================================ 4. AI INSIGHT ================================ */

type QId = 'cpl' | 'compare' | 'best'

const QUESTIONS: { id: QId; vi: string; en: string }[] = [
  { id: 'cpl', vi: 'Campaign nào CPL cao nhất tuần này?', en: 'Which campaign has the highest CPL this week?' },
  { id: 'compare', vi: 'So sánh 2 tuyến nội dung 30 ngày qua', en: 'Compare two content streams over the last 30 days' },
  { id: 'best', vi: 'Tuyến nội dung nào hiệu quả nhất?', en: 'Which content stream performs best?' },
]

const CPL_ROWS = [
  { name: { vi: 'Prospecting · Sở thích rộng', en: 'Prospecting · Broad interests' }, spend: 2700000, leads: 5, ctr: 0.74 },
  { name: { vi: 'Reach · Video thương hiệu', en: 'Reach · Brand video' }, spend: 1880000, leads: 4, ctr: 0.69 },
  { name: { vi: 'Lead Gen · Hội thảo trực tiếp', en: 'Lead Gen · Live seminar' }, spend: 2150000, leads: 5, ctr: 0.81 },
  { name: { vi: 'Traffic · Thử nghiệm landing', en: 'Traffic · Landing test' }, spend: 1640000, leads: 4, ctr: 0.77 },
  { name: { vi: 'Messenger · Ưu đãi mùa lễ', en: 'Messenger · Holiday offer' }, spend: 1580000, leads: 4, ctr: 0.72 },
]

function answerIntro(id: QId, t: (vi: string, en: string) => string, lang: Lang) {
  if (id === 'cpl') {
    const avg = windowOf(ACCOUNT_DAYS, 7).curT.cpl
    const top = CPL_ROWS[0].spend / CPL_ROWS[0].leads
    const over = Math.round((top / avg - 1) * 100)
    const avgTxt = money(avg, lang)
    return t(
      `Dưới đây là 5 campaign có CPL cao nhất trong 7 ngày qua. Campaign đứng đầu cao hơn CPL trung bình của tài khoản (${avgTxt}) khoảng ${over}%, nên cân nhắc giảm ngân sách hoặc đổi nội dung.`,
      `These are the 5 campaigns with the highest CPL over the last 7 days. The top one is about ${over}% above the account's average CPL (${avgTxt}), so consider trimming its budget or changing the creative.`
    )
  }
  if (id === 'compare')
    return t(
      'Trong 30 ngày qua, "Kiến thức chuyên sâu" có CPL thấp hơn "Tin tức ngành" khoảng 37% và CTR cao gần gấp đôi. Gợi ý: chuyển 20% ngân sách từ Tin tức ngành sang Kiến thức chuyên sâu.',
      'Over the last 30 days, "Expert insights" has a CPL about 37% lower than "Industry news" and almost double the CTR. Suggestion: move 20% of the Industry news budget to Expert insights.'
    )
  return t(
    'Xét theo CPL thấp nhất trong các tuyến đang đạt hiệu quả cao, "Chia sẻ khách hàng" dẫn đầu, theo sau là Livestream & sự kiện và Case study.',
    'Judged by the lowest CPL among high-performing streams, "Customer stories" leads, followed by Livestreams & events and Case studies.'
  )
}

function AnswerVisual({ id }: { id: QId }) {
  const { t, lang } = useLang()
  if (id === 'cpl') {
    const rows = CPL_ROWS.map((r) => ({ ...r, cpl: r.spend / r.leads })).sort((a, b) => b.cpl - a.cpl)
    const max = Math.max(...rows.map((r) => r.cpl))
    return (
      <div className="space-y-3">
        <Card>
          <Table min={520}>
            <thead>
              <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th className={th}>#</th>
                <th className={th}>Campaign</th>
                <th className={th}>{t('Chi tiêu', 'Spend')}</th>
                <th className={th}>Leads</th>
                <th className={th}>CPL</th>
                <th className={th}>CTR</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.name.en} style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                  <td className={td} style={{ color: C.faint }}>{i + 1}</td>
                  <td className={td}>{t(r.name.vi, r.name.en)}</td>
                  <td className={`${td} tabular-nums`}>{money(r.spend, lang)}</td>
                  <td className={`${td} tabular-nums`}>{r.leads}</td>
                  <td className={`${td} font-semibold tabular-nums`} style={{ color: C.redText }}>{money(r.cpl, lang)}</td>
                  <td className={`${td} tabular-nums`}>{pct(r.ctr, lang)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card title={t('Top 5 CPL cao nhất', 'Top 5 highest CPL')}>
          <div className="flex h-36 items-end gap-3">
            {rows.map((r, i) => (
              <div key={r.name.en} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[11.5px] font-semibold tabular-nums" style={{ color: C.ink }}>{money(r.cpl, lang)}</span>
                <span
                  className="w-full max-w-[56px] rounded-t-md"
                  style={{ height: `${(r.cpl / max) * 96}px`, background: `linear-gradient(180deg, ${C.blue}, #60a5fa)`, opacity: 1 - i * 0.12 }}
                />
                <span className="w-full truncate text-center text-[10.5px]" style={{ color: C.faint }}>#{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }
  if (id === 'compare') {
    const sa = STREAMS[0]
    const sb = STREAMS[4]
    const A = { name: t(sa.name.vi, sa.name.en), spend: sa.spend * sa.k30.spend, leads: Math.round(sa.leads * sa.k30.leads), ctr: sa.ctr, cpc: sa.cpc }
    const B = { name: t(sb.name.vi, sb.name.en), spend: sb.spend * sb.k30.spend, leads: Math.round(sb.leads * sb.k30.leads), ctr: sb.ctr, cpc: sb.cpc }
    const rows: [string, string, string, boolean][] = [
      [t('Chi tiêu', 'Spend'), money(A.spend, lang), money(B.spend, lang), false],
      ['Leads', String(A.leads), String(B.leads), true],
      ['CPL', money(A.spend / A.leads, lang), money(B.spend / B.leads, lang), true],
      ['CTR', pct(A.ctr, lang), pct(B.ctr, lang), true],
      ['CPC', money(A.cpc, lang), money(B.cpc, lang), false],
    ]
    return (
      <Card>
        <Table min={420}>
          <thead>
            <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th className={th}>{t('Chỉ số', 'Metric')}</th>
              <th className={th}>{A.name}</th>
              <th className={th}>{B.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([m, a, b, hl]) => (
              <tr key={m} style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                <td className={td} style={{ color: C.muted }}>{m}</td>
                <td className={`${td} tabular-nums ${hl ? 'font-semibold' : ''}`} style={hl ? { color: C.greenText } : undefined}>{a}</td>
                <td className={`${td} tabular-nums`}>{b}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    )
  }
  const ranked = STREAMS.filter((s) => s.level === 'high')
    .map((s) => ({ name: t(s.name.vi, s.name.en), cpl: s.spend / s.leads }))
    .sort((a, b) => a.cpl - b.cpl)
  const max = Math.max(...ranked.map((r) => r.cpl))
  return (
    <Card title={t('CPL theo tuyến (thấp là tốt)', 'CPL by stream (lower is better)')}>
      <div className="space-y-2">
        {ranked.map((r, i) => (
          <div key={r.name} className="flex items-center gap-2 text-[12px]">
            <span className="w-36 truncate" style={{ color: C.ink }}>{r.name}</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: '#eef1f5' }}>
              <span className="block h-full rounded-full" style={{ width: `${(r.cpl / max) * 100}%`, background: i === 0 ? C.green : C.blue }} />
            </span>
            <b className="w-12 text-right tabular-nums" style={{ color: C.ink }}>{money(r.cpl, lang)}</b>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function AiScreen() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const [asked, setAsked] = useState<QId[]>(['cpl'])
  const [phase, setPhase] = useState<'thinking' | 'typing' | 'done'>('thinking')
  const [shown, setShown] = useState(0)
  const scroller = useRef<HTMLDivElement | null>(null)
  const lastTurn = useRef<HTMLDivElement | null>(null)
  const current = asked[asked.length - 1]
  const full = answerIntro(current, t, lang)

  useEffect(() => {
    if (reduced) {
      setPhase('done')
      setShown(full.length)
      return
    }
    setPhase('thinking')
    setShown(0)
    const a = setTimeout(() => setPhase('typing'), 900)
    return () => clearTimeout(a)
  }, [current, asked.length, reduced, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'typing') return
    if (shown >= full.length) {
      setPhase('done')
      return
    }
    const id = setTimeout(() => setShown((s) => Math.min(full.length, s + 3)), 16)
    return () => clearTimeout(id)
  }, [phase, shown, full.length])

  // Khi có câu hỏi mới, cuộn để câu hỏi nằm ở đầu khung (không cuộn cả trang)
  useEffect(() => {
    const el = scroller.current
    const last = lastTurn.current
    if (el && last) el.scrollTo({ top: Math.max(0, last.offsetTop - 8), behavior: reduced ? 'auto' : 'smooth' })
  }, [asked.length, phase, reduced])

  const ask = (id: QId) => setAsked((a) => [...a, id])
  const remaining = QUESTIONS.filter((q) => q.id !== current)

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4">
        <Head title="AI Insight" sub={t('Chat với dữ liệu quảng cáo của bạn', 'Chat with your advertising data')} />
      </div>
      <div ref={scroller} className="relative min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 pb-3">
        {asked.map((id, idx) => {
          const q = QUESTIONS.find((x) => x.id === id)!
          const last = idx === asked.length - 1
          const isDone = !last || phase === 'done'
          return (
            <div key={`${id}-${idx}`} ref={last ? lastTurn : undefined} className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2 text-[12.5px]" style={{ background: C.blueBg, color: C.ink }}>
                  {t(q.vi, q.en)}
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: C.blueBg }}>
                  <Sparkles className="h-3.5 w-3.5" style={{ color: C.blueDeep }} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 space-y-3">
                  {last && phase === 'thinking' ? (
                    <div className="flex items-center gap-1 py-2" aria-label={t('AI đang phân tích', 'AI is analysing')}>
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: C.faint, animationDelay: `${d * 120}ms` }} />
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-[12.5px] leading-relaxed" style={{ color: C.ink }}>
                        {last ? full.slice(0, shown) : answerIntro(id, t, lang)}
                      </p>
                      {isDone && (
                        <div className="animate-in fade-in slide-in-from-bottom-1 duration-500">
                          <AnswerVisual id={id} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div aria-hidden="true" className="h-40" />
      </div>

      <div className="border-t px-4 py-3" style={{ borderColor: C.line, background: '#fff' }}>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11.5px]" style={{ color: C.muted }}>{t('Gợi ý câu hỏi:', 'Try asking:')}</span>
          {(remaining.length ? remaining : QUESTIONS).map((q) => (
            <button
              key={q.id}
              type="button"
              disabled={phase !== 'done'}
              onClick={() => ask(q.id)}
              className="rounded-full border px-2.5 py-1 text-left text-[11.5px] transition-colors hover:bg-[#eff4ff] disabled:opacity-50"
              style={{ borderColor: C.line, color: C.ink }}
            >
              {t(q.vi, q.en)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: C.line }}>
          <span className="min-w-0 flex-1 truncate text-[12.5px]" style={{ color: C.faint }}>{t('Hỏi AI về dữ liệu quảng cáo của bạn...', 'Ask the AI about your advertising data...')}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: C.blue }}>
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-1.5 text-[10.5px]" style={{ color: C.faint }}>
          {t('AI có thể trả lời sai. Luôn xác minh số liệu quan trọng. Dữ liệu trong demo là minh họa.', 'AI can be wrong. Always verify important figures. Data in this demo is illustrative.')}
        </p>
      </div>
    </div>
  )
}

/* =============================== 5. META API SETUP =============================== */

export function MetaScreen() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const [done, setDone] = useState(0)
  const [test, setTest] = useState<number | null>(null)
  const [justNow, setJustNow] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (reduced) {
      setDone(PIPELINE_STEPS.length)
      return
    }
    if (done >= PIPELINE_STEPS.length) return
    const id = setTimeout(() => setDone((d) => d + 1), done === 0 ? 350 : 420)
    return () => clearTimeout(id)
  }, [done, reduced])

  useEffect(() => {
    if (test === null) return
    if (test >= PIPELINE_TESTS.length) {
      setTest(null)
      setJustNow(true)
      return
    }
    const id = setTimeout(() => setTest((x) => (x === null ? x : x + 1)), reduced ? 120 : 520)
    return () => clearTimeout(id)
  }, [test, reduced])

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(id)
  }, [copied])

  const allOk = done >= PIPELINE_STEPS.length

  return (
    <div className="h-full overflow-y-auto overscroll-contain p-4">
      <Head
        title="Meta API Setup"
        sub={t('Thiết lập & kết nối pipeline dữ liệu Meta Marketing API', 'Set up and connect the Meta Marketing API data pipeline')}
      />
      <Card title={t('Trạng thái kết nối', 'Connection status')}>
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {PIPELINE_STEPS.map((s, i) => {
            const ok = i < done
            return (
              <li key={s.en} className="flex items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors duration-300" style={{ borderColor: ok ? '#bbf7d0' : C.line, background: ok ? '#f0fdf4' : '#fff' }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: ok ? C.green : '#9ca3af' }}>
                  {ok ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold" style={{ color: C.ink }}>{t(s.vi, s.en)}</span>
                  <span className="block truncate text-[11px]" style={{ color: C.muted }}>{ok ? t(s.subVi, s.subEn) : t('Đang xử lý...', 'In progress...')}</span>
                </span>
              </li>
            )
          })}
        </ol>
        <div
          className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 text-[12px] transition-colors duration-500"
          style={{ background: allOk ? '#f0fdf4' : C.soft, color: allOk ? C.greenText : C.muted }}
          aria-live="polite"
        >
          <span>
            <b>{allOk ? t('Pipeline hoạt động tốt!', 'Pipeline healthy!') : t('Đang kiểm tra pipeline...', 'Checking the pipeline...')}</b>{' '}
            {allOk && t('Dữ liệu đang được đồng bộ real-time.', 'Data is syncing in real time.')}
          </span>
          {allOk && <span style={{ color: C.muted }}>{t('Cập nhật lần cuối: ', 'Last update: ')}{justNow ? t('vừa xong', 'just now') : t('2 phút trước', '2 min ago')}</span>}
        </div>
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card title={t('Thông tin kết nối', 'Connection details')}>
          <dl className="space-y-2 text-[12px]">
            {[
              ['Meta Business', '••••••••••• 4821'],
              ['Ad Account', 'act_••••••••3907'],
              ['System User ID', '••••••••••••6612'],
              ['App ID', '••••••••••••••5304'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 border-b pb-2" style={{ borderColor: C.line }}>
                <dt style={{ color: C.muted }}>{k}</dt>
                <dd className="tabular-nums" style={{ color: C.ink }}>{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 border-b pb-2" style={{ borderColor: C.line }}>
              <dt style={{ color: C.muted }}>Webhook URL</dt>
              <dd className="flex min-w-0 items-center gap-1.5" style={{ color: C.blueDeep }}>
                <span className="truncate">https://example.com/webhook/meta</span>
                <button type="button" onClick={() => setCopied(true)} aria-label={t('Sao chép', 'Copy')} className="shrink-0 rounded p-1 hover:bg-[#eff4ff]">
                  {copied ? <Check className="h-3.5 w-3.5" style={{ color: C.greenText }} /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt style={{ color: C.muted }}>{t('Trạng thái', 'Status')}</dt>
              <dd><Pill tone={allOk ? 'green' : 'gray'}>{allOk ? t('Đang hoạt động', 'Active') : t('Đang kiểm tra', 'Checking')}</Pill></dd>
            </div>
          </dl>
          <p className="mt-3 text-[11.5px]" style={{ color: C.muted }}>
            {t('Click Star không yêu cầu mật khẩu, bạn chỉ cần ủy quyền tài khoản Meta Business.', 'Click Star never asks for your password, you only authorize your Meta Business account.')}
          </p>
        </Card>

        <Card
          title="Test pipeline"
          right={
            <button
              type="button"
              disabled={test !== null || !allOk}
              onClick={() => {
                setJustNow(false)
                setTest(0)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium disabled:opacity-60"
              style={{ borderColor: C.line, color: C.blueDeep }}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${test !== null ? 'animate-spin' : ''}`} aria-hidden="true" />
              {t('Test lại', 'Run again')}
            </button>
          }
        >
          <ul className="space-y-1.5">
            {PIPELINE_TESTS.map((p, i) => {
              const running = test !== null && i === test
              const pending = test !== null && i > test
              return (
                <li key={p.en} className="flex items-center gap-3 rounded-lg px-2 py-1.5" style={{ background: running ? C.blueBg : undefined }}>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold" style={{ color: C.ink }}>{t(p.vi, p.en)}</span>
                    <span className="block truncate text-[11px]" style={{ color: C.muted }}>{t(p.subVi, p.subEn)}</span>
                  </span>
                  {running ? (
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: C.blue }} aria-label={t('Đang chạy', 'Running')} />
                  ) : pending || !allOk ? (
                    <span className="text-[11px]" style={{ color: C.faint }}>{t('Chờ', 'Queued')}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-medium" style={{ color: C.greenText }}>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" /> {t('Thành công', 'Passed')}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <Card className="mt-3" title={t('Dữ liệu gần đây', 'Recent data')}>
        <Table min={520}>
          <thead>
            <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th className={th}>{t('Thời gian', 'Time')}</th>
              <th className={th}>{t('Loại dữ liệu', 'Data type')}</th>
              <th className={th}>{t('Chi tiết', 'Details')}</th>
              <th className={th}>{t('Trạng thái', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_SYNC.map((r) => (
              <tr key={r.time} style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                <td className={`${td} tabular-nums`}>{fmtFull(dateAt(0), lang)} {r.time}</td>
                <td className={td}>{r.kind}</td>
                <td className={td}>{t(r.vi, r.en)}</td>
                <td className={td}><Pill tone="green">{t('Thành công', 'Success')}</Pill></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
