import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runServiceRouter } from '@/lib/ai/chatbot-run'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { query } = (await req.json()) as { query?: string }

    // Đọc cấu hình bot (public read). Nếu bảng trống/lỗi → fallback prompt mặc định trong runServiceRouter.
    let enabled = true
    let systemPrompt: string | null = null
    let model: string | null = null
    try {
      const supabase = await createClient()
      const { data: cfg } = await supabase
        .from('chatbot_settings')
        .select('enabled, system_prompt, model')
        .eq('id', 1)
        .maybeSingle()
      if (cfg) {
        enabled = cfg.enabled
        systemPrompt = cfg.system_prompt
        model = cfg.model
      }
    } catch (e) {
      // Bảng chưa tồn tại hoặc lỗi đọc → giữ default, bot vẫn chạy.
      console.error('chatbot_settings read error:', e)
    }

    if (!enabled) {
      return NextResponse.json(
        { error: 'Trợ lý AI hiện đang tạm tắt. Vui lòng liên hệ hotline 0977 713 428.' },
        { status: 503 }
      )
    }

    const result = await runServiceRouter({ query: query ?? '', systemPrompt, model })
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json({ answer: result.answer, links: result.links })
  } catch (err: any) {
    console.error('service-router error:', err)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
