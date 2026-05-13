'use client'

import { useState, useTransition, useEffect } from 'react'
import { Sparkles, Loader2, X, Wand2, ChevronLeft, ChevronDown, ChevronRight, AlertTriangle, ExternalLink, Pencil } from 'lucide-react'
import { BLOG_STYLE_OPTIONS, type BlogStyle } from '@/lib/ai/settings-shared'

export type GeneratedPost = {
  title_vi: string
  title_en: string
  excerpt_vi: string
  excerpt_en: string
  content_vi: string
  content_en: string
  keyword?: string // forwarded from form so parent can derive slug
}

type OutlineSection = { heading_vi: string; heading_en: string; summary_vi: string }
type Outline = { title_vi: string; title_en: string; sections: OutlineSection[] }

type DuplicateMatch = {
  id: string
  slug: string
  title_vi: string
  matched_in: 'title' | 'tags' | 'seo_title'
  excerpt_vi?: string | null
}

type Step = 'form' | 'outline' | 'writing' | 'preview'

export function AiWholePost({
  onApply,
}: {
  onApply: (post: GeneratedPost) => void
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('form')

  // Form inputs
  const [topic, setTopic] = useState('')
  const [keyword, setKeyword] = useState('')
  const [style, setStyle] = useState<BlogStyle>('professional')
  const [targetWords, setTargetWords] = useState(1000)
  const [includeImages, setIncludeImages] = useState(true)
  const [useOutline, setUseOutline] = useState(true)

  // Workflow state
  const [outline, setOutline] = useState<Outline | null>(null)
  const [selectedSections, setSelectedSections] = useState<Set<number>>(new Set())
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [preview, setPreview] = useState<GeneratedPost | null>(null)
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateMatch[]>([])

  const [isPending, startTransition] = useTransition()
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Duplicate keyword check (debounced)
  useEffect(() => {
    if (!keyword.trim() || keyword.trim().length < 3 || !open) {
      setDuplicateMatches([])
      return
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/admin-cls/ai/keyword-check', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ keyword }),
        })
        const json = (await res.json()) as { matches?: DuplicateMatch[] }
        setDuplicateMatches(json.matches || [])
      } catch {
        // silent — non-critical
      }
    }, 600)
    return () => clearTimeout(t)
  }, [keyword, open])

  const reset = () => {
    setStep('form')
    setOutline(null)
    setSelectedSections(new Set())
    setExpandedSection(null)
    setPreview(null)
    setError(null)
    setProgress(null)
  }

  const toggleSection = (i: number) => {
    setSelectedSections((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const toggleAllSections = () => {
    if (!outline) return
    if (selectedSections.size === outline.sections.length) {
      setSelectedSections(new Set())
    } else {
      setSelectedSections(new Set(outline.sections.map((_, i) => i)))
    }
  }

  const closeModal = () => {
    setOpen(false)
    reset()
  }

  // STEP 1: Generate outline (or skip directly to full write)
  const handleGenerateOutline = () => {
    if (!topic.trim()) return
    startTransition(async () => {
      setError(null)
      setOutline(null)
      setProgress('Đang gen dàn bài...')
      try {
        const res = await fetch('/api/admin-cls/ai/blog/outline', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ topic, keyword, style, targetWords }),
        })
        const json = (await res.json()) as { outline?: Outline; error?: string }
        if (json.error) {
          setError(json.error)
          setProgress(null)
        } else if (json.outline) {
          setOutline(json.outline)
          setSelectedSections(new Set()) // default: nothing ticked = use all
          setExpandedSection(null)
          setStep('outline')
          setProgress(null)
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
        setProgress(null)
      }
    })
  }

  // STEP 2 (or single-step if !useOutline): Generate full content via SSE
  /**
   * Build the outline payload that goes to /api/admin-cls/ai/blog.
   * - If user ticked specific sections → only send those (in original order).
   * - If nothing ticked → send all sections (auto fallback per user request).
   */
  const buildOutlineForGen = (): Outline | null => {
    if (!outline) return null
    if (selectedSections.size === 0) return outline
    const filtered = outline.sections.filter((_, i) => selectedSections.has(i))
    return { ...outline, sections: filtered }
  }

  const handleGenerateFull = (approvedOutline?: Outline | null) => {
    if (!topic.trim()) return
    startTransition(async () => {
      setError(null)
      setPreview(null)
      setProgress('Đang gọi AI...')
      setStep('writing')
      try {
        const res = await fetch('/api/admin-cls/ai/blog', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            topic,
            keyword,
            style,
            targetWords,
            includeImages,
            outline: approvedOutline || undefined,
          }),
        })
        if (!res.body) {
          setError('No response body')
          setStep('form')
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        let receivedFinalEvent = false
        let lastChars = 0
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const events = buf.split('\n\n')
          buf = events.pop() || ''
          for (const evt of events) {
            if (!evt.startsWith('data: ')) continue
            try {
              const data = JSON.parse(evt.slice(6))
              if (data.type === 'done' && data.post) {
                setPreview({ ...data.post, keyword })
                setStep('preview')
                setProgress(null)
                receivedFinalEvent = true
              } else if (data.type === 'error') {
                setError(data.error)
                setProgress(null)
                setStep('form')
                receivedFinalEvent = true
              } else if (data.type === 'progress') {
                lastChars = data.chars
                setProgress(`Đang viết... (${data.chars} ký tự)`)
              } else if (data.type === 'status') {
                setProgress(data.message)
              }
            } catch {}
          }
        }
        if (!receivedFinalEvent) {
          setError(
            `Stream bị ngắt sau ${lastChars} ký tự. Thử giảm "Độ dài" hoặc đổi sang model nhanh hơn.`
          )
          setStep('form')
          setProgress(null)
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
        setProgress(null)
        setStep('form')
      }
    })
  }

  const handleApply = () => {
    if (preview) {
      onApply(preview)
      closeModal()
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-semibold rounded shadow-md hover:shadow-lg transition-all"
      >
        <Wand2 className="w-3.5 h-3.5" />
        AI viết bài hoàn chỉnh
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30">
          <div className="flex items-center gap-2">
            {step !== 'form' && step !== 'writing' && (
              <button
                onClick={reset}
                className="p-1 hover:bg-white/50 rounded text-slate-600"
                title="Quay lại"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <Wand2 className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {step === 'form' && 'AI viết bài blog hoàn chỉnh'}
              {step === 'outline' && 'Bước 1: Chốt dàn bài'}
              {step === 'writing' && 'Đang viết bài...'}
              {step === 'preview' && 'Bước 2: Xem trước kết quả'}
            </h2>
          </div>
          <button onClick={closeModal} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 'form' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Chủ đề bài viết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  placeholder="VD: 5 xu hướng AI Marketing 2026, hướng tới SMEs Việt Nam"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  SEO keyword chính
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="VD: AI marketing"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                />
                <p className="text-[10px] text-slate-500 mt-1">Dùng cho slug + cảnh báo trùng</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Độ dài bài viết
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-2">
                  {[
                    { value: 500, label: '📝 Ngắn', sub: '~500 từ · đọc 2 phút' },
                    { value: 1000, label: '📄 Trung bình', sub: '~1000 từ · đọc 4 phút' },
                    { value: 1800, label: '📚 Dài', sub: '~1800 từ · đọc 7 phút' },
                    { value: 2500, label: '📖 Rất dài', sub: '~2500 từ · đọc 10 phút' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setTargetWords(preset.value)}
                      className={`text-left px-2.5 py-2 rounded border transition-colors ${
                        targetWords === preset.value
                          ? 'bg-violet-500 text-white border-violet-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-violet-50 hover:border-violet-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{preset.label}</div>
                      <div className={`text-[10px] mt-0.5 ${targetWords === preset.value ? 'text-violet-100' : 'text-slate-500'}`}>
                        {preset.sub}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-slate-500 shrink-0">Hoặc custom:</label>
                  <input
                    type="number"
                    value={targetWords}
                    onChange={(e) => setTargetWords(Number(e.target.value) || 1000)}
                    min={300}
                    max={4000}
                    step={100}
                    className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />
                  <span className="text-[10px] text-slate-400">từ (300-4000)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Phong cách viết
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as BlogStyle)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                >
                  {BLOG_STYLE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useOutline}
                    onChange={(e) => setUseOutline(e.target.checked)}
                    className="rounded"
                  />
                  <span>
                    <strong>Viết dàn bài trước</strong> rồi mới gen full (chất lượng cao hơn, mất thêm ~5s
                    cho dàn bài)
                  </span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="rounded"
                  />
                  <span>
                    <strong>Chèn marker ảnh</strong> [[IMAGE: ...]] trong bài (2-4 ảnh, gen sau khi save)
                  </span>
                </label>
              </div>

              {/* Duplicate warning */}
              {duplicateMatches.length > 0 && (
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Đã có {duplicateMatches.length} bài chứa keyword "{keyword}":
                  </div>
                  <ul className="space-y-1">
                    {duplicateMatches.map((m) => (
                      <li key={m.id} className="text-[11px] text-amber-900 flex items-start gap-1">
                        <span className="text-amber-600">•</span>
                        <a
                          href={`/admin-cls/posts/${m.id}/edit`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          {m.title_vi}
                          <ExternalLink className="w-3 h-3" />
                          <span className="text-amber-600 text-[10px]">(trong {m.matched_in})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && (
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  ⚠ {error}
                </div>
              )}

              {progress && (
                <div className="px-3 py-2 bg-violet-50 border border-violet-200 rounded text-xs text-violet-700 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {progress}
                </div>
              )}
            </>
          )}

          {step === 'outline' && outline && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Em đã gen {outline.sections.length} mục H2. Anh <strong>tích</strong> các mục muốn đưa vào
                bài (click chữ để mở rộng sửa). <strong>Không tích cái nào</strong> = lấy hết.
              </p>

              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    TITLE VI
                  </label>
                  <input
                    type="text"
                    value={outline.title_vi}
                    onChange={(e) => setOutline({ ...outline, title_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    TITLE EN
                  </label>
                  <input
                    type="text"
                    value={outline.title_en}
                    onChange={(e) => setOutline({ ...outline, title_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    SECTIONS{' '}
                    {selectedSections.size > 0
                      ? `(${selectedSections.size}/${outline.sections.length} đã chọn)`
                      : `(${outline.sections.length} · không chọn = lấy hết)`}
                  </label>
                  <button
                    type="button"
                    onClick={toggleAllSections}
                    className="text-[11px] text-violet-600 hover:underline"
                  >
                    {selectedSections.size === outline.sections.length ? 'Bỏ chọn hết' : 'Chọn hết'}
                  </button>
                </div>

                <ul className="border border-slate-200 rounded-md bg-white divide-y divide-slate-100">
                  {outline.sections.map((sec, i) => {
                    const checked = selectedSections.has(i)
                    const expanded = expandedSection === i
                    return (
                      <li
                        key={i}
                        className={`${
                          checked ? 'bg-violet-50/50' : ''
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-2 px-2 py-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSection(i)}
                            className="rounded cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded shrink-0">
                            H2 #{i + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => setExpandedSection(expanded ? null : i)}
                            className="flex-1 text-left flex items-center gap-2 group"
                          >
                            <span className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-violet-700">
                              {sec.heading_vi || '(chưa có heading)'}
                            </span>
                            <Pencil className="w-3 h-3 text-slate-400 group-hover:text-violet-600 shrink-0" />
                            {expanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                          </button>
                        </div>

                        {expanded && (
                          <div className="px-3 pb-3 space-y-1.5 bg-slate-50/50 border-t border-slate-100">
                            <input
                              type="text"
                              value={sec.heading_vi}
                              onChange={(e) => {
                                const next = [...outline.sections]
                                next[i] = { ...sec, heading_vi: e.target.value }
                                setOutline({ ...outline, sections: next })
                              }}
                              placeholder="Heading VI"
                              className="w-full px-2 py-1 text-sm font-medium bg-white border border-slate-200 rounded mt-1.5"
                            />
                            <input
                              type="text"
                              value={sec.heading_en}
                              onChange={(e) => {
                                const next = [...outline.sections]
                                next[i] = { ...sec, heading_en: e.target.value }
                                setOutline({ ...outline, sections: next })
                              }}
                              placeholder="Heading EN"
                              className="w-full px-2 py-1 text-xs italic bg-white border border-slate-200 rounded text-slate-600"
                            />
                            <textarea
                              value={sec.summary_vi}
                              onChange={(e) => {
                                const next = [...outline.sections]
                                next[i] = { ...sec, summary_vi: e.target.value }
                                setOutline({ ...outline, sections: next })
                              }}
                              rows={2}
                              placeholder="Tóm tắt sẽ viết gì..."
                              className="w-full px-2 py-1 text-[11px] bg-white border border-slate-200 rounded text-slate-700"
                            />
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}

          {step === 'writing' && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
              <p className="text-sm font-medium text-slate-700">
                {progress || 'Đang viết bài...'}
              </p>
              <p className="text-[10px] text-slate-500">
                Có thể mất 30-60s. Stream đang chạy — đừng đóng cửa sổ.
              </p>
            </div>
          )}

          {step === 'preview' && preview && (
            <div className="space-y-3 border-2 border-violet-200 bg-violet-50/30 rounded-lg p-4">
              <p className="text-[10px] uppercase font-bold text-violet-600">
                Xem trước — click Áp dụng để fill vào form
              </p>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">TITLE VI</p>
                <p className="text-sm font-medium text-slate-900">{preview.title_vi}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">TITLE EN</p>
                <p className="text-sm font-medium text-slate-900">{preview.title_en}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">EXCERPT VI</p>
                <p className="text-xs text-slate-700">{preview.excerpt_vi}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">EXCERPT EN</p>
                <p className="text-xs text-slate-700">{preview.excerpt_en}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  CONTENT VI ({preview.content_vi.split(/\s+/).length} từ
                  {(() => {
                    const c = (preview.content_vi.match(/\[\[IMAGE:/g) || []).length
                    return c > 0 ? ` · ${c} ảnh markers` : ''
                  })()}
                  )
                </p>
                <pre className="text-[11px] text-slate-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto bg-white p-2 rounded border border-slate-200">
                  {preview.content_vi.substring(0, 1000)}
                  {preview.content_vi.length > 1000 && '\n\n…(rút gọn)…'}
                </pre>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  CONTENT EN ({preview.content_en.split(/\s+/).length} words)
                </p>
                <pre className="text-[11px] text-slate-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto bg-white p-2 rounded border border-slate-200">
                  {preview.content_en.substring(0, 1000)}
                  {preview.content_en.length > 1000 && '\n\n…(truncated)…'}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50">
          <p className="text-[10px] text-slate-500">
            {step === 'form' && '💡 Provider/model config tại /admin-cls/ai → Viết bài blog'}
            {step === 'outline' && '☑️ Tích các mục muốn dùng (không tích = lấy hết)'}
            {step === 'preview' && '✅ Áp dụng = fill 6 field + auto-slug từ keyword'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={closeModal}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
            >
              Huỷ
            </button>

            {step === 'form' && (
              <button
                onClick={useOutline ? handleGenerateOutline : () => handleGenerateFull(null)}
                disabled={isPending || !topic.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {isPending ? 'Đang chạy…' : useOutline ? 'Gen dàn bài' : 'Viết luôn'}
              </button>
            )}

            {step === 'outline' && outline && (
              <button
                onClick={() => handleGenerateFull(buildOutlineForGen())}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {selectedSections.size > 0
                  ? `Viết với ${selectedSections.size} mục đã chọn`
                  : `Viết với cả ${outline.sections.length} mục`}
              </button>
            )}

            {step === 'preview' && (
              <>
                <button
                  onClick={() => handleGenerateFull(buildOutlineForGen())}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded disabled:opacity-50"
                >
                  Viết lại
                </button>
                <button
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded"
                >
                  Áp dụng vào bài
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
