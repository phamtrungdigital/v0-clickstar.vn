import { getAiSettings } from '@/lib/ai/settings'
import { AiSettingsForm } from './_components/ai-settings-form'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function AiSettingsPage() {
  const settings = await getAiSettings()
  return <AiSettingsForm initial={settings} />
}
