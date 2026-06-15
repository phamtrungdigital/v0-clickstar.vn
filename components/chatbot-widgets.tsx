'use client'

import { FloatingAiChat } from '@/components/floating-ai-chat'
import { FloatingAiServiceRouter } from '@/components/floating-ai-service-router'
import type { ChatbotPublicConfig } from '@/lib/cms/chatbot-shared'

/**
 * Render bot công khai theo cấu hình admin (chatbot_settings).
 * widget_mode: bubble = nút tròn | bar = thanh đáy | both = cả hai | none = tắt.
 */
export function ChatbotWidgets({ config }: { config: ChatbotPublicConfig }) {
  if (!config.enabled || config.widget_mode === 'none') return null

  const showBubble = config.widget_mode === 'bubble' || config.widget_mode === 'both'
  const showBar = config.widget_mode === 'bar' || config.widget_mode === 'both'

  return (
    <>
      {showBubble && <FloatingAiChat config={config} />}
      {showBar && <FloatingAiServiceRouter config={config} />}
    </>
  )
}
