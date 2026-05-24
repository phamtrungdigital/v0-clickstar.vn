import { CampaignEditor } from '../_components/campaign-editor'

export const dynamic = 'force-dynamic'

export default function NewCampaignPage() {
  return <CampaignEditor campaign={null} mode="new" />
}
