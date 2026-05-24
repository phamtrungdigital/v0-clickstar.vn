import { notFound } from 'next/navigation'
import { getCampaignForAdmin } from '@/lib/personalize/campaigns'
import { CampaignEditor } from '../../_components/campaign-editor'

export const dynamic = 'force-dynamic'

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await getCampaignForAdmin(id)
  if (!campaign) notFound()
  return <CampaignEditor campaign={campaign} mode="edit" />
}
