'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type EditLang = 'vi' | 'en'

type Ctx = { lang: EditLang; setLang: (l: EditLang) => void }

const EditLangContext = createContext<Ctx | null>(null)

export function EditLangProvider({
  children,
  initial = 'vi',
}: {
  children: ReactNode
  initial?: EditLang
}) {
  const [lang, setLang] = useState<EditLang>(initial)
  return (
    <EditLangContext.Provider value={{ lang, setLang }}>{children}</EditLangContext.Provider>
  )
}

export function useEditLang(): Ctx {
  const ctx = useContext(EditLangContext)
  // Default to VI when not wrapped — keeps I18nInput usable in standalone contexts
  return ctx ?? { lang: 'vi' as EditLang, setLang: () => {} }
}

export function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useEditLang()
  return (
    <div
      className={`inline-flex items-center gap-0.5 bg-slate-100 dark:bg-slate-900 rounded-md p-0.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang('vi')}
        className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
          lang === 'vi'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        🇻🇳 VI
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
          lang === 'en'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  )
}
