'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Phone,
  Mail,
  AlertCircle,
  Send,
  Bot,
  RotateCcw,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

type ResultLink = {
  title: string
  href: string
  type: 'service' | 'page' | 'contact' | 'blog'
}

type ApiResponse = {
  answer: string
  links: ResultLink[]
  error?: string
}

const QUICK_PROMPTS_VI = [
  'Tôi muốn chạy quảng cáo Facebook & Google',
  'Cần làm website mới chuẩn SEO',
  'Thiết kế dashboard để theo dõi tình hình doanh nghiệp',
  'Tích hợp chatbot AI cho website',
  'Tự động hoá email marketing nuôi lead',
  'Bảng giá dịch vụ thế nào?',
]

const QUICK_PROMPTS_EN = [
  'I want to run Facebook & Google ads',
  'Build a new SEO-optimized website',
  'Design a dashboard to monitor business performance',
  'Integrate AI chatbot for website',
  'Automate email marketing & lead nurturing',
  'What is the pricing?',
]

const COPY = {
  vi: {
    badge: 'AI Assistant',
    title: 'Bạn cần dịch vụ gì?',
    titleHighlight: 'Để Click Star hỗ trợ bạn',
    subtitle:
      'Mô tả ngắn gọn nhu cầu — AI Click Star sẽ trả lời mọi thắc mắc về dịch vụ, giá, dự án trong vòng 2 giây.',
    placeholder: 'Vui lòng nhập yêu cầu để được hỗ trợ…',
    quickLabel: 'Hoặc thử nhanh:',
    submit: 'Hỏi AI',
    submitting: 'Đang xử lý…',
    askAnother: 'Hỏi câu khác',
    aiThinking: 'AI Click Star đang suy nghĩ…',
    seeMore: 'Có thể anh quan tâm:',
    note: 'AI có thể nhầm. Gọi hotline 0977 713 428 nếu cần tư vấn người thật.',
    errorUnknown: 'Lỗi không xác định',
    errorNetwork: 'Không kết nối được. Vui lòng thử lại hoặc gọi 0977 713 428.',
  },
  en: {
    badge: 'AI Assistant',
    title: 'Which service do you need?',
    titleHighlight: 'Let Click Star help you',
    subtitle:
      'Briefly describe your need — Click Star AI answers everything about services, pricing, projects in 2 seconds.',
    placeholder: 'Type your request to get support…',
    quickLabel: 'Or try one of these:',
    submit: 'Ask AI',
    submitting: 'Thinking…',
    askAnother: 'Ask another',
    aiThinking: 'Click Star AI is thinking…',
    seeMore: 'You may also like:',
    note: 'AI may be wrong. Call 0977 713 428 for a real consultant.',
    errorUnknown: 'Something went wrong. Please try again.',
    errorNetwork: "Couldn't connect. Please try again or call 0977 713 428.",
  },
}

// Lightweight markdown-ish formatter: **bold**, *italic*, line breaks
function formatAnswer(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
}

// Animated typing effect
function useTypingEffect(text: string, speed = 14): string {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!text) {
      setDisplayed('')
      return
    }
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

export function AiServiceRouter() {
  const { language } = useLanguage()
  const t = COPY[language as 'vi' | 'en'] || COPY.vi
  const quickPrompts = language === 'en' ? QUICK_PROMPTS_EN : QUICK_PROMPTS_VI

  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const typedAnswer = useTypingEffect(result?.answer || '', 12)

  const submit = (q: string) => {
    if (!q || q.length < 3) return
    setQuery(q)
    setError(null)
    setResult(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/ai/service-router', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: q }),
        })
        const data: ApiResponse = await res.json()
        if (!res.ok || data.error) {
          setError(data.error || t.errorUnknown)
          return
        }
        setResult(data)
      } catch (e: any) {
        setError(t.errorNetwork)
      }
    })
  }

  const reset = () => {
    setQuery('')
    setResult(null)
    setError(null)
  }

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-slate-950 text-white">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container relative mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-4 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
            <span className="text-white">{t.title}</span>{' '}
            <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Input card — glassmorphism */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(query.trim())
          }}
          className="relative group"
        >
          {/* Glow ring */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-3 md:p-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.placeholder}
                  maxLength={500}
                  disabled={isPending}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800/80 border border-white/10 rounded-xl text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isPending || query.trim().length < 3}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 hover:from-sky-500 hover:via-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.submitting}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t.submit}
                  </>
                )}
              </button>
            </div>

            {/* Quick prompts */}
            {!result && !error && !isPending && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-2.5">{t.quickLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => submit(p)}
                      className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-blue-400/50 text-slate-300 hover:text-white rounded-full transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI thinking indicator */}
            {isPending && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-sky-300 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                <span className="text-sm text-slate-300">{t.aiThinking}</span>
              </div>
            )}
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-200">{error}</p>
              <button
                onClick={reset}
                className="text-xs text-red-300 hover:text-red-100 underline mt-1"
              >
                {t.askAnother}
              </button>
            </div>
          </div>
        )}

        {/* AI Answer */}
        {result && (
          <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Answer bubble */}
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/40">
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-sky-300 mb-1.5">Click Star AI</p>
                  <div
                    className="text-sm md:text-[15px] text-slate-100 leading-relaxed prose-strong:text-white prose-em:text-slate-200"
                    dangerouslySetInnerHTML={{
                      __html: formatAnswer(typedAnswer) + (typedAnswer.length < (result.answer?.length || 0) ? '<span class="inline-block w-1.5 h-4 ml-0.5 bg-blue-400 animate-pulse"></span>' : ''),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Suggested links */}
            {result.links && result.links.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  {t.seeMore}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.links.map((link, idx) => {
                    const isContact = link.href.startsWith('tel:') || link.href.startsWith('mailto:')
                    const Icon =
                      link.href.startsWith('tel:') ? Phone : link.href.startsWith('mailto:') ? Mail : ArrowRight
                    const className =
                      'group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all border ' +
                      (idx === 0
                        ? 'bg-gradient-to-r from-sky-400/25 to-blue-500/25 hover:from-sky-400/40 hover:to-blue-500/40 border-sky-300/50 text-white shadow-lg shadow-sky-500/20'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 text-slate-200')

                    if (isContact) {
                      return (
                        <a key={idx} href={link.href} className={className}>
                          <Icon className="w-3.5 h-3.5" />
                          {link.title}
                        </a>
                      )
                    }
                    return (
                      <Link key={idx} href={link.href} className={className}>
                        {link.title}
                        <Icon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Footer note + reset */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-500">{t.note}</p>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 text-xs text-sky-300 hover:text-white whitespace-nowrap transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {t.askAnother}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
