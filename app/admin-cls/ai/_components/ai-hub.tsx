'use client'

import { useState } from 'react'
import { Segmented } from '@/components/admin/segmented'
import { AiSettingsForm } from './ai-settings-form'
import { ChatbotSettingsForm } from './chatbot-settings-form'
import type { AiSettings } from '@/lib/ai/settings-shared'
import type { ChatbotSettings } from '@/lib/cms/chatbot-shared'

export function AiHub({
  aiInitial,
  chatbotInitial,
  aiEnabled,
}: {
  aiInitial: AiSettings | null
  chatbotInitial: ChatbotSettings | null
  aiEnabled: boolean
}) {
  const [tab, setTab] = useState<'cms' | 'chatbot'>('cms')

  // Module AI tắt: chỉ hiện cấu hình chatbot website, không có tab Trợ lý CMS
  if (!aiEnabled) return <ChatbotSettingsForm initial={chatbotInitial} />

  return (
    <div className="space-y-4">
      {/* Tab cấp cao: Trợ lý CMS (nội bộ) và Chatbot website (công khai) */}
      <Segmented
        ariaLabel="Chọn loại trợ lý"
        value={tab}
        onChange={setTab}
        options={[
          { id: 'cms', label: 'Trợ lý CMS' },
          { id: 'chatbot', label: 'Chatbot website' },
        ]}
      />

      {tab === 'cms' ? (
        <AiSettingsForm initial={aiInitial} embedded />
      ) : (
        <ChatbotSettingsForm initial={chatbotInitial} embedded />
      )}
    </div>
  )
}
