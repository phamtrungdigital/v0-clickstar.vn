import { listLeads } from '@/lib/cms/leads'
import { LeadsTable } from './_components/leads-table'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const leads = await listLeads()
  return <LeadsTable leads={leads} />
}
