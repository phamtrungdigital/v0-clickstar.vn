'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Loader2, Phone, Mail, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

type ServiceMatch = {
  slug: string
  title: string
  reason: string
}

type ApiResponse = {
  matched: boolean
  services: ServiceMatch[]
  fallback_message: string | null
  error?: string
}

const SERVICE_ICONS: Record<string, string> = {
  'digital-marketing': '📢',
  'website': '🌐',
  'dashboard': '📊',
  'crm-cdp': '👥',
  'ai-integration': '🤖',
  'automation': '⚙️',
}

const QUICK_PROMPTS_VI = [
  'Tôi muốn chạy quảng cáo Facebook & Google',
  'Cần làm website mới chuẩn SEO',
  'Thiết kế dashboard để theo dõi tình hình doanh nghiệp',
  'Tích hợp chatbot AI cho website',
  'Tự động hoá email marketing nuôi lead',
  'Quản lý khách hàng + chăm sóc trên 1 nền tảng',
]

const QUICK_PROMPTS_EN = [
  'I want to run Facebook & Google ads',
  'Build a new SEO-optimized website',
  'Design a dashboard to monitor business performance',
  'Integrate AI chatbot for website',
  'Automate email marketing & lead nurturing',
  'Manage customers and care on one platform',
]

const COPY = {
  vi: {
    title: 'Bạn cần dịch vụ gì? Để Click Star hỗ trợ bạn?',
    subtitle:
      'Mô tả ngắn gọn nhu cầu — Click Star sẽ gợi ý dịch vụ phù hợp nhất trong vòng 2 giây.',
    placeholder: 'VD: tôi muốn tăng đơn hàng online cho shop quần áo…',
    quickLabel: 'Hoặc thử nhanh:',
    submit: 'Hỏi AI',
    submitting: 'AI đang suy nghĩ…',
    resultTitle: 'AI gợi ý dịch vụ phù hợp với anh:',
    viewDetail: 'Xem chi tiết',
    contactTitle: 'Liên hệ tư vấn trực tiếp',
    reset: 'Hỏi câu khác',
    note: 'Trả lời bằng AI — anh có thể gọi hotline 0977 713 428 nếu cần tư vấn người thật.',
  },
  en: {
    title: 'Which service do you need? Let Click Star help you',
    subtitle:
      'Briefly describe your need — Click Star will suggest the best fit in 2 seconds.',
    placeholder: 'E.g., I want to boost online sales for my clothing store…',
    quickLabel: 'Or try one of these:',
    submit: 'Ask AI',
    submitting: 'AI is thinking…',
    resultTitle: 'AI suggests these services for you:',
    viewDetail: 'View details',
    contactTitle: 'Or contact us directly',
    reset: 'Ask another question',
    note: 'AI-generated answer — call hotline 0977 713 428 for a real consultant.',
  },
}

export function AiServiceRouter() {
  const { language } = useLanguage()
  const t = COPY[language as 'vi' | 'en'] || COPY.vi
  const quickPrompts = language === 'en' ? QUICK_PROMPTS_EN : QUICK_PROMPTS_VI

  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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
          setError(data.error || 'Lỗi không xác định')
          return
        }
        setResult(data)
      } catch (e: any) {
        setError('Không kết nối được. Vui lòng thử lại hoặc gọi 0977 713 428.')
      }
    })
  }

  const reset = () => {
    setQuery('')
    setResult(null)
    setError(null)
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-blue-50/40 via-white to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Service Router
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.title}</h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Input row */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(query.trim())
          }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-3 md:p-4"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              maxLength={500}
              disabled={isPending}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isPending || query.trim().length < 3}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t.submit}
                </>
              )}
            </button>
          </div>

          {/* Quick prompts */}
          {!result && !error && !isPending && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">{t.quickLabel}</p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => submit(p)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 rounded-full transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={reset}
                className="text-xs text-red-600 hover:text-red-800 underline mt-1"
              >
                {t.reset}
              </button>
            </div>
          </div>
        )}

        {/* Result: matched services */}
        {result && result.matched && result.services.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700 px-1">{t.resultTitle}</p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {result.services.map((s, idx) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg p-4 transition-all relative"
                >
                  {idx === 0 && result.services.length > 1 && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full">
                      ⭐ Phù hợp nhất
                    </span>
                  )}
                  <div className="text-3xl mb-2">{SERVICE_ICONS[s.slug] || '✨'}</div>
                  <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{s.reason}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    {t.viewDetail}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 px-1 pt-1">
              <p className="text-[11px] text-slate-400">{t.note}</p>
              <button
                onClick={reset}
                className="text-xs text-blue-600 hover:text-blue-700 underline whitespace-nowrap"
              >
                {t.reset}
              </button>
            </div>
          </div>
        )}

        {/* Fallback: not matched */}
        {result && !result.matched && (
          <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">
                {result.fallback_message ||
                  'Câu hỏi này không khớp với dịch vụ ClickStar. Anh vui lòng liên hệ trực tiếp:'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 ml-8">
              <a
                href="tel:0977713428"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg"
              >
                <Phone className="w-3.5 h-3.5" />
                0977 713 428
              </a>
              <a
                href="mailto:clickstar.vn@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 text-xs font-semibold rounded-lg"
              >
                <Mail className="w-3.5 h-3.5" />
                clickstar.vn@gmail.com
              </a>
              <button
                onClick={reset}
                className="ml-auto text-xs text-amber-700 hover:text-amber-900 underline"
              >
                {t.reset}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
