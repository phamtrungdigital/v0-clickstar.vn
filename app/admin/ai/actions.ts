'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  generateWithAnthropic,
  generateWithOpenAI,
  type GenerateOpts,
} from '@/lib/ai/providers'
import type { AiProvider, AiSettings } from '@/lib/ai/settings'

export type SaveAiSettingsInput = {
  provider: AiProvider
  anthropic_api_key: string | null
  openai_api_key: string | null
  default_model: string
  enabled: boolean
  system_prompt: string
}

export async function saveAiSettings(input: SaveAiSettingsInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const { error } = await supabase
    .from('ai_settings')
    .update({ ...input, updated_by: user.id })
    .eq('id', 1)

  if (error) return { error: error.message }
  revalidatePath('/admin/ai')
  return { ok: true }
}

export type GenerateInput = {
  prompt: string
  language?: 'vi' | 'en'
  fieldLabel?: string // e.g. "Hero heading"
  currentValue?: string // existing value (refine vs create)
  pageContext?: string // e.g. "Trang chủ" or "Dịch vụ Dashboard"
  maxTokens?: number
}

export type GenerateResult = { text?: string; error?: string }

export async function generateText(input: GenerateInput): Promise<GenerateResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  const { data: settings } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  const s = settings as AiSettings | null
  if (!s) return { error: 'Chưa init ai_settings' }
  if (!s.enabled) {
    return { error: 'AI chưa bật. Vào /admin/ai để cấu hình + bật.' }
  }

  const lang = input.language || 'vi'
  const langLabel = lang === 'vi' ? 'tiếng Việt' : 'English'

  const systemBase =
    s.system_prompt ||
    'You are a content writer for ClickStar — a Vietnamese digital marketing & technology agency.'
  const system = `${systemBase}\n\nIMPORTANT: Trả về CHỈ nội dung được yêu cầu (${langLabel}). KHÔNG markdown, KHÔNG nháy kép, KHÔNG giải thích thêm.`

  // Build user prompt
  const parts: string[] = []
  if (input.pageContext) parts.push(`Ngữ cảnh trang: ${input.pageContext}`)
  if (input.fieldLabel) parts.push(`Field cần viết: ${input.fieldLabel}`)
  if (input.currentValue) parts.push(`Hiện đang là: "${input.currentValue}"`)
  parts.push(`Yêu cầu của user: ${input.prompt}`)
  parts.push(`Ngôn ngữ output: ${langLabel}`)
  const userPrompt = parts.join('\n\n')

  const opts: GenerateOpts = {
    apiKey:
      s.provider === 'anthropic' ? (s.anthropic_api_key ?? '') : (s.openai_api_key ?? ''),
    model: s.default_model,
    system,
    prompt: userPrompt,
    maxTokens: input.maxTokens ?? 512,
  }

  if (!opts.apiKey) {
    return { error: `Chưa có API key cho ${s.provider}. Vào /admin/ai để dán key.` }
  }

  try {
    const text =
      s.provider === 'anthropic'
        ? await generateWithAnthropic(opts)
        : await generateWithOpenAI(opts)
    return { text }
  } catch (err: any) {
    return { error: err?.message || 'Lỗi không xác định' }
  }
}

export async function testAiConnection(): Promise<GenerateResult> {
  return generateText({
    prompt: 'Viết 1 câu chào ngắn (5-8 từ) chứng minh API call thành công.',
    maxTokens: 64,
  })
}
