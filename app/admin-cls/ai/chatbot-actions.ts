'use server'

import { revalidatePath, revalidateTag, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { runServiceRouter } from '@/lib/ai/chatbot-run'
import { getSiteKnowledge, SITE_KNOWLEDGE_TAG } from '@/lib/ai/site-knowledge'
import type { ChatbotSettingsUpdate, WidgetMode, QuickPrompt } from '@/lib/cms/chatbot-shared'
import { DEFAULT_MODEL, isValidModelId, looksLikeKey, CHAT_PROVIDERS, type ChatProvider } from '@/lib/ai/chatbot-models'
import { KEY_COLUMN, clearAiKeyCache, getAiKeyInfo, last4 } from '@/lib/ai/ai-keys'
import { explainLlmError, pingModel } from '@/lib/ai/llm-chat'

const WIDGET_MODES: WidgetMode[] = ['bubble', 'bar', 'both', 'none']

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(v))
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function cleanI18n(v: any): { vi: string; en: string } {
  return {
    vi: typeof v?.vi === 'string' ? v.vi : '',
    en: typeof v?.en === 'string' ? v.en : '',
  }
}

function cleanPrompts(v: any): QuickPrompt[] {
  if (!Array.isArray(v)) return []
  return v
    .map((p) => ({
      label: typeof p?.label === 'string' ? p.label.trim() : '',
      value: typeof p?.value === 'string' ? p.value.trim() : '',
    }))
    .filter((p) => p.label && p.value)
    .slice(0, 8)
}

export async function saveChatbotSettings(input: ChatbotSettingsUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const widget_mode: WidgetMode = WIDGET_MODES.includes(input.widget_mode)
    ? input.widget_mode
    : 'both'

  const payload = {
    enabled: !!input.enabled,
    widget_mode,
    bot_name: cleanI18n(input.bot_name),
    welcome_message: cleanI18n(input.welcome_message),
    quick_prompts: {
      vi: cleanPrompts(input.quick_prompts?.vi),
      en: cleanPrompts(input.quick_prompts?.en),
    },
    hotline: typeof input.hotline === 'string' ? input.hotline.trim() : '',
    system_prompt:
      typeof input.system_prompt === 'string' && input.system_prompt.trim()
        ? input.system_prompt
        : null,
    model: isValidModelId(input.model?.trim()) ? input.model.trim() : DEFAULT_MODEL.openai,
    hidden_paths: Array.isArray(input.hidden_paths)
      ? input.hidden_paths.map((p) => String(p).trim()).filter(Boolean).slice(0, 50)
      : [],
    show_delay_ms: clampInt(input.show_delay_ms, 0, 120_000, 10_000),
    auto_close_ms: clampInt(input.auto_close_ms, 0, 120_000, 15_000),
    dismiss_hours: clampInt(input.dismiss_hours, 0, 720, 24),
    show_on_desktop: !!input.show_on_desktop,
    show_on_mobile: !!input.show_on_mobile,
    updated_by: user.id,
  }

  const { error } = await supabase.from('chatbot_settings').update(payload).eq('id', 1)
  if (error) return { error: error.message }

  revalidateTag('chatbot_settings')
  revalidatePath('/admin-cls/ai')
  // Widget nằm ở root layout → revalidate toàn bộ trang dùng layout để áp config mới.
  revalidatePath('/', 'layout')
  return { ok: true }
}

export type ChatbotTestResult = { answer?: string; links?: any[]; error?: string }

/** Test bot — chạy ĐÚNG lõi runServiceRouter với prompt/model đã LƯU trong DB. */
export async function testChatbot(query: string): Promise<ChatbotTestResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  const { data: cfg } = await supabase
    .from('chatbot_settings')
    .select('enabled, system_prompt, model, hotline')
    .eq('id', 1)
    .maybeSingle()

  if (cfg && cfg.enabled === false) {
    return { error: 'Bot đang TẮT — bật lại + lưu rồi test (test vẫn chạy được nhưng nhắc anh).' }
  }

  const result = await runServiceRouter({
    query,
    systemPrompt: cfg?.system_prompt ?? null,
    model: cfg?.model ?? null,
    hotline: cfg?.hotline ?? null,
    forAdmin: true,
  })
  if (!result.ok) return { error: result.error }
  return { answer: result.answer, links: result.links }
}

export type SiteKnowledgeInfo = { chars: number; pages: number; builtAt: string; preview: string }

/**
 * "Cho AI học lại ngay": xoá cache kiến thức rồi dựng lại từ website hiện tại.
 * Bình thường không cần bấm — Lưu trang trong admin đã tự làm mới, tối đa sau 1 giờ.
 */
