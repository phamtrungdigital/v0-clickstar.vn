'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowUp, X, ChevronUp, ChevronDown, Bot, Loader2, ExternalLink, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useChatbotGate } from '@/components/chatbot-gate'
import type { ChatbotPublicConfig } from '@/lib/cms/chatbot-shared'

const STORAGE_KEY = 'cs_floating_router_dismissed_v1'
const SESSION_AUTOCLOSE_KEY = 'cs_floating_router_session_autoclose'
const MAX_TURNS = 3 // max user turns before forcing CTA

type LinkItem = { title: string; href: string; type: string }

type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'ai'; text: string; links: LinkItem[] }

const COPY = {
  vi: {
    placeholder: 'Bạn cần dịch vụ gì? Click Star sẽ tư vấn ngay…',
    placeholderReply: 'Trả lời / hỏi tiếp…',
    button: 'Hỏi AI',
    badge: 'AI Assistant',
    title: 'Click Star tư vấn miễn phí',
    subtitle: 'Mô tả nhu cầu — AI trả lời + đề xuất giải pháp trong 2 giây',
    quickLabel: 'Hoặc thử nhanh:',
    you: 'Bạn',
    ai: 'Click Star AI',
    thinking: 'Đang suy nghĩ…',
    suggested: 'Đề xuất cho bạn:',
    error: 'Xin lỗi, AI tạm không phản hồi. Liên hệ trực tiếp Hotline nhé!',
    contactCta: 'Liên hệ tư vấn chi tiết',
    resetCta: 'Hỏi câu mới',
    finalHint: 'Cần tư vấn chi tiết hơn? Bấm Liên hệ — chuyên gia Click Star sẽ phản hồi trong 2h.',
  },
  en: {
    placeholder: 'What service do you need? Click Star will help…',
    placeholderReply: 'Reply / ask more…',
    button: 'Ask AI',
    badge: 'AI Assistant',
    title: 'Click Star free consultation',
    subtitle: 'Describe your need — AI replies + recommends solutions in 2 seconds',
    quickLabel: 'Or try:',
    you: 'You',
    ai: 'Click Star AI',
    thinking: 'Thinking…',
    suggested: 'Recommended for you:',
    error: 'Sorry, AI is unavailable. Please contact Hotline directly!',
    contactCta: 'Contact for detailed consultation',
    resetCta: 'New question',
    finalHint: 'Need more details? Click Contact — our experts reply within 2 hours.',
  },
}

function loadDismissed(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return parseInt(raw, 10) || null
  } catch {
    return null
  }
}

function setDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {}
}

/** Session/dismiss check (rule trang + thiết bị do useChatbotGate lo riêng). */
function passesDismissRules(dismissHours: number): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (sessionStorage.getItem(SESSION_AUTOCLOSE_KEY) === '1') return false
  } catch {}
  const dismissed = loadDismissed()
  if (!dismissed) return true
  const hoursSince = (Date.now() - dismissed) / 3_600_000
  return hoursSince >= dismissHours
}

function markSessionAutoclosed(): void {
  try {
    sessionStorage.setItem(SESSION_AUTOCLOSE_KEY, '1')
  } catch {}
}

