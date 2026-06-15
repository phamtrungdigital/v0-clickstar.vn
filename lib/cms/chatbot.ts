// Server-only: đọc cấu hình bot. Types/constants client-safe nằm ở chatbot-shared.ts.
import { createClient } from '@/lib/supabase/server'

export * from './chatbot-shared'
import type { ChatbotSettings } from './chatbot-shared'

export async function getChatbotSettings(): Promise<ChatbotSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('chatbot_settings').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as ChatbotSettings) || null
}
