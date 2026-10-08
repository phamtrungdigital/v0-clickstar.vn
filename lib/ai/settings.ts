// Server-only: contains getAiSettings (uses next/headers via createClient).
// All types + constants live in lib/ai/settings-shared.ts for client-safe import.
// Re-exported here so existing server imports `from '@/lib/ai/settings'` still work.

import { createClient } from '@/lib/supabase/server'

export * from './settings-shared'
import type { AiProvider, AiSettings, KeySources } from './settings-shared'

export async function getAiSettings(): Promise<AiSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as AiSettings) || null
}

const ENV_KEY: Record<AiProvider, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
}

/**
 * Key dùng để gọi AI: ưu tiên key admin lưu trong Cài đặt AI (giữ nguyên hành vi cũ),
 * trống thì dùng biến môi trường Vercel (ANTHROPIC_API_KEY / OPENAI_API_KEY).
 * Hướng đi lâu dài: để key ở Vercel env và xoá key khỏi DB.
 */
export function resolveApiKey(s: AiSettings | null, provider: AiProvider): string | null {
  const db = provider === 'anthropic' ? s?.anthropic_api_key : s?.openai_api_key
  return db?.trim() || process.env[ENV_KEY[provider]]?.trim() || null
}

export function keySources(s: AiSettings | null): KeySources {
  const src = (provider: AiProvider) => {
    const db = provider === 'anthropic' ? s?.anthropic_api_key : s?.openai_api_key
    if (db?.trim()) return 'db' as const
    if (process.env[ENV_KEY[provider]]?.trim()) return 'env' as const
    return null
  }
  return { anthropic: src('anthropic'), openai: src('openai') }
}