export function FloatingAiServiceRouter({ config }: { config: ChatbotPublicConfig }) {
  const gateVisible = useChatbotGate(config)
  const { language } = useLanguage()
  const lang: 'vi' | 'en' = language === 'en' ? 'en' : 'vi'

  const showDelayMs = config.show_delay_ms
  const autoCloseMs = config.auto_close_ms
  const dismissHours = config.dismiss_hours
  const hotline = config.hotline || '0977 713 428'

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const interactedRef = useRef(false)
  const [phase, setPhase] = useState<'hidden' | 'collapsed' | 'expanded'>('hidden')
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [autoCloseAt, setAutoCloseAt] = useState<number | null>(null)
  const [remainingMs, setRemainingMs] = useState<number>(autoCloseMs)
  const [closing, setClosing] = useState(false)

  const copy = COPY[lang]
  const prompts = config.quick_prompts?.[lang] || []
  const userTurns = messages.filter((m) => m.role === 'user').length
  const hasReachedMax = userTurns >= MAX_TURNS

  // Show after delay (rule trang/thiết bị qua gate + rule session/dismiss)
  useEffect(() => {
    if (!gateVisible || !passesDismissRules(dismissHours)) {
      setPhase('hidden')
      return
    }
    const timer = setTimeout(() => setPhase('collapsed'), showDelayMs)
    return () => clearTimeout(timer)
  }, [gateVisible, showDelayMs, dismissHours])

  // Auto-scroll to bottom on new message
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  // Start auto-close countdown when bar first appears (collapsed, no interaction)
  useEffect(() => {
    if (phase !== 'collapsed') return
    if (interactedRef.current) return
    if (messages.length > 0) return
    if (autoCloseMs <= 0) return // 0 = tắt auto-close

    const target = Date.now() + autoCloseMs
    setAutoCloseAt(target)
    setRemainingMs(autoCloseMs)
  }, [phase, messages.length, autoCloseMs])

  // Tick countdown with requestAnimationFrame (smooth ring animation)
  useEffect(() => {
    if (!autoCloseAt) return

    let rafId: number
    const tick = () => {
      const remaining = autoCloseAt - Date.now()
      if (remaining <= 0) {
        setRemainingMs(0)
        setAutoCloseAt(null)
        handleAutoClose()
        return
      }
      setRemainingMs(remaining)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCloseAt])

  const cancelAutoClose = () => {
    if (interactedRef.current && !autoCloseAt) return
    interactedRef.current = true
    setAutoCloseAt(null)
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setPhase('hidden')
      setDismissed()
      setClosing(false)
    }, 350)
  }

  const handleAutoClose = () => {
    setClosing(true)
    setTimeout(() => {
      setPhase('hidden')
      markSessionAutoclosed() // session-only — không block như dismiss
      setClosing(false)
    }, 350)
  }

  const handleReset = () => {
    setMessages([])
    setValue('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const submitQuery = async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || loading) return

    cancelAutoClose()

    // Expand if collapsed
    if (phase === 'collapsed') {
      setPhase('expanded')
    }

    // Append user message immediately
    const userMsg: ChatMessage = { role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setValue('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/service-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const aiMsg: ChatMessage = {
        role: 'ai',
        text: data.answer || copy.error,
        links: Array.isArray(data.links) ? data.links : [],
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      console.error('[FloatingRouter] API error:', err)
      const aiMsg: ChatMessage = {
        role: 'ai',
        text: copy.error,
        links: [{ title: copy.contactCta, href: '/contact', type: 'contact' }],
      }
      setMessages((prev) => [...prev, aiMsg])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleSubmit = (e?: React.FormEvent, customValue?: string) => {
    e?.preventDefault()
    const q = (customValue ?? value).trim()
    if (!q) {
      // Empty submit → just expand if collapsed
      if (phase === 'collapsed') {
        setPhase('expanded')
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      return
    }
    submitQuery(q)
  }

  const handleChip = (val: string) => {
    submitQuery(val)
  }

  // Build contact link with conversation context
  const buildContactHref = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user') as
      | { role: 'user'; text: string }
      | undefined
    const params = new URLSearchParams({
      service: 'Tư vấn tổng thể',
      utm_source: 'floating_router',
    })
    if (lastUser) params.set('message', lastUser.text)
    return `/contact?${params.toString()}`
  }

  if (phase === 'hidden') return null

  const hasMessages = messages.length > 0
  const showCountdown = autoCloseAt !== null && !hasMessages && phase === 'collapsed'
  const remainingSec = Math.ceil(remainingMs / 1000)
  // Progress 0 → 1 (filled)
  const progress = autoCloseAt && autoCloseMs > 0 ? 1 - remainingMs / autoCloseMs : 0
  const urgent = remainingMs < 3000
  const warning = remainingMs < 5000 && !urgent

  return (
    <div
      onMouseEnter={cancelAutoClose}
      onTouchStart={cancelAutoClose}
      className={`fixed inset-x-0 bottom-0 z-[55] transition-all duration-300 ease-out ${
        closing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100 animate-in slide-in-from-bottom-4 fade-in'
      }`}
    >
      <div className="mx-auto max-w-5xl px-3 pb-3 lg:pb-4">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl shadow-primary/30 border border-white/10 backdrop-blur-xl overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-32 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Top bar */}
          <div className="relative flex items-center justify-between px-4 lg:px-5 pt-3 pb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <RouterIcon showRing={showCountdown} progress={progress} urgent={urgent} warning={warning} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/90">
                    {copy.badge}
                  </span>
                  <span className="hidden sm:flex items-center text-[9px] text-emerald-400 font-bold">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full mr-1 animate-pulse" />
                    LIVE
                  </span>
                  {showCountdown && (
                    <span
                      className={`flex items-center gap-1 text-[9px] font-mono font-bold tabular-nums transition-colors duration-300 ${
                        urgent
                          ? 'text-red-400 animate-pulse'
                          : warning
                            ? 'text-amber-400'
                            : 'text-white/50'
                      }`}
                    >
                      <span className="hidden sm:inline opacity-70">·</span>
                      AUTO-CLOSE {remainingSec}s
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-white truncate">{copy.title}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {hasMessages && phase === 'expanded' && (
                <button
                  onClick={handleReset}
                  className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  aria-label={copy.resetCta}
                  title={copy.resetCta}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  cancelAutoClose()
                  setPhase(phase === 'collapsed' ? 'expanded' : 'collapsed')
                }}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label={phase === 'collapsed' ? 'Mở rộng' : 'Thu gọn'}
                title={phase === 'collapsed' ? 'Mở rộng' : 'Thu gọn'}
              >
                {phase === 'collapsed' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Đóng"
                title={`Đóng (ẩn ${dismissHours}h)`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat area — only when expanded */}
          {phase === 'expanded' && (
            <>
              {/* Subtitle (only when empty) */}
              {!hasMessages && (
                <div className="relative px-4 lg:px-5 pb-2 text-xs text-white/60">
                  {copy.subtitle}
                </div>
              )}

              {/* Messages list */}
              {hasMessages && (
                <div
                  ref={scrollRef}
                  className="relative px-4 lg:px-5 py-2 max-h-[40vh] lg:max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                >
                  <div className="flex flex-col gap-2.5">
                    {messages.map((msg, idx) => (
                      <ChatBubble
                        key={idx}
                        message={msg}
                        animate={msg.role === 'ai' && idx === messages.length - 1}
                        onTick={scrollToBottom}
                        labels={{ you: copy.you, ai: copy.ai, suggested: copy.suggested }}
                      />
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 text-xs text-white/60 px-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {copy.thinking}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Final CTA after max turns */}
              {hasReachedMax && !loading && (
                <div className="relative px-4 lg:px-5 pb-2 pt-1">
                  <div className="bg-gradient-to-r from-primary/15 to-orange-500/15 border border-primary/30 rounded-lg p-2.5 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-white/80 flex-1 min-w-0">{copy.finalHint}</div>
                    <Link
                      href={buildContactHref()}
                      onClick={() => setDismissed()}
                      className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold rounded-full hover:scale-105 transition-transform"
                    >
                      {copy.contactCta}
                      <ArrowUp className="w-3 h-3 rotate-45" />
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Input + send */}
          <form
            onSubmit={handleSubmit}
            className="relative px-4 lg:px-5 pb-3 pt-1 flex items-center gap-2"
          >
            <div className="flex-1 relative">
              <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => {
                  cancelAutoClose()
                  setValue(e.target.value)
                }}
                placeholder={hasMessages ? copy.placeholderReply : copy.placeholder}
                disabled={loading || hasReachedMax}
                className="w-full pl-9 pr-3 py-2.5 lg:py-3 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/10 focus:border-primary/60 rounded-full text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onFocus={() => {
                  cancelAutoClose()
                  if (phase === 'collapsed') setPhase('expanded')
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || hasReachedMax}
              className="group flex items-center justify-center gap-1.5 px-4 lg:px-5 py-2.5 lg:py-3 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/40 text-white text-sm font-bold rounded-full transition-all hover:scale-[1.02] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">{copy.button}</span>
                  <ArrowUp className="w-4 h-4 sm:rotate-45 group-hover:translate-y-[-1px] sm:group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick prompts — only when expanded AND no messages */}
          {phase === 'expanded' && !hasMessages && prompts.length > 0 && (
            <div className="relative px-4 lg:px-5 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                {copy.quickLabel}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      cancelAutoClose()
                      handleChip(p.value)
                    }}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-primary/40 text-white/85 hover:text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Avatar icon + circular progress ring countdown
 * Ring fills 0 → 1 as time runs out, color shifts blue → amber → red
 */
function RouterIcon({
  showRing,
  progress,
  urgent,
  warning,
}: {
  showRing: boolean
  progress: number // 0 (full time left) → 1 (zero)
  urgent: boolean
  warning: boolean
}) {
  const ringColor = urgent ? '#ef4444' : warning ? '#f59e0b' : '#1B7BFF'
  const glowColor = urgent ? 'shadow-red-500/60' : warning ? 'shadow-amber-500/50' : 'shadow-primary/40'
  // r=17, circumference ≈ 106.81
  const R = 17
  const C = 2 * Math.PI * R
  const offset = C * (1 - progress)

  return (
    <div className="relative w-9 h-9 shrink-0">
      {/* Avatar */}
      <div
        className={`absolute inset-0.5 rounded-full bg-gradient-to-br from-primary via-purple-500 to-orange-500 flex items-center justify-center shadow-lg transition-shadow duration-300 ${glowColor} ${
          urgent ? 'animate-pulse' : ''
        }`}
      >
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      {/* Countdown progress ring */}
      {showRing && (
        <svg
          className="absolute inset-0 w-9 h-9 -rotate-90 pointer-events-none"
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="18"
            cy="18"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          {/* Progress */}
          <circle
            cx="18"
            cy="18"
            r={R}
            fill="none"
            stroke={ringColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke 300ms ease',
              filter: `drop-shadow(0 0 4px ${ringColor})`,
            }}
          />
        </svg>
      )}
    </div>
  )
}

/** Chat bubble — user (right, primary) vs AI (left, glass + typewriter) */
function ChatBubble({
  message,
  animate,
  onTick,
  labels,
}: {
  message: ChatMessage
  animate?: boolean
  onTick?: () => void
  labels: { you: string; ai: string; suggested: string }
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="max-w-[80%] bg-gradient-to-br from-primary to-primary-dark text-white text-sm px-3.5 py-2 rounded-2xl rounded-br-sm shadow-md">
          {message.text}
        </div>
      </div>
    )
  }

  return (
    <AiBubble message={message} animate={!!animate} onTick={onTick} labels={labels} />
  )
}

/**
 * AI bubble với typewriter effect
 */
function AiBubble({
  message,
  animate,
  onTick,
  labels,
}: {
  message: Extract<ChatMessage, { role: 'ai' }>
  animate: boolean
  onTick?: () => void
  labels: { you: string; ai: string; suggested: string }
}) {
  const fullText = message.text
  const doneRef = useRef(!animate)
  const [displayText, setDisplayText] = useState(animate ? '' : fullText)
  const [done, setDone] = useState(!animate)

  useEffect(() => {
    if (!animate) {
      setDisplayText(fullText)
      setDone(true)
      doneRef.current = true
      return
    }
    if (doneRef.current) {
      // Already typed in a previous mount — keep full text
      setDisplayText(fullText)
      setDone(true)
      return
    }

    let i = 0
    const CHUNK = 2 // chars per tick
    const TICK_MS = 16 // ~60fps

    const timer = setInterval(() => {
      i += CHUNK
      if (i >= fullText.length) {
        setDisplayText(fullText)
        setDone(true)
        doneRef.current = true
        clearInterval(timer)
        onTick?.()
        return
      }
      setDisplayText(fullText.slice(0, i))
      onTick?.()
    }, TICK_MS)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullText, animate])

  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="max-w-[88%] flex flex-col gap-2">
        <div className="bg-white/10 border border-white/10 text-white/95 text-sm px-3.5 py-2 rounded-2xl rounded-bl-sm whitespace-pre-wrap leading-relaxed">
          {displayText}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-text-bottom animate-pulse"
              style={{ verticalAlign: '-0.15em' }}
              aria-hidden="true"
            />
          )}
        </div>
        {done && message.links.length > 0 && (
          <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              {labels.suggested}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {message.links.map((link, i) => (
                <SmartLink key={i} link={link} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SmartLink({ link }: { link: LinkItem }) {
  const isExternal = link.href.startsWith('tel:') || link.href.startsWith('mailto:')
  const className =
    'inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 border border-primary/40 hover:border-primary/60 text-white text-xs font-semibold rounded-full transition-all hover:scale-[1.02]'

  if (isExternal) {
    return (
      <a href={link.href} className={className}>
        {link.title}
        <ExternalLink className="w-3 h-3" />
      </a>
    )
  }

  return (
    <Link href={link.href} className={className}>
      {link.title}
      <ArrowUp className="w-3 h-3 rotate-45" />
    </Link>
  )
}
