'use client'

import type { I18n } from '@/lib/cms/types'

type Props = {
  label: string
  value: I18n
  onChange: (next: I18n) => void
  multiline?: boolean
  rows?: number
}

export function I18nInput({ label, value, onChange, multiline, rows = 3 }: Props) {
  const inputClass =
    'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 mb-1 block">VI 🇻🇳</span>
          {multiline ? (
            <textarea
              value={value.vi}
              onChange={(e) => onChange({ ...value, vi: e.target.value })}
              rows={rows}
              className={inputClass}
            />
          ) : (
            <input
              type="text"
              value={value.vi}
              onChange={(e) => onChange({ ...value, vi: e.target.value })}
              className={inputClass}
            />
          )}
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 mb-1 block">EN 🇬🇧</span>
          {multiline ? (
            <textarea
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              rows={rows}
              className={inputClass}
            />
          ) : (
            <input
              type="text"
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              className={inputClass}
            />
          )}
        </div>
      </div>
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
