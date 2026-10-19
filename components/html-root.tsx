'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { langFromPathname } from '@/lib/i18n/locale'

/**
 * Thẻ <html> và <body> của cả site. Là client component để thuộc tính lang đúng theo địa chỉ ngay trong HTML tĩnh
 * (trang /en/... có lang="en", còn lại lang="vi") mà layout gốc không phải đọc header/cookie (đọc sẽ ép mọi trang
 * thành render động). usePathname chạy được lúc prerender nên bản HTML tĩnh đã có lang đúng.
 */
export function HtmlRoot({
  htmlClassName,
  bodyClassName,
  children,
}: {
  htmlClassName?: string
  bodyClassName?: string
  children: ReactNode
}) {
  const lang = langFromPathname(usePathname())
  return (
    <html lang={lang} className={htmlClassName}>
      <body className={bodyClassName}>{children}</body>
    </html>
  )
}
