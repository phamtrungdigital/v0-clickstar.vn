'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Page, Section, SectionType } from './types'

const PageDataContext = createContext<Page | null>(null)

export function PageDataProvider({
  page,
  children,
}: {
  page: Page | null
  children: ReactNode
}) {
  return <PageDataContext.Provider value={page}>{children}</PageDataContext.Provider>
}

export function usePageData(): Page | null {
  return useContext(PageDataContext)
}

/**
 * Look up an enabled section of a given type within the current page's data.
 * Returns null if no page context, no matching section, or section is disabled.
 */
export function usePageSection<T extends SectionType>(
  type: T
): Extract<Section, { type: T }> | null {
  const page = usePageData()
  if (!page) return null
  return (page.sections.find((s) => s.type === type && s.enabled) ?? null) as
    | Extract<Section, { type: T }>
    | null
}
