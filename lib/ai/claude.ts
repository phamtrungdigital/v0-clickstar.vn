// Gọi Claude bằng SDK chính thức (@anthropic-ai/sdk). CHỈ dùng phía server
// (route handler / server action) — file này nhận API key, không import từ client.
//
// Quy ước model 5.x (tài liệu Anthropic 10/2026):
// - Opus 5.5 / Sonnet 5.5 / Fable 5.1: thinking luôn bật (adaptive), KHÔNG gửi `thinking`
//   hay `temperature` (400). Điều chỉnh độ sâu bằng `output_config.effort`.
// - Thinking ăn vào `max_tokens` → đặt trần rộng (mặc định 32k, bài dài 64k) và luôn stream.
// - Bị bộ lọc an toàn từ chối → `stop_reason: "refusal"`; bật `fallbacks: "default"` để
//   server tự chạy lại trên model dự phòng (chỉ Opus/Sonnet/Fable 5.x, không Haiku).
import Anthropic from '@anthropic-ai/sdk'

type BetaMessage = Anthropic.Beta.BetaMessage
type BetaMessageParam = Anthropic.Beta.BetaMessageParam
type BetaToolUnion = Anthropic.Beta.BetaToolUnion
export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max'

/** Giá USD / 1 triệu token (bảng giá Anthropic 10/2026). Model lạ → tính theo Opus 5.5. */
const PRICES: Record<string, { input: number; output: number; cacheRead: number }> = {
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2 },
  'claude-sonnet-5-5': { input: 2, output: 10, cacheRead: 0.2 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheRead: 0.01 },
  'claude-fable-5-1': { input: 10, output: 50, cacheRead: 0.25 },
  'claude-opus-5': { input: 5, output: 25, cacheRead: 0.5 },
  'claude-opus-4-8': { input: 5, output: 25, cacheRead: 0.5 },
  'claude-opus-4-7': { input: 5, output: 25, cacheRead: 0.5 },
  'claude-sonnet-4-6': { input: 3, output: 15, cacheRead: 0.3 },
  'claude-haiku-4-5-20251001': { input: 1, output: 5, cacheRead: 0.1 },
}
/** Web search: $10 / 1.000 lượt. */
const WEB_SEARCH_USD = 0.01

/** Model có server-side fallback khi bị từ chối (không có cho Haiku). */
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-1', 'claude-opus-5'])
/** Model nhận `output_config.effort` (Haiku 4.5 và Sonnet 4.5 trở xuống báo lỗi). */
const EFFORT_RE = /^claude-(opus-5|sonnet-5|fable-5|haiku-5|opus-4-[678]|sonnet-4-6)/

export type ClaudeUsage = {
  model: string
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  webSearches: number
  costUsd: number
}

/** Lỗi sau khi đã gọi API (đã tốn tiền): mang theo usage để bên gọi vẫn cộng chi phí. */
export class ClaudeError extends Error {
  usage: ClaudeUsage | null = null
}

/** Gắn usage vào lỗi bất kỳ (vd lỗi đọc JSON sau khi API đã trả lời). */
export function withUsage<E>(err: E, usage: ClaudeUsage | null): E {
  if (err && typeof err === 'object' && usage) (err as { usage?: ClaudeUsage }).usage = usage
  return err
}

export function usageOfError(err: unknown): ClaudeUsage | null {
  if (!err || typeof err !== 'object') return null
  return (err as { usage?: ClaudeUsage }).usage ?? null
}

export class ClaudeRefusalError extends ClaudeError {
  constructor(public category: string | null) {
    super(
      `Claude từ chối trả lời yêu cầu này${category ? ` (nhóm: ${category})` : ''}. Thử đổi cách diễn đạt chủ đề.`
    )
    this.name = 'ClaudeRefusalError'
  }
}

export class ClaudeTruncatedError extends ClaudeError {
  constructor() {
    super('Câu trả lời bị cắt vì chạm trần độ dài (max_tokens). Thử lại hoặc giảm độ dài bài.')
    this.name = 'ClaudeTruncatedError'
  }
}

function priceOf(model: string) {
  return PRICES[model] ?? PRICES['claude-opus-5-5']
}

function tokenCost(model: string, t: { input: number; output: number; cacheRead: number; cacheWrite: number }) {
  const p = priceOf(model)
  return (t.input * p.input + t.cacheWrite * p.input * 1.25 + t.cacheRead * p.cacheRead + t.output * p.output) / 1_000_000
}

