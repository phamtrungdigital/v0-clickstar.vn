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
