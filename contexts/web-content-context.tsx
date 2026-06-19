'use client'

import { createContext, useContext } from 'react'
import {
  DEFAULT_FOOTER,
  DEFAULT_SERVICE_CTAS,
  type FooterContent,
  type ServiceCtas,
  type ServiceCta,
} from '@/lib/cms/web-content-shared'

type WebContentValue = {
  footer: FooterContent
  serviceCtas: ServiceCtas
}

const WebContentContext = createContext<WebContentValue>({
  footer: DEFAULT_FOOTER,
  serviceCtas: DEFAULT_SERVICE_CTAS,
})

export function WebContentProvider({
  value,
  children,
}: {
  value: WebContentValue
  children: React.ReactNode
}) {
  return <WebContentContext.Provider value={value}>{children}</WebContentContext.Provider>
}

export function useFooterContent(): FooterContent {
  return useContext(WebContentContext).footer
}

/** Lấy CTA của 1 trang dịch vụ theo slug; null nếu chưa cấu hình. */
export function useServiceCta(slug: string): ServiceCta | null {
  return useContext(WebContentContext).serviceCtas[slug] ?? null
}
