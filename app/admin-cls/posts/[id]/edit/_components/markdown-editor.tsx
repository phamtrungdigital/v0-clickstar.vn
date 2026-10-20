'use client'

import { AI_MODULE_ENABLED } from '@/lib/ai/module-flag'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { I18n } from '@/lib/cms/types'
import { useEditLang } from '@/lib/cms/edit-lang-context'
import { AiCompose } from '@/app/admin-cls/pages/[slug]/edit/_components/ai-compose'
import { fieldInputClass } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'

type Mode = 'edit' | 'preview' | 'split'

/**
 * Markdown editor for post body: Edit / Preview / Split modes.
 * Same VI/EN context + AI button pattern as I18nInput, but adds live preview
 * via react-markdown. Replaces the generic I18nInput for content field only.
 */
export function MarkdownEditor({
  label,
  value,
  onChange,
  rows = 20,
}: {
  label: string
  value: I18n
  onChange: (next: I18n) => void
  rows?: number
}) {
  const { lang } = useEditLang()
  const current = value?.[lang] ?? ''
  const flag = lang === 'vi' ? '🇻🇳' : '🇬🇧'
  const [aiOpen, setAiOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('edit')

  const inputClass = fieldInputClass + ' leading-relaxed'

  const renderPreview = (
    <div className="prose prose-sm max-w-none overflow-y-auto rounded-[10px] border border-[var(--ad-line)] bg-[var(--ad-fill-soft)] px-4 py-3" style={{ minHeight: `${rows * 1.5}rem`, maxHeight: '40rem' }}>
      {current.trim() ? (
        <ReactMarkdown>{current}</ReactMarkdown>
      ) : (
        <p className="text-[13px] text-[var(--ad-fg-3)]">Chưa có nội dung</p>
      )}
    </div>
  )

  const renderEditor = (
    <textarea
      value={current}
      onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
      rows={rows}
      className={inputClass}
      placeholder="Nội dung viết bằng Markdown"
    />
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
        <label className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--ad-fg-2)]">
          <span>{label}</span>
          <span className="text-[11.5px] font-normal text-[var(--ad-fg-3)]">
            {flag} {lang.toUpperCase()}
          </span>
        </label>

        <div className="flex items-center gap-2">
          <Segmented
            ariaLabel="Chế độ soạn"
            value={mode}
            onChange={setMode}
            options={[
              { id: 'edit', label: 'Soạn' },
              { id: 'split', label: 'Song song' },
              { id: 'preview', label: 'Xem trước' },
            ]}
          />
          {AI_MODULE_ENABLED && (
          <button
            type="button"
            onClick={() => setAiOpen((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium transition-colors ${
              aiOpen
                ? 'bg-[var(--ad-accent)] text-white'
                : 'text-[var(--ad-accent)] hover:bg-[var(--ad-accent-soft)]'
            }`}
            title="AI viết hộ"
          >
            <Sparkles className="h-3 w-3" />
            AI
          </button>
          )}
        </div>
      </div>

      {mode === 'edit' && renderEditor}
      {mode === 'preview' && renderPreview}
      {mode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {renderEditor}
          {renderPreview}
        </div>
      )}

      {aiOpen && (
        <AiCompose
          fieldLabel={label}
          currentValue={current}
          language={lang}
          multiline
          onResult={(text) => onChange({ ...value, [lang]: text })}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  )
}
