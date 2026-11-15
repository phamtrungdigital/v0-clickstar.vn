// Gọi mô hình ngôn ngữ cho chatbot website. Server-only.
//  - OpenAI: gọi trực tiếp API chat/completions (giữ nguyên cách chạy cũ của bot).
//  - Anthropic (Claude): dùng SDK chính thức @anthropic-ai/sdk.
// Trả kết quả dạng { ok } thay vì ném lỗi để nơi gọi biết LOẠI lỗi (khóa sai, model không có, hết hạn mức...)
// và nói lại cho quản trị viên bằng tiếng Việt dễ hiểu.
import Anthropic from '@anthropic-ai/sdk'
import type { ChatProvider } from './chatbot-models'

export type LlmTurn = { role: 'user' | 'assistant'; content: string }
export type LlmErrorKind = 'auth' | 'model' | 'rate' | 'billing' | 'refusal' | 'timeout' | 'network' | 'other'
export type LlmUsage = { input: number; cached: number; output: number }
export type LlmResult =
  | { ok: true; text: string; usage: LlmUsage | null }
  | { ok: false; kind: LlmErrorKind; status: number; detail: string }

/** Giải thích lỗi cho quản trị viên (không lộ chi tiết kỹ thuật cho khách: nơi gọi tự chọn câu hiển thị). */
export function explainLlmError(kind: LlmErrorKind, provider: ChatProvider): string {
  const name = provider === 'anthropic' ? 'Anthropic' : 'OpenAI'
  switch (kind) {
    case 'auth':
      return `${name} không chấp nhận khóa này (sai, đã bị thu hồi hoặc chưa đủ quyền). Kiểm tra lại khóa.`
    case 'model':
      return `${name} không có model này hoặc tài khoản chưa được dùng model này. Chọn model khác trong danh sách.`
    case 'rate':
      return `${name} đang giới hạn tốc độ (quá nhiều yêu cầu). Thử lại sau ít phút.`
    case 'billing':
      return `Tài khoản ${name} hết số dư hoặc chưa nạp tiền. Vào trang quản lý của ${name} để nạp thêm.`
    case 'refusal':
      return `${name} từ chối trả lời yêu cầu này.`
    case 'timeout':
      return `${name} trả lời quá lâu. Thử lại hoặc chọn model nhanh hơn.`
    case 'network':
      return `Không kết nối được tới ${name}. Thử lại sau.`
    default:
      return `${name} báo lỗi. Thử lại hoặc chọn model khác.`
  }
}

/** Model Claude thế hệ 5 hỗ trợ tham số effort (model cũ hơn sẽ báo lỗi nếu gửi). */
const isClaude5 = (model: string) => /^claude-(haiku|sonnet|opus|fable|mythos)-5/i.test(model)

/** Claude cần tin nhắn đầu là của khách và các lượt xen kẽ: bỏ lượt trợ lý ở đầu, gộp các lượt liền nhau cùng vai. */
function normalizeForAnthropic(turns: LlmTurn[]): LlmTurn[] {
  const out: LlmTurn[] = []
  for (const t of turns) {
    if (out.length === 0 && t.role !== 'user') continue
    const last = out[out.length - 1]
    if (last && last.role === t.role) last.content += '\n\n' + t.content
    else out.push({ ...t })
  }
  return out
}

export type ChatJsonOpts = {
  provider: ChatProvider
  apiKey: string
  model: string
  /** Phần cố định (prompt + hợp đồng + nội dung website): đặt trước để được cache tiền tố. */
  system: string
  /** Ghi chú ngắn đổi theo lượt (ví dụ ngôn ngữ khách đang xem). */
  notes?: string[]
  history?: LlmTurn[]
  /** Nhắc thêm đặt sát câu hỏi (chỉ khi câu hỏi khớp). */
  pastNote?: string | null
  user: string
  maxTokens?: number
}

export async function chatJson(opts: ChatJsonOpts): Promise<LlmResult> {
  return opts.provider === 'anthropic' ? callAnthropic(opts) : callOpenAI(opts)
}

async function callOpenAI(opts: ChatJsonOpts): Promise<LlmResult> {
  let res: Response
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${opts.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: opts.model,
        messages: [
          { role: 'system', content: opts.system },
          ...(opts.notes ?? []).map((n) => ({ role: 'system', content: n })),
          ...(opts.history ?? []),
          ...(opts.pastNote ? [{ role: 'system', content: opts.pastNote }] : []),
          { role: 'user', content: opts.user },
        ],
        temperature: 0.2,
        max_tokens: opts.maxTokens ?? 1000,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(28_000),
    })
  } catch (err) {
    const timeout = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')
    return { ok: false, kind: timeout ? 'timeout' : 'network', status: 502, detail: String(err) }
  }

  if (!res.ok) {
    const raw = await res.text()
    let code = ''
    let type = ''
    let message = raw
    try {
      const j = JSON.parse(raw)
      code = String(j?.error?.code ?? '')
      type = String(j?.error?.type ?? '')
      message = j?.error?.message || raw
    } catch {}
    // Hết số dư báo bằng nhiều dạng: type "insufficient_quota", code "credit_balance_exhausted" / "billing_hard_limit_reached"...
    const outOfCredit =
      type === 'insufficient_quota' || /quota|credit|billing/i.test(code) || /no credits|credit balance|exceeded your current quota|billing/i.test(String(message))
    let kind: LlmErrorKind = 'other'
    if (res.status === 401) kind = 'auth'
    else if (res.status === 404 || code === 'model_not_found') kind = 'model'
    else if (outOfCredit) kind = 'billing'
    else if (res.status === 429) kind = 'rate'
    return { ok: false, kind, status: res.status, detail: String(message).slice(0, 300) }
  }

  const data = await res.json()
  const u = data.usage
  const text = data.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text) return { ok: false, kind: 'other', status: 502, detail: 'empty response' }
  return {
    ok: true,
    text,
    usage: u ? { input: u.prompt_tokens ?? 0, cached: u.prompt_tokens_details?.cached_tokens ?? 0, output: u.completion_tokens ?? 0 } : null,
  }
}

