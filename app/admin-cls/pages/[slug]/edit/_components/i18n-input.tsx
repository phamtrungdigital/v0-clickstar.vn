'use client'

import { AI_MODULE_ENABLED } from '@/lib/ai/module-flag'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { I18n } from '@/lib/cms/types'
import { useEditLang } from '@/lib/cms/edit-lang-context'
import { AiCompose } from './ai-compose'
import { fieldInputClass, fieldLabelClass } from '@/components/admin/ui'

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

  const inputClass = fieldInputClass

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--ad-fg-2)]">
          <span>{label}</span>
          <span className="text-[11.5px] font-normal text-[var(--ad-fg-3)]">
            {flag} {lang.toUpperCase()}
          </span>
        </label>
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
          <Sparkles className="w-3 h-3" />
          AI
        </button>
        )}
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
        <label className="block text-[13px] font-medium text-[var(--ad-fg-2)]">
          {label}
        </label>
        {enableAi && AI_MODULE_ENABLED && (
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
        className={fieldInputClass}
      />
      {hint && <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">{hint}</p>}

      {enableAi && AI_MODULE_ENABLED && aiOpen && (
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
