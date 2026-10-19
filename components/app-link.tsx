'use client'

import type { ComponentProps } from 'react'
import NextLink from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { localizeAnyHref, localizePath, type Lang } from '@/lib/i18n/locale'

type Href = ComponentProps<typeof NextLink>['href']

/** Địa chỉ nội bộ theo ngôn ngữ `lang` (chuỗi hoặc UrlObject); địa chỉ ngoài site, neo (#) và tệp tĩnh giữ nguyên. */
export function localizeHref(href: Href, lang: Lang): Href {
  if (typeof href === 'string') return localizePath(href, lang)
  if (href && typeof href === 'object' && typeof href.pathname === 'string') {
    return { ...href, pathname: localizePath(href.pathname, lang) }
  }
  return href
}

/**
 * Hook cho chỗ dùng thẻ <a> thường hoặc router.push: trả về hàm đổi đường dẫn nội bộ sang ngôn ngữ đang xem.
 * Hiểu cả địa chỉ tuyệt đối tới chính site (CMS hay dán https://clickstar.vn/projects/x); địa chỉ ngoài site, neo, tel: giữ nguyên.
 */
export function useLocalHref(): (href: string) => string {
  const { language } = useLanguage()
  return (href: string) => localizeAnyHref(href, language)
}

/**
 * Thay cho `next/link`: trên trang tiếng Anh (/en/...) mọi liên kết nội bộ tự trỏ sang bản /en tương ứng,
 * nên khách (và công cụ tìm kiếm) đi tiếp trong cùng ngôn ngữ. Trên trang tiếng Việt không đổi gì.
 */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { language } = useLanguage()
  return <NextLink href={localizeHref(href, language)} {...props} />
}
