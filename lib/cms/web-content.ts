// Server-only: đọc web_content. Types/defaults client-safe ở web-content-shared.ts.
import { createClient } from '@/lib/supabase/server'

export * from './web-content-shared'
import type { WebContent } from './web-content-shared'

export async function getWebContent(): Promise<WebContent | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('web_content').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as WebContent) || null
}
