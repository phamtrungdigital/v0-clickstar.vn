// Client-safe types + constants — no server imports.
// Re-exported by lib/ai/settings.ts for server use.

export type AiProvider = 'anthropic' | 'openai'
export type ImageModel = 'gpt-image-1' | 'dall-e-3'
export type ImageSize =
  | '1024x1024'
  | '1536x1024'
  | '1024x1536'
  | '1792x1024'
  | '1024x1792'
export type ImageQuality = 'low' | 'medium' | 'high' | 'auto' | 'standard' | 'hd'

export type AiSettings = {
  id: number
  enabled: boolean

  // Shared API keys
  anthropic_api_key: string | null
  openai_api_key: string | null

  // Inline ✨ AI button on every text field (short refine/generate)
  inline_provider: AiProvider
  inline_model: string
  inline_system_prompt: string | null

  // Full blog post generator (✨ AI viết bài hoàn chỉnh)
  blog_provider: AiProvider
  blog_model: string
  blog_system_prompt: string | null
  blog_target_words: number

  // Cover image generator (🎨 Tạo ảnh đại diện AI)
  image_model: ImageModel
  image_size: ImageSize
  image_quality: ImageQuality
  image_style_prefix: string | null

  // Inline body images (cheaper/smaller, gen for each [[IMAGE: alt]] marker)
  body_image_model: ImageModel
  body_image_size: ImageSize
  body_image_quality: ImageQuality
  body_image_style_prefix: string | null

  updated_at: string
}

/** Model cho từng nhà cung cấp. Giá trị cũ trong DB (vd claude-opus-4-7) vẫn chạy được,
 * ô chọn sẽ hiện thêm dòng "model cũ" để admin chủ động đổi. */
export const MODEL_OPTIONS = {
  anthropic: [
    { value: 'claude-haiku-5-5', label: 'Claude Haiku 5.5 (rẻ, nhanh: sửa câu ngắn)' },
    { value: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (cân bằng: dịch, rà soát)' },
    { value: 'claude-opus-5-5', label: 'Claude Opus 5.5 (viết bài, khuyến nghị)' },
    { value: 'claude-fable-5-1', label: 'Claude Fable 5.1 (mạnh nhất, giá gấp 2,5 lần Opus)' },
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o mini (rẻ + nhanh)' },
    { value: 'gpt-4o', label: 'GPT-4o (cân bằng)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (mạnh)' },
  ],
} as const

export const DEFAULT_CLAUDE_INLINE_MODEL = 'claude-haiku-5-5'
export const DEFAULT_CLAUDE_BLOG_MODEL = 'claude-opus-5-5'

// ── Che API key khi gửi xuống trình duyệt ──
// Trang Cài đặt AI chỉ nhận "••••abcd" (4 ký tự cuối). Khi lưu, giá trị còn dạng che
// nghĩa là "giữ nguyên key trong DB"; ô trống nghĩa là xoá key.
export const MASKED_KEY_PREFIX = '••••'

export function maskApiKey(key: string | null | undefined): string | null {
  const k = key?.trim()
  if (!k) return null
  return `${MASKED_KEY_PREFIX}${k.slice(-4)}`
}

/** Đúng dạng che "••••" + tối đa 4 ký tự. Dán key mới nối sau dạng che (con trỏ không bôi
 * đen hết) thì KHÔNG coi là che → lưu theo giá trị mới, không âm thầm bỏ qua. */
export function isMaskedKey(value: string | null | undefined): boolean {
  return !!value && value.startsWith(MASKED_KEY_PREFIX) && value.length <= MASKED_KEY_PREFIX.length + 4
}

/** Dán key mới khi ô còn dạng che: bỏ phần "••••abcd" phía trước, chỉ giữ key vừa dán. */
export function normalizeKeyInput(value: string | null | undefined): string | null {
  const v = (value ?? '').trim()
  if (!v) return null
  if (v.startsWith('•') && !isMaskedKey(v)) {
    // Bỏ các dấu che, rồi bỏ phần đuôi key cũ còn sót (tối đa 4 ký tự) trước key mới.
    const rest = v.replace(/^•+/, '')
    const i = rest.indexOf('sk-')
    return (i >= 0 && i <= 4 ? rest.slice(i) : rest.slice(Math.min(4, rest.length))).trim() || null
  }
  return v
}

/** Nguồn key đang dùng: lưu trong DB, biến môi trường Vercel, hoặc chưa có. */
export type KeySource = 'db' | 'env' | null
export type KeySources = { anthropic: KeySource; openai: KeySource }

export const BLOG_STYLE_OPTIONS = [
  { value: 'professional', label: 'Chuyên nghiệp (B2B, tone trang trọng)' },
  { value: 'friendly', label: 'Thân thiện (gần gũi, dùng "bạn")' },
  { value: 'storytelling', label: 'Storytelling (kể chuyện, có ví dụ)' },
  { value: 'seo', label: 'SEO-focused (keyword dày, list dày)' },
  { value: 'technical', label: 'Kỹ thuật (đi sâu, có code/số liệu)' },
] as const

export type BlogStyle = (typeof BLOG_STYLE_OPTIONS)[number]['value']

export const STYLE_PROMPT_HINTS: Record<BlogStyle, string> = {
  professional: 'Tone chuyên nghiệp, B2B, trang trọng. Tránh slang, dùng "doanh nghiệp" / "tổ chức". Số liệu cụ thể, dẫn nguồn nếu có.',
  friendly: 'Tone thân thiện, gần gũi. Dùng "bạn", "mình", "chúng ta". Có thể chèn câu hỏi tu từ. Tránh quá học thuật.',
  storytelling: 'Kể chuyện qua case studies cụ thể. Mở bài bằng tình huống thực tế. Dùng nhân vật giả định để dẫn dắt vấn đề.',
  seo: 'Tối ưu SEO: keyword chính xuất hiện ở H1, H2 đầu, đoạn mở, đoạn kết. Bullet list dày. Câu ngắn (15-20 từ). FAQ section nếu hợp.',
  technical: 'Đi sâu kỹ thuật. Dùng số liệu, benchmark, code snippet nếu phù hợp. Cite tool name, version. Tránh marketing fluff.',
}
