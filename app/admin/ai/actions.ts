'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  generateWithAnthropic,
  generateWithOpenAI,
  type GenerateOpts,
} from '@/lib/ai/providers'
import type {
  AiProvider,
  AiSettings,
  ImageModel,
  ImageQuality,
  ImageSize,
} from '@/lib/ai/settings'

export type SaveAiSettingsInput = {
  enabled: boolean
  anthropic_api_key: string | null
  openai_api_key: string | null

  inline_provider: AiProvider
  inline_model: string
  inline_system_prompt: string

  blog_provider: AiProvider
  blog_model: string
  blog_system_prompt: string
  blog_target_words: number

  image_model: ImageModel
  image_size: ImageSize
  image_quality: ImageQuality
  image_style_prefix: string
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
  fieldLabel?: string
  currentValue?: string
  pageContext?: string
  maxTokens?: number
}

export type GenerateResult = { text?: string; error?: string }

/** Inline ✨ AI on field — uses inline_* config */
export async function generateText(input: GenerateInput): Promise<GenerateResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  const { data: settings } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  const s = settings as AiSettings | null
  if (!s) return { error: 'Chưa init ai_settings' }
  if (!s.enabled) return { error: 'AI chưa bật. Vào /admin/ai để cấu hình + bật.' }

  const lang = input.language || 'vi'
  const langLabel = lang === 'vi' ? 'tiếng Việt' : 'English'

  const systemBase =
    s.inline_system_prompt ||
    'You are a content writer for ClickStar.'
  const system = `${systemBase}\n\nIMPORTANT: Trả về CHỈ nội dung được yêu cầu (${langLabel}). KHÔNG markdown, KHÔNG nháy kép, KHÔNG giải thích thêm.`

  const parts: string[] = []
  if (input.pageContext) parts.push(`Ngữ cảnh trang: ${input.pageContext}`)
  if (input.fieldLabel) parts.push(`Field cần viết: ${input.fieldLabel}`)
  if (input.currentValue) parts.push(`Hiện đang là: "${input.currentValue}"`)
  parts.push(`Yêu cầu của user: ${input.prompt}`)
  parts.push(`Ngôn ngữ output: ${langLabel}`)
  const userPrompt = parts.join('\n\n')

  const apiKey =
    s.inline_provider === 'anthropic' ? s.anthropic_api_key : s.openai_api_key
  if (!apiKey) return { error: `Chưa có API key cho ${s.inline_provider}` }

  const opts: GenerateOpts = {
    apiKey,
    model: s.inline_model,
    system,
    prompt: userPrompt,
    maxTokens: input.maxTokens ?? 512,
  }

  try {
    const text =
      s.inline_provider === 'anthropic'
        ? await generateWithAnthropic(opts)
        : await generateWithOpenAI(opts)
    return { text }
  } catch (err: any) {
    return { error: err?.message || 'Lỗi không xác định' }
  }
}

export async function testInlineConnection(): Promise<GenerateResult> {
  return generateText({
    prompt: 'Viết 1 câu chào ngắn (5-8 từ) chứng minh API call thành công.',
    maxTokens: 64,
  })
}

/** Test a specific provider API key without saving — uses CURRENT input value */
export async function testProviderApiKey(
  provider: AiProvider,
  apiKey: string
): Promise<{ ok?: boolean; message?: string; error?: string }> {
  if (!apiKey?.trim()) return { error: 'Chưa nhập API key' }

  try {
    if (provider === 'anthropic') {
      const { generateWithAnthropic } = await import('@/lib/ai/providers')
      const text = await generateWithAnthropic({
        apiKey,
        model: 'claude-haiku-4-5-20251001',
        system: 'You are a helpful assistant.',
        prompt: 'Trả lời 1 từ "OK" để xác nhận API hoạt động.',
        maxTokens: 16,
      })
      return { ok: true, message: `✓ Anthropic OK — Claude trả lời: "${text.trim().slice(0, 50)}"` }
    } else {
      const { generateWithOpenAI } = await import('@/lib/ai/providers')
      const text = await generateWithOpenAI({
        apiKey,
        model: 'gpt-4o-mini',
        system: 'You are a helpful assistant.',
        prompt: 'Trả lời 1 từ "OK" để xác nhận API hoạt động.',
        maxTokens: 16,
      })
      return { ok: true, message: `✓ OpenAI OK — GPT trả lời: "${text.trim().slice(0, 50)}"` }
    }
  } catch (err: any) {
    return { error: err?.message || 'Test failed' }
  }
}

/** Test OpenAI Images API separately (cần credit riêng) */
export async function testOpenAiImagesApi(
  apiKey: string
): Promise<{ ok?: boolean; message?: string; error?: string }> {
  if (!apiKey?.trim()) return { error: 'Chưa nhập OpenAI API key' }

  try {
    const { generateImageWithOpenAI } = await import('@/lib/ai/providers')
    const b64 = await generateImageWithOpenAI({
      apiKey,
      prompt: 'A small blue checkmark on white background — test',
      model: 'gpt-image-1',
      size: '1024x1024',
      quality: 'low',
    })
    return {
      ok: true,
      message: `✓ OpenAI Images OK — gen ${Math.round(b64.length / 1024)} KB ảnh test`,
    }
  } catch (err: any) {
    return { error: err?.message || 'Image test failed' }
  }
}

export async function testImageConnection(): Promise<{ url?: string; error?: string }> {
  // Quick test: generate a tiny test image
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  const { data: settings } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  const s = settings as AiSettings | null
  if (!s?.enabled) return { error: 'AI chưa bật' }
  if (!s.openai_api_key) return { error: 'Chưa có OpenAI API key' }

  try {
    const { generateImageWithOpenAI } = await import('@/lib/ai/providers')
    const b64 = await generateImageWithOpenAI({
      apiKey: s.openai_api_key,
      prompt: 'Simple blue gradient with a checkmark — test image',
      model: s.image_model,
      size: '1024x1024',
      quality: 'low',
    })
    return { url: `data:image/png;base64,${b64.slice(0, 100)}...(truncated, full image works)` }
  } catch (err: any) {
    return { error: err?.message || 'Image test failed' }
  }
}
