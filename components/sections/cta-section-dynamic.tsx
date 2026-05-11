'use client'

import { CTASection } from './cta-section'
import { usePageSection } from '@/lib/cms/page-data-context'

/** Reads `cta` section from PageDataContext and renders CTASection. Returns null if absent. */
export function CTASectionDynamic() {
  const section = usePageSection('cta')
  if (!section) return null
  return <CTASection content={section.content} />
}
