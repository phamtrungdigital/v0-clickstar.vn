import type { BlogStyle } from '@/lib/ai/settings'
import { STYLE_PROMPT_HINTS } from '@/lib/ai/settings'
import { loadAiContext, missingKeyMessage } from '@/lib/ai/route-context'
import { sseResponse } from '@/lib/ai/sse'
import { callClaude } from '@/lib/ai/claude'
import { STYLE_RULES_VI } from '@/lib/ai/content-rules'

export const runtime = 'nodejs'
export const maxDuration = 300
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
  // 1. Prefer explicit ```json fence (only that, not ```python or other).
  const jsonFence = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonFence) return jsonFence[1]
  // 2. Raw outermost { ... } block — most reliable when AI returns clean JSON
  //    or wraps it in conversational text. Works even if content_vi/content_en
  //    contains other fenced code blocks (```python, ```js etc).
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  // 3. Last resort: any fence (could be wrong if content has ```python etc).
  const anyFence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (anyFence) return anyFence[1]
  return text
}

const POST_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title_vi', 'title_en', 'excerpt_vi', 'excerpt_en', 'content_vi', 'content_en'],
  properties: {
    title_vi: { type: 'string' },
    title_en: { type: 'string' },
    excerpt_vi: { type: 'string' },
    excerpt_en: { type: 'string' },
    content_vi: { type: 'string' },
    content_en: { type: 'string' },
  },
}

type BlogBody = {
  topic?: string
  keyword?: string
  style?: BlogStyle
  targetWords?: number
  outline?: {
    title_vi: string
    title_en: string
    sections: Array<{ heading_vi: string; heading_en: string; summary_vi: string }>
  }
  includeImages?: boolean
}

