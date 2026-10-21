import Link from 'next/link'
import { loadReportData } from '@/lib/cms/report-data'
import { loadTraffic } from '@/lib/cms/cdp-report'
import { Card, PageHeader } from '@/components/admin/ui'
import { ReportsDashboard } from './_components/reports-dashboard'
import { TrafficJourney } from './_components/traffic-journey'

export const dynamic = 'force-dynamic'

const DAY_OPTIONS = [7, 30, 90] as const

/** Báo cáo có 2 phần: Khách tiềm năng (dữ liệu website) và Truy cập và hành trình (dữ liệu CDP Click Star). */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ tab?: string; days?: string }> }) {
  const sp = await searchParams
  const tab = sp.tab === 'traffic' ? 'traffic' : 'leads'
  const days = DAY_OPTIONS.find((d) => String(d) === sp.days) ?? 30

  const tabLink = (id: 'leads' | 'traffic', label: string) => (
    <Link
      href={id === 'traffic' ? `/admin-cls/reports?tab=traffic&days=${days}` : '/admin-cls/reports'}
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
      </nav>

      {tab === 'leads' ? <ReportsDashboard data={await loadReportData()} /> : <TrafficTab days={days} />}
    </div>
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
        actions={
          <nav aria-label="Chọn kỳ" className="inline-flex gap-0.5 rounded-[10px] bg-[var(--ad-fill)] p-0.5">
            {DAY_OPTIONS.map((d) => (
              <Link
                key={d}
                href={`/admin-cls/reports?tab=traffic&days=${d}`}
                aria-current={d === days ? 'page' : undefined}
                className={`h-7 rounded-lg px-3.5 text-[13px] font-medium leading-7 ${
                  d === days ? 'bg-[var(--ad-surface)] text-[var(--ad-fg)] shadow-[0_1px_3px_rgba(0,0,0,.14)]' : 'text-[var(--ad-fg-2)] hover:text-[var(--ad-fg)]'
                }`}
              >
                {d} ngày
              </Link>
            ))}
          </nav>
        }
      />
      {result.ok ? (
        <TrafficJourney data={result.data} />
      ) : (
        <Card className="px-6 py-10 text-center text-[14px] text-[var(--ad-fg-3)]">{result.reason}</Card>
      )}
    </>
  )
}
