import { createClient } from '@/lib/supabase/server'
import { generateImageWithOpenAI } from '@/lib/ai/providers'
import type { AiSettings } from '@/lib/ai/settings'

export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

// Streaming response: gpt-image-1 doesn't natively stream, but we emit
// heartbeat events every 3s to keep the connection alive past Vercel's
// non-streaming 10s function limit.
export async function POST(req: Request) {
  const encoder = new TextEncoder()
  const send = (controller: ReadableStreamDefaultController, type: string, payload: any) => {
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({ type, ...payload })}\n\n`)
    )
  }

  const stream = new ReadableStream({
    async start(controller) {
      let heartbeat: NodeJS.Timeout | null = null
      try {
        const body = (await req.json()) as { prompt?: string; mode?: 'cover' | 'body' }
        const prompt = body.prompt
        const mode = body.mode || 'cover'
        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
          send(controller, 'error', { error: 'Thiếu prompt mô tả ảnh' })
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

        const { data } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle()
        const settings = data as AiSettings | null
        if (!settings?.enabled) {
          send(controller, 'error', { error: 'AI chưa được kích hoạt. Vào /admin/ai để bật.' })
          controller.close()
          return
        }
        if (!settings.openai_api_key) {
          send(controller, 'error', { error: 'Image generation cần OpenAI API key.' })
          controller.close()
          return
        }

        // Pick config based on mode (cover = high quality 16:9 / body = cheaper square)
        const cfg = mode === 'body'
          ? {
              model: settings.body_image_model,
              size: settings.body_image_size,
              quality: settings.body_image_quality,
              stylePrefix: settings.body_image_style_prefix,
            }
          : {
              model: settings.image_model,
              size: settings.image_size,
              quality: settings.image_quality,
              stylePrefix: settings.image_style_prefix,
            }

        const finalPrompt = cfg.stylePrefix
          ? `${prompt}\n\nStyle hints: ${cfg.stylePrefix}`
          : prompt

        send(controller, 'status', { message: 'Đang vẽ ảnh...' })

        // Heartbeat every 3s so Vercel knows we're still alive
        let elapsedSec = 0
        heartbeat = setInterval(() => {
          elapsedSec += 3
          send(controller, 'pulse', { elapsedSec })
        }, 3000)

        const b64 = await generateImageWithOpenAI({
          apiKey: settings.openai_api_key,
          prompt: finalPrompt,
          model: cfg.model,
          size: cfg.size,
          quality: cfg.quality,
        })

        if (heartbeat) {
          clearInterval(heartbeat)
          heartbeat = null
        }

        send(controller, 'status', { message: 'Đang upload...' })

        const buffer = Buffer.from(b64, 'base64')
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`
        const path = mode === 'body'
          ? `cms/ai-body/${safeName}`
          : `cms/ai-generated/${safeName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(path, buffer, {
            contentType: 'image/png',
            cacheControl: '31536000',
            upsert: false,
          })

        if (uploadError) {
          send(controller, 'error', { error: `Upload lỗi: ${uploadError.message}` })
          controller.close()
          return
        }

        const { data: publicData } = supabase.storage.from('media').getPublicUrl(path)
        send(controller, 'done', { url: publicData.publicUrl })
      } catch (err: any) {
        send(controller, 'error', { error: err?.message || 'Image generation failed' })
      } finally {
        if (heartbeat) clearInterval(heartbeat)
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
