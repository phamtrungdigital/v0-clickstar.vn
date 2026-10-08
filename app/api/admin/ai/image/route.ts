import { generateImageWithOpenAI } from '@/lib/ai/providers'
import { loadAiContext, missingKeyMessage } from '@/lib/ai/route-context'

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
          return
        }

        const ctx = await loadAiContext()
        if (!ctx.ok) {
          send(controller, 'error', { error: ctx.error })
          return
        }
        const { supabase, settings } = ctx
        const openaiKey = ctx.keyFor('openai')
        if (!openaiKey) {
          send(controller, 'error', { error: missingKeyMessage('openai') })
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
          apiKey: openaiKey,
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
          return
        }

        const { data: publicData } = supabase.storage.from('media').getPublicUrl(path)
        send(controller, 'done', { url: publicData.publicUrl })
      } catch (err: any) {
        send(controller, 'error', { error: err?.message || 'Image generation failed' })
      } finally {
        if (heartbeat) clearInterval(heartbeat)
        try {
          controller.close()
        } catch {}
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
