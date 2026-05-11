import { createClient } from '@/lib/supabase/server'
import type { AiSettings, BlogStyle } from '@/lib/ai/settings'
import { STYLE_PROMPT_HINTS } from '@/lib/ai/settings'

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

// Streaming SSE response so we don't hit Vercel Hobby's 10s function timeout.
// While bytes keep flowing, Vercel keeps the function alive (up to 5 min).
export async function POST(req: Request) {
  const encoder = new TextEncoder()
  const send = (controller: ReadableStreamDefaultController, type: string, payload: any) => {
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({ type, ...payload })}\n\n`)
    )
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const body = (await req.json()) as {
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
        const topic = body.topic?.trim()
        if (!topic) {
          send(controller, 'error', { error: 'Thiếu chủ đề bài viết' })
          controller.close()
          return
        }
        const keyword = body.keyword?.trim() || ''
        const style = body.style
        const outline = body.outline
        const includeImages = body.includeImages !== false // default true

        const supabase = await createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          send(controller, 'error', { error: 'Chưa đăng nhập' })
          controller.close()
          return
        }

        const { data } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle()
        const settings = data as AiSettings | null
        if (!settings?.enabled) {
          send(controller, 'error', { error: 'AI chưa được kích hoạt. Vào /admin/ai để bật.' })
          controller.close()
          return
        }

        const apiKey =
          settings.blog_provider === 'anthropic'
            ? settings.anthropic_api_key
            : settings.openai_api_key
        if (!apiKey) {
          send(controller, 'error', { error: `Chưa có ${settings.blog_provider} API key` })
          controller.close()
          return
        }
        if (!settings.blog_model) {
          send(controller, 'error', { error: 'Chưa chọn blog model. Vào /admin/ai → Viết bài blog' })
          controller.close()
          return
        }

        const effectiveWords = body.targetWords || settings.blog_target_words
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
          'You are an expert blog writer for ClickStar — a Vietnamese digital marketing & technology agency.'

        const styleHint = style ? `\n\nSTYLE: ${STYLE_PROMPT_HINTS[style]}` : ''
        const keywordHint = keyword
          ? `\n\nPRIMARY SEO KEYWORD: "${keyword}" — appear in title, intro, conclusion, and at least 2 H2 headings. Density ~1-2% (natural, not stuffed).`
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
${outline.sections.map((s, i) => `${i + 1}. ${s.heading_vi} (${s.heading_en}) — ${s.summary_vi}`).join('\n')}

Use these exact titles + section headings (translate naturally for EN). Each section MUST be ~${Math.round(effectiveWords / outline.sections.length)} words.`
          : `\n\nSTRUCTURE (when no outline provided):
- Intro: ~${Math.round(effectiveWords * 0.1)} words (hook + thesis)
- ${sectionCount} H2 sections (## heading), each ~${wordsPerSection} words, ${paragraphsPerSection}
- Conclusion: ~${Math.round(effectiveWords * 0.1)} words
- Total: AT LEAST ${minWords} words, target ${effectiveWords}, max ${maxWords}.`

        const systemPrompt = `${baseSystem}${styleHint}${keywordHint}

You are writing a long-form blog post in ${effectiveWords <= 600 ? 'concise' : effectiveWords <= 1500 ? 'standard' : 'IN-DEPTH'} format. You MUST return ONLY valid JSON — no preamble, no markdown fences, no explanation outside JSON.

═══ LENGTH REQUIREMENT (CRITICAL) ═══
content_vi MUST be ${minWords}-${maxWords} words (target: ${effectiveWords}). content_en MUST mirror same length.
${
  effectiveWords >= 1500
    ? `This is a LONG-FORM article. Do NOT be concise. Expand each H2 with examples, sub-points, statistics, analogies, real-world scenarios. Add bullet lists, numbered steps, callout quotes where natural. Mỗi đoạn 60-100 từ — viết sâu, viết kỹ, không tóm tắt.`
    : effectiveWords >= 1000
    ? `Be thorough. Each section deserves 2-3 paragraphs with examples and supporting points.`
    : 'Concise but complete.'
}
══════════════════════════════════════

JSON schema (return exactly these 6 keys):
{
  "title_vi": "Tiêu đề tiếng Việt — hấp dẫn, đầy đủ keyword SEO",
  "title_en": "English title — engaging, SEO-friendly",
  "excerpt_vi": "Tóm tắt VN 1-2 câu (~150 ký tự)",
  "excerpt_en": "English excerpt 1-2 sentences (~150 chars)",
  "content_vi": "FULL Markdown blog post in Vietnamese. AT LEAST ${minWords} words, target ${effectiveWords} words. Intro + ${sectionCount} H2 sections + conclusion. Each H2: ${paragraphsPerSection}.",
  "content_en": "FULL English Markdown blog post — same structure, same length (${minWords}-${maxWords} words). Mirror VI section-by-section."
}

IMPORTANT:
- Content MUST be in Markdown (## for H2, ### for H3, **bold**, lists -, etc).
- Both VI and EN versions cover the same topics in parallel.
- DO NOT shorten the content. If you finish before hitting ${minWords} words, add more depth, examples, or sub-points before closing the JSON.${imageHint}${outlineHint}
- Output ONLY the JSON object — no text before or after.`

        const userPrompt = `Chủ đề bài viết: ${topic}`

        send(controller, 'status', { message: 'Đang gọi AI...' })

        // Provider-specific streaming
        let fullText = ''
        if (settings.blog_provider === 'anthropic') {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              model: settings.blog_model,
              max_tokens: 16384,
              system: systemPrompt,
              messages: [{ role: 'user', content: userPrompt }],
              stream: true,
            }),
          })
          if (!res.ok) {
            const text = await res.text()
            send(controller, 'error', { error: `Anthropic ${res.status}: ${text.slice(0, 300)}` })
            controller.close()
            return
          }

          const reader = res.body!.getReader()
          const decoder = new TextDecoder()
          let buf = ''
          let charsSinceLastPing = 0
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buf += decoder.decode(value, { stream: true })
            const lines = buf.split('\n')
            buf = lines.pop() || ''
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const payload = line.slice(6).trim()
              if (!payload) continue
              try {
                const evt = JSON.parse(payload)
                if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
                  fullText += evt.delta.text
                  charsSinceLastPing += evt.delta.text.length
                  // Throttle progress events to avoid spam: every ~500 chars
                  if (charsSinceLastPing >= 500) {
                    send(controller, 'progress', { chars: fullText.length })
                    charsSinceLastPing = 0
                  }
                }
              } catch {}
            }
          }
        } else {
          // OpenAI streaming
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              model: settings.blog_model,
              max_tokens: 16384,
              temperature: 0.7,
              stream: true,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
            }),
          })
          if (!res.ok) {
            const text = await res.text()
            send(controller, 'error', { error: `OpenAI ${res.status}: ${text.slice(0, 300)}` })
            controller.close()
            return
          }

          const reader = res.body!.getReader()
          const decoder = new TextDecoder()
          let buf = ''
          let charsSinceLastPing = 0
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
                  charsSinceLastPing += delta.length
                  if (charsSinceLastPing >= 500) {
                    send(controller, 'progress', { chars: fullText.length })
                    charsSinceLastPing = 0
                  }
                }
              } catch {}
            }
          }
        }

        // Parse final JSON
        const jsonText = extractJson(fullText)
        let parsed: GeneratedPost
        try {
          parsed = JSON.parse(jsonText) as GeneratedPost
        } catch (parseErr: any) {
          const trimmed = jsonText.trimEnd()
          const startsWithBrace = jsonText.trimStart().startsWith('{')
          const endsWithBrace = trimmed.endsWith('}')
          let hint = ''
          if (!startsWithBrace) {
            hint = `AI trả output có code block trong content (vd \`\`\`python) làm parser nhầm. Em đã thêm regex prefer "json" fence — thử lại 1-2 lần nữa, hoặc đổi sang model thông minh hơn (Opus/GPT-4o).`
          } else if (!endsWithBrace) {
            hint = `AI trả output dài hơn giới hạn → JSON bị cắt cuối. Thử giảm "Số từ mục tiêu" trong /admin/ai (đang ${settings.blog_target_words}, thử 800-1000), hoặc đổi sang model nhỏ hơn.`
          } else {
            hint = `AI trả JSON không hợp lệ (syntax error). Thử lại — nếu lặp lại, đổi model.`
          }
          send(controller, 'error', { error: `${parseErr.message}. ${hint}` })
          controller.close()
          return
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
            send(controller, 'error', { error: `JSON thiếu field "${k}". Thử lại?` })
            controller.close()
            return
          }
        }

        send(controller, 'done', { post: parsed })
      } catch (err: any) {
        send(controller, 'error', { error: err?.message || 'Generation failed' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
