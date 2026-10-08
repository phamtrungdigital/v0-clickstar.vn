import type { BlogStyle } from '@/lib/ai/settings'
import { STYLE_PROMPT_HINTS } from '@/lib/ai/settings'
import { claudeMaxTokens, loadAiContext, missingKeyMessage } from '@/lib/ai/route-context'
import { sseResponse } from '@/lib/ai/sse'
import { callClaude } from '@/lib/ai/claude'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// SSE streaming inline AI (refine/generate short text on any field).
export async function POST(req: Request) {
  return sseResponse(async (send) => {
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
      send('error', { error: 'Thiếu yêu cầu' })
      return
    }
    // Trần độ dài đầu vào: chặn gửi dữ liệu khổng lồ làm tốn tiền token.
    if (
      userPrompt.length > 4000 ||
      (body.currentValue?.length ?? 0) > 20000 ||
      (body.pageContext?.length ?? 0) > 4000 ||
      (body.fieldLabel?.length ?? 0) > 200
    ) {
      send('error', { error: 'Nội dung gửi lên quá dài cho nút AI viết nhanh' })
      return
    }

    const ctx = await loadAiContext()
    if (!ctx.ok) {
      send('error', { error: ctx.error })
      return
    }
    const s = ctx.settings
    const apiKey = ctx.keyFor(s.inline_provider)
    if (!apiKey) {
      send('error', { error: missingKeyMessage(s.inline_provider) })
      return
    }

    const lang = body.language || 'vi'
    const langLabel = lang === 'vi' ? 'tiếng Việt' : 'English'
    const styleHint = body.style && STYLE_PROMPT_HINTS[body.style] ? `\n\nSTYLE: ${STYLE_PROMPT_HINTS[body.style]}` : ''

    const systemBase = s.inline_system_prompt || 'You are a content writer for ClickStar.'
    const system = `${systemBase}${styleHint}\n\nIMPORTANT: Trả về CHỈ nội dung được yêu cầu (${langLabel}). KHÔNG markdown, KHÔNG nháy kép, KHÔNG giải thích thêm. Không dùng emoji, không dùng dấu gạch ngang dài (— –).`

    const parts: string[] = []
    if (body.pageContext) parts.push(`Ngữ cảnh trang: ${body.pageContext}`)
    if (body.fieldLabel) parts.push(`Field cần viết: ${body.fieldLabel}`)
    if (body.currentValue) parts.push(`Hiện đang là: "${body.currentValue}"`)
    parts.push(`Yêu cầu của user: ${userPrompt}`)
    parts.push(`Ngôn ngữ output: ${langLabel}`)
    const finalPrompt = parts.join('\n\n')

    const maxTokens = Math.min(Math.max(body.maxTokens || 512, 16), 4096)

    let fullText = ''
    if (s.inline_provider === 'anthropic') {
      const r = await callClaude({
        apiKey,
        model: s.inline_model,
        system,
        prompt: finalPrompt,
        // Model 5.x suy nghĩ trước khi viết, phần đó tính vào max_tokens → trần tối thiểu 8k.
        maxTokens: claudeMaxTokens(maxTokens, 8000),
        effort: 'low',
        signal: req.signal,
        onText: (delta) => {
          fullText += delta
          send('delta', { text: delta })
        },
      })
      fullText = r.text
    } else {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
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
        send('error', { error: `OpenAI ${res.status}: ${txt.slice(0, 300)}` })
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
              send('delta', { text: delta })
            }
          } catch {}
        }
      }
    }

    send('done', { text: fullText.trim() })
  })
}
