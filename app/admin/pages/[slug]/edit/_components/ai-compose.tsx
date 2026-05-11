'use client'

import { useState, useTransition } from 'react'
import { Sparkles, Loader2, X, Copy } from 'lucide-react'
import { generateText } from '@/app/admin/ai/actions'

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
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const isRefine = !!currentValue?.trim()

  const handleGenerate = () => {
    if (!prompt.trim()) return
    startTransition(async () => {
      setError(null)
      setPreview(null)
      const result = await generateText({
        prompt,
        currentValue: currentValue || undefined,
        fieldLabel,
        pageContext,
        language,
        maxTokens: multiline ? 600 : 200,
      })
      if (result.error) setError(result.error)
      else if (result.text) setPreview(result.text)
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
        <button onClick={onClose} className="ml-auto p-0.5 hover:bg-violet-200 dark:hover:bg-violet-900 rounded" title="Đóng">
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

      <div className="flex items-center gap-2 mt-1.5">
        <button
          onClick={handleGenerate}
          disabled={isPending || !prompt.trim()}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-500 text-white text-[11px] font-medium rounded hover:bg-violet-600 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {isPending ? 'Đang viết…' : preview ? 'Generate lại' : 'Generate'}
        </button>
        {preview && (
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
        <p className="text-[10px] text-red-600 mt-2 px-2 py-1 bg-red-50 rounded">
          ⚠ {error}
        </p>
      )}

      {preview && (
        <div className="mt-2 p-2 bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 rounded">
          <p className="text-[10px] uppercase font-semibold text-violet-600 mb-1">
            Kết quả AI
          </p>
          <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{preview}</p>
        </div>
      )}
    </div>
  )
}
