import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 30

const InputSchema = z.object({
  interests: z.array(z.string()).max(10),
  recent_pages: z.array(z.string()).max(15),
  prompt_hint: z.string().max(500).optional().default(''),
})

type PersonalizeResponse = {
  message: string // <140 chars Vietnamese greeting + CTA hook
  recommended_service: string // matches /contact dropdown
  cta_label: string
}

// Service mapping (matches lib/personalize/tracker.ts CATEGORY_TO_SERVICE)
const SERVICE_LABELS: Record<string, string> = {
  marketing: 'Digital Marketing',
  website: 'Thiết kế Website',
  dashboard: 'Dashboard dữ liệu',
  ai: 'Tích hợp AI',
  automation: 'AI Automation',
  crm: 'CRM & CDP',
  pricing: 'Tư vấn tổng thể',
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'invalid_input' }, { status: 400 })
  }

  const { interests, recent_pages, prompt_hint } = parsed.data

  // Get AI config via RPC (SECURITY DEFINER bypasses RLS for anon)
  const supabase = await createClient()
  const { data: cfg } = await supabase.rpc('get_personalize_ai_config').single<{
    api_key: string | null
    model: string
    enabled: boolean
  }>()

  if (!cfg?.enabled || !cfg.api_key) {
    return Response.json(fallback(interests), { status: 200 })
  }

  const topService = SERVICE_LABELS[interests[0]] || 'Tư vấn tổng thể'

  const systemPrompt = `Bạn là trợ lý sales của Click Star Digital — agency Marketing & AI.
Khách vừa xem các trang dịch vụ rồi rời khỏi. Em viết 1 câu greeting tiếng Việt ngắn (dưới 140 ký tự) gợi ý dịch vụ phù hợp + hook để đặt lịch tư vấn.

QUY TẮC:
- Tone: chuyên nghiệp nhưng thân thiện, xưng "Click Star" (KHÔNG xưng "em" hay "tôi").
- Tập trung vào 1-2 dịch vụ TOP interest (không liệt kê hết).
- KHÔNG dùng emoji.
- Nhấn mạnh USP: "tư vấn miễn phí", "60 phút", "khám phá giải pháp phù hợp".

Trả về JSON CHÍNH XÁC:
{"message": "câu greeting <140 chars", "recommended_service": "${topService}", "cta_label": "Đặt lịch tư vấn miễn phí"}`

  const userPrompt = `Khách vừa xem:
- Top interest: ${interests.slice(0, 3).map((i) => SERVICE_LABELS[i] || i).join(', ')}
- Trang gần đây: ${recent_pages.slice(-5).join(' → ')}
${prompt_hint ? `\nGợi ý từ campaign admin: ${prompt_hint}` : ''}

Viết JSON greeting hấp dẫn nhất.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': cfg.api_key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: cfg.model || 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      console.error('[personalize] Anthropic API error:', res.status)
      return Response.json(fallback(interests), { status: 200 })
    }

    const json = await res.json()
    const text: string = json.content?.[0]?.text ?? ''

    // Extract JSON from response (may be wrapped in markdown)
    const jsonMatch = text.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) return Response.json(fallback(interests), { status: 200 })

    const parsed = JSON.parse(jsonMatch[0]) as Partial<PersonalizeResponse>
    if (!parsed.message) return Response.json(fallback(interests), { status: 200 })

    return Response.json(
      {
        message: parsed.message.slice(0, 200),
        recommended_service: parsed.recommended_service || topService,
        cta_label: parsed.cta_label || 'Đặt lịch tư vấn miễn phí',
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'private, max-age=3600' }, // 1h cache
      },
    )
  } catch (e) {
    console.error('[personalize] error:', e)
    return Response.json(fallback(interests), { status: 200 })
  }
}

/** Rule-based fallback khi AI fail hoặc disabled */
function fallback(interests: string[]): PersonalizeResponse {
  const topInterest = interests[0] || 'marketing'
  const service = SERVICE_LABELS[topInterest] || 'Tư vấn tổng thể'
  const messages: Record<string, string> = {
    marketing: `Click Star có gói Digital Marketing đa nền tảng phù hợp doanh nghiệp anh. Đặt lịch tư vấn miễn phí 60 phút?`,
    website: `Click Star chuyên thiết kế Website chuyển đổi cao + Dashboard real-time. Tư vấn miễn phí gói phù hợp?`,
    ai: `Tích hợp AI vào quy trình kinh doanh — Click Star giúp anh setup Claude/GPT trong 2-4 tuần. Tư vấn miễn phí?`,
    automation: `Tự động hóa quy trình với N8N + AI Agent — Click Star có gói setup phù hợp. Đặt lịch tư vấn?`,
    crm: `CRM/CDP hợp nhất dữ liệu khách hàng — Click Star tư vấn giải pháp phù hợp ngành nghề anh.`,
    crm_cdp: `CRM/CDP hợp nhất dữ liệu khách hàng — Click Star tư vấn giải pháp phù hợp ngành nghề anh.`,
    dashboard: `Dashboard real-time cho doanh nghiệp data-driven — Click Star có gói tích hợp ERP/CRM. Tư vấn miễn phí?`,
    pricing: `Anh vừa xem bảng giá — Click Star có thể custom gói phù hợp ngân sách. Đặt lịch tư vấn 60 phút miễn phí?`,
  }
  return {
    message: messages[topInterest] || messages.pricing,
    recommended_service: service,
    cta_label: 'Đặt lịch tư vấn miễn phí',
  }
}
