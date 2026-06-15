'use client'

import { useState } from 'react'
import { Sparkles, MessageCircle } from 'lucide-react'
import { AiSettingsForm } from './ai-settings-form'
import { ChatbotSettingsForm } from './chatbot-settings-form'
import type { AiSettings } from '@/lib/ai/settings-shared'
import type { ChatbotSettings } from '@/lib/cms/chatbot-shared'

export function AiHub({
  aiInitial,
  chatbotInitial,
}: {
  aiInitial: AiSettings | null
  chatbotInitial: ChatbotSettings | null
}) {
  const [tab, setTab] = useState<'cms' | 'chatbot'>('cms')

  return (
    <div className="space-y-3">
      {/* Tab cấp cao: Trợ lý CMS (nội bộ) vs Chatbot website (công khai) */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('cms')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition-colors ${
            tab === 'cms'
              ? 'bg-violet-50 border-violet-300 text-violet-700'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Trợ lý CMS
        </button>
        <button
          onClick={() => setTab('chatbot')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition-colors ${
            tab === 'chatbot'
              ? 'bg-sky-50 border-sky-300 text-sky-700'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chatbot website
        </button>
      </div>

      {tab === 'cms' ? (
        <AiSettingsForm initial={aiInitial} />
      ) : (
        <ChatbotSettingsForm initial={chatbotInitial} />
      )}
    </div>
  )
}
