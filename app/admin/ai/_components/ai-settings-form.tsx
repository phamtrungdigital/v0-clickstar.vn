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
  Key,
  PenTool,
  Wand2,
  Image as ImageIcon,
} from 'lucide-react'
import {
  saveAiSettings,
  testInlineConnection,
  testProviderApiKey,
  testOpenAiImagesApi,
  type SaveAiSettingsInput,
} from '../actions'
import { MODEL_OPTIONS } from '@/lib/ai/providers'
import type {
  AiSettings,
  AiProvider,
  ImageModel,
  ImageQuality,
  ImageSize,
} from '@/lib/ai/settings'

const IMAGE_SIZES: { value: ImageSize; label: string }[] = [
  { value: '1024x1024', label: '1024×1024 (square)' },
  { value: '1536x1024', label: '1536×1024 (landscape — cover image)' },
  { value: '1024x1536', label: '1024×1536 (portrait)' },
  { value: '1792x1024', label: '1792×1024 (DALL-E wide)' },
  { value: '1024x1792', label: '1024×1792 (DALL-E tall)' },
]

type Tab = 'keys' | 'inline' | 'blog' | 'image'

export function AiSettingsForm({ initial }: { initial: AiSettings | null }) {
  const [draft, setDraft] = useState<SaveAiSettingsInput>({
    enabled: initial?.enabled ?? false,
    anthropic_api_key: initial?.anthropic_api_key ?? null,
    openai_api_key: initial?.openai_api_key ?? null,
    inline_provider: initial?.inline_provider ?? 'anthropic',
    inline_model: initial?.inline_model ?? 'claude-haiku-4-5-20251001',
    inline_system_prompt: initial?.inline_system_prompt ?? '',
    blog_provider: initial?.blog_provider ?? 'anthropic',
    blog_model: initial?.blog_model ?? 'claude-opus-4-7',
    blog_system_prompt: initial?.blog_system_prompt ?? '',
    blog_target_words: initial?.blog_target_words ?? 1200,
    image_model: initial?.image_model ?? 'gpt-image-1',
    image_size: initial?.image_size ?? '1536x1024',
    image_quality: initial?.image_quality ?? 'high',
    image_style_prefix: initial?.image_style_prefix ?? '',
    body_image_model: initial?.body_image_model ?? 'gpt-image-1',
    body_image_size: initial?.body_image_size ?? '1024x1024',
    body_image_quality: initial?.body_image_quality ?? 'medium',
    body_image_style_prefix: initial?.body_image_style_prefix ?? '',
  })

  const [tab, setTab] = useState<Tab>('keys')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showAnthropic, setShowAnthropic] = useState(false)
  const [showOpenai, setShowOpenai] = useState(false)
  const [testResult, setTestResult] = useState<{ text?: string; error?: string } | null>(null)
  const [testing, setTesting] = useState(false)
  const [keyTests, setKeyTests] = useState<{
    anthropic?: { ok?: boolean; message?: string; error?: string; loading?: boolean }
    openai?: { ok?: boolean; message?: string; error?: string; loading?: boolean }
    openai_images?: { ok?: boolean; message?: string; error?: string; loading?: boolean }
  }>({})

  const handleTestKey = async (
    which: 'anthropic' | 'openai' | 'openai_images'
  ) => {
    setKeyTests((p) => ({ ...p, [which]: { loading: true } }))
    let result
    if (which === 'anthropic') {
      result = await testProviderApiKey('anthropic', draft.anthropic_api_key ?? '')
    } else if (which === 'openai') {
      result = await testProviderApiKey('openai', draft.openai_api_key ?? '')
    } else {
      result = await testOpenAiImagesApi(draft.openai_api_key ?? '')
    }
    setKeyTests((p) => ({ ...p, [which]: { ...result, loading: false } }))
  }

  const update = <K extends keyof SaveAiSettingsInput>(
    key: K,
    value: SaveAiSettingsInput[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
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

  const handleTestInline = async () => {
    if (status === 'dirty') {
      setTestResult({ error: 'Lưu setting trước rồi test' })
      return
    }
    setTesting(true)
    setTestResult(null)
    const result = await testInlineConnection()
    setTesting(false)
    setTestResult(result)
  }

  return (
    <div className="space-y-3 max-w-4xl">
      {/* Header */}
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            AI Assistant
          </h1>
          <p className="text-[11px] text-slate-500">
            Quản lý cấu hình AI cho từng tác vụ riêng biệt
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

      {/* Enable toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
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
              Sau khi bật + lưu, mọi nút ✨ AI trong CMS sẽ hoạt động.
            </div>
          </div>
        </label>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          <TabButton active={tab === 'keys'} onClick={() => setTab('keys')} icon={<Key className="w-3.5 h-3.5" />}>
            API Keys
          </TabButton>
          <TabButton active={tab === 'inline'} onClick={() => setTab('inline')} icon={<PenTool className="w-3.5 h-3.5" />}>
            Inline ✨ AI
          </TabButton>
          <TabButton active={tab === 'blog'} onClick={() => setTab('blog')} icon={<Wand2 className="w-3.5 h-3.5" />}>
            Viết bài blog
          </TabButton>
          <TabButton active={tab === 'image'} onClick={() => setTab('image')} icon={<ImageIcon className="w-3.5 h-3.5" />}>
            Tạo ảnh
          </TabButton>
        </div>

        <div className="p-5">
          {tab === 'keys' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Dán API keys của 2 nhà cung cấp. Em recommend <strong>Anthropic</strong> cho viết bài tiếng Việt,{' '}
                <strong>OpenAI</strong> cho tạo ảnh.
              </p>
              <div className="space-y-2">
                <ApiKeyInput
                  label="Anthropic API Key"
                  placeholder="sk-ant-..."
                  value={draft.anthropic_api_key ?? ''}
                  onChange={(v) => update('anthropic_api_key', v.trim() === '' ? null : v)}
                  visible={showAnthropic}
                  onToggleVisible={() => setShowAnthropic((v) => !v)}
                  hint="Lấy ở https://console.anthropic.com/settings/keys"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestKey('anthropic')}
                    disabled={keyTests.anthropic?.loading || !draft.anthropic_api_key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-medium rounded disabled:opacity-50"
                  >
                    {keyTests.anthropic?.loading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                    Test Anthropic
                  </button>
                  <TestResult result={keyTests.anthropic} />
                </div>
              </div>

              <div className="space-y-2">
                <ApiKeyInput
                  label="OpenAI API Key"
                  placeholder="sk-..."
                  value={draft.openai_api_key ?? ''}
                  onChange={(v) => update('openai_api_key', v.trim() === '' ? null : v)}
                  visible={showOpenai}
                  onToggleVisible={() => setShowOpenai((v) => !v)}
                  hint="Lấy ở https://platform.openai.com/api-keys (cần credit cho Images API)"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestKey('openai')}
                    disabled={keyTests.openai?.loading || !draft.openai_api_key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-medium rounded disabled:opacity-50"
                  >
                    {keyTests.openai?.loading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                    Test text (GPT)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestKey('openai_images')}
                    disabled={keyTests.openai_images?.loading || !draft.openai_api_key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-medium rounded disabled:opacity-50"
                  >
                    {keyTests.openai_images?.loading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Test Images API (~$0.01)
                  </button>
                </div>
                {keyTests.openai && <TestResult result={keyTests.openai} />}
                {keyTests.openai_images && <TestResult result={keyTests.openai_images} />}
              </div>
            </div>
          )}

          {tab === 'inline' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Cấu hình cho nút <strong>✨ AI</strong> bên cạnh mỗi field text trong CMS (refine ngắn,
                viết câu/đoạn ngắn). Khuyến nghị model <strong>rẻ + nhanh</strong> như Haiku/4o-mini.
              </p>
              <ProviderPicker
                value={draft.inline_provider}
                onChange={(p) => {
                  update('inline_provider', p)
                  update('inline_model', MODEL_OPTIONS[p][0].value)
                }}
              />
              <ModelSelect
                value={draft.inline_model}
                provider={draft.inline_provider}
                onChange={(v) => update('inline_model', v)}
              />
              <SystemPromptArea
                label="System prompt"
                value={draft.inline_system_prompt}
                onChange={(v) => update('inline_system_prompt', v)}
                hint="Tông giọng & brand voice — AI tham khảo khi refine từng field"
              />

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Test connection
                  </h3>
                  <button
                    onClick={handleTestInline}
                    disabled={testing || !draft.enabled}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600 disabled:opacity-50"
                  >
                    {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                    Test
                  </button>
                </div>
                {testResult?.text && (
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700">
                    ✓ "{testResult.text}"
                  </div>
                )}
                {testResult?.error && (
                  <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    ✗ {testResult.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'blog' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Cấu hình cho nút <strong>✨ AI viết bài hoàn chỉnh</strong> trong PostEditor. AI viết toàn
                bộ blog (title + excerpt + content markdown × VI/EN). Khuyến nghị <strong>Claude Opus 4.7</strong>{' '}
                cho chất lượng cao nhất.
              </p>
              <ProviderPicker
                value={draft.blog_provider}
                onChange={(p) => {
                  update('blog_provider', p)
                  update(
                    'blog_model',
                    p === 'anthropic' ? 'claude-opus-4-7' : 'gpt-4o'
                  )
                }}
              />
              <ModelSelect
                value={draft.blog_model}
                provider={draft.blog_provider}
                onChange={(v) => update('blog_model', v)}
              />
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Số từ mục tiêu (target words)
                </label>
                <input
                  type="number"
                  min={400}
                  max={3000}
                  step={100}
                  value={draft.blog_target_words}
                  onChange={(e) => update('blog_target_words', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Khoảng từ AI nhắm tới (±200 từ). Bài 1200 từ ≈ 5 phút đọc.
                </p>
              </div>
              <SystemPromptArea
                label="System prompt riêng cho blog"
                value={draft.blog_system_prompt}
                onChange={(v) => update('blog_system_prompt', v)}
                hint="Khác với inline — hướng AI viết long-form: structure intro/H2/conclusion, tông giọng, target audience..."
              />
            </div>
          )}

          {tab === 'image' && (
            <div className="space-y-6">
              {/* COVER IMAGE — 1 ảnh đại diện per bài, chất lượng cao */}
              <section className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    📸 Ảnh đại diện (Cover)
                  </h3>
                  <span className="text-[10px] text-slate-500">1 ảnh/bài, chất lượng cao</span>
                </header>
                <p className="text-xs text-slate-500">
                  Dùng cho nút <strong>🎨 Tạo ảnh AI</strong> ở sidebar Cover image. Đề xuất:
                  gpt-image-1 1536×1024 high (~$0.04).
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Model
                  </label>
                  <select
                    value={draft.image_model}
                    onChange={(e) => update('image_model', e.target.value as ImageModel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    <option value="gpt-image-1">gpt-image-1 (recommend, ~$0.04)</option>
                    <option value="dall-e-3">DALL-E 3 (~$0.04 standard, ~$0.08 HD)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Size
                    </label>
                    <select
                      value={draft.image_size}
                      onChange={(e) => update('image_size', e.target.value as ImageSize)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                    >
                      {IMAGE_SIZES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Quality
                    </label>
                    <select
                      value={draft.image_quality}
                      onChange={(e) => update('image_quality', e.target.value as ImageQuality)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                    >
                      {draft.image_model === 'gpt-image-1' ? (
                        <>
                          <option value="low">low (~$0.01)</option>
                          <option value="medium">medium (~$0.02)</option>
                          <option value="high">high (~$0.04)</option>
                          <option value="auto">auto</option>
                        </>
                      ) : (
                        <>
                          <option value="standard">standard (~$0.04)</option>
                          <option value="hd">HD (~$0.08)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <SystemPromptArea
                  label="Style prefix (append vào prompt cover)"
                  value={draft.image_style_prefix}
                  onChange={(v) => update('image_style_prefix', v)}
                  rows={2}
                  hint="VD: 'modern, professional, clean, suitable for Vietnamese tech brand'"
                />
              </section>

              {/* BODY IMAGE — N ảnh inline trong content, rẻ hơn, vuông */}
              <section className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    🖼️ Ảnh trong bài (Body inline)
                  </h3>
                  <span className="text-[10px] text-slate-500">Nhiều ảnh/bài, nên rẻ + vuông</span>
                </header>
                <p className="text-xs text-slate-500">
                  Khi AI viết bài, sẽ chèn marker{' '}
                  <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">[[IMAGE: mô tả]]</code> trong
                  content. Editor cho phép click từng marker để gen ảnh. Đề xuất: gpt-image-1 1024×1024
                  medium (~$0.02/ảnh).
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Model
                  </label>
                  <select
                    value={draft.body_image_model}
                    onChange={(e) => update('body_image_model', e.target.value as ImageModel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    <option value="gpt-image-1">gpt-image-1 (recommend)</option>
                    <option value="dall-e-3">DALL-E 3</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Size
                    </label>
                    <select
                      value={draft.body_image_size}
                      onChange={(e) => update('body_image_size', e.target.value as ImageSize)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                    >
                      {IMAGE_SIZES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Quality
                    </label>
                    <select
                      value={draft.body_image_quality}
                      onChange={(e) =>
                        update('body_image_quality', e.target.value as ImageQuality)
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                    >
                      {draft.body_image_model === 'gpt-image-1' ? (
                        <>
                          <option value="low">low (~$0.01)</option>
                          <option value="medium">medium (~$0.02)</option>
                          <option value="high">high (~$0.04)</option>
                          <option value="auto">auto</option>
                        </>
                      ) : (
                        <>
                          <option value="standard">standard (~$0.04)</option>
                          <option value="hd">HD (~$0.08)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <SystemPromptArea
                  label="Style prefix (append vào prompt body image)"
                  value={draft.body_image_style_prefix}
                  onChange={(v) => update('body_image_style_prefix', v)}
                  rows={2}
                  hint="Có thể khác cover. VD: 'flat illustration, minimal, vector-style' để body images đồng nhất với nhau"
                />
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TestResult({
  result,
}: {
  result?: { ok?: boolean; message?: string; error?: string; loading?: boolean }
}) {
  if (!result || result.loading) return null
  if (result.message) {
    return (
      <span className="inline-flex items-center text-[11px] px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded">
        {result.message}
      </span>
    )
  }
  if (result.error) {
    return (
      <span
        className="inline-flex items-center text-[11px] px-2 py-1 bg-red-50 border border-red-200 text-red-700 rounded max-w-md truncate"
        title={result.error}
      >
        ✗ {result.error.slice(0, 80)}
      </span>
    )
  }
  return null
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
        active
          ? 'border-primary text-primary bg-primary/5'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function ProviderPicker({
  value,
  onChange,
}: {
  value: AiProvider
  onChange: (p: AiProvider) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
        Provider
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('anthropic')}
          className={`text-left p-3 rounded-md border-2 transition-colors ${
            value === 'anthropic'
              ? 'border-primary bg-primary/5'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="text-sm font-semibold">Anthropic Claude</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Tốt cho tiếng Việt, viết tự nhiên
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange('openai')}
          className={`text-left p-3 rounded-md border-2 transition-colors ${
            value === 'openai'
              ? 'border-primary bg-primary/5'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="text-sm font-semibold">OpenAI GPT</div>
          <div className="text-[10px] text-slate-500 mt-1">Phổ biến, nhanh</div>
        </button>
      </div>
    </div>
  )
}

function ModelSelect({
  value,
  provider,
  onChange,
}: {
  value: string
  provider: AiProvider
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        Model
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
      >
        {MODEL_OPTIONS[provider].map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function SystemPromptArea({
  label,
  value,
  onChange,
  hint,
  rows = 5,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
  rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
      />
      {hint && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
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
