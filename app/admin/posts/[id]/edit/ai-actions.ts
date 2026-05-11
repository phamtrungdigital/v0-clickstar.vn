'use server'

import { createClient } from '@/lib/supabase/server'
import {
  generateWithAnthropic,
  generateWithOpenAI,
  generateImageWithOpenAI,
} from '@/lib/ai/providers'
import type { AiSettings } from '@/lib/ai/settings'

async function getSettings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' as const, settings: null }
  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  const settings = data as AiSettings | null
  if (!settings?.enabled) return { error: 'AI chưa được kích hoạt. Vào /admin/ai để bật.', settings: null }
  return { error: null, settings }
}

export type GeneratedPost = {
  title_vi: string
  title_en: string
  excerpt_vi: string
  excerpt_en: string
  content_vi: string
  content_en: string
}

/**
 * Generate full blog post (title + excerpt + content, bilingual) from a topic prompt.
 * Uses Claude (recommended) or OpenAI based on saved settings.
 */
export async function generateBlogPost(
  topic: string
): Promise<{ post?: GeneratedPost; error?: string }> {
  const { error, settings } = await getSettings()
  if (error || !settings) return { error: error || 'no_settings' }

  const apiKey =
    settings.provider === 'anthropic'
      ? settings.anthropic_api_key
      : settings.openai_api_key
  if (!apiKey) return { error: `Chưa có ${settings.provider} API key` }

  const systemPrompt = `${settings.system_prompt || 'You are a blog content writer.'}

You are writing a long-form blog post for ClickStar (Vietnamese digital marketing & technology agency).
You MUST return ONLY valid JSON — no preamble, no markdown fences, no explanation outside JSON.

JSON schema (return exactly these 6 keys):
{
  "title_vi": "Tiêu đề tiếng Việt — hấp dẫn, đầy đủ keyword SEO",
  "title_en": "English title — engaging, SEO-friendly",
  "excerpt_vi": "Tóm tắt VN 1-2 câu (~150 ký tự)",
  "excerpt_en": "English excerpt 1-2 sentences (~150 chars)",
  "content_vi": "Toàn bộ bài viết tiếng Việt dạng Markdown. Bao gồm: intro (1 đoạn), 3-5 mục H2 (## ...), mỗi mục có 2-3 đoạn + bullet list khi cần, conclusion. Tối thiểu 800 từ.",
  "content_en": "Full English blog post in Markdown — mirror VI structure. Min 800 words."
}

IMPORTANT:
- Content MUST be in Markdown (use ##, ###, **bold**, lists, etc.)
- Both VI and EN versions must cover the same topics in parallel.
- Output ONLY the JSON object — no text before or after.`

  const userPrompt = `Chủ đề bài viết: ${topic}`

  try {
    const raw =
      settings.provider === 'anthropic'
        ? await generateWithAnthropic({
            apiKey,
            model: settings.default_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 4096,
            temperature: 0.7,
          })
        : await generateWithOpenAI({
            apiKey,
            model: settings.default_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 4096,
            temperature: 0.7,
          })

    // Extract JSON: model may sometimes wrap in ```json ... ``` fences
    const jsonText = extractJson(raw)
    const parsed = JSON.parse(jsonText) as GeneratedPost

    // Validate
    const required = [
      'title_vi',
      'title_en',
      'excerpt_vi',
      'excerpt_en',
      'content_vi',
      'content_en',
    ] as const
    for (const k of required) {
      if (typeof parsed[k] !== 'string') {
        return { error: `JSON thiếu field "${k}". Thử lại?` }
      }
    }

    return { post: parsed }
  } catch (err: any) {
    return { error: err?.message || 'Generation failed' }
  }
}

function extractJson(text: string): string {
  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenceMatch) return fenceMatch[1]
  // Otherwise find first { ... last } pair
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1)
  }
  return text
}

/**
 * Generate cover image with OpenAI gpt-image-1, upload to Supabase Storage,
 * and return the public URL.
 */
export async function generatePostCoverImage(
  prompt: string
): Promise<{ url?: string; error?: string }> {
  const { error, settings } = await getSettings()
  if (error || !settings) return { error: error || 'no_settings' }
  if (!settings.openai_api_key) {
    return { error: 'Image generation cần OpenAI API key. Vào /admin/ai dán key.' }
  }

  try {
    const b64 = await generateImageWithOpenAI({
      apiKey: settings.openai_api_key,
      prompt,
      model: 'gpt-image-1',
      size: '1536x1024',
      quality: 'high',
    })

    // Decode base64 → buffer
    const buffer = Buffer.from(b64, 'base64')

    // Upload to Supabase Storage
    const supabase = await createClient()
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`
    const path = `cms/ai-generated/${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, buffer, {
        contentType: 'image/png',
        cacheControl: '31536000',
        upsert: false,
      })

    if (uploadError) return { error: `Upload lỗi: ${uploadError.message}` }

    const { data } = supabase.storage.from('media').getPublicUrl(path)
    return { url: data.publicUrl }
  } catch (err: any) {
    return { error: err?.message || 'Image generation failed' }
  }
}
