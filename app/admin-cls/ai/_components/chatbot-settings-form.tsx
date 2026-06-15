'use client'

import { useState, useTransition } from 'react'
import {
  MessageCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Zap,
  Loader2,
  RotateCcw,
  Send,
} from 'lucide-react'
import { saveChatbotSettings, testChatbot } from '../chatbot-actions'
import {
  CHATBOT_MODEL_OPTIONS,
  WIDGET_MODE_OPTIONS,
  DEFAULT_CHATBOT_SYSTEM_PROMPT,
  DEFAULT_CHATBOT_CONFIG,
  type ChatbotSettings,
  type ChatbotSettingsUpdate,
  type WidgetMode,
  type QuickPrompt,
} from '@/lib/cms/chatbot-shared'

function initDraft(initial: ChatbotSettings | null): ChatbotSettingsUpdate {
  const d = DEFAULT_CHATBOT_CONFIG
  return {
    enabled: initial?.enabled ?? d.enabled,
    widget_mode: initial?.widget_mode ?? d.widget_mode,
    bot_name: initial?.bot_name ?? d.bot_name,
    welcome_message: initial?.welcome_message ?? d.welcome_message,
    quick_prompts: initial?.quick_prompts ?? d.quick_prompts,
    hotline: initial?.hotline ?? d.hotline,
    system_prompt: initial?.system_prompt ?? null,
    model: initial?.model ?? 'gpt-4o-mini',
    hidden_paths: initial?.hidden_paths ?? d.hidden_paths,
    show_delay_ms: initial?.show_delay_ms ?? d.show_delay_ms,
    auto_close_ms: initial?.auto_close_ms ?? d.auto_close_ms,
    dismiss_hours: initial?.dismiss_hours ?? d.dismiss_hours,
    show_on_desktop: initial?.show_on_desktop ?? d.show_on_desktop,
    show_on_mobile: initial?.show_on_mobile ?? d.show_on_mobile,
  }
}

