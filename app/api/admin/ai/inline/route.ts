import { createClient } from '@/lib/supabase/server'
import type { AiSettings, BlogStyle } from '@/lib/ai/settings'
import { STYLE_PROMPT_HINTS } from '@/lib/ai/settings'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// SSE streaming inline AI (refine/generate short text on any field).
// Replaces server-action-based generateText so we can stream + bypass
// non-streaming function timeouts.
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
          prompt?: string
          language?: 'vi' | 'en'
          fieldLabel?: string
          currentValue?: string
          pageContext?: string
          style?: BlogStyle
          maxTokens?: number
        }
        const userPrompt = body.prompt?.trim()
        if (!userPrompt) {
          send(controller, 'error', { error: 'Thiếu prompt' })
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
          send(controller, 'error', { error: 'AI chưa kích hoạt. Vào /admin/ai để bật.' })
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

        const lang = body.language || 'vi'
        const langLabel = lang === 'vi' ? 'tiếng Việt' : 'English'
        const styleHint = body.style ? `\n\nSTYLE: ${STYLE_PROMPT_HINTS[body.style]}` : ''

        const systemBase = s.inline_system_prompt || 'You are a content writer for ClickStar.'
        const system = `${systemBase}${styleHint}\n\nIMPORTANT: Trả về CHỈ nội dung được yêu cầu (${langLabel}). KHÔNG markdown, KHÔNG nháy kép, KHÔNG giải thích thêm.`

        const parts: string[] = []
        if (body.pageContext) parts.push(`Ngữ cảnh trang: ${body.pageContext}`)
        if (body.fieldLabel) parts.push(`Field cần viết: ${body.fieldLabel}`)
        if (body.currentValue) parts.push(`Hiện đang là: "${body.currentValue}"`)
        parts.push(`Yêu cầu của user: ${userPrompt}`)
        parts.push(`Ngôn ngữ output: ${langLabel}`)
        const finalPrompt = parts.join('\n\n')

        const maxTokens = body.maxTokens || 512

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
              max_tokens: maxTokens,
              system,
              messages: [{ role: 'user', content: finalPrompt }],
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
                  send(controller, 'delta', { text: evt.delta.text })
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
              max_tokens: maxTokens,
              temperature: 0.7,
              stream: true,
              messages: [
                { role: 'system', content: system },
                { role: 'user', content: finalPrompt },
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
                  send(controller, 'delta', { text: delta })
                }
              } catch {}
            }
          }
        }

        send(controller, 'done', { text: fullText.trim() })
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
