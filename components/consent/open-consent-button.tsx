'use client'

import { CONSENT_OPEN_EVENT } from '@/lib/consent/shared'

/** Nút mở bảng "Cài đặt cookie" (components/consent/consent-manager.tsx) từ bất kỳ trang nào. */
export function OpenConsentButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      {label}
    </button>
  )
}
