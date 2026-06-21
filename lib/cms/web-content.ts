// Server-only: đọc web_content. Types/defaults client-safe ở web-content-shared.ts.
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export * from './web-content-shared'
import type { WebContent } from './web-content-shared'

// Cache footer + service CTA. Revalidate khi admin Lưu Footer & CTA.
export const getWebContent = unstable_cache(
  async (): Promise<WebContent | null> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('web_content').select('*').eq('id', 1).maybeSingle()
    return (data as unknown as WebContent) || null
  },
  ['web-content'],
  { tags: ['web_content'], revalidate: 3600 }
)
