import { getAiSettings, keySources, maskApiKey } from '@/lib/ai/settings'
import { getChatbotSettings } from '@/lib/cms/chatbot'
import { AiHub } from './_components/ai-hub'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function AiSettingsPage() {
  const [ai, chatbot] = await Promise.all([getAiSettings(), getChatbotSettings()])
  // Không gửi key thật xuống trình duyệt: chỉ "••••" + 4 ký tự cuối.
  const aiMasked = ai
    ? { ...ai, anthropic_api_key: maskApiKey(ai.anthropic_api_key), openai_api_key: maskApiKey(ai.openai_api_key) }
    : null
  return <AiHub aiInitial={aiMasked} aiKeySources={keySources(ai)} chatbotInitial={chatbot} />
}
