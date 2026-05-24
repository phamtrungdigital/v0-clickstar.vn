'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackVisit } from '@/lib/personalize/tracker'

/**
 * Track current pathname into localStorage on mount + route change.
 * Mount once globally in app/layout.tsx.
 */
export function useTrackPage() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    trackVisit(pathname)
  }, [pathname])
}
