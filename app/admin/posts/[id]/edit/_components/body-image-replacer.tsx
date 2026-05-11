'use client'

import { useMemo, useState, useTransition } from 'react'
import { ImagePlus, Loader2, CheckCircle2, RefreshCw } from 'lucide-react'

type Lang = 'vi' | 'en'
type Marker = { lang: Lang; raw: string; alt: string; index: number }

type I18n = { vi: string; en: string }

const MARKER_REGEX = /\[\[IMAGE:\s*([^\]]+)\]\]/g

function scanMarkers(content: I18n): Marker[] {
  const out: Marker[] = []
  for (const lang of ['vi', 'en'] as const) {
    const text = content[lang] || ''
    let match: RegExpExecArray | null
    const re = new RegExp(MARKER_REGEX.source, 'g')
    while ((match = re.exec(text)) !== null) {
      out.push({
        lang,
        raw: match[0],
        alt: match[1].trim(),
        index: match.index,
      })
    }
  }
  return out
}

/**
 * Live-scans content for [[IMAGE: ...]] markers. Lets user gen each one
 * and replaces the marker with Markdown image syntax in content_vi/content_en.
 */
export function BodyImageReplacer({
  content,
  onContentChange,
}: {
  content: I18n
  onContentChange: (next: I18n) => void
}) {
  const markers = useMemo(() => scanMarkers(content), [content])
  const [editedPrompts, setEditedPrompts] = useState<Record<string, string>>({})
  const [genResults, setGenResults] = useState<Record<string, { url?: string; error?: string; loading?: boolean; elapsedSec?: number }>>({})
  const [isPending, startTransition] = useTransition()

  if (markers.length === 0) {
    return null
  }

  // Group markers by `raw` to dedupe (same marker often appears in both VI + EN)
  const uniqueByRaw = new Map<string, Marker[]>()
  for (const m of markers) {
    if (!uniqueByRaw.has(m.raw)) uniqueByRaw.set(m.raw, [])
    uniqueByRaw.get(m.raw)!.push(m)
  }

  const handleGen = (raw: string, group: Marker[]) => {
    const prompt = editedPrompts[raw] ?? group[0].alt
    if (!prompt.trim()) return
    startTransition(async () => {
      setGenResults((p) => ({ ...p, [raw]: { loading: true, elapsedSec: 0 } }))
      try {
        const res = await fetch('/api/admin/ai/image', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ prompt, mode: 'body' }),
        })
        if (!res.body) {
          setGenResults((p) => ({ ...p, [raw]: { error: 'No response' } }))
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        let finalUrl: string | null = null
        let finalError: string | null = null
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
              if (data.type === 'done' && data.url) finalUrl = data.url
              else if (data.type === 'error') finalError = data.error
              else if (data.type === 'pulse')
                setGenResults((p) => ({ ...p, [raw]: { loading: true, elapsedSec: data.elapsedSec } }))
            } catch {}
          }
        }
        if (finalError) {
          setGenResults((p) => ({ ...p, [raw]: { error: finalError } }))
          return
        }
        if (!finalUrl) {
          setGenResults((p) => ({ ...p, [raw]: { error: 'Stream ended without URL' } }))
          return
        }

        // Replace ALL occurrences of this marker (VI + EN) with Markdown image
        const alt = group[0].alt
        const replacement = `![${alt}](${finalUrl})`
        const next: I18n = {
          vi: content.vi.split(raw).join(replacement),
          en: content.en.split(raw).join(replacement),
        }
        onContentChange(next)
        setGenResults((p) => ({ ...p, [raw]: { url: finalUrl! } }))
      } catch (err: any) {
        setGenResults((p) => ({ ...p, [raw]: { error: err?.message || 'Failed' } }))
      }
    })
  }

  const handleGenAll = () => {
    for (const [raw, group] of uniqueByRaw.entries()) {
      if (genResults[raw]?.url) continue // skip already done
      handleGen(raw, group)
    }
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
          <ImagePlus className="w-3.5 h-3.5" />
          🖼️ {uniqueByRaw.size} marker ảnh chờ gen
        </h3>
        {uniqueByRaw.size > 1 && (
          <button
            onClick={handleGenAll}
            disabled={isPending}
            className="text-[11px] px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded disabled:opacity-50"
          >
            🎨 Gen tất cả ({uniqueByRaw.size})
          </button>
        )}
      </div>
      <p className="text-[10px] text-amber-700 dark:text-amber-400">
        AI đã chèn marker <code className="bg-white px-1 rounded">[[IMAGE: ...]]</code> trong content. Click
        gen từng cái → ảnh sẽ thay marker thành Markdown image cả ở VI + EN.
      </p>

      <div className="space-y-2">
        {Array.from(uniqueByRaw.entries()).map(([raw, group]) => {
          const result = genResults[raw]
          const promptValue = editedPrompts[raw] ?? group[0].alt
          const langs = Array.from(new Set(group.map((g) => g.lang))).join('+')
          return (
            <div
              key={raw}
              className="bg-white dark:bg-slate-900 border border-amber-200 rounded p-2 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                  {langs}
                </span>
                <input
                  type="text"
                  value={promptValue}
                  onChange={(e) => setEditedPrompts((p) => ({ ...p, [raw]: e.target.value }))}
                  placeholder="Prompt mô tả ảnh"
                  disabled={!!result?.url}
                  className="flex-1 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded disabled:opacity-50"
                />
                {!result?.url && (
                  <button
                    onClick={() => handleGen(raw, group)}
                    disabled={result?.loading || !promptValue.trim()}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold rounded disabled:opacity-50"
                  >
                    {result?.loading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {result.elapsedSec ?? 0}s
                      </>
                    ) : (
                      '🎨 Gen'
                    )}
                  </button>
                )}
                {result?.url && (
                  <button
                    onClick={() => {
                      setGenResults((p) => ({ ...p, [raw]: {} }))
                      // Note: we can't easily revert content because user may have edited;
                      // they need to re-paste marker if they want to re-gen
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] rounded"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
              {result?.error && (
                <p className="text-[10px] text-red-700 bg-red-50 px-2 py-1 rounded">⚠ {result.error}</p>
              )}
              {result?.url && (
                <div className="flex items-center gap-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã thay marker bằng ảnh
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto underline truncate max-w-[200px]"
                  >
                    Xem ảnh
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
