import { AI_MODULE_ENABLED } from '@/lib/ai/module-flag'
import { getAiSettings } from '@/lib/ai/settings'
import { getChatbotSettings } from '@/lib/cms/chatbot'
import { AiHub } from './_components/ai-hub'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function AiSettingsPage() {
  // Module AI tắt: không nạp khoá AI từ DB (tránh đưa khoá xuống trình duyệt), chỉ còn cấu hình chatbot website
  const [ai, chatbot] = await Promise.all([AI_MODULE_ENABLED ? getAiSettings() : Promise.resolve(null), getChatbotSettings()])
  return <AiHub aiInitial={ai} chatbotInitial={chatbot} aiEnabled={AI_MODULE_ENABLED} />
}
