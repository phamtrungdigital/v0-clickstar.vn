'use client'

import { useState, useTransition } from 'react'
import { ImagePlus, Loader2, X, Sparkles } from 'lucide-react'

export function AiCoverImage({
  onApply,
  postTitle,
}: {
  onApply: (url: string) => void
  postTitle?: string
}) {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isPending, startTransition] = useTransition()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [progress, setProgress] = useState<string | null>(null)

  const handleGenerate = () => {
    const finalPrompt = prompt.trim() || (postTitle ? `Cover image for blog post: ${postTitle}` : '')
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
      setPrompt('')
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          if (!prompt && postTitle) setPrompt(`Modern professional cover image for blog: ${postTitle}`)
        }}
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
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Mô tả ảnh anh muốn (tiếng Anh chính xác hơn)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={`Ví dụ:
- "Modern AI marketing dashboard, blue and purple gradient, professional, 16:9"
- "Vietnamese SME owner using laptop with charts on screen, warm lighting, photorealistic"
- "Abstract illustration of CRM workflow with connected nodes, minimal flat design"`}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              gpt-image-1 · 1536×1024 (~$0.04/ảnh) · Mất 15-30s · Tự upload Supabase Storage
            </p>
          </div>

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
            disabled={isPending || !prompt.trim()}
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
