'use client'

import { useState, useTransition } from 'react'
import { Sparkles, Loader2, X, Copy } from 'lucide-react'
import { BLOG_STYLE_OPTIONS, type BlogStyle } from '@/lib/ai/settings-shared'

export function AiCompose({
  fieldLabel,
  currentValue,
  language,
  pageContext,
  multiline,
  onResult,
  onClose,
}: {
  fieldLabel: string
  currentValue: string
  language: 'vi' | 'en'
  pageContext?: string
  multiline?: boolean
  onResult: (text: string) => void
  onClose: () => void
}) {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<BlogStyle | ''>('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [done, setDone] = useState(false)

  const isRefine = !!currentValue?.trim()

  const handleGenerate = () => {
    if (!prompt.trim()) return
    startTransition(async () => {
      setError(null)
      setPreview('')
      setDone(false)
      try {
        const res = await fetch('/api/admin/ai/inline', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            prompt,
            currentValue: currentValue || undefined,
            fieldLabel,
            pageContext,
            language,
            style: style || undefined,
            maxTokens: multiline ? 600 : 200,
          }),
        })
        if (!res.body) {
          setError('No response body')
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        let acc = ''
        let finalReceived = false
        while (true) {
          const { done: streamDone, value } = await reader.read()
          if (streamDone) break
          buf += decoder.decode(value, { stream: true })
          const events = buf.split('\n\n')
          buf = events.pop() || ''
          for (const evt of events) {
            if (!evt.startsWith('data: ')) continue
            try {
              const data = JSON.parse(evt.slice(6))
              if (data.type === 'delta' && typeof data.text === 'string') {
                acc += data.text
                setPreview(acc)
              } else if (data.type === 'done') {
                setPreview(data.text || acc)
                setDone(true)
                finalReceived = true
              } else if (data.type === 'error') {
                setError(data.error)
                finalReceived = true
              }
            } catch {}
          }
        }
        if (!finalReceived && !acc) {
          setError('Stream kết thúc không có dữ liệu')
        } else if (!finalReceived) {
          // Stream cut off mid-flight — accept what we got
          setDone(true)
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      }
    })
  }

  const handleAccept = () => {
    if (preview) {
      onResult(preview)
      onClose()
    }
  }

  return (
    <div className="mt-1.5 p-2.5 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-md">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
        <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
          AI viết hộ {isRefine ? '(refine bản hiện tại)' : '(viết mới)'}
        </span>
        <button
          onClick={onClose}
          className="ml-auto p-0.5 hover:bg-violet-200 dark:hover:bg-violet-900 rounded"
          title="Đóng"
        >
          <X className="w-3 h-3 text-violet-700" />
        </button>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={
          isRefine
            ? 'Vd: viết ngắn hơn / năng động hơn / dùng giọng formal / thêm số 500+...'
            : 'Vd: heading hero cho trang Dashboard, mô tả 4 lợi ích chính của AI automation...'
        }
        rows={2}
        className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
      />

      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as BlogStyle | '')}
          className="px-2 py-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
          title="Style (optional)"
        >
          <option value="">Style mặc định</option>
          {BLOG_STYLE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerate}
          disabled={isPending || !prompt.trim()}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-500 text-white text-[11px] font-medium rounded hover:bg-violet-600 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {isPending ? 'Đang viết…' : done ? 'Generate lại' : 'Generate'}
        </button>
        {done && preview && (
          <button
            onClick={handleAccept}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-medium rounded hover:bg-emerald-700"
          >
            <Copy className="w-3 h-3" />
            Dùng kết quả này
          </button>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-red-600 mt-2 px-2 py-1 bg-red-50 rounded">⚠ {error}</p>
      )}

      {preview && (
        <div className="mt-2 p-2 bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 rounded">
          <p className="text-[10px] uppercase font-semibold text-violet-600 mb-1 flex items-center gap-1">
            Kết quả AI
            {isPending && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
            {done && <span className="text-emerald-600">✓</span>}
          </p>
          <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{preview}</p>
        </div>
      )}
    </div>
  )
}
