'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  generateWithAnthropic,
  generateWithOpenAI,
  type GenerateOpts,
} from '@/lib/ai/providers'
import { requireAdmin, requireContentEditor } from '@/lib/ai/admin-guard'
import {
  isMaskedKey,
  normalizeKeyInput,
  resolveApiKey,
  type AiProvider,
  type AiSettings,
  type ImageModel,
  type ImageQuality,
  type ImageSize,
} from '@/lib/ai/settings'

export type SaveAiSettingsInput = {
  enabled: boolean
  /** "••••abcd" = giữ key cũ trong DB; null = xoá; chuỗi khác = key mới. */
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

  body_image_model: ImageModel
  body_image_size: ImageSize
  body_image_quality: ImageQuality
  body_image_style_prefix: string
}

const SETTINGS_FIELDS = [
  'enabled',
  'inline_provider',
  'inline_model',
  'inline_system_prompt',
  'blog_provider',
  'blog_model',
  'blog_system_prompt',
  'blog_target_words',
  'image_model',
  'image_size',
  'image_quality',
  'image_style_prefix',
  'body_image_model',
  'body_image_size',
  'body_image_quality',
  'body_image_style_prefix',
] as const satisfies ReadonlyArray<keyof SaveAiSettingsInput>

async function readSettings(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  return data as AiSettings | null
}

export async function saveAiSettings(input: SaveAiSettingsInput) {
  const supabase = await createClient()
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return { error: guard.error }

  // Chỉ nhận đúng các cột cấu hình (không để client ghi cột khác như id, updated_at).
  const patch: Record<string, unknown> = { updated_by: guard.profile.user_id }
  for (const k of SETTINGS_FIELDS) if (k in input) patch[k] = input[k]
  // Key đang ở dạng che → không ghi đè (giữ key thật trong DB).
  const { anthropic_api_key, openai_api_key } = input
  if (!isMaskedKey(anthropic_api_key)) patch.anthropic_api_key = normalizeKeyInput(anthropic_api_key)
  if (!isMaskedKey(openai_api_key)) patch.openai_api_key = normalizeKeyInput(openai_api_key)

  const { error } = await supabase.from('ai_settings').update(patch).eq('id', 1)

  if (error) return { error: error.message }
  revalidatePath('/admin-cls/ai')
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
  const guard = await requireContentEditor(supabase)
  if (!guard.ok) return { error: guard.error }

  if (
    (input.prompt?.length ?? 0) > 4000 ||
    (input.currentValue?.length ?? 0) > 20000 ||
    (input.pageContext?.length ?? 0) > 4000 ||
    (input.fieldLabel?.length ?? 0) > 200
  ) {
    return { error: 'Nội dung gửi lên quá dài' }
  }
  const s = await readSettings(supabase)
  if (!s) return { error: 'Chưa khởi tạo cấu hình AI' }
  if (!s.enabled) return { error: 'AI chưa bật. Vào Cài đặt AI để cấu hình và bật.' }

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

  const apiKey = resolveApiKey(s, s.inline_provider)
  if (!apiKey) return { error: `Chưa có API key cho ${s.inline_provider}` }

  const opts: GenerateOpts = {
    apiKey,
    model: s.inline_model,
    system,
    prompt: userPrompt,
    maxTokens: Math.min(Math.max(input.maxTokens ?? 512, 16), 4096),
  }

  try {
    const text =
      s.inline_provider === 'anthropic'
        ? await generateWithAnthropic(opts)
        : await generateWithOpenAI(opts)
    return { text }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Lỗi không xác định' }
  }
}

export async function testInlineConnection(): Promise<GenerateResult> {
  return generateText({
    prompt: 'Viết 1 câu chào ngắn (5-8 từ) chứng minh API call thành công.',
    maxTokens: 64,
  })
}

/**
 * Key để test: ô nhập còn dạng che hoặc trống → dùng key đang lưu (DB, rồi env);
 * admin vừa dán key mới → test đúng key đó (chưa cần lưu).
 */
async function keyForTest(provider: AiProvider, typed: string) {
  const supabase = await createClient()
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return { error: guard.error }
  const value = normalizeKeyInput(typed)
  if (value && !isMaskedKey(value)) return { key: value }
  const stored = resolveApiKey(await readSettings(supabase), provider)
  return stored ? { key: stored } : { error: 'Chưa nhập API key' }
}

/** Test a specific provider API key without saving */
export async function testProviderApiKey(
  provider: AiProvider,
  apiKey: string
): Promise<{ ok?: boolean; message?: string; error?: string }> {
  const k = await keyForTest(provider, apiKey)
  if (!k.key) return { error: k.error }

  try {
    if (provider === 'anthropic') {
      const text = await generateWithAnthropic({
        apiKey: k.key,
        model: 'claude-haiku-5-5',
        system: 'You are a helpful assistant.',
        prompt: 'Trả lời 1 từ "OK" để xác nhận API hoạt động.',
        maxTokens: 16,
      })
      return { ok: true, message: `✓ Anthropic OK, Claude trả lời: "${text.trim().slice(0, 50)}"` }
    } else {
      const text = await generateWithOpenAI({
        apiKey: k.key,
        model: 'gpt-4o-mini',
        system: 'You are a helpful assistant.',
        prompt: 'Trả lời 1 từ "OK" để xác nhận API hoạt động.',
        maxTokens: 16,
      })
      return { ok: true, message: `✓ OpenAI OK, GPT trả lời: "${text.trim().slice(0, 50)}"` }
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Test thất bại' }
  }
}

/** Test OpenAI Images API separately (cần credit riêng) */
export async function testOpenAiImagesApi(
  apiKey: string
): Promise<{ ok?: boolean; message?: string; error?: string }> {
  const k = await keyForTest('openai', apiKey)
  if (!k.key) return { error: k.error }

  try {
    const { generateImageWithOpenAI } = await import('@/lib/ai/providers')
    const b64 = await generateImageWithOpenAI({
      apiKey: k.key,
      prompt: 'A small blue checkmark on white background, test',
      model: 'gpt-image-1',
      size: '1024x1024',
      quality: 'low',
    })
    return {
      ok: true,
      message: `✓ OpenAI Images OK, tạo được ảnh thử ${Math.round(b64.length / 1024)} KB`,
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Test ảnh thất bại' }
  }
}
