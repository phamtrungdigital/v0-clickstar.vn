'use client'

import type { ReactNode } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { switchLocalePath, type Lang } from '@/lib/i18n/locale'

/**
 * Nút đổi ngôn ngữ dạng LIÊN KẾT THẬT: href là địa chỉ của chính trang này ở ngôn ngữ kia (ví dụ /about và /en/about),
 * có hrefLang, nên công cụ tìm kiếm và người dùng mở tab mới đều thấy bản tương ứng. Bấm thường thì đi qua
 * setLanguage (giữ query và neo, ghi lại lựa chọn); bấm kèm Ctrl/Cmd/Shift hoặc chuột giữa thì để trình duyệt tự mở.
 */
export function LanguageSwitchLink({
  lang,
  className,
  children,
}: {
  lang: Lang
  className?: string
  children: ReactNode
}) {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const href = switchLocalePath(pathname || '/', lang)
  return (
    <NextLink
      href={href}
      hrefLang={lang}
      lang={lang}
      prefetch={false}
      aria-current={language === lang ? 'true' : undefined}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        setLanguage(lang)
      }}
    >
      {children}
    </NextLink>
  )
}
