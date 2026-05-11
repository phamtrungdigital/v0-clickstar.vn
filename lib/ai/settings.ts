import { createClient } from '@/lib/supabase/server'

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

  // Cover image generator (🎨 Tạo ảnh AI)
  image_model: ImageModel
  image_size: ImageSize
  image_quality: ImageQuality
  image_style_prefix: string | null

  updated_at: string
}

export async function getAiSettings(): Promise<AiSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as AiSettings) || null
}
