import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWithAnthropic, generateWithOpenAI } from '@/lib/ai/providers'
import type { AiSettings } from '@/lib/ai/settings'
import { STYLE_PROMPT_HINTS, type BlogStyle } from '@/lib/ai/settings'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export type BlogOutline = {
  title_vi: string
  title_en: string
  sections: Array<{ heading_vi: string; heading_en: string; summary_vi: string }>
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
    const body = (await req.json()) as {
      topic?: string
      keyword?: string
      style?: BlogStyle
      targetWords?: number
    }
    const topic = body.topic?.trim()
    if (!topic) {
      return NextResponse.json({ error: 'Thiếu chủ đề bài viết' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
    const settings = data as AiSettings | null
    if (!settings?.enabled) {
      return NextResponse.json({ error: 'AI chưa được kích hoạt' }, { status: 400 })
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

    const styleHint = body.style ? STYLE_PROMPT_HINTS[body.style] : ''
    const targetWords = body.targetWords || settings.blog_target_words || 1200
    const keyword = body.keyword?.trim() || ''

    const systemPrompt = `You are an expert blog content strategist for ClickStar — a Vietnamese digital marketing & technology agency.

Generate a JSON outline (NOT the full article) for a blog post. Return ONLY JSON, no markdown fences:
{
  "title_vi": "Tiêu đề tiếng Việt — hấp dẫn, có keyword SEO",
  "title_en": "English title — engaging, SEO-friendly",
  "sections": [
    {
      "heading_vi": "Đoạn mở (Introduction)",
      "heading_en": "Introduction",
      "summary_vi": "1 câu mô tả sẽ viết gì trong đoạn này"
    },
    ... (5-7 sections total: intro + 3-5 main H2 + conclusion)
  ]
}

${styleHint ? `STYLE: ${styleHint}\n\n` : ''}${keyword ? `PRIMARY SEO KEYWORD: "${keyword}" — must appear in title_vi, title_en, and at least 2 section headings.\n\n` : ''}TARGET LENGTH: ${targetWords} words total (full article when written from this outline).

Sections should logically flow. Each summary_vi should give a clear preview of WHAT will be covered (not just topic name).`

    const userPrompt = `Chủ đề: ${topic}`

    const raw =
      settings.blog_provider === 'anthropic'
        ? await generateWithAnthropic({
            apiKey,
            model: settings.blog_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 2048,
          })
        : await generateWithOpenAI({
            apiKey,
            model: settings.blog_model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 2048,
            temperature: 0.7,
          })

    const jsonText = extractJson(raw)
    let parsed: BlogOutline
    try {
      parsed = JSON.parse(jsonText)
    } catch (e: any) {
      return NextResponse.json({ error: `JSON parse: ${e.message}` }, { status: 422 })
    }

    if (
      !parsed.title_vi ||
      !parsed.title_en ||
      !Array.isArray(parsed.sections) ||
      parsed.sections.length < 3
    ) {
      return NextResponse.json(
        { error: 'AI trả outline thiếu field hoặc < 3 sections' },
        { status: 422 }
      )
    }

    return NextResponse.json({ outline: parsed })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Outline generation failed' },
      { status: 500 }
    )
  }
}
