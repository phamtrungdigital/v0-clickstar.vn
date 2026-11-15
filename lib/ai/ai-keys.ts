// Khóa API của chatbot (OpenAI / Anthropic). Server-only: không import từ component client.
//
// Khóa lưu trong bảng ai_settings (cột openai_api_key / anthropic_api_key). Bảng này chỉ cho quản trị viên đọc/ghi
// (RLS), còn chatbot công khai đọc bằng service role ở máy chủ. Khóa KHÔNG BAO GIỜ được trả xuống trình duyệt:
// trang quản trị chỉ nhận trạng thái và 4 ký tự cuối (xem app/admin-cls/ai/chatbot-actions.ts).
// Không có khóa trong DB thì dùng biến môi trường OPENAI_API_KEY / ANTHROPIC_API_KEY như trước đây.
import { createServiceClient } from '@/lib/supabase/service'
import type { ChatProvider } from './chatbot-models'

export const KEY_COLUMN = { openai: 'openai_api_key', anthropic: 'anthropic_api_key' } as const
const ENV_NAME = { openai: 'OPENAI_API_KEY', anthropic: 'ANTHROPIC_API_KEY' } as const

const TTL_MS = 30_000
const cache = new Map<ChatProvider, { key: string | null; source: 'db' | 'env' | null; at: number }>()

/** Xóa bộ nhớ đệm trong tiến trình (gọi sau khi lưu/xóa khóa để lượt chat kế tiếp dùng khóa mới). */
export function clearAiKeyCache() {
  cache.clear()
}

export async function getAiKeyInfo(provider: ChatProvider): Promise<{ key: string | null; source: 'db' | 'env' | null }> {
  const hit = cache.get(provider)
  if (hit && Date.now() - hit.at < TTL_MS) return { key: hit.key, source: hit.source }

  let key: string | null = null
  let source: 'db' | 'env' | null = null
  try {
    const svc = createServiceClient()
    if (svc) {
      const col = KEY_COLUMN[provider]
      const { data } = await svc.from('ai_settings').select(col).eq('id', 1).maybeSingle()
      const v = (data as Record<string, unknown> | null)?.[col]
      if (typeof v === 'string' && v.trim()) {
        key = v.trim()
        source = 'db'
      }
    }
  } catch (err) {
    console.error('ai-keys read error:', err)
  }
  if (!key) {
    const env = process.env[ENV_NAME[provider]]?.trim()
    if (env) {
      key = env
      source = 'env'
    }
  }
  cache.set(provider, { key, source, at: Date.now() })
  return { key, source }
}

export async function getAiKey(provider: ChatProvider): Promise<string | null> {
  return (await getAiKeyInfo(provider)).key
}

/** Chỉ giữ 4 ký tự cuối để hiển thị. */
export function last4(key: string): string {
  return key.slice(-4)
}
