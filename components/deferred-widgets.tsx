'use client'

import { useEffect, useState } from 'react'
import nextDynamic from 'next/dynamic'
import type { ChatbotPublicConfig } from '@/lib/cms/chatbot-shared'

// Các tiện ích nổi không cần có mặt lúc vẽ trang đầu tiên: chỉ tải mã sau khi trang đã tải xong
// và trình duyệt rảnh, để điện thoại không phải tải và chạy chúng cùng lúc với phần nội dung chính.
const ChatbotWidgets = nextDynamic(() => import('@/components/chatbot-widgets').then((m) => m.ChatbotWidgets), { ssr: false })
const EditModeOverlay = nextDynamic(() => import('@/components/edit-mode-overlay').then((m) => m.EditModeOverlay), { ssr: false })
const PersonalizeBanner = nextDynamic(() => import('@/components/personalize-banner').then((m) => m.PersonalizeBanner), { ssr: false })
const CapabilityPopup = nextDynamic(() => import('@/components/capability-popup').then((m) => m.CapabilityPopup), { ssr: false })

export function DeferredWidgets({ chatbot }: { chatbot: ChatbotPublicConfig }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let idleId: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const start = () => {
      const ric = window.requestIdleCallback
      if (ric) idleId = ric(() => setReady(true), { timeout: 2500 })
      else timer = setTimeout(() => setReady(true), 300)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timer) clearTimeout(timer)
    }
  }, [])

  if (!ready) return null
  return (
    <>
      <ChatbotWidgets config={chatbot} />
      <EditModeOverlay />
      <PersonalizeBanner />
      <CapabilityPopup />
    </>
  )
}
