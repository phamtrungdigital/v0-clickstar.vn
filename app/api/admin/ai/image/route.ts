import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateImageWithOpenAI } from '@/lib/ai/providers'
import type { AiSettings } from '@/lib/ai/settings'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string }
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Thiếu prompt mô tả ảnh' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    const { data } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    const settings = data as AiSettings | null
    if (!settings?.enabled) {
      return NextResponse.json(
        { error: 'AI chưa được kích hoạt. Vào /admin/ai để bật.' },
        { status: 400 }
      )
    }
    if (!settings.openai_api_key) {
      return NextResponse.json(
        { error: 'Image generation cần OpenAI API key. Vào /admin/ai dán key.' },
        { status: 400 }
      )
    }

    const finalPrompt = settings.image_style_prefix
      ? `${prompt}\n\nStyle hints: ${settings.image_style_prefix}`
      : prompt

    const b64 = await generateImageWithOpenAI({
      apiKey: settings.openai_api_key,
      prompt: finalPrompt,
      model: settings.image_model,
      size: settings.image_size,
      quality: settings.image_quality,
    })

    const buffer = Buffer.from(b64, 'base64')
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`
    const path = `cms/ai-generated/${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, buffer, {
        contentType: 'image/png',
        cacheControl: '31536000',
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload lỗi: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const { data: publicData } = supabase.storage.from('media').getPublicUrl(path)
    return NextResponse.json({ url: publicData.publicUrl })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Image generation failed' },
      { status: 500 }
    )
  }
}
