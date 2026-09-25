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

/** Số lượt gần nhất gửi kèm để bot hiểu câu hỏi nối tiếp ("gói đó giá bao nhiêu?"). */
const HISTORY_TURNS = 8

// Nhãn UI tĩnh (không phải nội dung do admin chỉnh — nội dung lấy từ config).
const UI = {
  vi: {
    subtitle: 'Trợ lý ảo · trả lời mọi câu hỏi',
    online: 'Đang hoạt động',
    quickLabel: 'Câu hỏi gợi ý:',
    placeholder: 'Nhập câu hỏi…',
    closeLabel: 'Đóng',
    ask: 'Hỏi',
    send: 'Gửi',
    errorUnknown: 'Lỗi không xác định',
    errorNetwork: 'Không kết nối được. Vui lòng gọi {hotline}.',
  },
  en: {
    subtitle: 'Virtual assistant · answers anything',
    online: 'Online',
    quickLabel: 'Quick questions:',
    placeholder: 'Type your question…',
    closeLabel: 'Close',
    ask: 'Ask',
    send: 'Send',
    errorUnknown: 'Something went wrong. Please try again.',
    errorNetwork: "We couldn't connect right now — please call us at {hotline}.",
  },
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Markdown tối giản của câu trả lời AI → HTML. ESCAPE trước rồi mới gắn thẻ:
 * câu trả lời là chữ do AI sinh, không được để nó chèn HTML/script vào trang.
 */
function formatAnswer(text: string): string {
  const inline = (s: string) =>
    escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
  let html = ''
  let inList = false
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const bullet = line.match(/^[-•*]\s+(.*)$/)
    if (bullet) {
      if (!inList) {
        html += '<ul class="list-disc pl-4 space-y-1 my-1.5">'
        inList = true
      }
      // Ý con (thụt ≥ 2 dấu cách, vd gói nằm trong nhóm giá) → lùi vào + chấm rỗng
      const nested = /^\s{2,}/.test(raw)
      html += nested
        ? `<li class="ml-4 list-[circle] text-slate-200">${inline(bullet[1])}</li>`
        : `<li>${inline(bullet[1])}</li>`
      continue
    }
    if (inList) {
      html += '</ul>'
      inList = false
    }
    if (line) html += `<p class="my-1 first:mt-0 last:mb-0">${inline(line)}</p>`
  }
  if (inList) html += '</ul>'
  return html
}

/**
 * Trên điện thoại, khung chat bám đúng VÙNG NHÌN THẤY (visualViewport) thay vì 80vh:
 * iOS/Android không co layout khi bàn phím bật, nên khung `fixed bottom-0` cũ bị bàn
 * phím che mất ô nhập. visualViewport co theo bàn phím → ô nhập luôn nằm ngay trên phím.
 */
