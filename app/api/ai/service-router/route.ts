import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `Bạn là trợ lý của ClickStar — công ty cung cấp 6 dịch vụ digital cho doanh nghiệp Việt Nam.

CÁC DỊCH VỤ:
1. slug="digital-marketing" | "Marketing tổng thể" — SEO, Google Ads, Facebook Ads, TikTok Ads, Zalo Ads, Content Marketing, chiến lược đa kênh, lead generation
2. slug="website" | "Thiết kế Website" — Website responsive, tối ưu SEO/tốc độ, landing page, e-commerce, sửa giao diện
3. slug="dashboard" | "Dashboard dữ liệu" — BI dashboard, báo cáo real-time, KPI tracking, trực quan hoá dữ liệu, Looker/Metabase
4. slug="crm-cdp" | "CRM & CDP" — Quản lý khách hàng, cá nhân hoá chăm sóc, customer journey, customer data platform
5. slug="ai-integration" | "Tích hợp AI" — Chatbot AI, AI phân tích dữ liệu, dự đoán xu hướng, AI assistant tích hợp vào hệ thống
6. slug="automation" | "Marketing Automation" — Workflow tự động, email marketing automation, nuôi dưỡng lead tự động, sales pipeline automation

NHIỆM VỤ:
Đọc câu hỏi/nhu cầu của khách → trả về JSON theo schema sau (KHÔNG markdown wrap, JSON thuần):

{
  "matched": true | false,
  "services": [
    {
      "slug": "digital-marketing" | "website" | "dashboard" | "crm-cdp" | "ai-integration" | "automation",
      "title": "Tên dịch vụ",
      "reason": "1-2 câu tiếng Việt giải thích vì sao dịch vụ này phù hợp với nhu cầu khách"
    }
  ],
  "fallback_message": null | string
}

LUẬT:
- Nếu nhu cầu MATCH 1+ dịch vụ → matched=true, list 1-3 services xếp theo độ phù hợp GIẢM DẦN, KHÔNG list service không liên quan, fallback_message=null
- Nếu nhu cầu liên quan công nghệ/marketing/web nhưng không hoàn toàn match → matched=true, gợi ý 1-2 service GẦN nhất, reason giải thích cách ClickStar hỗ trợ
- Nếu nhu cầu HOÀN TOÀN không liên quan (thời tiết, tin tức, hỏi linh tinh) → matched=false, services=[], fallback_message="ClickStar chuyên giải pháp Digital Marketing, Website, CRM, AI và Automation cho doanh nghiệp. Anh vui lòng gọi hotline 0977 713 428 hoặc email clickstar.vn@gmail.com để được tư vấn chi tiết."
- Tone tiếng Việt thân thiện, dùng "anh/chị" lịch sự, ngắn gọn
- Reason 15-30 từ, KHÔNG sales quá lố
- Trả về JSON THUẦN, không có \`\`\`json hay markdown
`

export async function POST(req: Request) {
  try {
    const { query } = (await req.json()) as { query?: string }
    const q = query?.trim()
    if (!q || q.length < 3) {
      return NextResponse.json({ error: 'Vui lòng mô tả nhu cầu chi tiết hơn' }, { status: 400 })
    }
    if (q.length > 500) {
      return NextResponse.json({ error: 'Câu hỏi tối đa 500 ký tự' }, { status: 400 })
    }

    // Read AI settings (OpenAI key)
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('ai_settings')
      .select('openai_api_key, enabled')
      .eq('id', 1)
      .maybeSingle()

    if (!settings?.enabled || !settings?.openai_api_key) {
      return NextResponse.json(
        { error: 'AI tạm thời chưa khả dụng. Vui lòng liên hệ hotline 0977 713 428.' },
        { status: 503 }
      )
    }

    // Call OpenAI gpt-4o-mini (fast + cheap for routing task)
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.openai_api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: q },
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('OpenAI error:', errText)
      return NextResponse.json(
        { error: 'AI tạm lỗi, vui lòng thử lại hoặc gọi 0977 713 428.' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'AI không trả lời được' }, { status: 502 })
    }

    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'AI trả về định dạng không hợp lệ' }, { status: 502 })
    }

    // Validate + sanitize
    const VALID_SLUGS = new Set([
      'digital-marketing',
      'website',
      'dashboard',
      'crm-cdp',
      'ai-integration',
      'automation',
    ])

    const services = Array.isArray(parsed.services)
      ? parsed.services
          .filter(
            (s: any) =>
              s && typeof s.slug === 'string' && VALID_SLUGS.has(s.slug) && s.title && s.reason
          )
          .slice(0, 3)
      : []

    return NextResponse.json({
      matched: !!parsed.matched && services.length > 0,
      services,
      fallback_message: parsed.fallback_message || null,
    })
  } catch (err: any) {
    console.error('service-router error:', err)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
