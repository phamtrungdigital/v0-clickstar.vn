// Mở đầu chung cho mọi API /api/admin/ai/*: kiểm quyền (admin/editor) → đọc cấu hình
// AI → kiểm đã bật. Server-only.
import { createClient } from '@/lib/supabase/server'
import { requireContentEditor, type GuardProfile } from './admin-guard'
import { resolveApiKey, type AiProvider, type AiSettings } from './settings'

type ServerClient = Awaited<ReturnType<typeof createClient>>

export type AiContext =
  | {
      ok: true
      supabase: ServerClient
      settings: AiSettings
      profile: GuardProfile
      /** Key của nhà cung cấp (DB trước, env sau); null = chưa có. */
      keyFor: (provider: AiProvider) => string | null
    }
  | { ok: false; status: number; error: string }

export async function loadAiContext(): Promise<AiContext> {
  const supabase = await createClient()
  const guard = await requireContentEditor(supabase)
  if (!guard.ok) return guard

  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  const settings = data as AiSettings | null
  if (!settings) return { ok: false, status: 500, error: 'Chưa khởi tạo cấu hình AI' }
  if (!settings.enabled) {
    return { ok: false, status: 400, error: 'AI chưa được bật. Vào Cài đặt AI để bật.' }
  }
  return {
    ok: true,
    supabase,
    settings,
    profile: guard.profile,
    keyFor: (provider) => resolveApiKey(settings, provider),
  }
}

/** Câu báo thiếu key, nói rõ 2 cách thêm. */
export function missingKeyMessage(provider: AiProvider): string {
  const name = provider === 'anthropic' ? 'Anthropic' : 'OpenAI'
  const env = provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'
  return `Chưa có API key ${name}. Thêm ở Cài đặt AI hoặc biến môi trường ${env} trên Vercel.`
}

/** Trần max_tokens khi gọi Claude: model 5.x luôn suy nghĩ trước khi trả lời và phần
 * suy nghĩ tính vào max_tokens → trần thấp (512) làm câu trả lời bị cắt. Chỉ tính tiền
 * theo token dùng thật nên đặt trần rộng không tốn thêm. */
export function claudeMaxTokens(requested: number | undefined, floor: number): number {
  return Math.min(64000, Math.max(requested ?? 0, floor))
}
