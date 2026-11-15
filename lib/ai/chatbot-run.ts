// Lõi gọi bot service-router. Dùng chung cho:
//  - app/api/ai/service-router/route.ts (endpoint công khai widget gọi)
//  - app/admin-cls/ai/chatbot-actions.ts (nút Test trong admin)
// => Test trong admin chạy ĐÚNG đường code thật của bot.
import { DEFAULT_CHATBOT_SYSTEM_PROMPT } from '@/lib/cms/chatbot-shared'
import { getSiteKnowledge } from '@/lib/ai/site-knowledge'
import { getAiKey } from '@/lib/ai/ai-keys'
import { chatJson, explainLlmError, extractJson } from '@/lib/ai/llm-chat'
import { DEFAULT_MODEL, providerOfModel, CHAT_PROVIDERS } from '@/lib/ai/chatbot-models'

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

/**
 * Câu hỏi "đã làm dự án / hệ thống nào": gpt-4o-mini hay trả lời bằng mục phạm vi ("Các loại hệ
 * thống chúng tôi thiết kế…") vì trùng chữ "hệ thống", dù luật prompt đã dặn và dữ liệu đã gắn
 * nhãn (đo trên preview 4/10/2026: sai 2-3/4 lần). Nhắc lại ngay sát câu hỏi thì model nhỏ theo
 * được. Chỉ chèn khi câu hỏi khớp, không đổi phần system prompt lớn (giữ cache tiền tố của OpenAI).
 */
const PAST_WORK_RE =
  /(từng|đã)\s+(làm|triển khai|xây dựng|thực hiện|phát triển)|case\s*stud|dự án\s+(nào|gì|tiêu biểu)|làm cho\s+(ai|khách|bên nào)|(have|did)\s+you\s+(built|build|made|done|delivered)|past (projects|work)|portfolio/i
const PAST_WORK_NOTE =
  'Câu này hỏi về DỰ ÁN ĐÃ LÀM: trả lời từ khối "DỰ ÁN ĐÃ TRIỂN KHAI" (gồm cả các hệ thống phần mềm ẩn tên khách), mỗi dự án 1 dòng kèm lĩnh vực. KHÔNG liệt kê các dòng "Loại hệ thống nhận làm" (đó là phạm vi dịch vụ).'

export async function runServiceRouter(opts: {
  query: string
  systemPrompt?: string | null
  model?: string | null
  history?: unknown
  lang?: string | null
  hotline?: string | null
  /** Chạy từ nút Test trong trang quản trị: báo lỗi chi tiết bằng tiếng Việt cho quản trị viên thay vì câu chung cho khách. */
  forAdmin?: boolean
}): Promise<ChatbotRunResult> {
  const q = opts.query?.trim()
  if (!q || q.length < 2) {
    return { ok: false, error: 'Vui lòng nhập câu hỏi chi tiết hơn', status: 400 }
  }
  if (q.length > 500) {
    return { ok: false, error: 'Câu hỏi tối đa 500 ký tự', status: 400 }
  }

  // Nhà cung cấp suy ra từ tên model (claude* → Anthropic, còn lại → OpenAI). Khóa API lấy từ ai_settings (do quản trị viên
  // nhập trong trang quản trị) hoặc biến môi trường; không bao giờ trả xuống trình duyệt.
  const model = opts.model?.trim() || DEFAULT_MODEL.openai
  const provider = providerOfModel(model)
  const apiKey = await getAiKey(provider)
  if (!apiKey) {
    const label = CHAT_PROVIDERS.find((p) => p.value === provider)?.label ?? provider
    return {
      ok: false,
      error: opts.forAdmin
        ? `Chưa có khóa API của ${label}. Nhập khóa ở mục "Bộ não AI" rồi thử lại.`
        : 'AI tạm thời chưa khả dụng. Vui lòng liên hệ hotline 0383 406 735.',
      status: 503,
    }
  }

  const hotline = opts.hotline?.trim() || '0383 406 735'
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

  const llm = await chatJson({
    provider,
    apiKey,
    model,
    system,
    notes: [langNote],
    history: sanitizeHistory(opts.history),
    pastNote: PAST_WORK_RE.test(q) ? PAST_WORK_NOTE : null,
    user: q,
  })
  if (!llm.ok) {
    console.error(`[chatbot] provider=${provider} model=${model} kind=${llm.kind} status=${llm.status} ${llm.detail}`)
    return {
      ok: false,
      error: opts.forAdmin ? explainLlmError(llm.kind, provider) : `AI tạm lỗi, vui lòng thử lại hoặc gọi ${hotline}.`,
      status: 502,
    }
  }

  // Theo dõi chi phí trên Vercel logs: prompt chứa cả website (~25k token) nên cần thấy tỉ lệ token đọc từ cache.
  if (llm.usage) {
    console.log(`[chatbot] provider=${provider} model=${model} in=${llm.usage.input} cached=${llm.usage.cached} out=${llm.usage.output}`)
  }

  const parsed = extractJson(llm.text) as { answer?: unknown; links?: unknown } | null
  if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'AI trả về định dạng không hợp lệ', status: 502 }

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
