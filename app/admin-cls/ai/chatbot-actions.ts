'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { runServiceRouter } from '@/lib/ai/chatbot-run'
import type { ChatbotSettingsUpdate, WidgetMode, QuickPrompt } from '@/lib/cms/chatbot-shared'

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
    model: typeof input.model === 'string' && input.model.trim() ? input.model.trim() : 'gpt-4o-mini',
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
    .select('enabled, system_prompt, model')
    .eq('id', 1)
    .maybeSingle()

  if (cfg && cfg.enabled === false) {
    return { error: 'Bot đang TẮT — bật lại + lưu rồi test (test vẫn chạy được nhưng nhắc anh).' }
  }

  const result = await runServiceRouter({
    query,
    systemPrompt: cfg?.system_prompt ?? null,
    model: cfg?.model ?? null,
  })
  if (!result.ok) return { error: result.error }
  return { answer: result.answer, links: result.links }
}