/**
 * Cộng usage + chi phí. Khi model dự phòng trả lời (server-side fallback), usage tổng chỉ
 * tính lượt được trả về → tính theo từng lượt trong `usage.iterations`, mỗi lượt theo giá
 * model của chính nó (kể cả lượt model chính đã từ chối).
 */
export function summarizeUsage(model: string, messages: BetaMessage[]): ClaudeUsage {
  let inputTokens = 0
  let outputTokens = 0
  let cacheReadTokens = 0
  let cacheWriteTokens = 0
  let webSearches = 0
  let tokenUsd = 0
  const served = new Set<string>()
  for (const m of messages) {
    webSearches += m.usage.server_tool_use?.web_search_requests ?? 0
    const iters = m.usage.iterations ?? []
    const fellBack = iters.some((it) => it.type === 'fallback_message')
    if (fellBack) {
      for (const it of iters) {
        if (it.type !== 'message' && it.type !== 'fallback_message') continue
        const itModel = ('model' in it && it.model) || model
        const t = {
          input: it.input_tokens ?? 0,
          output: it.output_tokens ?? 0,
          cacheRead: it.cache_read_input_tokens ?? 0,
          cacheWrite: it.cache_creation_input_tokens ?? 0,
        }
        inputTokens += t.input
        outputTokens += t.output
        cacheReadTokens += t.cacheRead
        cacheWriteTokens += t.cacheWrite
        tokenUsd += tokenCost(String(itModel), t)
        if (it.type === 'fallback_message') served.add(String(itModel))
      }
      continue
    }
    const t = {
      input: m.usage.input_tokens ?? 0,
      output: m.usage.output_tokens ?? 0,
      cacheRead: m.usage.cache_read_input_tokens ?? 0,
      cacheWrite: m.usage.cache_creation_input_tokens ?? 0,
    }
    inputTokens += t.input
    outputTokens += t.output
    cacheReadTokens += t.cacheRead
    cacheWriteTokens += t.cacheWrite
    tokenUsd += tokenCost(model, t)
  }
  const costUsd = tokenUsd + webSearches * WEB_SEARCH_USD
  const label = served.size ? `${model}→${[...served].join('+')}` : model
  return { model: label, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, webSearches, costUsd }
}

export function addUsage(a: ClaudeUsage | null, b: ClaudeUsage): ClaudeUsage {
  if (!a) return b
  return {
    model: a.model === b.model ? a.model : `${a.model}+${b.model}`,
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    cacheReadTokens: a.cacheReadTokens + b.cacheReadTokens,
    cacheWriteTokens: a.cacheWriteTokens + b.cacheWriteTokens,
    webSearches: a.webSearches + b.webSearches,
    costUsd: a.costUsd + b.costUsd,
  }
}

export type ClaudeCallOpts = {
  apiKey: string
  model: string
  system: string
  /** Hoặc `prompt` (1 lượt user) hoặc `messages` đầy đủ. */
  prompt?: string
  messages?: BetaMessageParam[]
  maxTokens?: number
  effort?: Effort
  tools?: BetaToolUnion[]
  /** JSON Schema → structured output (không dùng chung với citations/web search). */
  jsonSchema?: Record<string, unknown>
  /** Nhận từng đoạn chữ khi stream (để báo tiến độ / giữ kết nối SSE sống). */
  onText?: (delta: string) => void
  /** Số lần tự tiếp tục khi server tool dừng giữa chừng (`pause_turn`). */
  maxContinuations?: number
  /** Huỷ request (người dùng bấm Dừng / đóng tab) → không tốn tiếp. */
  signal?: AbortSignal
}

export type ClaudeResult = {
  text: string
  /** Toàn bộ message (kể cả các lượt `pause_turn` đã nối) — để đọc citations. */
  messages: BetaMessage[]
  usage: ClaudeUsage
}

/**
 * Gọi Claude 1 lần (stream), tự nối các lượt `pause_turn` của web search, kiểm
 * `refusal` / `max_tokens`, trả chữ cuối + usage + chi phí ước tính.
 */