export async function refreshSiteKnowledge(): Promise<SiteKnowledgeInfo | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  // updateTag (không phải revalidateTag): hết hạn NGAY và lượt đọc kế tiếp trong
  // chính action này dựng lại từ DB → admin thấy luôn bản mới.
  updateTag(SITE_KNOWLEDGE_TAG)
  const k = await getSiteKnowledge()
  return {
    chars: k.text.length,
    pages: (k.text.match(/^### /gm) ?? []).length,
    builtAt: k.builtAt,
    preview: k.text,
  }
}


// ───────────────────────── Khóa API của chatbot (OpenAI / Anthropic) ─────────────────────────
// Khóa lưu ở ai_settings (RLS: chỉ quản trị viên). Các hàm dưới KHÔNG BAO GIỜ trả khóa về trình duyệt, chỉ trả trạng thái
// và 4 ký tự cuối. Quyền được kiểm bằng chính RLS: người không phải quản trị đọc ai_settings sẽ không thấy dòng nào.

export type AiKeyStatus = { provider: ChatProvider; source: 'db' | 'env' | null; last4: string | null }

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Chưa đăng nhập' }
  const { data } = await supabase.from('ai_settings').select('id').eq('id', 1).maybeSingle()
  if (!data) return { ok: false as const, error: 'Chỉ quản trị viên mới được quản lý khóa API' }
  return { ok: true as const, supabase, user }
}

export async function getAiKeyStatuses(): Promise<AiKeyStatus[] | { error: string }> {
  const a = await requireAdmin()
  if (!a.ok) return { error: a.error }
  const { data } = await a.supabase.from('ai_settings').select('openai_api_key, anthropic_api_key').eq('id', 1).maybeSingle()
  const row = (data ?? {}) as Record<string, string | null>
  return CHAT_PROVIDERS.map((p) => {
    const v = row[KEY_COLUMN[p.value]]
    if (typeof v === 'string' && v.trim()) return { provider: p.value, source: 'db' as const, last4: last4(v.trim()) }
    const env = process.env[p.value === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY']?.trim()
    return env ? { provider: p.value, source: 'env' as const, last4: last4(env) } : { provider: p.value, source: null, last4: null }
  })
}

export async function saveAiKey(provider: ChatProvider, key: string): Promise<{ ok: true; last4: string } | { error: string }> {
  const a = await requireAdmin()
  if (!a.ok) return { error: a.error }
  if (!CHAT_PROVIDERS.some((p) => p.value === provider)) return { error: 'Nhà cung cấp không hợp lệ' }
  const k = typeof key === 'string' ? key.trim() : ''
  if (!looksLikeKey(provider, k)) {
    const hint = CHAT_PROVIDERS.find((p) => p.value === provider)?.keyHint
    return { error: `Khóa không đúng dạng (phải bắt đầu bằng ${hint?.replace('...', '')} và không có khoảng trắng).` }
  }
  const { error } = await a.supabase.from('ai_settings').update({ [KEY_COLUMN[provider]]: k, updated_by: a.user.id }).eq('id', 1)
  if (error) return { error: error.message }
  clearAiKeyCache()
  revalidatePath('/admin-cls/ai')
  return { ok: true, last4: last4(k) }
}

export async function removeAiKey(provider: ChatProvider): Promise<{ ok: true } | { error: string }> {
  const a = await requireAdmin()
  if (!a.ok) return { error: a.error }
  if (!CHAT_PROVIDERS.some((p) => p.value === provider)) return { error: 'Nhà cung cấp không hợp lệ' }
  const { error } = await a.supabase.from('ai_settings').update({ [KEY_COLUMN[provider]]: null, updated_by: a.user.id }).eq('id', 1)
  if (error) return { error: error.message }
  clearAiKeyCache()
  revalidatePath('/admin-cls/ai')
  return { ok: true }
}

/**
 * Gọi thử 1 câu rất ngắn để biết khóa + model có chạy không.
 * `key` để trống = thử khóa đã lưu (hoặc khóa của hệ thống); có `key` = thử khóa vừa gõ, CHƯA lưu.
 */
export async function testAiConnection(input: {
  provider: ChatProvider
  model: string
  key?: string
}): Promise<{ ok: true; ms: number; message: string } | { ok: false; message: string }> {
  const a = await requireAdmin()
  if (!a.ok) return { ok: false, message: a.error }
  if (!CHAT_PROVIDERS.some((p) => p.value === input.provider)) return { ok: false, message: 'Nhà cung cấp không hợp lệ' }
  if (!isValidModelId(input.model)) return { ok: false, message: 'Tên model không hợp lệ' }

  const typed = input.key?.trim()
  let apiKey: string | null = null
  if (typed) {
    if (!looksLikeKey(input.provider, typed)) return { ok: false, message: 'Khóa không đúng dạng của nhà cung cấp đã chọn' }
    apiKey = typed
  } else {
    apiKey = (await getAiKeyInfo(input.provider)).key
  }
  if (!apiKey) return { ok: false, message: 'Chưa có khóa để thử. Nhập khóa rồi bấm lại.' }

  const r = await pingModel({ provider: input.provider, apiKey, model: input.model })
  if (!r.ok) return { ok: false, message: explainLlmError(r.kind, input.provider) }
  return { ok: true, ms: r.ms, message: `Kết nối tốt, model trả lời trong ${(r.ms / 1000).toFixed(1)} giây.` }
}
