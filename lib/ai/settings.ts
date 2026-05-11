// Server-only: contains getAiSettings (uses next/headers via createClient).
// All types + constants live in lib/ai/settings-shared.ts for client-safe import.
// Re-exported here so existing server imports `from '@/lib/ai/settings'` still work.

import { createClient } from '@/lib/supabase/server'

export * from './settings-shared'
import type { AiSettings } from './settings-shared'

export async function getAiSettings(): Promise<AiSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as AiSettings) || null
}
