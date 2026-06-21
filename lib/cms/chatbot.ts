// Server-only: đọc cấu hình bot. Types/constants client-safe nằm ở chatbot-shared.ts.
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export * from './chatbot-shared'
import type { ChatbotSettings } from './chatbot-shared'

// Cache cho layout (widget config). Revalidate khi admin Lưu chatbot. Route
// /api/ai/service-router vẫn đọc DB trực tiếp nên không bị ảnh hưởng cache này.
export const getChatbotSettings = unstable_cache(
  async (): Promise<ChatbotSettings | null> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('chatbot_settings').select('*').eq('id', 1).maybeSingle()
    return (data as unknown as ChatbotSettings) || null
  },
  ['chatbot-settings'],
  { tags: ['chatbot_settings'], revalidate: 3600 }
)