function useMobileViewport(active: boolean) {
  const [state, setState] = useState<{ mobile: boolean; top: number; height: number } | null>(null)
  useEffect(() => {
    if (!active) return
    const mq = window.matchMedia('(max-width: 639px)')
    const vv = window.visualViewport
    const update = () =>
      setState({
        mobile: mq.matches,
        top: vv ? vv.offsetTop : 0,
        height: vv ? vv.height : window.innerHeight,
      })
    update()
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    mq.addEventListener('change', update)
    return () => {
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      mq.removeEventListener('change', update)
    }
  }, [active])
  return state
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
  const lastAiRef = useRef<HTMLDivElement>(null)
  const vp = useMobileViewport(open)
  const isMobile = !!vp?.mobile

  // Có câu trả lời mới → đưa ĐẦU câu trả lời lên đầu khung (câu dài không bị cuộn
  // mất đoạn mở đầu). Khách vừa gửi / đang chờ → cuộn xuống đáy.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const last = messages[messages.length - 1]
    if (last?.role === 'ai' && !isPending && lastAiRef.current) {
      el.scrollTo({ top: Math.max(0, lastAiRef.current.offsetTop - 12), behavior: 'smooth' })
    } else {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, isPending])

  // Khoá cuộn trang nền khi mở chat trên điện thoại
  useEffect(() => {
    if (open && isMobile) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open, isMobile])

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
    const history = messages.slice(-HISTORY_TURNS).map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }))
    setMessages((m) => [...m, { role: 'user', content: q }])
    setInput('')
    setError(null)

    startTransition(async () => {
      try {
        const res = await fetch('/api/ai/service-router', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: q, history, lang }),
        })
        const data = await res.json()
        if (!res.ok || data.error) {
          setError(data.error || t.errorUnknown)
          return
        }
        setMessages((m) => [...m, { role: 'ai', content: data.answer, links: data.links }])
      } catch {
        setError(t.errorNetwork.replace('{hotline}', hotline))
      }
    })
  }

  // Ẩn theo rule trang/thiết bị — return SAU khi mọi hook đã chạy.
  if (!visible) return null

  const lastAiIndex = messages.map((m) => m.role).lastIndexOf('ai')
  // Điện thoại: tấm trượt cao 85% VÙNG NHÌN THẤY, dính đáy (anh Trung chốt 25/9 — chừa
  // khoảng trống phía trên để vẫn thấy trang). Tính theo visualViewport nên khi bàn phím
  // bật, tấm co theo và ô nhập vẫn nằm ngay trên phím. Máy tính: hộp nổi góc phải như cũ.
  const SHEET_RATIO = 0.85
  const panelStyle =
    isMobile && vp
      ? { top: vp.top + vp.height * (1 - SHEET_RATIO), height: vp.height * SHEET_RATIO }
      : undefined

  return (
    <>
      {/* ─── Floating Button ─── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={buttonLabel}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 group"
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
        // Nền mờ phía trên tấm chat (chỉ điện thoại) — chạm vào để đóng
        <div className="fixed inset-0 z-40 bg-black/45 sm:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}
      {open && (
        <div
          role="dialog"
          aria-label={botName}
          style={panelStyle}
          className="fixed z-50 inset-x-0 top-[15dvh] bottom-0 sm:top-auto sm:left-auto sm:bottom-5 sm:right-5 w-full sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100dvh-2.5rem)] flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300 sm:[filter:drop-shadow(0_25px_50px_rgba(27,123,255,0.35))]"
        >
          {/* Container with glow */}
          <div className="relative h-full flex flex-col bg-slate-950 sm:bg-slate-950/95 sm:backdrop-blur-xl rounded-t-2xl sm:rounded-2xl border-t sm:border border-white/10 overflow-hidden shadow-[0_-12px_40px_rgba(0,0,0,0.35)] sm:shadow-none">
            {/* Thanh kéo — dấu hiệu "tấm trượt" quen thuộc trên điện thoại */}
            <div className="sm:hidden flex justify-center pt-2 shrink-0" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-white/25" />
            </div>
            {/* Background mesh — hiệu ứng mờ nặng GPU, chỉ bật trên máy tính */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 -z-10" />
            <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-sky-400/25 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 sm:p-4 border-b border-white/10 shrink-0">
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
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

            {/* Messages — relative để offsetTop của câu trả lời tính theo khung này */}
            <div
              ref={scrollRef}
              className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
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
                      className="block w-full text-left px-3 py-2.5 sm:py-2 text-sm text-slate-200 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-sky-300/60 rounded-lg transition-all"
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
                  bubbleRef={i === lastAiIndex ? lastAiRef : undefined}
                  onNavigate={() => {
                    // Điện thoại: khung chat phủ kín màn → đóng lại để khách thấy trang vừa mở
                    if (isMobile) setOpen(false)
                  }}
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
              className="shrink-0 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-white/10 bg-slate-950/50"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Bộ gõ tiếng Việt đang ghép âm tiết: Enter là để CHỐT chữ, không gửi.
                    // Gửi lúc này làm IME chèn lại phần đang ghép vào ô đã xoá → dính chữ rác.
                    if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
                      e.preventDefault()
                    }
                  }}
                  placeholder={t.placeholder}
                  disabled={isPending}
                  maxLength={500}
                  enterKeyHint="send"
                  autoComplete="off"
                  // 16px trên điện thoại: iOS tự phóng to trang khi chạm vào ô chữ < 16px
                  className="flex-1 min-w-0 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isPending || input.trim().length < 2}
                  aria-label={t.send}
                  className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 text-center">{poweredBy}</p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function MessageBubble({
  role,
  content,
  links,
  bubbleRef,
  onNavigate,
}: {
  role: 'user' | 'ai'
  content: string
  links?: ResultLink[]
  bubbleRef?: React.Ref<HTMLDivElement>
  onNavigate?: () => void
}) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-lg shadow-blue-500/20 break-words">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div ref={bubbleRef} className="flex items-start gap-2 sm:gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {/* Điện thoại: dùng hết bề ngang còn lại — 85% của cột vốn đã hẹp làm câu dài vỡ vụn */}
        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-3.5 sm:px-4 py-2.5 max-w-full sm:max-w-[85%] w-fit">
          <div
            className="text-sm text-slate-100 leading-relaxed break-words [&_strong]:text-white"
            dangerouslySetInnerHTML={{ __html: formatAnswer(content) }}
          />
        </div>
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:ml-1">
            {links.map((link, idx) => {
              const isContact = link.href.startsWith('tel:') || link.href.startsWith('mailto:')
              const Icon = link.href.startsWith('tel:')
                ? Phone
                : link.href.startsWith('mailto:')
                ? Mail
                : ArrowRight
              // Vùng chạm ≥ 36px trên điện thoại (chip 11px cũ chỉ cao ~24px, khó bấm)
              const cls =
                'inline-flex items-center gap-1 min-h-9 sm:min-h-0 px-3 sm:px-2.5 py-1.5 sm:py-1 rounded-full text-xs sm:text-[11px] font-medium transition-all border ' +
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
                <Link key={idx} href={link.href} className={cls} onClick={onNavigate}>
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
