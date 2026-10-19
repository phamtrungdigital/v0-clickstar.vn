'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import Link from '@/components/app-link'
import { isLocalizableHref } from '@/lib/i18n/locale'

/**
 * Liên kết trong nội dung Markdown (bài viết, dự án): liên kết nội bộ đi qua AppLink nên trên /en tự trỏ sang bản /en;
 * liên kết ngoài, mailto:, tel:, neo # giữ nguyên thẻ <a> thường như trước.
 */
export function MarkdownLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) {
  if (href && isLocalizableHref(href)) {
    return (
      <Link href={href} className={rest.className} title={rest.title}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
