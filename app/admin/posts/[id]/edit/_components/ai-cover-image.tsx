'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { ImagePlus, Loader2, X, Sparkles, Wand2 } from 'lucide-react'
import { COVER_PROMPT_TEMPLATES, CATEGORIES } from '@/lib/ai/image-prompt-templates'

function buildFinalPrompt(subject: string, style: string): string {
  const trimmedSubject = subject.trim()
  const trimmedStyle = style.trim()
  if (!trimmedSubject && !trimmedStyle) return ''
  if (!trimmedSubject) return trimmedStyle
  const stylePart = trimmedStyle || 'Modern professional editorial cover, clean composition, 16:9 aspect ratio'
  return `Editorial cover image for a blog post about: "${trimmedSubject}". The visual must clearly convey this topic to the viewer. Style guidance: ${stylePart}. No text, no letters, no logos overlaid on the image. 16:9 aspect ratio.`
}

export function AiCoverImage({
  onApply,
  postTitle,
  tags,
  seoKeyword,
}: {
  onApply: (url: string) => void
  postTitle?: string
  tags?: string[]
  seoKeyword?: string
}) {
  const defaultSubject = useMemo(() => {
    const fromKeyword = seoKeyword?.trim()
    if (fromKeyword) return fromKeyword
    const fromTag = tags?.[0]?.trim()
    if (fromTag && postTitle?.trim()) return `${postTitle.trim()} — ${fromTag}`
    return (postTitle?.trim() || fromTag || '').trim()
  }, [seoKeyword, tags, postTitle])

  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [style, setStyle] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all')
  const [isPending, startTransition] = useTransition()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [progress, setProgress] = useState<string | null>(null)

  useEffect(() => {
    if (open && !subject) setSubject(defaultSubject)
  }, [open, defaultSubject, subject])

  const visibleTemplates =
    activeCategory === 'all'
      ? COVER_PROMPT_TEMPLATES
      : COVER_PROMPT_TEMPLATES.filter((t) => t.category === activeCategory)

  const finalPrompt = buildFinalPrompt(subject, style)

  const handleGenerate = () => {
    if (!finalPrompt) return
    startTransition(async () => {
      setError(null)
      setPreviewUrl(null)
      setProgress(null)
      try {
        const res = await fetch('/api/admin/ai/image', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ prompt: finalPrompt }),
        })
        if (!res.body) {
          setError('No response body')
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        let receivedFinalEvent = false
        let lastElapsed = 0
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
              if (data.type === 'done' && data.url) {
                setPreviewUrl(data.url)
                setProgress(null)
                receivedFinalEvent = true
              } else if (data.type === 'error') {
                setError(data.error)
                setProgress(null)
                receivedFinalEvent = true
              } else if (data.type === 'pulse') {
                lastElapsed = data.elapsedSec
                setProgress(`Đang vẽ... (${data.elapsedSec}s)`)
              } else if (data.type === 'status') {
                setProgress(data.message)
              }
            } catch {}
          }
        }
        if (!receivedFinalEvent) {
          setError(
            `Stream bị ngắt sau ${lastElapsed}s (Vercel Pro maxDuration 300s). ` +
            `Thử vào /admin/ai → Tạo ảnh → giảm size xuống 1024×1024 + quality "low".`
          )
          setProgress(null)
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
        setProgress(null)
      }
    })
  }

  const handleApply = () => {
    if (previewUrl) {
      onApply(previewUrl)
      setOpen(false)
      setPreviewUrl(null)
      setStyle('')
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold rounded shadow-sm"
      >
        <ImagePlus className="w-3.5 h-3.5" />
        🎨 Tạo ảnh AI
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Tạo ảnh cover với AI</h2>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-200 rounded">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 1) Subject — what the image is ABOUT (keyword/title-driven) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              🎯 Chủ đề bài (ảnh sẽ vẽ về cái này)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={defaultSubject || 'VD: AI tự động hoá marketing cho SME Việt Nam'}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Tự lấy từ keyword SEO → tag đầu → tiêu đề. Có thể sửa cho khớp ảnh muốn.
            </p>
          </div>

          {/* 2) Style template picker */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                🎨 Style ảnh
              </span>
              <span className="text-[10px] text-slate-400">— click để chọn cách thiết kế</span>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1 mb-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tất cả ({COVER_PROMPT_TEMPLATES.length})
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    activeCategory === c.id
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Templates grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto">
              {visibleTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setStyle(t.prompt)}
                  title={t.prompt}
                  className={`text-left px-2 py-1.5 text-[11px] rounded border transition-colors ${
                    style === t.prompt
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-700'
                  }`}
                >
                  <span className="mr-1">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3) Optional style override */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Mô tả style (tiếng Anh) — tinh chỉnh thêm nếu muốn
            </label>
            <textarea
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              rows={3}
              placeholder="VD: Modern flat illustration, blue and purple gradient, clean professional"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
            />
          </div>

          {/* 4) Final prompt preview (what actually gets sent) */}
          {finalPrompt && (
            <div className="px-3 py-2 bg-violet-50 border border-violet-200 rounded">
              <p className="text-[10px] uppercase font-bold text-violet-700 mb-1">
                Prompt cuối gửi AI (chủ đề + style)
              </p>
              <p className="text-[11px] text-violet-900 leading-relaxed">{finalPrompt}</p>
            </div>
          )}

          <p className="text-[10px] text-slate-500">
            gpt-image-1 · 1536×1024 (~$0.04/ảnh) · Mất 15-30s · Tự upload Supabase Storage
          </p>

          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              ⚠ {error}
            </div>
          )}

          {progress && !previewUrl && (
            <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {progress}
            </div>
          )}

          {previewUrl && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-amber-600">Kết quả AI</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="AI generated cover"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
              />
              <p className="text-[10px] text-slate-500 font-mono break-all">{previewUrl}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
          >
            Huỷ
          </button>
          <button
            onClick={handleGenerate}
            disabled={isPending || !finalPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isPending ? 'Đang vẽ…' : previewUrl ? 'Vẽ lại' : 'Generate'}
          </button>
          {previewUrl && (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded"
            >
              Dùng ảnh này
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
