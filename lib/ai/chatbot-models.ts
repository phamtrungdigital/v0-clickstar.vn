// Danh sách nhà cung cấp + model cho chatbot website. Client-safe (không import gì phía máy chủ).
// Nhà cung cấp suy ra từ tên model: bắt đầu bằng "claude" → Anthropic, còn lại → OpenAI. Nhờ vậy không cần thêm cột
// trong cơ sở dữ liệu: cột `chatbot_settings.model` đã đủ cho cả hai bên.

export type ChatProvider = 'openai' | 'anthropic'

export type ChatModelOption = { value: string; label: string; note: string }

export const CHAT_PROVIDERS: { value: ChatProvider; label: string; keyHint: string; keyPrefix: string; keyUrl: string }[] = [
  { value: 'openai', label: 'OpenAI (GPT)', keyHint: 'sk-...', keyPrefix: 'sk-', keyUrl: 'platform.openai.com/api-keys' },
  { value: 'anthropic', label: 'Anthropic (Claude)', keyHint: 'sk-ant-...', keyPrefix: 'sk-ant-', keyUrl: 'console.anthropic.com/settings/keys' },
]

export const CHAT_MODELS: Record<ChatProvider, ChatModelOption[]> = {
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o mini', note: 'Rẻ nhất, nhanh' },
    { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini', note: 'Đọc nội dung dài chính xác hơn, chi phí khoảng 1,5 lần 4o mini' },
    { value: 'gpt-4o', label: 'GPT-4o', note: 'Chất lượng cao, đắt nhất (khoảng 15 lần 4o mini)' },
  ],
  anthropic: [
    { value: 'claude-haiku-5-5', label: 'Claude Haiku 5.5', note: 'Rẻ nhất, nhanh (0,10 USD / 0,50 USD mỗi triệu token)' },
    { value: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', note: 'Cân bằng tốc độ và chất lượng (2 USD / 10 USD)' },
    { value: 'claude-opus-5-5', label: 'Claude Opus 5.5', note: 'Thông minh, chậm hơn (4 USD / 20 USD)' },
    { value: 'claude-fable-5-2', label: 'Claude Fable 5.2', note: 'Mạnh nhất, đắt và chậm (8 USD / 40 USD), ít cần cho chatbot' },
  ],
}

export const DEFAULT_MODEL: Record<ChatProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-haiku-5-5',
}

/** Suy ra nhà cung cấp từ tên model. */
export function providerOfModel(model: string | null | undefined): ChatProvider {
  return /^claude/i.test((model ?? '').trim()) ? 'anthropic' : 'openai'
}

/** Model có nằm trong danh sách gợi ý của nhà cung cấp không (để giao diện biết có phải "model khác"). */
export function isListedModel(model: string): boolean {
  return [...CHAT_MODELS.openai, ...CHAT_MODELS.anthropic].some((m) => m.value === model)
}

/** Tên model hợp lệ: chữ, số, dấu chấm, gạch, hai chấm; tối đa 100 ký tự. */
export function isValidModelId(model: unknown): model is string {
  return typeof model === 'string' && model.length > 0 && model.length <= 100 && /^[A-Za-z0-9._:-]+$/.test(model)
}

/** Dạng khóa đúng của từng nhà cung cấp (kiểm tra sơ bộ, chưa phải kiểm tra với nhà cung cấp). */
export function looksLikeKey(provider: ChatProvider, key: string): boolean {
  const k = key.trim()
  if (k.length < 20 || k.length > 400 || /\s/.test(k)) return false
  return provider === 'anthropic' ? k.startsWith('sk-ant-') : k.startsWith('sk-') && !k.startsWith('sk-ant-')
}
