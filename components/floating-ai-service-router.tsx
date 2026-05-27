'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, ArrowUp, X, ChevronUp, ChevronDown, Bot } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const STORAGE_KEY = 'cs_floating_router_dismissed_v1'
const SHOW_DELAY_MS = 10_000 // 10s after page load
const DISMISS_HOURS = 24 // hide 24h after user dismiss

const QUICK_PROMPTS = {
  vi: [
    { label: 'Chạy quảng cáo FB & Google', value: 'Tôi muốn chạy quảng cáo Facebook & Google' },
    { label: 'Làm website chuẩn SEO', value: 'Cần làm website mới chuẩn SEO' },
    { label: 'Dashboard quản lý', value: 'Thiết kế dashboard để theo dõi tình hình doanh nghiệp' },
    { label: 'Tích hợp AI Chatbot', value: 'Tích hợp chatbot AI cho website' },
    { label: 'Bảng giá dịch vụ', value: 'Bảng giá dịch vụ thế nào?' },
  ],
  en: [
    { label: 'Facebook & Google Ads', value: 'I want to run Facebook & Google ads' },
    { label: 'SEO Website', value: 'Build a new SEO-optimized website' },
    { label: 'Dashboard', value: 'Design a dashboard to monitor business performance' },
    { label: 'AI Chatbot', value: 'Integrate AI chatbot for website' },
    { label: 'Pricing', value: 'What is the pricing?' },
  ],
}

const COPY = {
  vi: {
    placeholder: 'Bạn cần dịch vụ gì? Click Star sẽ tư vấn ngay…',
    button: 'Hỏi AI',
    badge: 'AI Assistant',
    title: 'Click Star tư vấn miễn phí',
    subtitle: 'Mô tả nhu cầu — AI trả lời + đề xuất giải pháp trong 2 giây',
    quickLabel: 'Hoặc thử nhanh:',
  },
  en: {
    placeholder: 'What service do you need? Click Star will help…',
    button: 'Ask AI',
    badge: 'AI Assistant',
    title: 'Click Star free consultation',
    subtitle: 'Describe your need — AI replies + recommends solutions in 2 seconds',
    quickLabel: 'Or try:',
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

function shouldShow(currentPath: string): boolean {
  if (typeof window === 'undefined') return false
  // Skip admin + contact + ads-hub (already has CTAs)
  if (currentPath.startsWith('/admin-cls')) return false
  if (currentPath.startsWith('/api')) return false
  if (currentPath === '/contact') return false
  if (currentPath === '/ads-hub') return false

  const dismissed = loadDismissed()
  if (!dismissed) return true
  const hoursSince = (Date.now() - dismissed) / 3_600_000
  return hoursSince >= DISMISS_HOURS
}

export function FloatingAiServiceRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const { language } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<'hidden' | 'collapsed' | 'expanded'>('hidden')
  const [value, setValue] = useState('')

  const copy = COPY[language]
  const prompts = QUICK_PROMPTS[language]

  // Show after delay
  useEffect(() => {
    if (!pathname) return
    if (!shouldShow(pathname)) {
      setPhase('hidden')
      return
    }

    const timer = setTimeout(() => setPhase('collapsed'), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  const handleClose = () => {
    setPhase('hidden')
    setDismissed()
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
    // Mark as dismissed (user engaged) + navigate to contact with pre-filled message
    setDismissed()
    const params = new URLSearchParams({
      service: 'Tư vấn tổng thể',
      message: q,
      utm_source: 'floating_router',
    })
    router.push(`/contact?${params.toString()}`)
  }

  const handleChip = (val: string) => {
    setValue(val)
    handleSubmit(undefined, val)
  }

  if (phase === 'hidden') return null

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[55] transition-transform duration-500 ease-out ${
        phase === 'hidden' ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="mx-auto max-w-5xl px-3 pb-3 lg:pb-4">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl shadow-primary/30 border border-white/10 backdrop-blur-xl overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-32 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Top bar — collapsed state header / expanded state header */}
          <div className="relative flex items-center justify-between px-4 lg:px-5 pt-3 pb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-purple-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary/40">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/90">
                    {copy.badge}
                  </span>
                  <span className="hidden sm:flex items-center text-[9px] text-emerald-400 font-bold">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full mr-1 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="text-sm font-semibold text-white truncate">{copy.title}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setPhase(phase === 'collapsed' ? 'expanded' : 'collapsed')}
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
                title="Đóng (ẩn 24h)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtitle — only when expanded */}
          {phase === 'expanded' && (
            <div className="relative px-4 lg:px-5 pb-2 text-xs text-white/60">
              {copy.subtitle}
            </div>
          )}

          {/* Input + send */}
          <form
            onSubmit={handleSubmit}
            className="relative px-4 lg:px-5 pb-3 flex items-center gap-2"
          >
            <div className="flex-1 relative">
              <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={copy.placeholder}
                className="w-full pl-9 pr-3 py-2.5 lg:py-3 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/10 focus:border-primary/60 rounded-full text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                onFocus={() => phase === 'collapsed' && setPhase('expanded')}
              />
            </div>
            <button
              type="submit"
              className="group flex items-center justify-center gap-1.5 px-4 lg:px-5 py-2.5 lg:py-3 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/40 text-white text-sm font-bold rounded-full transition-all hover:scale-[1.02] shrink-0"
            >
              <span className="hidden sm:inline">{copy.button}</span>
              <ArrowUp className="w-4 h-4 sm:rotate-45 group-hover:translate-y-[-1px] sm:group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick prompts — only when expanded */}
          {phase === 'expanded' && (
            <div className="relative px-4 lg:px-5 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                {copy.quickLabel}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChip(p.value)}
                    className="text-xs px-3 py-1.5 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-primary/40 text-white/85 hover:text-white rounded-full transition-all"
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
