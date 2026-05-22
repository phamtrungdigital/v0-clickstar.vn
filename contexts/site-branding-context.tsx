'use client'

import { createContext, useContext, type ReactNode } from 'react'

export type SiteBranding = {
  logoUrl: string | null
  faviconUrl: string | null
  siteName: string
  zaloUrl: string | null
  contactPhone: string | null
  contactEmail: string | null
}

// Fallback to /images/logo-clickstar.png if no logo configured in CMS
const DEFAULT_BRANDING: SiteBranding = {
  logoUrl: '/images/logo-clickstar.png',
  faviconUrl: null,
  siteName: 'ClickStar',
  zaloUrl: null,
  contactPhone: null,
  contactEmail: null,
}

const SiteBrandingContext = createContext<SiteBranding>(DEFAULT_BRANDING)

export function SiteBrandingProvider({
  branding,
  children,
}: {
  branding: SiteBranding
  children: ReactNode
}) {
  return (
    <SiteBrandingContext.Provider value={branding}>{children}</SiteBrandingContext.Provider>
  )
}

export function useSiteBranding(): SiteBranding {
  return useContext(SiteBrandingContext)
}
