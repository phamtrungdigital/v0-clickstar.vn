import { getAiSettings } from '@/lib/ai/settings'
import { getChatbotSettings } from '@/lib/cms/chatbot'
import { AiHub } from './_components/ai-hub'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function AiSettingsPage() {
  const [ai, chatbot] = await Promise.all([getAiSettings(), getChatbotSettings()])
  return <AiHub aiInitial={ai} chatbotInitial={chatbot} />
}
