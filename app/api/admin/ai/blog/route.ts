import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWithAnthropic, generateWithOpenAI } from '@/lib/ai/providers'
import type { AiSettings } from '@/lib/ai/settings'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

type GeneratedPost = {
  title_vi: string
  title_en: string
  excerpt_vi: string
  excerpt_en: string
  content_vi: string
  content_en: string
}

function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenceMatch) return fenceMatch[1]
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  return text
}

export async function POST(req: Request) {
  try {
    const { topic } = (await req.json()) as { topic?: string }
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return NextResponse.json({ error: 'Thiếu chủ đề bài viết' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    const { data } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    const settings = data as AiSettings | null
    if (!settings?.enabled) {
      return NextResponse.json(
        { error: 'AI chưa được kích hoạt. Vào /admin/ai để bật.' },
        { status: 400 }
      )
    }

    const apiKey =
      settings.blog_provider === 'anthropic'
        ? settings.anthropic_api_key
        : settings.openai_api_key
    if (!apiKey) {
      return NextResponse.json(
        { error: `Chưa có ${settings.blog_provider} API key` },
        { status: 400 }
      )
    }
    if (!settings.blog_model) {
      return NextResponse.json(
        { error: 'Chưa chọn blog model. Vào /admin/ai → Viết bài blog' },
        { status: 400 }
      )
    }

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

    const raw =
      settings.blog_provider === 'anthropic'
        ? await generateWithAnthropic({
            apiKey,
            model: settings.blog_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 16384,
            temperature: 0.7,
          })
        : await generateWithOpenAI({
            apiKey,
            model: settings.blog_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 16384,
            temperature: 0.7,
          })

    const jsonText = extractJson(raw)
    let parsed: GeneratedPost
    try {
      parsed = JSON.parse(jsonText) as GeneratedPost
    } catch (parseErr: any) {
      const truncated = !jsonText.trimEnd().endsWith('}')
      const hint = truncated
        ? `AI đã trả về output dài hơn giới hạn → JSON bị cắt cuối. Thử giảm "Số từ mục tiêu" trong /admin/ai → Viết bài blog (đang là ${settings.blog_target_words}, thử 800-1000), hoặc đổi sang Claude Sonnet 4.6 / Haiku 4.5.`
        : `AI trả JSON không hợp lệ. Thử lại — nếu lặp lại, đổi model trong /admin/ai → Viết bài blog.`
      return NextResponse.json(
        { error: `${parseErr.message}. ${hint}` },
        { status: 422 }
      )
    }

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
        return NextResponse.json(
          { error: `JSON thiếu field "${k}". Thử lại?` },
          { status: 422 }
        )
      }
    }

    return NextResponse.json({ post: parsed })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Generation failed' },
      { status: 500 }
    )
  }
}
