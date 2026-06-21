'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (vi: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const COOKIE_NAME = 'cs-lang'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function writeCookie(lang: Language) {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

export function LanguageProvider({
  children,
  initialLang = 'vi',
}: {
  children: ReactNode
  initialLang?: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLang)
  const router = useRouter()

  // Trang giờ render tĩnh (SSR mặc định 'vi') → đọc cookie cs-lang ở client khi mount
  // để đổi sang 'en' nếu user đã chọn. KHÔNG router.refresh ở đây (chỉ đổi state client).
  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)cs-lang=(en|vi)/)
    const saved = (m?.[1] as Language) || 'vi'
    if (saved !== language) setLanguageState(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update <html lang="…"> on language change so screen readers + Chrome translate know.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    writeCookie(lang)
    // Invalidate Next.js RSC cache so server components re-fetch with new cookie.
    // Without this, /blog & other server-rendered pages keep showing the OLD lang
    // after navigation because the prefetched RSC payload is in the client cache.
    router.refresh()
  }

  const t = (vi: string, en: string) => (language === 'vi' ? vi : en)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
