// AI provider clients. Server-only (don't import from client components).
// Both providers expose a single function `generate(opts) → string`.

export type GenerateOpts = {
  apiKey: string
  model: string
  system: string
  prompt: string
  maxTokens?: number
  temperature?: number
}

export async function generateWithAnthropic(opts: GenerateOpts): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 512,
      temperature: opts.temperature ?? 0.7,
      system: opts.system,
      messages: [{ role: 'user', content: opts.prompt }],
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    let msg = text
    try {
      const j = JSON.parse(text)
      msg = j?.error?.message || text
    } catch {}
    throw new Error(`Anthropic ${res.status}: ${msg.slice(0, 300)}`)
  }
  const data = await res.json()
  const out = data?.content?.[0]?.text
  if (typeof out !== 'string') throw new Error('Anthropic: unexpected response shape')
  return out.trim()
}

export async function generateWithOpenAI(opts: GenerateOpts): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 512,
      temperature: opts.temperature ?? 0.7,
      messages: [
        { role: 'system', content: opts.system },
        { role: 'user', content: opts.prompt },
      ],
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    let msg = text
    try {
      const j = JSON.parse(text)
      msg = j?.error?.message || text
    } catch {}
    throw new Error(`OpenAI ${res.status}: ${msg.slice(0, 300)}`)
  }
  const data = await res.json()
  const out = data?.choices?.[0]?.message?.content
  if (typeof out !== 'string') throw new Error('OpenAI: unexpected response shape')
  return out.trim()
}

// ---------- Image generation (OpenAI only) ----------
export type GenerateImageOpts = {
  apiKey: string
  prompt: string
  model?: string // 'gpt-image-1' (default) or 'dall-e-3'
  size?: '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792'
  quality?: 'low' | 'medium' | 'high' | 'standard' | 'hd' | 'auto'
}

/**
 * Generate an image with OpenAI Images API.
 * Returns base64 PNG data (without the data: prefix).
 */
export async function generateImageWithOpenAI(
  opts: GenerateImageOpts
): Promise<string> {
  const model = opts.model || 'gpt-image-1'
  const isDalle = model.startsWith('dall-e')

  const body: Record<string, unknown> = {
    model,
    prompt: opts.prompt,
    n: 1,
    size: opts.size || (isDalle ? '1792x1024' : '1536x1024'),
  }
  // DALL-E quality: 'standard' | 'hd'. gpt-image-1: 'low' | 'medium' | 'high' | 'auto'.
  if (opts.quality) body.quality = opts.quality
  // DALL-E returns URLs by default; gpt-image-1 always returns base64.
  if (isDalle) body.response_format = 'b64_json'

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    let msg = text
    try {
      msg = JSON.parse(text)?.error?.message || text
    } catch {}
    throw new Error(`OpenAI Images ${res.status}: ${msg.slice(0, 300)}`)
  }
  const data = await res.json()
  const b64 = data?.data?.[0]?.b64_json
  if (typeof b64 !== 'string') throw new Error('OpenAI Images: missing b64_json')
  return b64
}

export const MODEL_OPTIONS = {
  anthropic: [
    { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (rẻ + nhanh)' },
    { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (cân bằng)' },
    { value: 'claude-opus-4-7', label: 'Claude Opus 4.7 (thông minh nhất)' },
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o mini (rẻ + nhanh)' },
    { value: 'gpt-4o', label: 'GPT-4o (cân bằng)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (mạnh)' },
  ],
} as const
