'use client'

import type { I18n } from '@/lib/cms/types'
import { useEditLang } from '@/lib/cms/edit-lang-context'

type Props = {
  label: string
  value: I18n
  onChange: (next: I18n) => void
  multiline?: boolean
  rows?: number
}

export function I18nInput({ label, value, onChange, multiline, rows = 3 }: Props) {
  const { lang } = useEditLang()
  const current = value?.[lang] ?? ''
  const flag = lang === 'vi' ? '🇻🇳' : '🇬🇧'

  const inputClass =
    'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        <span>{label}</span>
        <span className="text-[10px] text-slate-400 font-normal">
          {flag} {lang.toUpperCase()}
        </span>
      </label>
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
    </div>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      {hint && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}
