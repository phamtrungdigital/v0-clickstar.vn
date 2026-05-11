import { createClient } from '@/lib/supabase/server'
import type { AiSettings } from '@/lib/ai/settings'

export const runtime = 'nodejs'
export const maxDuration = 120
export const dynamic = 'force-dynamic'

// Translate VI ↔ EN for one or many fields at once.
// Uses INLINE model config (recommend Haiku/4o-mini — fast + cheap for translation).
// Returns single JSON via SSE — fields populated per requested keys.
export async function POST(req: Request) {
  const encoder = new TextEncoder()
  const send = (
    controller: ReadableStreamDefaultController,
    type: string,
    payload: Record<string, unknown>
  ) => {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, ...payload })}\n\n`))
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const body = (await req.json()) as {
          from?: 'vi' | 'en'
          to?: 'vi' | 'en'
          fields?: { title?: string; excerpt?: string; content?: string }
        }
        const from = body.from || 'vi'
        const to = body.to || 'en'
        if (from === to) {
          send(controller, 'error', { error: 'Ngôn ngữ nguồn và đích trùng nhau' })
          controller.close()
          return
        }
        const fields = body.fields || {}
        const keys = (Object.keys(fields) as Array<keyof typeof fields>).filter(
          (k) => typeof fields[k] === 'string' && fields[k]!.trim().length > 0
        )
        if (keys.length === 0) {
          send(controller, 'error', { error: 'Không có field nào để dịch' })
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

        const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
        const s = data as AiSettings | null
        if (!s?.enabled) {
          send(controller, 'error', { error: 'AI chưa kích hoạt' })
          controller.close()
          return
        }

        const apiKey =
          s.inline_provider === 'anthropic' ? s.anthropic_api_key : s.openai_api_key
        if (!apiKey) {
          send(controller, 'error', { error: `Chưa có ${s.inline_provider} API key` })
          controller.close()
          return
        }

        const fromName = from === 'vi' ? 'Vietnamese' : 'English'
        const toName = to === 'vi' ? 'Vietnamese' : 'English'

        const systemPrompt = `You are a professional ${fromName} → ${toName} translator for ClickStar, a Vietnamese digital marketing & technology agency.

Your output MUST be ONLY a JSON object, no preamble, no markdown fences, no explanation outside.

Schema (only include keys that were present in input):
{
${keys.map((k) => `  "${k}": "${toName} translation of the ${k}"`).join(',\n')}
}

Translation rules:
- Preserve Markdown formatting (headings ##, bold **, lists -, links, code blocks) EXACTLY for content fields.
- Keep PROPER NOUNS, brand names, product names, technical terms in original (do NOT translate "ClickStar", "Google Ads", "Meta Ads", "CRM", "SEO", "AI", company names).
- Preserve [[IMAGE: ...]] markers exactly as-is (already English, do not translate).
- Use natural ${toName} idioms, NOT literal word-by-word.
- For business/marketing content, prefer professional but accessible tone.
- Numbers, percentages, statistics: keep exact.
- URLs and email addresses: keep exact.`

        const userPrompt = `Translate the following ${fromName} fields to ${toName}. Return ONLY the JSON object.

${keys.map((k) => `### ${k} (${fromName})\n${fields[k]}`).join('\n\n')}`

        let fullText = ''
        if (s.inline_provider === 'anthropic') {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              model: s.inline_model,
              max_tokens: 16384,
              system: systemPrompt,
              messages: [{ role: 'user', content: userPrompt }],
              stream: true,
            }),
          })
          if (!res.ok) {
            const txt = await res.text()
            send(controller, 'error', { error: `Anthropic ${res.status}: ${txt.slice(0, 300)}` })
            controller.close()
            return
          }
          const reader = res.body!.getReader()
          const decoder = new TextDecoder()
          let buf = ''
          let charsSincePing = 0
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
                  charsSincePing += evt.delta.text.length
                  if (charsSincePing >= 500) {
                    send(controller, 'progress', { chars: fullText.length })
                    charsSincePing = 0
                  }
                }
              } catch {}
            }
          }
        } else {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              model: s.inline_model,
              max_tokens: 16384,
              temperature: 0.3,
              stream: true,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
            }),
          })
          if (!res.ok) {
            const txt = await res.text()
            send(controller, 'error', { error: `OpenAI ${res.status}: ${txt.slice(0, 300)}` })
            controller.close()
            return
          }
          const reader = res.body!.getReader()
          const decoder = new TextDecoder()
          let buf = ''
          let charsSincePing = 0
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
                  charsSincePing += delta.length
                  if (charsSincePing >= 500) {
                    send(controller, 'progress', { chars: fullText.length })
                    charsSincePing = 0
                  }
                }
              } catch {}
            }
          }
        }

        // Extract JSON: prefer explicit ```json fence, then raw { ... },
        // then any fence. Avoids grabbing ```python etc when content has
        // code blocks.
        const jsonText = (() => {
          const jsonFence = fullText.match(/```json\s*([\s\S]*?)\s*```/)
          if (jsonFence) return jsonFence[1]
          const a = fullText.indexOf('{')
          const b = fullText.lastIndexOf('}')
          if (a !== -1 && b !== -1 && b > a) return fullText.slice(a, b + 1)
          const anyFence = fullText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
          if (anyFence) return anyFence[1]
          return fullText
        })()

        let parsed: Record<string, string>
        try {
          parsed = JSON.parse(jsonText)
        } catch (e: any) {
          send(controller, 'error', { error: `Translation JSON parse failed: ${e.message}` })
          controller.close()
          return
        }

        send(controller, 'done', { fields: parsed })
      } catch (err: any) {
        send(controller, 'error', { error: err?.message || 'Translation failed' })
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
