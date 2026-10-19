'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { langFromPathname, localizePath, switchLocalePath, type Lang } from '@/lib/i18n/locale'

export type Language = Lang

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

/**
 * Ngôn ngữ SUY RA TỪ ĐỊA CHỈ: /en/... là tiếng Anh, còn lại là tiếng Việt (xem lib/i18n/locale.ts). Nhờ vậy
 * HTML tĩnh của mỗi bản đã đúng ngôn ngữ ngay khi tải (không còn "luôn tiếng Việt trước rồi đổi sau khi hydrate")
 * và công cụ tìm kiếm thấy hai bản có địa chỉ riêng. Cookie cs-lang chỉ ghi lại lựa chọn của khách.
 */
export function LanguageProvider({
  children,
  initialLang = 'vi',
}: {
  children: ReactNode
  initialLang?: Language
}) {
  const pathname = usePathname()
  const router = useRouter()
  const language: Language = pathname ? langFromPathname(pathname) : initialLang

  // Khách đã tự chọn tiếng Anh ở lần trước (cookie cs-lang=en) mà mở một địa chỉ tiếng Việt từ bên ngoài site
  // (ví dụ gõ thẳng clickstar.vn): chuyển sang bản /en tương ứng một lần. Chỉ chạy ở client nên công cụ tìm kiếm
  // (không có cookie) không bao giờ bị chuyển hướng, và không chạy khi khách đang đi trong site (referrer cùng origin).
  useEffect(() => {
    if (language !== 'vi' || !pathname) return
    const saved = document.cookie.match(/(?:^|;\s*)cs-lang=(en|vi)/)?.[1]
    if (saved !== 'en') return
    let sameOrigin = false
    try {
      sameOrigin = !!document.referrer && new URL(document.referrer).origin === window.location.origin
    } catch {
      /* referrer lạ: coi như ngoài site */
    }
    if (sameOrigin) return
    const target = localizePath(pathname, 'en')
    if (target !== pathname) router.replace(`${target}${window.location.search}${window.location.hash}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Đổi ngôn ngữ = sang địa chỉ tương ứng (giữ query và neo), ghi lại lựa chọn để lần sau không bị chuyển ngược.
  const setLanguage = (lang: Language) => {
    if (lang === language) return
    writeCookie(lang)
    const target = switchLocalePath(window.location.pathname, lang)
    router.push(`${target}${window.location.search}${window.location.hash}`)
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
