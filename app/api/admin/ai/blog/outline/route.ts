import { NextResponse } from 'next/server'
import { generateWithOpenAI } from '@/lib/ai/providers'
import { STYLE_PROMPT_HINTS, type BlogStyle } from '@/lib/ai/settings'
import { loadAiContext, missingKeyMessage } from '@/lib/ai/route-context'
import { callClaude } from '@/lib/ai/claude'

export const runtime = 'nodejs'
export const maxDuration = 120
export const dynamic = 'force-dynamic'

export type BlogOutline = {
  title_vi: string
  title_en: string
  sections: Array<{ heading_vi: string; heading_en: string; summary_vi: string }>
}

const OUTLINE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title_vi', 'title_en', 'sections'],
  properties: {
    title_vi: { type: 'string' },
    title_en: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['heading_vi', 'heading_en', 'summary_vi'],
        properties: {
          heading_vi: { type: 'string' },
          heading_en: { type: 'string' },
          summary_vi: { type: 'string' },
        },
      },
    },
  },
}

function extractJson(text: string): string {
  // 1. Prefer explicit ```json fence (only that, not ```python or other).
  const jsonFence = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonFence) return jsonFence[1]
  // 2. Raw outermost { ... } block — most reliable.
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  // 3. Last resort: any fence.
  const anyFence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (anyFence) return anyFence[1]
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
    if (topic.length > 500 || (body.keyword?.length ?? 0) > 150) {
      return NextResponse.json({ error: 'Chủ đề hoặc từ khoá quá dài' }, { status: 400 })
    }

    const ctx = await loadAiContext()
    if (!ctx.ok) return NextResponse.json({ error: ctx.error }, { status: ctx.status })
    const settings = ctx.settings

    const apiKey = ctx.keyFor(settings.blog_provider)
    if (!apiKey) {
      return NextResponse.json({ error: missingKeyMessage(settings.blog_provider) }, { status: 400 })
    }

    const styleHint = body.style ? (STYLE_PROMPT_HINTS[body.style] ?? '') : ''
    const targetWords = body.targetWords || settings.blog_target_words || 1200
    const keyword = body.keyword?.trim() || ''

    const systemPrompt = `You are an expert blog content strategist for ClickStar, a Vietnamese digital marketing & technology agency.

Generate a JSON outline (NOT the full article) for a blog post. Return ONLY JSON, no markdown fences:
{
  "title_vi": "Tiêu đề tiếng Việt, hấp dẫn, có keyword SEO",
  "title_en": "English title, engaging, SEO-friendly",
  "sections": [
    {
      "heading_vi": "Đoạn mở (Introduction)",
      "heading_en": "Introduction",
      "summary_vi": "1 câu mô tả sẽ viết gì trong đoạn này"
    },
    ... (5-7 sections total: intro + 3-5 main H2 + conclusion)
  ]
}

${styleHint ? `STYLE: ${styleHint}\n\n` : ''}${keyword ? `PRIMARY SEO KEYWORD: "${keyword}": must appear in title_vi, title_en, and at least 2 section headings.\n\n` : ''}TARGET LENGTH: ${targetWords} words total (full article when written from this outline).

Sections should logically flow. Each summary_vi should give a clear preview of WHAT will be covered (not just topic name).`

    const userPrompt = `Chủ đề: ${topic}`

    const raw =
      settings.blog_provider === 'anthropic'
        ? (
            await callClaude({
              apiKey,
              model: settings.blog_model,
              system: systemPrompt,
              prompt: userPrompt,
              maxTokens: 16000,
              effort: 'medium',
              jsonSchema: OUTLINE_SCHEMA,
              signal: req.signal,
            })
          ).text
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'lỗi'
      return NextResponse.json({ error: `Đọc JSON dàn ý lỗi: ${msg}` }, { status: 422 })
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
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Tạo dàn ý thất bại' },
      { status: 500 }
    )
  }
}
