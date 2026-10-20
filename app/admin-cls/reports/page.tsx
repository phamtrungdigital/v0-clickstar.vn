import { loadReportData } from '@/lib/cms/report-data'
import { ReportsDashboard } from './_components/reports-dashboard'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const data = await loadReportData()
  return <ReportsDashboard data={data} />
}
