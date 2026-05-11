import { createClient } from '@/lib/supabase/server'
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
        const { topic } = (await req.json()) as { topic?: string }
        if (!topic || typeof topic !== 'string' || !topic.trim()) {
          send(controller, 'error', { error: 'Thiếu chủ đề bài viết' })
          controller.close()
          return
        }

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
          const truncated = !jsonText.trimEnd().endsWith('}')
          const hint = truncated
            ? `AI trả output dài hơn giới hạn → JSON bị cắt cuối. Thử giảm "Số từ mục tiêu" trong /admin/ai (đang ${settings.blog_target_words}, thử 800-1000), hoặc đổi sang model nhỏ hơn.`
            : `AI trả JSON không hợp lệ. Thử lại.`
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
