'use client'

import { useState, useTransition } from 'react'
import { Sparkles, Loader2, X, Wand2 } from 'lucide-react'

export type GeneratedPost = {
  title_vi: string
  title_en: string
  excerpt_vi: string
  excerpt_en: string
  content_vi: string
  content_en: string
}

export function AiWholePost({
  onApply,
}: {
  onApply: (post: GeneratedPost) => void
}) {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState('')
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<GeneratedPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [progress, setProgress] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!topic.trim()) return
    startTransition(async () => {
      setError(null)
      setPreview(null)
      setProgress(null)
      try {
        const res = await fetch('/api/admin/ai/blog', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ topic }),
        })
        if (!res.body) {
          setError('No response body')
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
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
                setPreview(data.post)
                setProgress(null)
              } else if (data.type === 'error') {
                setError(data.error)
                setProgress(null)
              } else if (data.type === 'progress') {
                setProgress(`Đang viết... (${data.chars} ký tự)`)
              } else if (data.type === 'status') {
                setProgress(data.message)
              }
            } catch {}
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
        setProgress(null)
      }
    })
  }

  const handleApply = () => {
    if (preview) {
      onApply(preview)
      setOpen(false)
      setPreview(null)
      setTopic('')
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
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              AI viết bài blog hoàn chỉnh
            </h2>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Chủ đề bài viết (càng chi tiết AI viết càng đúng ý)
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              placeholder={`Ví dụ:
- "5 xu hướng AI Marketing 2026, có ví dụ thực tế, hướng tới SMEs Việt Nam, 1500 từ"
- "Hướng dẫn setup Google Analytics 4 cho beginner, có screenshot mô tả từng bước"
- "Vì sao doanh nghiệp nên đầu tư CRM năm 2026, có case study, 1200 từ"`}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              AI sẽ trả về cả VI + EN cho title, excerpt, content. Có thể mất 15-30s.
            </p>
          </div>

          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              ⚠ {error}
            </div>
          )}

          {progress && !preview && (
            <div className="px-3 py-2 bg-violet-50 border border-violet-200 rounded text-xs text-violet-700 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {progress}
            </div>
          )}

          {preview && (
            <div className="space-y-3 border-2 border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/10 rounded-lg p-4">
              <p className="text-[10px] uppercase font-bold text-violet-600">
                Kết quả AI — xem trước trước khi áp dụng
              </p>

              <div>
                <p className="text-[10px] text-slate-500 font-semibold">TITLE VI</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {preview.title_vi}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">TITLE EN</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {preview.title_en}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">EXCERPT VI</p>
                <p className="text-xs text-slate-700 dark:text-slate-300">{preview.excerpt_vi}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">EXCERPT EN</p>
                <p className="text-xs text-slate-700 dark:text-slate-300">{preview.excerpt_en}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  CONTENT VI ({preview.content_vi.split(/\s+/).length} từ)
                </p>
                <pre className="text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-700">
                  {preview.content_vi.substring(0, 800)}
                  {preview.content_vi.length > 800 && '\n\n…(rút gọn xem trước)…'}
                </pre>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  CONTENT EN ({preview.content_en.split(/\s+/).length} words)
                </p>
                <pre className="text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-700">
                  {preview.content_en.substring(0, 800)}
                  {preview.content_en.length > 800 && '\n\n…(truncated preview)…'}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50">
          <p className="text-[10px] text-slate-500">
            💡 Tip: Dùng Claude Opus 4.7 cho chất lượng cao nhất (cấu hình tại /admin/ai)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
            >
              Huỷ
            </button>
            <button
              onClick={handleGenerate}
              disabled={isPending || !topic.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isPending ? 'Đang viết…' : preview ? 'Viết lại' : 'Generate'}
            </button>
            {preview && (
              <button
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded"
              >
                Áp dụng vào bài
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
