'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { stripLocale } from '@/lib/i18n/locale'
import { trackVisit } from '@/lib/personalize/tracker'

/**
 * Track current pathname into localStorage on mount + route change.
 * Mount once globally in app/layout.tsx.
 */
export function useTrackPage() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // Ghi nhận theo đường dẫn tiếng Việt để bản /en và bản gốc tính chung một trang
    trackVisit(stripLocale(pathname))
  }, [pathname])
}
