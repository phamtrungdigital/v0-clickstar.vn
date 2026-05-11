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
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' as const, settings: null }
  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  const settings = data as AiSettings | null
  if (!settings?.enabled)
    return { error: 'AI chưa được kích hoạt. Vào /admin/ai để bật.', settings: null }
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

/** Uses blog_* config (recommend Claude Opus 4.7 in /admin/ai → tab Viết bài blog) */
export async function generateBlogPost(
  topic: string
): Promise<{ post?: GeneratedPost; error?: string }> {
  const { error, settings } = await getSettings()
  if (error || !settings) return { error: error || 'no_settings' }

  const apiKey =
    settings.blog_provider === 'anthropic'
      ? settings.anthropic_api_key
      : settings.openai_api_key
  if (!apiKey) return { error: `Chưa có ${settings.blog_provider} API key` }
  if (!settings.blog_model) return { error: 'Chưa chọn blog model. Vào /admin/ai → Viết bài blog' }

  const minWords = Math.max(400, settings.blog_target_words - 200)
  const maxWords = settings.blog_target_words + 300

  const baseSystem =
    settings.blog_system_prompt ||
    'You are an expert blog writer for ClickStar — a Vietnamese digital marketing & technology agency.'

  const systemPrompt = `${baseSystem}

You are writing a long-form blog post. You MUST return ONLY valid JSON — no preamble, no markdown fences, no explanation outside JSON.

JSON schema (return exactly these 6 keys):
{
  "title_vi": "Tiêu đề tiếng Việt — hấp dẫn, đầy đủ keyword SEO",
  "title_en": "English title — engaging, SEO-friendly",
  "excerpt_vi": "Tóm tắt VN 1-2 câu (~150 ký tự)",
  "excerpt_en": "English excerpt 1-2 sentences (~150 chars)",
  "content_vi": "Toàn bộ bài viết tiếng Việt dạng Markdown. intro + 3-5 mục H2 (## ...) + bullet list khi cần + conclusion. Mục tiêu ${settings.blog_target_words} từ (tối thiểu ${minWords}, tối đa ${maxWords}).",
  "content_en": "Full English blog post in Markdown — mirror VI structure. Target ${settings.blog_target_words} words."
}

IMPORTANT:
- Content MUST be in Markdown.
- Both VI and EN versions cover the same topics in parallel.
- Output ONLY the JSON object — no text before or after.`

  const userPrompt = `Chủ đề bài viết: ${topic}`

  try {
    const raw =
      settings.blog_provider === 'anthropic'
        ? await generateWithAnthropic({
            apiKey,
            model: settings.blog_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 4096,
            temperature: 0.7,
          })
        : await generateWithOpenAI({
            apiKey,
            model: settings.blog_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 4096,
            temperature: 0.7,
          })

    const jsonText = extractJson(raw)
    const parsed = JSON.parse(jsonText) as GeneratedPost

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
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenceMatch) return fenceMatch[1]
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  return text
}

/** Uses image_* config (OpenAI gpt-image-1 by default) */
export async function generatePostCoverImage(
  prompt: string
): Promise<{ url?: string; error?: string }> {
  const { error, settings } = await getSettings()
  if (error || !settings) return { error: error || 'no_settings' }
  if (!settings.openai_api_key) {
    return { error: 'Image generation cần OpenAI API key. Vào /admin/ai dán key.' }
  }

  const finalPrompt = settings.image_style_prefix
    ? `${prompt}\n\nStyle hints: ${settings.image_style_prefix}`
    : prompt

  try {
    const b64 = await generateImageWithOpenAI({
      apiKey: settings.openai_api_key,
      prompt: finalPrompt,
      model: settings.image_model,
      size: settings.image_size,
      quality: settings.image_quality,
    })

    const buffer = Buffer.from(b64, 'base64')
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
