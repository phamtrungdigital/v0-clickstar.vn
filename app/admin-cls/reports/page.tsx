import Link from 'next/link'
import { loadReportData } from '@/lib/cms/report-data'
import { loadTraffic } from '@/lib/cms/cdp-report'
import { loadConsentReport } from '@/lib/cms/consent-report'
import { Card, PageHeader } from '@/components/admin/ui'
import { ReportsDashboard } from './_components/reports-dashboard'
import { TrafficJourney } from './_components/traffic-journey'
import { ConsentReportView } from './_components/consent-report'

export const dynamic = 'force-dynamic'

const DAY_OPTIONS = [7, 30, 90] as const

type Tab = 'leads' | 'traffic' | 'consent'

/**
 * Báo cáo có 3 phần: Khách tiềm năng (dữ liệu website), Truy cập và hành trình (dữ liệu CDP Click Star),
 * Đồng ý cookie (sổ consent_log).
 */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ tab?: string; days?: string; q?: string }> }) {
  const sp = await searchParams
  const tab: Tab = sp.tab === 'traffic' || sp.tab === 'consent' ? sp.tab : 'leads'
  const days = DAY_OPTIONS.find((d) => String(d) === sp.days) ?? 30

  const tabLink = (id: Tab, label: string) => (
    <Link
      href={id === 'leads' ? '/admin-cls/reports' : `/admin-cls/reports?tab=${id}&days=${days}`}
      aria-current={tab === id ? 'page' : undefined}
      className={`h-8 rounded-lg px-4 text-[13.5px] font-medium leading-8 transition-colors ${
        tab === id ? 'bg-[var(--ad-surface)] text-[var(--ad-fg)] shadow-[0_1px_3px_rgba(0,0,0,.14)]' : 'text-[var(--ad-fg-2)] hover:text-[var(--ad-fg)]'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <nav aria-label="Phần báo cáo" className="inline-flex gap-0.5 rounded-[10px] bg-[var(--ad-fill)] p-0.5">
        {tabLink('leads', 'Khách tiềm năng')}
        {tabLink('traffic', 'Truy cập và hành trình')}
        {tabLink('consent', 'Đồng ý cookie')}
      </nav>

      {tab === 'leads' ? (
        <ReportsDashboard data={await loadReportData()} />
      ) : tab === 'traffic' ? (
        <TrafficTab days={days} />
      ) : (
        <ConsentTab days={days} q={sp.q ?? ''} />
      )}
    </div>
  )
}

function DayPicker({ tab, days }: { tab: Tab; days: number }) {
  return (
    <nav aria-label="Chọn kỳ" className="inline-flex gap-0.5 rounded-[10px] bg-[var(--ad-fill)] p-0.5">
      {DAY_OPTIONS.map((d) => (
        <Link
          key={d}
          href={`/admin-cls/reports?tab=${tab}&days=${d}`}
          aria-current={d === days ? 'page' : undefined}
          className={`h-7 rounded-lg px-3.5 text-[13px] font-medium leading-7 ${
            d === days ? 'bg-[var(--ad-surface)] text-[var(--ad-fg)] shadow-[0_1px_3px_rgba(0,0,0,.14)]' : 'text-[var(--ad-fg-2)] hover:text-[var(--ad-fg)]'
          }`}
        >
          {d} ngày
        </Link>
      ))}
    </nav>
  )
}

async function ConsentTab({ days, q }: { days: number; q: string }) {
  return (
    <>
      <PageHeader
        className="mb-0"
        title="Đồng ý cookie"
        description="Khách đồng ý, từ chối hay tùy chỉnh cookie trên website, ghi từ thanh thông báo cookie."
        actions={<DayPicker tab="consent" days={days} />}
      />
      <ConsentReportView data={await loadConsentReport(days, q)} />
    </>
  )
}

async function TrafficTab({ days }: { days: number }) {
  const result = await loadTraffic(days)
  return (
    <>
      <PageHeader
        className="mb-0"
        title="Truy cập và hành trình"
        description="Số liệu từ CDP Click Star, đã loại bot, máy chạy thử và lượt vào trang quản trị."
        actions={<DayPicker tab="traffic" days={days} />}
      />
      {result.ok ? (
        <TrafficJourney data={result.data} />
      ) : (
        <Card className="px-6 py-10 text-center text-[14px] text-[var(--ad-fg-3)]">{result.reason}</Card>
      )}
    </>
  )
}