async function callAnthropic(opts: ChatJsonOpts): Promise<LlmResult> {
  const client = new Anthropic({ apiKey: opts.apiKey, maxRetries: 1, timeout: 28_000 })
  const messages = normalizeForAnthropic([
    ...(opts.history ?? []),
    { role: 'user', content: opts.pastNote ? `${opts.pastNote}\n\n${opts.user}` : opts.user },
  ])
  try {
    const res = await client.messages.create({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 4000,
      // Khối lớn cố định đứng đầu và gắn cache_control: lượt sau đọc lại từ cache (rẻ hơn nhiều).
      system: [
        { type: 'text', text: opts.system, cache_control: { type: 'ephemeral' } },
        ...((opts.notes ?? []).length ? [{ type: 'text' as const, text: (opts.notes ?? []).join('\n') }] : []),
      ],
      messages,
      // Chatbot hỏi đáp ngắn: effort thấp cho nhanh và rẻ (chỉ model thế hệ 5 nhận tham số này).
      ...(isClaude5(opts.model) ? { output_config: { effort: 'low' as const } } : {}),
    })
    if (res.stop_reason === 'refusal') return { ok: false, kind: 'refusal', status: 502, detail: 'refusal' }
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
    if (!text) return { ok: false, kind: 'other', status: 502, detail: 'empty response' }
    return {
      ok: true,
      text,
      usage: {
        input: res.usage.input_tokens + (res.usage.cache_read_input_tokens ?? 0) + (res.usage.cache_creation_input_tokens ?? 0),
        cached: res.usage.cache_read_input_tokens ?? 0,
        output: res.usage.output_tokens,
      },
    }
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      return { ok: false, kind: 'auth', status: 502, detail: err.message.slice(0, 300) }
    }
    if (err instanceof Anthropic.NotFoundError) {
      return { ok: false, kind: 'model', status: 502, detail: err.message.slice(0, 300) }
    }
    if (err instanceof Anthropic.RateLimitError) {
      return { ok: false, kind: 'rate', status: 502, detail: err.message.slice(0, 300) }
    }
    if (err instanceof Anthropic.BadRequestError) {
      const m = err.message
      const billing = /credit balance|billing|payment/i.test(m)
      return { ok: false, kind: billing ? 'billing' : /model/i.test(m) ? 'model' : 'other', status: 502, detail: m.slice(0, 300) }
    }
    if (err instanceof Anthropic.APIConnectionTimeoutError) {
      return { ok: false, kind: 'timeout', status: 502, detail: 'timeout' }
    }
    if (err instanceof Anthropic.APIConnectionError) {
      return { ok: false, kind: 'network', status: 502, detail: err.message.slice(0, 300) }
    }
    if (err instanceof Anthropic.APIError) {
      return { ok: false, kind: 'other', status: err.status ?? 502, detail: err.message.slice(0, 300) }
    }
    return { ok: false, kind: 'other', status: 502, detail: String(err).slice(0, 300) }
  }
}

/** Gọi thử một câu rất ngắn để biết khóa + model có chạy không. */
export async function pingModel(opts: { provider: ChatProvider; apiKey: string; model: string }): Promise<
  { ok: true; ms: number; reply: string } | { ok: false; kind: LlmErrorKind; detail: string }
> {
  const t0 = Date.now()
  const r = await chatJson({
    provider: opts.provider,
    apiKey: opts.apiKey,
    model: opts.model,
    system: 'Chỉ trả lời đúng một chữ: OK',
    user: 'ping',
    maxTokens: opts.provider === 'anthropic' ? 300 : 16,
  })
  if (!r.ok) return { ok: false, kind: r.kind, detail: r.detail }
  return { ok: true, ms: Date.now() - t0, reply: r.text.slice(0, 40) }
}

/** Lấy khối JSON đầu tiên trong phản hồi (Claude đôi khi bọc ```json ... ```). */
export function extractJson(text: string): unknown {
  const t = text.trim()
  try {
    return JSON.parse(t)
  } catch {}
  const a = t.indexOf('{')
  const b = t.lastIndexOf('}')
  if (a >= 0 && b > a) {
    try {
      return JSON.parse(t.slice(a, b + 1))
    } catch {}
  }
  return null
}
