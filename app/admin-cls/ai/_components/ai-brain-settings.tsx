'use client'

import { useEffect, useState, useTransition } from 'react'
import { CheckCircle2, AlertCircle, KeyRound, Loader2, PlugZap, Trash2 } from 'lucide-react'
import { Chip, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'
import {
  CHAT_MODELS,
  CHAT_PROVIDERS,
  DEFAULT_MODEL,
  isListedModel,
  providerOfModel,
  type ChatProvider,
} from '@/lib/ai/chatbot-models'
import { getAiKeyStatuses, removeAiKey, saveAiKey, testAiConnection, type AiKeyStatus } from '../chatbot-actions'

const CUSTOM = '__custom__'

/**
 * "Bộ não AI" của chatbot: chọn nhà cung cấp (OpenAI hoặc Claude), model, và nhập khóa API.
 * Khóa gõ vào đây chỉ đi tới máy chủ (server action), được lưu ở máy chủ và KHÔNG hiện lại: ô nhập luôn trống,
 * trạng thái chỉ cho biết đã có khóa và 4 ký tự cuối. Model được lưu cùng nút "Lưu thay đổi" của cả trang.
 */
export function AiBrainSettings({ model, onModelChange }: { model: string; onModelChange: (m: string) => void }) {
  const provider = providerOfModel(model)
  const providerInfo = CHAT_PROVIDERS.find((p) => p.value === provider)!
  const listed = isListedModel(model)
  const [customMode, setCustomMode] = useState(!listed)

  const [statuses, setStatuses] = useState<Record<ChatProvider, AiKeyStatus | null>>({ openai: null, anthropic: null })
  const [statusLoaded, setStatusLoaded] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [busy, setBusy] = useState<null | 'save' | 'test' | 'remove'>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [, startTransition] = useTransition()

  const loadStatuses = () =>
    startTransition(async () => {
      const r = await getAiKeyStatuses()
      if (!('error' in r)) {
        setStatuses({
          openai: r.find((s) => s.provider === 'openai') ?? null,
          anthropic: r.find((s) => s.provider === 'anthropic') ?? null,
        })
      }
      setStatusLoaded(true)
    })

  useEffect(loadStatuses, [])

  const switchProvider = (next: ChatProvider) => {
    if (next === provider) return
    setKeyInput('')
    setMsg(null)
    setCustomMode(false)
    onModelChange(DEFAULT_MODEL[next])
  }

  const st = statuses[provider]
  const listedModels = CHAT_MODELS[provider]
  const selectValue = customMode || !listed ? CUSTOM : model
  const note = listedModels.find((m) => m.value === model)?.note

  const doSave = async () => {
    setBusy('save')
    setMsg(null)
    const r = await saveAiKey(provider, keyInput)
    setBusy(null)
    if ('error' in r) return setMsg({ ok: false, text: r.error })
    setKeyInput('')
    setMsg({ ok: true, text: 'Đã lưu khóa. Bấm "Kiểm tra kết nối" để chắc chắn khóa chạy được.' })
    loadStatuses()
  }

  const doTest = async () => {
    setBusy('test')
    setMsg(null)
    const r = await testAiConnection({ provider, model, key: keyInput || undefined })
    setBusy(null)
    setMsg({ ok: r.ok, text: r.message })
  }

  const doRemove = async () => {
    setBusy('remove')
    setMsg(null)
    const r = await removeAiKey(provider)
    setBusy(null)
    if ('error' in r) return setMsg({ ok: false, text: r.error })
    setMsg({ ok: true, text: 'Đã xóa khóa đã lưu.' })
    loadStatuses()
  }

  return (
    <div className="space-y-3.5">
      <div>
        <span className={fieldLabelClass}>Nhà cung cấp AI</span>
        <Segmented
          ariaLabel="Nhà cung cấp AI"
          value={provider}
          options={CHAT_PROVIDERS.map((p) => ({ id: p.value, label: p.label }))}
          onChange={switchProvider}
        />
      </div>

      <div>
        <label className={fieldLabelClass} htmlFor="chatbot-model">
          Model
        </label>
        <select
          id="chatbot-model"
          value={selectValue}
          onChange={(e) => {
            if (e.target.value === CUSTOM) {
              setCustomMode(true)
            } else {
              setCustomMode(false)
              onModelChange(e.target.value)
            }
          }}
          className={fieldInputClass}
        >
          {listedModels.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
          <option value={CUSTOM}>Khác (nhập tên model)</option>
        </select>
        {selectValue === CUSTOM ? (
          <input
            type="text"
            value={model}
            onChange={(e) => onModelChange(e.target.value.trim())}
            placeholder={provider === 'anthropic' ? 'ví dụ: claude-sonnet-5-5' : 'ví dụ: gpt-4.1'}
            spellCheck={false}
            className={`${fieldInputClass} mt-2 font-mono text-[13px]`}
          />
        ) : null}
        <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
          {note ?? 'Nhập đúng tên model theo tài liệu của nhà cung cấp. Bấm "Kiểm tra kết nối" để biết model có dùng được không.'}{' '}
          Model được lưu khi bấm &quot;Lưu thay đổi&quot; ở đầu trang.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--ad-line)] bg-[var(--ad-fill)]/40 p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--ad-fg)]">
            <KeyRound className="h-4 w-4 text-[var(--ad-fg-2)]" />
            Khóa API của {providerInfo.label}
          </span>
          {!statusLoaded ? (
            <Chip>Đang kiểm tra</Chip>
          ) : st?.source === 'db' ? (
            <Chip tone="ok">Đã lưu · ••••{st.last4}</Chip>
          ) : st?.source === 'env' ? (
            <Chip tone="blue">Đang dùng khóa của hệ thống · ••••{st.last4}</Chip>
          ) : (
            <Chip tone="warn">Chưa có khóa: bot chưa trả lời được</Chip>
          )}
        </div>

        <label className={fieldLabelClass} htmlFor="chatbot-api-key">
          {st?.source === 'db' ? 'Thay bằng khóa mới' : 'Dán khóa API'}
        </label>
        <input
          id="chatbot-api-key"
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={keyInput}
          onChange={(e) => {
            setKeyInput(e.target.value)
            setMsg(null)
          }}
          placeholder={providerInfo.keyHint}
          className={`${fieldInputClass} font-mono text-[13px]`}
        />

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <button type="button" onClick={doSave} disabled={!keyInput.trim() || busy !== null} className={btn('primary')}>
            {busy === 'save' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Lưu khóa
          </button>
          <button type="button" onClick={doTest} disabled={busy !== null || (!keyInput.trim() && !st?.source)} className={btn('secondary')}>
            {busy === 'test' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlugZap className="h-3.5 w-3.5" />}
            Kiểm tra kết nối
          </button>
          {st?.source === 'db' ? (
            <button type="button" onClick={doRemove} disabled={busy !== null} className={btn('danger')}>
              {busy === 'remove' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Xóa khóa
            </button>
          ) : null}
        </div>

        <div aria-live="polite" className="min-h-0">
          {msg ? (
            <p className={`mt-2.5 flex items-start gap-1.5 text-[13px] ${msg.ok ? 'text-[#248a3d]' : 'text-[#d70015]'}`}>
              {msg.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" /> : <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />}
              <span>{msg.text}</span>
            </p>
          ) : null}
        </div>

        <p className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--ad-fg-3)]">
          Lấy khóa tại <span className="font-mono">{providerInfo.keyUrl}</span>. Khóa chỉ lưu trên máy chủ, <strong>không hiện lại</strong> sau khi
          lưu và chỉ quản trị viên dùng được. Muốn đổi nhà cung cấp, chọn ở trên, nhập khóa của nhà đó rồi bấm &quot;Lưu thay đổi&quot;. Ô nhập khóa để trống
          khi kiểm tra = thử khóa đã lưu.
        </p>
      </div>
    </div>
  )
}
