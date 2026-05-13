'use client'

import { useState, useTransition } from 'react'
import { Languages, Loader2 } from 'lucide-react'
import type { I18n } from '@/lib/cms/types'

type Fields = { title?: string; excerpt?: string; content?: string }

/**
 * Auto-translate VI → EN button for PostEditor header.
 * Translates title, excerpt, content from VI to EN via /api/admin-cls/ai/translate.
 * On success, calls onApply with the translated fields so parent merges into draft.
 */
export function AutoTranslate({
  title,
  excerpt,
  content,
  onApply,
}: {
  title: I18n
  excerpt: I18n
  content: I18n
  onApply: (fields: Fields) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = () => {
    const viFields: Fields = {}
    if (title.vi?.trim()) viFields.title = title.vi
    if (excerpt.vi?.trim()) viFields.excerpt = excerpt.vi
    if (content.vi?.trim()) viFields.content = content.vi

    if (Object.keys(viFields).length === 0) {
      setError('Chưa có nội dung VI để dịch')
      setTimeout(() => setError(null), 3000)
      return
    }

    // Warn if EN already has content (will be overwritten)
    const enHasContent =
      (title.en?.trim() || '') ||
      (excerpt.en?.trim() || '') ||
      (content.en?.trim() || '')
    if (enHasContent) {
      if (!confirm('EN đã có nội dung. Dịch lại sẽ ghi đè. Tiếp tục?')) return
    }

    startTransition(async () => {
      setError(null)
      setProgress('Đang gọi AI dịch...')
      try {
        const res = await fetch('/api/admin-cls/ai/translate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ from: 'vi', to: 'en', fields: viFields }),
        })
        if (!res.body) {
          setError('No response body')
          setProgress(null)
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        let finalReceived = false
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
              if (data.type === 'done' && data.fields) {
                onApply(data.fields as Fields)
                setProgress(null)
                finalReceived = true
              } else if (data.type === 'error') {
                setError(data.error)
                setProgress(null)
                finalReceived = true
              } else if (data.type === 'progress') {
                setProgress(`Đang dịch... (${data.chars} ký tự)`)
              }
            } catch {}
          }
        }
        if (!finalReceived) {
          setError('Stream kết thúc không có kết quả — thử lại?')
          setProgress(null)
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
        setProgress(null)
      }
    })
  }

  return (
    <div className="relative">
      <button
        onClick={handleTranslate}
        disabled={isPending}
        title="Tự động dịch VI → EN (ghi đè EN hiện có)"
        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Languages className="w-3.5 h-3.5" />
        )}
        <span className="hidden md:inline">{isPending ? 'Đang dịch…' : 'Auto-dịch EN'}</span>
        <span className="md:hidden">{isPending ? '…' : 'EN'}</span>
      </button>

      {(progress || error) && (
        <div
          className={`absolute right-0 top-full mt-1 z-30 px-3 py-2 text-[11px] rounded shadow-lg whitespace-nowrap ${
            error
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-cyan-50 border border-cyan-200 text-cyan-700'
          }`}
        >
          {error ? `⚠ ${error}` : progress}
        </div>
      )}
    </div>
  )
}
