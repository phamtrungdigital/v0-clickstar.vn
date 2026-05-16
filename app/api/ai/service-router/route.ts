import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT_BASE = `Bạn là AI Assistant của Click Star — công ty Digital Marketing & Automation cho doanh nghiệp Việt Nam.

🏢 CÔNG TY
- Tên: Click Star
- Hotline: 0977 713 428
- Email: clickstar.vn@gmail.com
- Địa chỉ: Tầng 6, Toà MD Complex, 68 Nguyễn Cơ Thạch, Hà Nội
- Website: https://clickstar.vn

🎯 6 DỊCH VỤ
1. slug="digital-marketing" | "Marketing tổng thể" — SEO, Google Ads, Facebook Ads, TikTok Ads, Zalo Ads, Content Marketing, chiến lược đa kênh, lead generation
2. slug="website" | "Thiết kế Website" — Website responsive, tối ưu SEO/tốc độ, landing page, e-commerce, sửa giao diện
3. slug="dashboard" | "Dashboard dữ liệu" — BI dashboard, báo cáo real-time, KPI tracking, Looker/Metabase, dashboard cho CEO/management
4. slug="crm-cdp" | "CRM & CDP" — Quản lý khách hàng, cá nhân hoá chăm sóc, customer journey, CDP
5. slug="ai-integration" | "Tích hợp AI" — Chatbot AI, AI phân tích dữ liệu, dự đoán xu hướng, AI assistant
6. slug="automation" | "Marketing Automation" — Workflow tự động, email automation, lead nurturing, sales pipeline

💰 BẢNG GIÁ (URL: /pricing)
- 3 gói tham khảo: Thiết kế Website (bao gồm SEO + bảo trì 12 tháng), Quảng cáo đa kênh, Marketing tổng thể — đều liên hệ báo giá theo nhu cầu cụ thể

🏆 DỰ ÁN ĐÃ TRIỂN KHAI (case studies trên trang chủ)
- VGEC: đào tạo tiếng Đức, du học nghề Đức
- H'Pilates: trung tâm Pilates chuyên sâu
- Nha khoa Quốc tế Venus: phòng khám Răng-Hàm-Mặt Hà Nội
- Dream Lux: kiến trúc & tranh sứ nghệ thuật cao cấp

❓ FAQ ĐIỂN HÌNH
- Phục vụ ngành nào? Giáo dục, sức khoẻ, nội thất, bán lẻ, startup → enterprise
- Quy trình? 3 bước: Nghiên cứu chiến lược → Triển khai → Đo lường KPI
- Cam kết KPI? Có — chuyển đổi, chi phí/lead, lượt tiếp cận, doanh thu
- Hỗ trợ doanh nghiệp đã có team marketing in-house? Có — tư vấn chiến lược + thực thi mảng chuyên sâu

📝 NHIỆM VỤ
Đọc câu hỏi user → trả lời thân thiện bằng tiếng Việt (xưng "anh/chị" lịch sự).

LUẬT TRẢ LỜI:
- Câu trả lời ngắn gọn 2-5 câu, KHÔNG dài dòng, KHÔNG dùng markdown heading
- Nếu liên quan đến dịch vụ → giải thích ngắn cách Click Star hỗ trợ + gợi ý 1-3 links đến /services/[slug]
- Nếu hỏi giá → đề cập có 3 gói tham khảo, link /pricing
- Nếu hỏi case study/khách hàng → đề cập 4 dự án + link /about hoặc /
- Nếu hỏi liên hệ → cung cấp hotline 0977 713 428 và email
- Nếu hỏi blog/tin tức → link /blog
- Nếu CÂU HỎI HOÀN TOÀN KHÔNG LIÊN QUAN (thời tiết, tin tức ngẫu nhiên) → lịch sự nói Click Star chuyên giải pháp digital, gợi ý gọi hotline tư vấn

ĐỊNH DẠNG OUTPUT JSON THUẦN (KHÔNG markdown wrap):
{
  "answer": "Câu trả lời 2-5 câu, có thể bold/italic markdown ngắn",
  "links": [
    {"title": "Tên hiển thị", "href": "/services/website" | "/pricing" | "/about" | "/blog" | "tel:0977713428" | "mailto:clickstar.vn@gmail.com", "type": "service" | "page" | "contact" | "blog"}
  ]
}

Tối đa 4 links. Links phải LIÊN QUAN câu trả lời, sắp theo độ phù hợp giảm dần.`

export async function POST(req: Request) {
  try {
    const { query } = (await req.json()) as { query?: string }
    const q = query?.trim()
    if (!q || q.length < 3) {
      return NextResponse.json({ error: 'Vui lòng nhập câu hỏi chi tiết hơn (tối thiểu 3 ký tự)' }, { status: 400 })
    }
    if (q.length > 500) {
      return NextResponse.json({ error: 'Câu hỏi tối đa 500 ký tự' }, { status: 400 })
    }

    // Read OpenAI key from Vercel env (server-only, encrypted at rest).
    // We don't read from DB because RLS only allows admins, and this is a public endpoint.
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      return NextResponse.json(
        { error: 'AI tạm thời chưa khả dụng. Vui lòng liên hệ hotline 0977 713 428.' },
        { status: 503 }
      )
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_BASE },
          { role: 'user', content: q },
        ],
        temperature: 0.4,
        max_tokens: 1000,
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
    const VALID_HREF = (h: string) =>
      typeof h === 'string' &&
      (h.startsWith('/services/') ||
        h === '/pricing' ||
        h === '/about' ||
        h === '/blog' ||
        h === '/' ||
        h.startsWith('/blog/') ||
        h.startsWith('tel:') ||
        h.startsWith('mailto:'))

    const links = Array.isArray(parsed.links)
      ? parsed.links
          .filter((l: any) => l && l.title && VALID_HREF(l.href))
          .slice(0, 4)
          .map((l: any) => ({ title: String(l.title), href: l.href, type: l.type || 'page' }))
      : []

    const answer = typeof parsed.answer === 'string' ? parsed.answer.trim() : ''
    if (!answer) {
      return NextResponse.json({ error: 'AI không trả lời được nội dung' }, { status: 502 })
    }

    return NextResponse.json({ answer, links })
  } catch (err: any) {
    console.error('service-router error:', err)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
