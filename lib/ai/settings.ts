import { createClient } from '@/lib/supabase/server'

export type AiProvider = 'anthropic' | 'openai'

export type AiSettings = {
  id: number
  provider: AiProvider
  anthropic_api_key: string | null
  openai_api_key: string | null
  default_model: string
  enabled: boolean
  system_prompt: string | null
  updated_at: string
}

export async function getAiSettings(): Promise<AiSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as AiSettings) || null
}
