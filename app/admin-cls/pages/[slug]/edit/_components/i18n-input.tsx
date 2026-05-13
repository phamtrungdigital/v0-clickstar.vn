'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { I18n } from '@/lib/cms/types'
import { useEditLang } from '@/lib/cms/edit-lang-context'
import { AiCompose } from './ai-compose'

type Props = {
  label: string
  value: I18n
  onChange: (next: I18n) => void
  multiline?: boolean
  rows?: number
  pageContext?: string
}

export function I18nInput({ label, value, onChange, multiline, rows = 3, pageContext }: Props) {
  const { lang } = useEditLang()
  const current = value?.[lang] ?? ''
  const flag = lang === 'vi' ? '🇻🇳' : '🇬🇧'
  const [aiOpen, setAiOpen] = useState(false)

  const inputClass =
    'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            {flag} {lang.toUpperCase()}
          </span>
        </label>
        <button
          type="button"
          onClick={() => setAiOpen((v) => !v)}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
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
      {multiline ? (
        <textarea
          value={current}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
          rows={rows}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={current}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
          className={inputClass}
        />
      )}

      {aiOpen && (
        <AiCompose
          fieldLabel={label}
          currentValue={current}
          language={lang}
          pageContext={pageContext}
          multiline={multiline}
          onResult={(text) => onChange({ ...value, [lang]: text })}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  enableAi,
  pageContext,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  hint?: string
  enableAi?: boolean
  pageContext?: string
}) {
  const [aiOpen, setAiOpen] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {enableAi && (
          <button
            type="button"
            onClick={() => setAiOpen((v) => !v)}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
              aiOpen
                ? 'bg-violet-500 text-white'
                : 'text-violet-600 hover:bg-violet-100'
            }`}
            title="AI viết hộ"
          >
            <Sparkles className="w-3 h-3" />
            AI
          </button>
        )}
      </div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      {hint && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}

      {enableAi && aiOpen && (
        <AiCompose
          fieldLabel={label}
          currentValue={value}
          language="vi"
          pageContext={pageContext}
          onResult={(text) => onChange(text)}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  )
}
