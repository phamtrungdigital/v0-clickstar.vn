'use client'

import { useState, useTransition } from 'react'
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Loader2,
} from 'lucide-react'
import { saveAiSettings, testAiConnection, type SaveAiSettingsInput } from '../actions'
import { MODEL_OPTIONS } from '@/lib/ai/providers'
import type { AiSettings, AiProvider } from '@/lib/ai/settings'

export function AiSettingsForm({ initial }: { initial: AiSettings | null }) {
  const [draft, setDraft] = useState<SaveAiSettingsInput>({
    provider: initial?.provider ?? 'anthropic',
    anthropic_api_key: initial?.anthropic_api_key ?? null,
    openai_api_key: initial?.openai_api_key ?? null,
    default_model: initial?.default_model ?? 'claude-haiku-4-5-20251001',
    enabled: initial?.enabled ?? false,
    system_prompt:
      initial?.system_prompt ??
      'You are a content writer for ClickStar — a Vietnamese digital marketing & technology agency.',
  })

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [testResult, setTestResult] = useState<{ text?: string; error?: string } | null>(null)
  const [testing, setTesting] = useState(false)

  const update = <K extends keyof SaveAiSettingsInput>(key: K, value: SaveAiSettingsInput[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setStatus('dirty')
  }

  const handleProviderChange = (p: AiProvider) => {
    setDraft((prev) => ({
      ...prev,
      provider: p,
      default_model: MODEL_OPTIONS[p][0].value,
    }))
    setStatus('dirty')
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveAiSettings(draft)
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
      setTestResult({ error: 'Lưu setting trước rồi test' })
      return
    }
    setTesting(true)
    setTestResult(null)
    const result = await testAiConnection()
    setTesting(false)
    setTestResult(result)
  }

  const modelOptions = MODEL_OPTIONS[draft.provider]

  return (
    <div className="space-y-3 max-w-3xl">
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            AI Assistant
          </h1>
          <p className="text-[11px] text-slate-500">
            Cấu hình AI để viết nội dung tự động trong CMS
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

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4">
        {/* Enable toggle */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(e) => update('enabled', e.target.checked)}
            className="w-4 h-4 mt-0.5"
          />
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              Kích hoạt AI Assistant
            </div>
            <div className="text-[11px] text-slate-500">
              Sau khi bật + lưu, các field text trong CMS sẽ có nút ✨ AI để gen content.
            </div>
          </div>
        </label>

        {/* Provider */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Provider
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleProviderChange('anthropic')}
              className={`text-left p-3 rounded-md border-2 transition-colors ${
                draft.provider === 'anthropic'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-semibold">Anthropic Claude</div>
              <div className="text-[10px] text-slate-500 mt-1">
                Khuyến nghị: tốt cho tiếng Việt, an toàn
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleProviderChange('openai')}
              className={`text-left p-3 rounded-md border-2 transition-colors ${
                draft.provider === 'openai'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-semibold">OpenAI GPT</div>
              <div className="text-[10px] text-slate-500 mt-1">
                Phổ biến, nhanh, có nhiều model
              </div>
            </button>
          </div>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Model mặc định
          </label>
          <select
            value={draft.default_model}
            onChange={(e) => update('default_model', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
          >
            {modelOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* API keys */}
        <div className="space-y-3">
          <ApiKeyInput
            label="Anthropic API Key"
            placeholder="sk-ant-..."
            value={draft.anthropic_api_key ?? ''}
            onChange={(v) => update('anthropic_api_key', v.trim() === '' ? null : v)}
            visible={showAnthropicKey}
            onToggleVisible={() => setShowAnthropicKey((v) => !v)}
            hint="Lấy ở https://console.anthropic.com/settings/keys"
          />
          <ApiKeyInput
            label="OpenAI API Key"
            placeholder="sk-..."
            value={draft.openai_api_key ?? ''}
            onChange={(v) => update('openai_api_key', v.trim() === '' ? null : v)}
            visible={showOpenaiKey}
            onToggleVisible={() => setShowOpenaiKey((v) => !v)}
            hint="Lấy ở https://platform.openai.com/api-keys"
          />
        </div>

        {/* System prompt */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            System prompt (chỉ dẫn chung cho AI)
          </label>
          <textarea
            value={draft.system_prompt}
            onChange={(e) => update('system_prompt', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Mô tả về thương hiệu, tông giọng — AI sẽ luôn tham khảo khi viết.
          </p>
        </div>
      </div>

      {/* Test connection */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Test kết nối
          </h2>
          <button
            onClick={handleTest}
            disabled={testing || !draft.enabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600 disabled:opacity-50"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            {testing ? 'Đang test…' : 'Test API'}
          </button>
        </div>
        {testResult?.text && (
          <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700">
            ✓ Kết nối OK. AI trả lời: <span className="italic">"{testResult.text}"</span>
          </div>
        )}
        {testResult?.error && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            ✗ {testResult.error}
          </div>
        )}
      </div>
    </div>
  )
}

function ApiKeyInput({
  label,
  placeholder,
  value,
  onChange,
  visible,
  onToggleVisible,
  hint,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  visible: boolean
  onToggleVisible: () => void
  hint?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
        >
          {visible ? (
            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      </div>
      {hint && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}
