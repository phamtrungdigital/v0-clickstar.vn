'use client'

import { usePathname } from 'next/navigation'
import { stripLocale } from '@/lib/i18n/locale'
import { useEffect, useState } from 'react'
import type { ChatbotPublicConfig } from '@/lib/cms/chatbot-shared'

/**
 * Quyết định widget bot có được phép hiện ở trang/thiết bị hiện tại không.
 * Áp dụng rule: hidden_paths (denylist theo prefix) + show_on_desktop / show_on_mobile.
 * Gọi UNCONDITIONALLY ở đầu widget (custom hook) — không vi phạm Rules of Hooks.
 */
export function useChatbotGate(config: ChatbotPublicConfig): boolean {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // hidden_paths khai báo theo đường dẫn tiếng Việt: bản /en của trang cũng bị ẩn như bản gốc
  const logical = pathname ? stripLocale(pathname) : pathname
  const pathHidden = (config.hidden_paths || []).some(
    (p) => p && (logical === p || logical?.startsWith(p))
  )
  if (pathHidden) return false

  // Chưa biết kích thước (first paint) → cho hiện để tránh trễ; khi biết rồi mới ẩn nếu rule tắt.
  if (isMobile === null) return true
  return isMobile ? config.show_on_mobile : config.show_on_desktop
}
