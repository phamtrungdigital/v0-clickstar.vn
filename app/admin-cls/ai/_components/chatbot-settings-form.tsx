'use client'

import { useState, useTransition } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Zap,
  Loader2,
  RotateCcw,
  Send,
} from 'lucide-react'
import {
  saveChatbotSettings,
  testChatbot,
  refreshSiteKnowledge,
  type SiteKnowledgeInfo,
} from '../chatbot-actions'
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
import { EditorBar, SaveStatus, SectionCard, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
import { Switch } from '@/components/admin/switch'

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

export function ChatbotSettingsForm({ initial, embedded = false }: { initial: ChatbotSettings | null; embedded?: boolean }) {
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
    <div>
      <EditorBar
        flush={!embedded}
        title="Chatbot website"
        subtitle="Bot AI hiện cho khách trên website: bật tắt, nội dung, quy tắc hiển thị"
      >
        <SaveStatus status={status} errorMsg={errorMsg} />
        <button onClick={handleSave} disabled={isPending} className={btn('primary')}>
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isPending ? 'Đang lưu' : 'Lưu thay đổi'}
        </button>
      </EditorBar>

      <div className="mx-auto max-w-4xl space-y-4">
      {/* ───── Trạng thái + widget ───── */}
      <Section title="Trạng thái & hiển thị">
        <div className="flex items-start gap-3">
          <Switch checked={draft.enabled} onChange={(v) => update('enabled', v)} label="Bật bot trên website" />
          <div>
            <div className="text-[14.5px] font-medium text-[var(--ad-fg)]">Bật bot trên website</div>
            <div className="text-[13px] text-[var(--ad-fg-3)]">Tắt thì khách không thấy bot và đường gọi bot trả về lỗi 503.</div>
          </div>
        </div>

        <div className="mt-4">
          <label className={fieldLabelClass}>Hiển thị kiểu nào</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WIDGET_MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('widget_mode', opt.value as WidgetMode)}
                aria-pressed={draft.widget_mode === opt.value}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  draft.widget_mode === opt.value
                    ? 'border-[var(--ad-accent)] bg-[var(--ad-accent-soft)] ring-1 ring-[var(--ad-accent)]'
                    : 'border-[var(--ad-line-2)] hover:bg-[var(--ad-fill-soft)]'
                }`}
              >
                <div className="text-[14px] font-semibold text-[var(--ad-fg)]">{opt.label}</div>
                <div className="mt-0.5 text-[12.5px] text-[var(--ad-fg-3)]">{opt.desc}</div>
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
          <select value={draft.model} onChange={(e) => update('model', e.target.value)} className={fieldInputClass}>
            {CHATBOT_MODEL_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
            API key dùng biến môi trường <code className="rounded bg-[var(--ad-fill)] px-1.5 py-0.5 text-[12px]">OPENAI_API_KEY</code> (không lưu trong DB).
          </p>
        </Field>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[13px] font-medium text-[var(--ad-fg-2)]">Chỉ dẫn hệ thống cho AI (system prompt)</label>
            <button
              type="button"
              onClick={() => update('system_prompt', DEFAULT_CHATBOT_SYSTEM_PROMPT)}
              className="inline-flex items-center gap-1 text-[12.5px] text-[var(--ad-accent)] hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Khôi phục bản mặc định
            </button>
          </div>
          <TextArea
            value={draft.system_prompt ?? ''}
            onChange={(v) => update('system_prompt', v)}
            rows={8}
            mono
          />
          <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
            Để trống = dùng prompt mặc định (tính cách + chính sách trả lời). <strong>Đừng gõ dịch vụ, giá, dự án vào đây</strong> —
            bot tự đọc toàn bộ website (xem mục &quot;Kiến thức AI&quot; bên dưới), sửa website là bot biết.
            Định dạng JSON và danh sách link do hệ thống tự gắn.
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
          <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
            VD: <code className="rounded bg-[var(--ad-fill)] px-1.5 py-0.5 text-[12px]">/admin-cls</code> ẩn mọi trang admin;{' '}
            <code className="rounded bg-[var(--ad-fill)] px-1.5 py-0.5 text-[12px]">/contact</code> ẩn trang liên hệ.
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

        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
          <div className="flex items-center gap-3">
            <Switch checked={draft.show_on_desktop} onChange={(v) => update('show_on_desktop', v)} label="Hiện trên máy tính" />
            <span className="text-[14px] text-[var(--ad-fg)]">Hiện trên máy tính</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={draft.show_on_mobile} onChange={(v) => update('show_on_mobile', v)} label="Hiện trên điện thoại" />
            <span className="text-[14px] text-[var(--ad-fg)]">Hiện trên điện thoại</span>
          </div>
        </div>
        <p className="text-[12.5px] text-[var(--ad-fg-3)]">
          Lưu ý: Delay & Auto-close chỉ áp dụng cho <strong>Thanh bar đáy</strong>. Nút tròn hiện ngay.
        </p>
      </Section>

      {/* ───── Kiến thức AI ───── */}
      <KnowledgePanel />

      {/* ───── Test ───── */}
      <Section title="Test bot (gửi thật 1 câu)">
        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Nhập câu hỏi test…"
            className={fieldInputClass + ' flex-1'}
          />
          <button type="button" onClick={handleTest} disabled={testing} className={btn('primary')}>
            {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Gửi thử
          </button>
        </div>
        {testResult?.answer && (
          <div className="mt-3 rounded-xl bg-[rgba(52,199,89,.12)] px-4 py-3">
            <div className="whitespace-pre-wrap text-[13.5px] text-[#1c6b30]">{testResult.answer}</div>
            {Array.isArray(testResult.links) && testResult.links.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {testResult.links.map((l: any, i: number) => (
                  <span key={i} className="rounded-full bg-white px-2.5 py-0.5 text-[12px] text-[#248a3d]">
                    {l.title} → {l.href}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {testResult?.error && (
          <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-[rgba(255,59,48,.10)] px-3.5 py-2.5 text-[13.5px] text-[#d70015]">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {testResult.error}
          </div>
        )}
        <div className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-[var(--ad-fg-3)]">
          <Zap className="h-3 w-3" /> Gọi đúng đường /api/ai/service-router (chỉ dẫn và model đã lưu).
        </div>
      </Section>
      </div>
    </div>
  )
}

/**
 * Kiến thức bot = toàn bộ nội dung công khai của website, tự làm mới khi Lưu trang
 * hoặc sau tối đa 1 giờ. Nút này để anh ép học lại ngay + xem đúng thứ bot đang đọc.
 */
function KnowledgePanel() {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<SiteKnowledgeInfo | null>(null)
  const [error, setError] = useState('')

  const handleRefresh = async () => {
    setLoading(true)
    setError('')
    const r = await refreshSiteKnowledge()
    setLoading(false)
    if ('error' in r) setError(r.error)
    else setInfo(r)
  }

  return (
    <Section title="Kiến thức AI (đọc tự động từ website)">
      <p className="text-[13.5px] leading-relaxed text-[var(--ad-fg-3)]">
        Bot đọc toàn bộ nội dung công khai: các trang dịch vụ, bảng giá, trang chủ, FAQ, dự án, blog, thông tin
        liên hệ. Sửa nội dung trong admin rồi bấm Lưu là bot tự cập nhật (chậm nhất 1 giờ); nội dung viết trong
        code cập nhật mỗi lần deploy. Bài nháp và dự án chưa xuất bản <strong>không</strong> bao giờ được đưa cho bot.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleRefresh} disabled={loading} className={btn('primary')}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
          Cho AI học lại ngay
        </button>
        {info && (
          <span className="inline-flex items-center gap-1 text-[13px] text-[#248a3d]">
            <CheckCircle2 className="h-4 w-4" />
            Đã học {info.pages} mục · {info.chars.toLocaleString('vi-VN')} ký tự · lúc{' '}
            {new Date(info.builtAt).toLocaleString('vi-VN')}
          </span>
        )}
      </div>
      {error && (
        <div className="flex items-start gap-1.5 rounded-xl bg-[rgba(255,59,48,.10)] px-3.5 py-2.5 text-[13.5px] text-[#d70015]">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {info && (
        <details className="rounded-xl border border-[var(--ad-line)]">
          <summary className="cursor-pointer px-4 py-2.5 text-[13.5px] font-medium text-[var(--ad-fg-2)]">
            Xem toàn bộ nội dung bot đang đọc
          </summary>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap px-4 pb-3 text-[12px] leading-relaxed text-[var(--ad-fg-3)]">
            {info.preview}
          </pre>
        </details>
      )}
    </Section>
  )
}

/* ───────── small UI helpers ───────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SectionCard title={title} bodyClassName="space-y-3.5 px-5 pb-5 pt-3">
      {children}
    </SectionCard>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={fieldLabelClass}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={fieldInputClass} />
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
      className={fieldInputClass + (mono ? ' font-mono !text-[12.5px]' : '')}
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
      className={fieldInputClass}
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
    <div className="rounded-xl border border-[var(--ad-line)] p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--ad-fg-2)]">{title}</span>
        <button type="button" onClick={onAdd} className={btn('ghost', 'sm')}>
          <Plus className="h-3.5 w-3.5" />
          Thêm
        </button>
      </div>
      {list.length === 0 && <p className="text-[13px] text-[var(--ad-fg-3)]">Chưa có câu gợi ý nào.</p>}
      <div className="space-y-2">
        {list.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={p.label}
              onChange={(e) => onUpdate(i, 'label', e.target.value)}
              placeholder="Nhãn hiện trên nút"
              className={fieldInputClass + ' min-w-0 flex-1 !py-1.5 !text-[13.5px]'}
            />
            <input
              type="text"
              value={p.value}
              onChange={(e) => onUpdate(i, 'value', e.target.value)}
              placeholder="Câu thật gửi cho AI"
              className={fieldInputClass + ' min-w-0 flex-1 !py-1.5 !text-[13.5px]'}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="grid h-8 w-8 flex-none place-items-center rounded-full text-[var(--ad-fg-3)] hover:bg-[rgba(255,59,48,.10)] hover:text-[#d70015]"
              aria-label="Xoá"
              title="Xoá"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
