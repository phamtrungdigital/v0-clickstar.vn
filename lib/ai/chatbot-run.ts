// Lõi gọi bot service-router. Dùng chung cho:
//  - app/api/ai/service-router/route.ts (endpoint công khai widget gọi)
//  - app/admin-cls/ai/chatbot-actions.ts (nút Test trong admin)
// => Test trong admin chạy ĐÚNG đường code thật của bot.
import { DEFAULT_CHATBOT_SYSTEM_PROMPT } from '@/lib/cms/chatbot-shared'

export type ChatbotLink = { title: string; href: string; type: string }
export type ChatbotRunResult =
  | { ok: true; answer: string; links: ChatbotLink[] }
  | { ok: false; error: string; status: number }

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

export async function runServiceRouter(opts: {
  query: string
  systemPrompt?: string | null
  model?: string | null
}): Promise<ChatbotRunResult> {
  const q = opts.query?.trim()
  if (!q || q.length < 3) {
    return { ok: false, error: 'Vui lòng nhập câu hỏi chi tiết hơn (tối thiểu 3 ký tự)', status: 400 }
  }
  if (q.length > 500) {
    return { ok: false, error: 'Câu hỏi tối đa 500 ký tự', status: 400 }
  }

  // API key đọc từ env (server-only, encrypted) — KHÔNG lưu trong DB vì đây là endpoint công khai.
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return { ok: false, error: 'AI tạm thời chưa khả dụng. Vui lòng liên hệ hotline 0977 713 428.', status: 503 }
  }

  const system = opts.systemPrompt?.trim() || DEFAULT_CHATBOT_SYSTEM_PROMPT
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
          { role: 'user', content: q },
        ],
        temperature: 0.4,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    })
  } catch (err) {
    console.error('service-router fetch error:', err)
    return { ok: false, error: 'Không kết nối được AI, vui lòng thử lại hoặc gọi 0977 713 428.', status: 502 }
  }

  if (!res.ok) {
    const errText = await res.text()
    console.error('OpenAI error:', errText)
    return { ok: false, error: 'AI tạm lỗi, vui lòng thử lại hoặc gọi 0977 713 428.', status: 502 }
  }

  const data = await res.json()
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
        .filter((l: any) => l && l.title && VALID_HREF(l.href))
        .slice(0, 4)
        .map((l: any) => ({ title: String(l.title), href: l.href, type: l.type || 'page' }))
    : []

  const answer = typeof parsed.answer === 'string' ? parsed.answer.trim() : ''
  if (!answer) return { ok: false, error: 'AI không trả lời được nội dung', status: 502 }

  return { ok: true, answer, links }
}
