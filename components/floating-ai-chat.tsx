'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  Phone,
  Mail,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useChatbotGate } from '@/components/chatbot-gate'
import type { ChatbotPublicConfig } from '@/lib/cms/chatbot-shared'

type ResultLink = {
  title: string
  href: string
  type: 'service' | 'page' | 'contact' | 'blog'
}

type Message = {
  role: 'user' | 'ai'
  content: string
  links?: ResultLink[]
}

// Nhãn UI tĩnh (không phải nội dung do admin chỉnh — nội dung lấy từ config).
const UI = {
  vi: {
    subtitle: 'Trợ lý ảo · trả lời mọi câu hỏi',
    online: 'Đang hoạt động',
    quickLabel: 'Câu hỏi gợi ý:',
    placeholder: 'Nhập câu hỏi…',
    closeLabel: 'Đóng',
    ask: 'Hỏi',
  },
  en: {
    subtitle: 'Virtual assistant · answers anything',
    online: 'Online',
    quickLabel: 'Quick questions:',
    placeholder: 'Type your question…',
    closeLabel: 'Close',
    ask: 'Ask',
  },
}

function formatAnswer(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
}

export function FloatingAiChat({ config }: { config: ChatbotPublicConfig }) {
  // ── Tất cả hook gọi UNCONDITIONALLY ở đầu (tránh lỗi Rules of Hooks) ──
  const visible = useChatbotGate(config)
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isPending])

  // Lock body scroll when panel open on mobile
  useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  const lang: 'vi' | 'en' = language === 'en' ? 'en' : 'vi'
  const t = UI[lang]
  const botName = config.bot_name?.[lang] || 'Click Star AI'
  const welcome = config.welcome_message?.[lang] || ''
  const quickPrompts = config.quick_prompts?.[lang] || []
  const buttonLabel = `${t.ask} ${botName}`
  const hotline = config.hotline || '0977 713 428'
  const poweredBy =
    lang === 'vi' ? `AI có thể nhầm. Hotline: ${hotline}` : `AI may be wrong. Hotline: ${hotline}`

  const submit = (q: string) => {
    if (!q || q.trim().length < 2 || isPending) return
    const userMsg: Message = { role: 'user', content: q }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setError(null)

    startTransition(async () => {
      try {
        const res = await fetch('/api/ai/service-router', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: q }),
        })
        const data = await res.json()
        if (!res.ok || data.error) {
          setError(data.error || 'Lỗi không xác định')
          return
        }
        setMessages((m) => [
          ...m,
          { role: 'ai', content: data.answer, links: data.links },
        ])
      } catch (e: any) {
        setError(`Không kết nối được. Vui lòng gọi ${hotline}.`)
      }
    })
  }

  // Ẩn theo rule trang/thiết bị — return SAU khi mọi hook đã chạy.
  if (!visible) return null

  return (
    <>
      {/* ─── Floating Button ─── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={buttonLabel}
          className="fixed bottom-5 right-5 z-50 group"
        >
          {/* Outer glow rings */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 blur-lg opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
          <span
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 opacity-30 animate-ping"
            style={{ animationDuration: '2.5s' }}
          />

          {/* Main button */}
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-[#1B7BFF] to-sky-500 shadow-2xl shadow-blue-500/40 border border-white/20 transition-transform group-hover:scale-110 group-active:scale-95">
            <Sparkles className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
            {/* Tiny animated dot top-right (online indicator) */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
          </span>

          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-white/10">
            {buttonLabel}
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900" />
          </span>
        </button>
      )}

      {/* ─── Chat Panel ─── */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="fixed z-50 bottom-0 right-0 left-0 sm:left-auto sm:bottom-5 sm:right-5 w-full sm:w-[400px] h-[80vh] sm:h-[600px] sm:max-h-[calc(100vh-2.5rem)] flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300"
            style={{ filter: 'drop-shadow(0 25px 50px rgba(27,123,255,0.35))' }}
          >
            {/* Container with glow */}
            <div className="relative h-full flex flex-col bg-slate-950/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl border border-white/10 overflow-hidden">
              {/* Background mesh */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 -z-10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/25 rounded-full blur-3xl -z-10 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -z-10" />

              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm leading-tight">{botName}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {t.online}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t.closeLabel}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              >
                {/* Welcome message */}
                <MessageBubble role="ai" content={welcome} />

                {/* Quick prompts (shown only at start) */}
                {messages.length === 0 && !isPending && quickPrompts.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] text-slate-500 px-1 uppercase tracking-wider font-medium">
                      {t.quickLabel}
                    </p>
                    {quickPrompts.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => submit(p.value)}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-200 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-sky-300/60 rounded-lg transition-all"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Conversation */}
                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    role={m.role}
                    content={m.content}
                    links={m.links}
                  />
                ))}

                {/* Thinking indicator */}
                {isPending && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 bg-sky-300 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200">{error}</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submit(input.trim())
                }}
                className="p-3 border-t border-white/10 bg-slate-950/50"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    disabled={isPending}
                    maxLength={500}
                    className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isPending || input.trim().length < 2}
                    aria-label="Send"
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 text-center">{poweredBy}</p>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function MessageBubble({
  role,
  content,
  links,
}: {
  role: 'user' | 'ai'
  content: string
  links?: ResultLink[]
}) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-lg shadow-blue-500/20">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
          <div
            className="text-sm text-slate-100 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatAnswer(content) }}
          />
        </div>
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 ml-1">
            {links.map((link, idx) => {
              const isContact = link.href.startsWith('tel:') || link.href.startsWith('mailto:')
              const Icon = link.href.startsWith('tel:')
                ? Phone
                : link.href.startsWith('mailto:')
                ? Mail
                : ArrowRight
              const cls =
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ' +
                (idx === 0
                  ? 'bg-gradient-to-r from-sky-400/25 to-blue-500/25 hover:from-sky-400/40 hover:to-blue-500/40 border-sky-300/50 text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200')
              if (isContact) {
                return (
                  <a key={idx} href={link.href} className={cls}>
                    <Icon className="w-3 h-3" />
                    {link.title}
                  </a>
                )
              }
              return (
                <Link key={idx} href={link.href} className={cls}>
                  {link.title}
                  <Icon className="w-3 h-3" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