export async function callClaude(opts: ClaudeCallOpts): Promise<ClaudeResult> {
  const client = new Anthropic({ apiKey: opts.apiKey, maxRetries: 2 })
  const model = opts.model
  const messages: BetaMessageParam[] = opts.messages
    ? [...opts.messages]
    : [{ role: 'user', content: opts.prompt ?? '' }]

  const outputConfig: Record<string, unknown> = {}
  if (opts.effort && EFFORT_RE.test(model)) outputConfig.effort = opts.effort
  if (opts.jsonSchema) outputConfig.format = { type: 'json_schema', schema: opts.jsonSchema }

  const results: BetaMessage[] = []
  const maxTurns = 1 + (opts.maxContinuations ?? 3)

  for (let turn = 0; turn < maxTurns; turn++) {
    const params: Anthropic.Beta.MessageCreateParamsStreaming = {
      model,
      max_tokens: opts.maxTokens ?? 32000,
      system: opts.system,
      messages,
      stream: true,
      ...(opts.tools ? { tools: opts.tools } : {}),
      ...(Object.keys(outputConfig).length ? { output_config: outputConfig } : {}),
      ...(FALLBACK_MODELS.has(model)
        ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }
        : {}),
    }
    // stream() nhận cả `stream: true`; bỏ đi để đúng chữ ký.
    const { stream: _s, ...streamParams } = params
    const stream = client.beta.messages.stream(streamParams, opts.signal ? { signal: opts.signal } : undefined)
    if (opts.onText) stream.on('text', opts.onText)
    const message = await stream.finalMessage()
    results.push(message)

    if (message.stop_reason === 'refusal') {
      throw withUsage(new ClaudeRefusalError(message.stop_details?.category ?? null), summarizeUsage(model, results))
    }
    if (message.stop_reason === 'pause_turn') {
      // Web search dài: server tạm dừng → gửi lại để model chạy tiếp.
      messages.push({ role: 'assistant', content: message.content })
      continue
    }
    if (message.stop_reason === 'max_tokens') {
      throw withUsage(new ClaudeTruncatedError(), summarizeUsage(model, results))
    }
    break
  }

  const last = results[results.length - 1]
  if (last.stop_reason === 'pause_turn') {
    // Hết số lần tự tiếp tục mà server vẫn chưa xong → báo lỗi thay vì trả kết quả dở.
    throw withUsage(
      new ClaudeError('AI chưa chạy xong sau nhiều lượt tìm kiếm. Bấm chạy lại bước này.'),
      summarizeUsage(model, results)
    )
  }
  const text = last.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
  return { text, messages: results, usage: summarizeUsage(model, results) }
}

/** Gọi Claude với JSON Schema và parse kết quả (structured output nên luôn là JSON hợp lệ). */
export async function callClaudeJson<T>(opts: ClaudeCallOpts & { jsonSchema: Record<string, unknown> }) {
  const r = await callClaude(opts)
  let data: T
  try {
    data = JSON.parse(r.text) as T
  } catch {
    throw withUsage(new Error('AI trả JSON không hợp lệ. Thử lại.'), r.usage)
  }
  return { data, usage: r.usage, messages: r.messages }
}

export type WebSource = { id: number; url: string; title: string; quote: string }

/**
 * Gom nguồn từ citations của web search (`web_search_result_location`): mỗi URL 1 mục,
 * giữ câu trích ngắn đầu tiên. Đây là danh sách nguồn "đã kiểm" cho các bước sau.
 */
export function collectWebSources(messages: BetaMessage[]): WebSource[] {
  const byUrl = new Map<string, WebSource>()
  for (const m of messages) {
    for (const block of m.content) {
      if (block.type !== 'text' || !block.citations) continue
      for (const c of block.citations) {
        if (c.type !== 'web_search_result_location') continue
        const existing = byUrl.get(c.url)
        if (existing) {
          if (existing.quote.length < 400 && !existing.quote.includes(c.cited_text)) {
            existing.quote = `${existing.quote} … ${c.cited_text}`.slice(0, 600)
          }
          continue
        }
        byUrl.set(c.url, {
          id: byUrl.size + 1,
          url: c.url,
          title: c.title ?? c.url,
          quote: c.cited_text.slice(0, 600),
        })
      }
    }
  }
  return Array.from(byUrl.values())
}

/** Chữ của toàn bộ chuỗi message (nối các lượt pause_turn). */
export function textOfMessages(messages: BetaMessage[]): string {
  return messages
    .flatMap((m) => m.content)
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
}
