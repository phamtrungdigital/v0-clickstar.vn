import { loadAiContext, missingKeyMessage } from '@/lib/ai/route-context'
import { sseResponse } from '@/lib/ai/sse'
import { callClaude } from '@/lib/ai/claude'

export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

type FieldKey = 'title' | 'excerpt' | 'content'

// Translate VI ↔ EN for one or many fields at once.
// Uses INLINE model config (nhanh + rẻ). Returns single JSON via SSE — fields populated per requested keys.
export async function POST(req: Request) {
  return sseResponse(
    async (send) => {
      const body = (await req.json()) as {
        from?: 'vi' | 'en'
        to?: 'vi' | 'en'
        fields?: { title?: string; excerpt?: string; content?: string }
      }
      const from = body.from || 'vi'
      const to = body.to || 'en'
      if (from === to) {
        send('error', { error: 'Ngôn ngữ nguồn và đích trùng nhau' })
        return
      }
      const fields = body.fields || {}
      const keys = (Object.keys(fields) as FieldKey[]).filter(
        (k) => ['title', 'excerpt', 'content'].includes(k) && typeof fields[k] === 'string' && fields[k]!.trim().length > 0
      )
      if (keys.length === 0) {
        send('error', { error: 'Không có trường nào để dịch' })
        return
      }
      if (keys.some((k) => fields[k]!.length > (k === 'content' ? 80000 : 1000))) {
        send('error', { error: 'Nội dung quá dài để dịch một lần (tối đa khoảng 80.000 ký tự)' })
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

      const fromName = from === 'vi' ? 'Vietnamese' : 'English'
      const toName = to === 'vi' ? 'Vietnamese' : 'English'

      const systemPrompt = `You are a professional ${fromName} to ${toName} translator for ClickStar, a Vietnamese digital marketing & technology agency.

Your output MUST be ONLY a JSON object, no preamble, no markdown fences, no explanation outside.

Schema (only include keys that were present in input):
{
${keys.map((k) => `  "${k}": "${toName} translation of the ${k}"`).join(',\n')}
}

Translation rules:
- Preserve Markdown formatting (headings ##, bold **, lists -, links, code blocks) EXACTLY for content fields.
- Keep PROPER NOUNS, brand names, product names, technical terms in original (do NOT translate "ClickStar", "Google Ads", "Meta Ads", "CRM", "SEO", "AI", company names).
- Preserve [[IMAGE: ...]] markers, [[CHUYÊN GIA: ...]] markers and source references like [1], [2] exactly as-is.
- Use natural ${toName} idioms, NOT literal word-by-word.
- For business/marketing content, prefer professional but accessible tone.
- Do not use em dashes or en dashes (— –) inside sentences; use commas, colons or split the sentence.
- Numbers, percentages, statistics: keep exact.
- URLs and email addresses: keep exact.`

      const userPrompt = `Translate the following ${fromName} fields to ${toName}. Return ONLY the JSON object.

${keys.map((k) => `### ${k} (${fromName})\n${fields[k]}`).join('\n\n')}`

      let fullText = ''
      if (s.inline_provider === 'anthropic') {
        const schema = {
          type: 'object',
          additionalProperties: false,
          required: keys,
          properties: Object.fromEntries(keys.map((k) => [k, { type: 'string' }])),
        }
        let sincePing = 0
        const r = await callClaude({
          apiKey,
          model: s.inline_model,
          system: systemPrompt,
          prompt: userPrompt,
          maxTokens: 64000,
          effort: 'low',
          jsonSchema: schema,
          signal: req.signal,
          onText: (delta) => {
            fullText += delta
            sincePing += delta.length
            if (sincePing >= 500) {
              send('progress', { chars: fullText.length })
              sincePing = 0
            }
          },
        })
        fullText = r.text
        send('usage', { usage: r.usage })
      } else {
        fullText = await streamOpenAi(apiKey, s.inline_model, systemPrompt, userPrompt, (chars) =>
          send('progress', { chars })
        )
      }

      // Extract JSON: prefer explicit ```json fence, then raw { ... }, then any fence.
      const jsonText = (() => {
        if (s.inline_provider === 'anthropic') return fullText // structured output: JSON chuẩn
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
      } catch (e) {
        send('error', { error: `Đọc kết quả dịch lỗi: ${e instanceof Error ? e.message : 'JSON sai'}` })
        return
      }

      send('done', { fields: parsed })
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
      temperature: 0.3,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`OpenAI ${res.status}: ${txt.slice(0, 300)}`)
  }
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let fullText = ''
  let sincePing = 0
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
          sincePing += delta.length
          if (sincePing >= 500) {
            onProgress(fullText.length)
            sincePing = 0
          }
        }
      } catch {}
    }
  }
  return fullText
}