export function ChatbotSettingsForm({ initial }: { initial: ChatbotSettings | null }) {
  const [draft, setDraft] = useState<ChatbotSettingsUpdate>(() => initDraft(initial))
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Test state
  const [testQuery, setTestQuery] = useState('Bảng giá dịch vụ thế nào?')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ answer?: string; links?: any[]; error?: string } | null>(null)

  const update = <K extends keyof ChatbotSettingsUpdate>(key: K, value: ChatbotSettingsUpdate[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setStatus('dirty')
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveChatbotSettings(draft)
      if (result?.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2500)
      }
    })
  }

  const handleTest = async () => {
    if (status === 'dirty') {
      setTestResult({ error: 'Lưu thay đổi trước rồi test (test chạy theo config đã lưu).' })
      return
    }
    setTesting(true)
    setTestResult(null)
    const r = await testChatbot(testQuery)
    setTesting(false)
    setTestResult(r)
  }

  // ───── Quick prompt editors ─────
  const setPrompts = (lang: 'vi' | 'en', list: QuickPrompt[]) => {
    update('quick_prompts', { ...draft.quick_prompts, [lang]: list })
  }
  const addPrompt = (lang: 'vi' | 'en') =>
    setPrompts(lang, [...(draft.quick_prompts[lang] || []), { label: '', value: '' }])
  const updatePrompt = (lang: 'vi' | 'en', idx: number, field: 'label' | 'value', v: string) => {
    const list = [...(draft.quick_prompts[lang] || [])]
    list[idx] = { ...list[idx], [field]: v }
    setPrompts(lang, list)
  }
  const removePrompt = (lang: 'vi' | 'en', idx: number) =>
    setPrompts(lang, (draft.quick_prompts[lang] || []).filter((_, i) => i !== idx))

  return (
    <div className="space-y-3 max-w-4xl">
      {/* Header */}
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-sky-500" />
            Chatbot website
          </h1>
          <p className="text-[11px] text-slate-500">
            Bot AI hiển thị cho khách trên trang công khai — bật/tắt, nội dung, quy tắc hiển thị
          </p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã lưu
            </span>
          )}
          {status === 'dirty' && <span className="text-xs text-amber-600">● Chưa lưu</span>}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs text-red-600" title={errorMsg}>
              <AlertCircle className="w-3.5 h-3.5" />
              Lỗi
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* ───── Trạng thái + widget ───── */}
      <Section title="Trạng thái & hiển thị">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(e) => update('enabled', e.target.checked)}
            className="w-4 h-4 mt-0.5"
          />
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Bật bot trên website</div>
            <div className="text-[11px] text-slate-500">Tắt → khách không thấy bot, endpoint trả 503.</div>
          </div>
        </label>

        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Hiển thị widget nào
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WIDGET_MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('widget_mode', opt.value as WidgetMode)}
                className={`text-left p-2.5 rounded-md border-2 transition-colors ${
                  draft.widget_mode === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ───── Nội dung ───── */}
      <Section title="Nội dung (song ngữ)">
        <Field label="Tên bot — Tiếng Việt">
          <TextInput value={draft.bot_name.vi} onChange={(v) => update('bot_name', { ...draft.bot_name, vi: v })} />
        </Field>
        <Field label="Tên bot — English">
          <TextInput value={draft.bot_name.en} onChange={(v) => update('bot_name', { ...draft.bot_name, en: v })} />
        </Field>

        <Field label="Lời chào — Tiếng Việt">
          <TextArea
            value={draft.welcome_message.vi}
            onChange={(v) => update('welcome_message', { ...draft.welcome_message, vi: v })}
            rows={2}
          />
        </Field>
        <Field label="Lời chào — English">
          <TextArea
            value={draft.welcome_message.en}
            onChange={(v) => update('welcome_message', { ...draft.welcome_message, en: v })}
            rows={2}
          />
        </Field>

        <Field label="Hotline (hiển thị trong bot)">
          <TextInput value={draft.hotline} onChange={(v) => update('hotline', v)} />
        </Field>

        {/* Quick prompts VI */}
        <PromptEditor
          title="Câu hỏi gợi ý — Tiếng Việt"
          list={draft.quick_prompts.vi || []}
          onAdd={() => addPrompt('vi')}
          onUpdate={(i, f, v) => updatePrompt('vi', i, f, v)}
          onRemove={(i) => removePrompt('vi', i)}
        />
        {/* Quick prompts EN */}
        <PromptEditor
          title="Câu hỏi gợi ý — English"
          list={draft.quick_prompts.en || []}
          onAdd={() => addPrompt('en')}
          onUpdate={(i, f, v) => updatePrompt('en', i, f, v)}
          onRemove={(i) => removePrompt('en', i)}
        />
      </Section>

      {/* ───── Bộ não AI ───── */}
      <Section title="Bộ não AI">
        <Field label="Model">
          <select
            value={draft.model}
            onChange={(e) => update('model', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
          >
            {CHATBOT_MODEL_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500 mt-1">
            API key dùng biến môi trường <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">OPENAI_API_KEY</code> (không lưu trong DB).
          </p>
        </Field>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">System prompt</label>
            <button
              type="button"
              onClick={() => update('system_prompt', DEFAULT_CHATBOT_SYSTEM_PROMPT)}
              className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Khôi phục prompt mặc định
            </button>
          </div>
          <TextArea
            value={draft.system_prompt ?? ''}
            onChange={(v) => update('system_prompt', v)}
            rows={8}
            mono
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Để trống = dùng prompt mặc định (thông tin công ty, 6 dịch vụ, luật trả lời JSON). Sửa cẩn thận — bot trả về JSON {`{answer, links}`}.
          </p>
        </div>
      </Section>

      {/* ───── Quy tắc hiển thị ───── */}
      <Section title="Quy tắc hiển thị">
        <Field label="Trang ẩn bot (mỗi dòng 1 đường dẫn, khớp tiền tố)">
          <TextArea
            value={(draft.hidden_paths || []).join('\n')}
            onChange={(v) => update('hidden_paths', v.split('\n').map((s) => s.trim()).filter(Boolean))}
            rows={4}
            mono
          />
          <p className="text-[10px] text-slate-500 mt-1">
            VD: <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">/admin-cls</code> ẩn mọi trang admin;{' '}
            <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">/contact</code> ẩn trang liên hệ.
          </p>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Delay hiện thanh bar (giây)">
            <NumberInput
              value={Math.round(draft.show_delay_ms / 1000)}
              onChange={(n) => update('show_delay_ms', n * 1000)}
              min={0}
              max={120}
            />
          </Field>
          <Field label="Auto-close thanh bar (giây, 0 = tắt)">
            <NumberInput
              value={Math.round(draft.auto_close_ms / 1000)}
              onChange={(n) => update('auto_close_ms', n * 1000)}
              min={0}
              max={120}
            />
          </Field>
          <Field label="Ẩn lại sau khi tắt (giờ)">
            <NumberInput
              value={draft.dismiss_hours}
              onChange={(n) => update('dismiss_hours', n)}
              min={0}
              max={720}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-5 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.show_on_desktop}
              onChange={(e) => update('show_on_desktop', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Hiện trên Desktop</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.show_on_mobile}
              onChange={(e) => update('show_on_mobile', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Hiện trên Mobile</span>
          </label>
        </div>
        <p className="text-[10px] text-slate-500">
          Lưu ý: Delay & Auto-close chỉ áp dụng cho <strong>Thanh bar đáy</strong>. Nút tròn hiện ngay.
        </p>
      </Section>

      {/* ───── Test ───── */}
      <Section title="Test bot (gửi thật 1 câu)">
        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Nhập câu hỏi test…"
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
          />
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded disabled:opacity-50"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Gửi thử
          </button>
        </div>
        {testResult?.answer && (
          <div className="mt-3 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-md">
            <div className="text-xs text-emerald-800 whitespace-pre-wrap">{testResult.answer}</div>
            {Array.isArray(testResult.links) && testResult.links.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {testResult.links.map((l: any, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-emerald-300 text-emerald-700 rounded-full">
                    {l.title} → {l.href}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {testResult?.error && (
          <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            {testResult.error}
          </div>
        )}
        <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-400">
          <Zap className="w-3 h-3" /> Gọi đúng endpoint /api/ai/service-router (prompt + model đã lưu).
        </div>
      </Section>
    </div>
  )
}

/* ───────── small UI helpers ───────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
    />
  )
}

function TextArea({
  value,
  onChange,
  rows = 3,
  mono = false,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  mono?: boolean
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm ${
        mono ? 'font-mono text-xs' : ''
      }`}
    />
  )
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number
  onChange: (n: number) => void
  min: number
  max: number
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
    />
  )
}

function PromptEditor({
  title,
  list,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string
  list: QuickPrompt[]
  onAdd: () => void
  onUpdate: (idx: number, field: 'label' | 'value', v: string) => void
  onRemove: (idx: number) => void
}) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{title}</span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-primary hover:bg-primary/5 rounded"
        >
          <Plus className="w-3 h-3" />
          Thêm
        </button>
      </div>
      {list.length === 0 && <p className="text-[11px] text-slate-400">Chưa có câu gợi ý nào.</p>}
      <div className="space-y-2">
        {list.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={p.label}
              onChange={(e) => onUpdate(i, 'label', e.target.value)}
              placeholder="Nhãn hiện trên nút"
              className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
            />
            <input
              type="text"
              value={p.value}
              onChange={(e) => onUpdate(i, 'value', e.target.value)}
              placeholder="Câu thật gửi cho AI"
              className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
              aria-label="Xoá"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
