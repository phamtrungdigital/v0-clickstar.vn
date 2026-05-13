'use client'

import { useState } from 'react'
import { Sparkles, Eye, Pencil, Columns2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { I18n } from '@/lib/cms/types'
import { useEditLang } from '@/lib/cms/edit-lang-context'
import { AiCompose } from '@/app/admin-cls/pages/[slug]/edit/_components/ai-compose'

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

  const inputClass =
    'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono'

  const renderPreview = (
    <div className="prose prose-sm max-w-none px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md overflow-y-auto" style={{ minHeight: `${rows * 1.5}rem`, maxHeight: '40rem' }}>
      {current.trim() ? (
        <ReactMarkdown>{current}</ReactMarkdown>
      ) : (
        <p className="text-slate-400 italic text-xs">Chưa có nội dung</p>
      )}
    </div>
  )

  const renderEditor = (
    <textarea
      value={current}
      onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
      rows={rows}
      className={inputClass}
      placeholder="Markdown content..."
    />
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            {flag} {lang.toUpperCase()}
          </span>
        </label>

        <div className="flex items-center gap-1">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded p-0.5">
            <ModeBtn active={mode === 'edit'} onClick={() => setMode('edit')} icon={<Pencil className="w-3 h-3" />} label="Edit" />
            <ModeBtn active={mode === 'split'} onClick={() => setMode('split')} icon={<Columns2 className="w-3 h-3" />} label="Split" />
            <ModeBtn active={mode === 'preview'} onClick={() => setMode('preview')} icon={<Eye className="w-3 h-3" />} label="Preview" />
          </div>
          <button
            type="button"
            onClick={() => setAiOpen((v) => !v)}
            className={`inline-flex items-center gap-1 px-1.5 py-1 text-[10px] font-medium rounded transition-colors ${
              aiOpen
                ? 'bg-violet-500 text-white'
                : 'text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-950/30'
            }`}
            title="AI viết hộ"
          >
            <Sparkles className="w-3 h-3" />
            AI
          </button>
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

function ModeBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
        active
          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
