// Lõi gọi bot service-router. Dùng chung cho:
//  - app/api/ai/service-router/route.ts (endpoint công khai widget gọi)
//  - app/admin-cls/ai/chatbot-actions.ts (nút Test trong admin)
// => Test trong admin chạy ĐÚNG đường code thật của bot.
import { DEFAULT_CHATBOT_SYSTEM_PROMPT } from '@/lib/cms/chatbot-shared'
import { getSiteKnowledge } from '@/lib/ai/site-knowledge'

export type ChatbotLink = { title: string; href: string; type: string }
export type ChatbotTurn = { role: 'user' | 'assistant'; content: string }
export type ChatbotRunResult =
  | { ok: true; answer: string; links: ChatbotLink[] }
  | { ok: false; error: string; status: number }

const MAX_HISTORY_TURNS = 8
const MAX_TURN_CHARS = 1500

/** Chỉ nhận lịch sử hợp lệ từ client: đúng role, cắt độ dài, giữ vài lượt gần nhất. */
function sanitizeHistory(raw: unknown): ChatbotTurn[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (m): m is ChatbotTurn =>
        !!m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_TURN_CHARS) }))
}

/**
 * Phần hệ thống do code quản (admin không sửa được) — giữ cố định định dạng JSON,
 * danh sách link hợp lệ và kiến thức website. Đặt SAU prompt admin và TRƯỚC phần
 * thay đổi theo từng lượt, để OpenAI cache được cả khối tiền tố dài này.
 */
function buildContract(knowledgeText: string, routes: string[], hotline: string, builtAt: string) {
  return `
────────────────────────
HOTLINE CHÍNH THỨC để mời khách gọi: ${hotline}

LINK: chỉ được gợi ý đường dẫn nằm trong danh sách sau, hoặc "tel:" / "mailto:":
${routes.join(', ')}

ĐỊNH DẠNG TRẢ VỀ — JSON thuần, không bọc markdown:
{"answer": "câu trả lời", "links": [{"title": "Tên hiển thị", "href": "/services/website", "type": "service" | "page" | "contact" | "blog"}]}
Tối đa 4 links, liên quan trực tiếp đến câu trả lời, xếp theo mức phù hợp giảm dần.
Trong "answer": gạch đầu dòng "- " (mỗi ý 1 dòng); chỉ in đậm **tên gói, mức giá, từ khoá chính** — KHÔNG in đậm cả câu hay cả đoạn (đọc trên điện thoại rất nặng); không dùng heading, bảng, link markdown.

════════ NỘI DUNG WEBSITE CLICKSTAR.VN (nguồn sự thật duy nhất · cập nhật ${builtAt}) ════════
${knowledgeText}
════════ HẾT NỘI DUNG WEBSITE ════════`
}

export async function runServiceRouter(opts: {
  query: string
  systemPrompt?: string | null
  model?: string | null
  history?: unknown
  lang?: string | null
  hotline?: string | null
}): Promise<ChatbotRunResult> {
  const q = opts.query?.trim()
  if (!q || q.length < 2) {
    return { ok: false, error: 'Vui lòng nhập câu hỏi chi tiết hơn', status: 400 }
  }
  if (q.length > 500) {
    return { ok: false, error: 'Câu hỏi tối đa 500 ký tự', status: 400 }
  }

  // API key đọc từ env (server-only, encrypted) — KHÔNG lưu trong DB vì đây là endpoint công khai.
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return { ok: false, error: 'AI tạm thời chưa khả dụng. Vui lòng liên hệ hotline 0977 713 428.', status: 503 }
  }

  const hotline = opts.hotline?.trim() || '0977 713 428'
  let knowledge: Awaited<ReturnType<typeof getSiteKnowledge>>
  try {
    knowledge = await getSiteKnowledge()
  } catch (err) {
    // DB lỗi vẫn phải trả lời được: dùng rỗng, prompt đã dặn không bịa → bot mời gọi hotline.
    console.error('site-knowledge build error:', err)
    knowledge = { text: '(Tạm thời không tải được nội dung website)', routes: ['/', '/pricing', '/contact'], builtAt: '' }
  }
  const allowed = new Set(knowledge.routes)
  const validHref = (h: unknown): h is string =>
    typeof h === 'string' && (allowed.has(h) || h.startsWith('tel:') || h.startsWith('mailto:'))

  const rules = opts.systemPrompt?.trim() || DEFAULT_CHATBOT_SYSTEM_PROMPT
  const system = rules + '\n' + buildContract(knowledge.text, knowledge.routes, hotline, knowledge.builtAt)
  const lang = opts.lang === 'en' ? 'en' : 'vi'
  const langNote =
    lang === 'en'
      ? 'Khách đang xem website bằng tiếng Anh → trả lời bằng TIẾNG ANH (trừ khi khách chủ động viết tiếng Việt).'
      : 'Khách đang xem website bằng tiếng Việt → trả lời bằng tiếng Việt (nếu khách viết tiếng Anh thì trả lời tiếng Anh).'

  const model = opts.model?.trim() || 'gpt-4o-mini'

  let res: Response
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'system', content: langNote },
          ...sanitizeHistory(opts.history),
          { role: 'user', content: q },
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    })
  } catch (err) {
    console.error('service-router fetch error:', err)
    return { ok: false, error: `Không kết nối được AI, vui lòng thử lại hoặc gọi ${hotline}.`, status: 502 }
  }

  if (!res.ok) {
    const errText = await res.text()
    console.error('OpenAI error:', errText)
    return { ok: false, error: `AI tạm lỗi, vui lòng thử lại hoặc gọi ${hotline}.`, status: 502 }
  }

  const data = await res.json()
  // Theo dõi chi phí trên Vercel logs: prompt chứa cả website (~25k token) nên cần
  // thấy tỉ lệ cached_tokens (OpenAI tự cache tiền tố giống nhau → rẻ 50–75%).
  const u = data.usage
  if (u) {
    console.log(
      `[chatbot] model=${model} in=${u.prompt_tokens} cached=${u.prompt_tokens_details?.cached_tokens ?? 0} out=${u.completion_tokens}`
    )
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) return { ok: false, error: 'AI không trả lời được', status: 502 }

  let parsed: any
  try {
    parsed = JSON.parse(content)
  } catch {
    return { ok: false, error: 'AI trả về định dạng không hợp lệ', status: 502 }
  }

  const links: ChatbotLink[] = Array.isArray(parsed.links)
    ? parsed.links
        .filter((l: any) => l && l.title && validHref(l.href))
        .slice(0, 4)
        .map((l: any) => ({ title: String(l.title), href: l.href, type: l.type || 'page' }))
    : []

  const answer = typeof parsed.answer === 'string' ? parsed.answer.trim() : ''
  if (!answer) return { ok: false, error: 'AI không trả lời được nội dung', status: 502 }

  return { ok: true, answer, links }
}