// Streaming SSE so the function stays alive while the model writes (up to 5 min).
export async function POST(req: Request) {
  return sseResponse(
    async (send) => {
      const body = (await req.json()) as BlogBody
      const topic = body.topic?.trim()
      if (!topic) {
        send('error', { error: 'Thiếu chủ đề bài viết' })
        return
      }
      if (topic.length > 500 || (body.keyword?.length ?? 0) > 150 || (body.outline?.sections?.length ?? 0) > 12) {
        send('error', { error: 'Chủ đề, từ khoá hoặc dàn ý quá dài' })
        return
      }
      const keyword = body.keyword?.trim() || ''
      const style = body.style
      const outline = body.outline
      const includeImages = body.includeImages !== false // default true

      const ctx = await loadAiContext()
      if (!ctx.ok) {
        send('error', { error: ctx.error })
        return
      }
      const settings = ctx.settings
      const apiKey = ctx.keyFor(settings.blog_provider)
      if (!apiKey) {
        send('error', { error: missingKeyMessage(settings.blog_provider) })
        return
      }
      if (!settings.blog_model) {
        send('error', { error: 'Chưa chọn model viết bài. Vào Cài đặt AI → Viết bài blog' })
        return
      }

      const effectiveWords = Math.min(3000, Math.max(300, body.targetWords || settings.blog_target_words || 1200))
      const minWords = Math.max(400, Math.round(effectiveWords * 0.9))
      const maxWords = Math.round(effectiveWords * 1.2)

      // Compute realistic per-section structure based on length.
      // AI tends to under-write — be EXPLICIT about section count + words/section.
      let sectionCount: number
      let wordsPerSection: number
      let paragraphsPerSection: string
      if (effectiveWords <= 600) {
        sectionCount = 3
        wordsPerSection = 150
        paragraphsPerSection = '1-2 đoạn'
      } else if (effectiveWords <= 1200) {
        sectionCount = 4
        wordsPerSection = 250
        paragraphsPerSection = '2-3 đoạn'
      } else if (effectiveWords <= 2000) {
        sectionCount = 5
        wordsPerSection = 350
        paragraphsPerSection = '3-4 đoạn (mỗi đoạn 60-90 từ)'
      } else {
        sectionCount = 6
        wordsPerSection = Math.round(effectiveWords / 6)
        paragraphsPerSection = '4-5 đoạn (mỗi đoạn 70-100 từ), có thể thêm H3 con để chia nhỏ'
      }

      const baseSystem =
        settings.blog_system_prompt ||
        'You are an expert blog writer for ClickStar, a Vietnamese digital marketing & technology agency.'

      const styleHint = style && STYLE_PROMPT_HINTS[style] ? `\n\nSTYLE: ${STYLE_PROMPT_HINTS[style]}` : ''
      const keywordHint = keyword
        ? `\n\nPRIMARY SEO KEYWORD: "${keyword}": appear in title, intro, conclusion, and at least 2 H2 headings. Density ~1-2% (natural, not stuffed).`
        : ''
      const imageHint = includeImages
        ? `\n\nINLINE IMAGES: Insert 2-4 image markers in content_vi and content_en at sensible spots (after intro, between H2 sections) using EXACT format:
[[IMAGE: short English description for AI image gen, max 12 words]]
Each marker on its own line, blank line above and below. Examples:
[[IMAGE: modern marketing dashboard showing analytics charts]]
[[IMAGE: team collaboration workspace with diverse professionals]]
Do NOT use Markdown image syntax (![]()). Use ONLY [[IMAGE: ...]].`
        : ''

      const outlineHint = outline
        ? `\n\nFOLLOW THIS APPROVED OUTLINE STRICTLY:
Title (VI): ${outline.title_vi}
Title (EN): ${outline.title_en}
Sections (${outline.sections.length} total):
${outline.sections.map((s, i) => `${i + 1}. ${s.heading_vi} (${s.heading_en}): ${s.summary_vi}`).join('\n')}

Use these exact titles + section headings (translate naturally for EN). Each section MUST be ~${Math.round(effectiveWords / outline.sections.length)} words.`
        : `\n\nSTRUCTURE (when no outline provided):
- Intro: ~${Math.round(effectiveWords * 0.1)} words (hook + thesis)
- ${sectionCount} H2 sections (## heading), each ~${wordsPerSection} words, ${paragraphsPerSection}
- Conclusion: ~${Math.round(effectiveWords * 0.1)} words
- Total: AT LEAST ${minWords} words, target ${effectiveWords}, max ${maxWords}.`

      const systemPrompt = `${baseSystem}${styleHint}${keywordHint}

You are writing a long-form blog post in ${effectiveWords <= 600 ? 'concise' : effectiveWords <= 1500 ? 'standard' : 'IN-DEPTH'} format. You MUST return ONLY valid JSON. No preamble, no markdown fences, no explanation outside JSON.

═══ LENGTH REQUIREMENT (CRITICAL) ═══
content_vi MUST be ${minWords}-${maxWords} words (target: ${effectiveWords}). content_en MUST mirror same length.
${
  effectiveWords >= 1500
    ? `This is a LONG-FORM article. Do NOT be concise. Expand each H2 with concrete steps, trade-offs and realistic scenarios. Add bullet lists and numbered steps where natural. Mỗi đoạn 60-100 từ, viết sâu, viết kỹ, không tóm tắt.`
    : effectiveWords >= 1000
    ? `Be thorough. Each section deserves 2-3 paragraphs with concrete supporting points.`
    : 'Concise but complete.'
}
══════════════════════════════════════

${STYLE_RULES_VI}
(Bài này không có danh sách nguồn: không đưa số liệu thống kê cụ thể, viết định tính.)

JSON schema (return exactly these 6 keys):
{
  "title_vi": "Tiêu đề tiếng Việt, hấp dẫn, có keyword SEO",
  "title_en": "English title, engaging, SEO-friendly",
  "excerpt_vi": "Tóm tắt VN 1-2 câu (~150 ký tự)",
  "excerpt_en": "English excerpt 1-2 sentences (~150 chars)",
  "content_vi": "FULL Markdown blog post in Vietnamese. AT LEAST ${minWords} words, target ${effectiveWords} words. Intro + ${sectionCount} H2 sections + conclusion. Each H2: ${paragraphsPerSection}.",
  "content_en": "FULL English Markdown blog post, same structure, same length (${minWords}-${maxWords} words). Mirror VI section-by-section."
}

IMPORTANT:
- Content MUST be in Markdown (## for H2, ### for H3, **bold**, lists -, etc).
- Both VI and EN versions cover the same topics in parallel.
- DO NOT shorten the content. If you finish before hitting ${minWords} words, add more depth or sub-points before closing the JSON.${imageHint}${outlineHint}
- Output ONLY the JSON object, no text before or after.`

      const userPrompt = `Chủ đề bài viết: ${topic}`

      send('status', { message: 'Đang gọi AI...' })

      let fullText = ''
      if (settings.blog_provider === 'anthropic') {
        // SDK + structured output: JSON luôn hợp lệ, không cần bóc tách.
        let sinceLastPing = 0
        const r = await callClaude({
          apiKey,
          model: settings.blog_model,
          system: systemPrompt,
          prompt: userPrompt,
          maxTokens: 64000,
          effort: 'high',
          jsonSchema: POST_SCHEMA,
          signal: req.signal,
          onText: (delta) => {
            fullText += delta
            sinceLastPing += delta.length
            if (sinceLastPing >= 500) {
              send('progress', { chars: fullText.length })
              sinceLastPing = 0
            }
          },
        })
        fullText = r.text
        send('usage', { usage: r.usage })
      } else {
        fullText = await streamOpenAi(apiKey, settings.blog_model, systemPrompt, userPrompt, (chars) =>
          send('progress', { chars })
        )
      }

      // Parse final JSON
      // Claude (structured output) trả JSON chuẩn → parse thẳng; extractJson có thể bắt nhầm
      // khối ```json nằm TRONG nội dung bài.
      const jsonText = settings.blog_provider === 'anthropic' ? fullText : extractJson(fullText)
      let parsed: GeneratedPost
      try {
        parsed = JSON.parse(jsonText) as GeneratedPost
      } catch (parseErr) {
        const trimmed = jsonText.trimEnd()
        const startsWithBrace = jsonText.trimStart().startsWith('{')
        const endsWithBrace = trimmed.endsWith('}')
        let hint = ''
        if (!startsWithBrace) {
          hint = `AI trả kèm code block trong nội dung làm bộ đọc JSON nhầm. Thử lại 1-2 lần, hoặc đổi sang Claude ở Cài đặt AI.`
        } else if (!endsWithBrace) {
          hint = `AI trả dài hơn giới hạn nên JSON bị cắt cuối. Thử giảm "Số từ mục tiêu" (đang ${settings.blog_target_words}, thử 800-1000).`
        } else {
          hint = `AI trả JSON sai cú pháp. Thử lại, nếu lặp lại thì đổi model.`
        }
        const msg = parseErr instanceof Error ? parseErr.message : 'JSON lỗi'
        send('error', { error: `${msg}. ${hint}` })
        return
      }

      const required = ['title_vi', 'title_en', 'excerpt_vi', 'excerpt_en', 'content_vi', 'content_en'] as const
      for (const k of required) {
        if (typeof parsed[k] !== 'string') {
          send('error', { error: `JSON thiếu trường "${k}". Thử lại?` })
          return
        }
      }

      send('done', { post: parsed })
    },
    { heartbeatMs: 10000 }
  )
}

async function streamOpenAi(
  apiKey: string,
  model: string,
  system: string,
  user: string,
  onProgress: (chars: number) => void
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 16384,
      temperature: 0.7,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI ${res.status}: ${text.slice(0, 300)}`)
  }
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let fullText = ''
  let sinceLastPing = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() || ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const evt = JSON.parse(payload)
        const delta = evt.choices?.[0]?.delta?.content
        if (typeof delta === 'string') {
          fullText += delta
          sinceLastPing += delta.length
          if (sinceLastPing >= 500) {
            onProgress(fullText.length)
            sinceLastPing = 0
          }
        }
      } catch {}
    }
  }
  return fullText
}
