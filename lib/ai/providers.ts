// AI provider clients. Server-only (don't import from client components).
// Both providers expose a single function `generate(opts) → string`.

export type GenerateOpts = {
  apiKey: string
  model: string
  system: string
  prompt: string
  maxTokens?: number
  temperature?: number
  /** Chỉ Claude 5.x: độ sâu suy nghĩ (mặc định low cho việc ngắn). */
  effort?: 'low' | 'medium' | 'high'
}

export async function generateWithAnthropic(opts: GenerateOpts): Promise<string> {
  // SDK chính thức + model 5.x: không gửi temperature; trần max_tokens rộng vì phần
  // suy nghĩ của model tính vào max_tokens (trần 512 cũ làm câu trả lời bị cắt).
  const { callClaude } = await import('./claude')
  const r = await callClaude({
    apiKey: opts.apiKey,
    model: opts.model,
    system: opts.system,
    prompt: opts.prompt,
    maxTokens: Math.min(64000, Math.max(opts.maxTokens ?? 0, 8000)),
    effort: opts.effort ?? 'low',
  })
  return r.text.trim()
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
  model?: string // luôn chạy gpt-image-1 (dall-e-3 cũ tự chuyển)
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
  // Gom về 1 model gpt-image-1 cho ảnh đồng đều. Cấu hình cũ còn chọn dall-e-3 thì tự
  // chuyển, đổi luôn kích thước/chất lượng sang giá trị gpt-image-1 nhận.
  const model = 'gpt-image-1'
  const SIZE_MAP: Record<string, string> = { '1792x1024': '1536x1024', '1024x1792': '1024x1536' }
  const QUALITY_MAP: Record<string, string> = { standard: 'medium', hd: 'high' }
  const size = opts.size ? (SIZE_MAP[opts.size] ?? opts.size) : '1536x1024'
  const quality = opts.quality ? (QUALITY_MAP[opts.quality] ?? opts.quality) : undefined

  const body: Record<string, unknown> = { model, prompt: opts.prompt, n: 1, size }
  if (quality) body.quality = quality

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

// Danh sách model chuyển sang settings-shared (client-safe); giữ export cũ cho tương thích.
export { MODEL_OPTIONS } from './settings-shared'
