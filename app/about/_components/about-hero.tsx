'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Database,
  Globe,
  Zap,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePageSection } from '@/lib/cms/page-data-context'
import type { PageHeroContent } from '@/lib/cms/types'

const TECH_PILLS = [
  { icon: Bot, label: 'AI' },
  { icon: Cpu, label: 'Automation' },
  { icon: Database, label: 'CRM/CDP' },
  { icon: Globe, label: 'Web' },
  { icon: Zap, label: 'Marketing' },
]

/**
 * AboutHero — tech-themed hero riêng cho trang Giới thiệu
 * Dark gradient mesh + AI badge + heading có gradient highlight + tech pills
 */
export function AboutHero({ fallback }: { fallback?: PageHeroContent }) {
  const { t, language } = useLanguage()
  const section = usePageSection('page_hero')
  const content = section?.content ?? fallback
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!content) return null

  const heading = t(content.heading.vi, content.heading.en)
  const description = t(content.description.vi, content.description.en)
  const badge = t(content.badge.vi, content.badge.en)

  return (
    <section
      data-cms-section="page_hero"
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      {/* ─── Background layers ─── */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />

      {/* Animated mesh blobs */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating particle dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && (
          <>
            {[...Array(15)].map((_, i) => (
              <span
                key={i}
                className="absolute w-1 h-1 bg-sky-300/50 rounded-full"
                style={{
                  top: `${(i * 37) % 100}%`,
                  left: `${(i * 53) % 100}%`,
                  animation: `float-up ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge with sparkles */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg shadow-blue-500/10 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent">
              {badge}
            </span>
          </div>

          {/* Heading — split into parts with gradient highlight */}
          <h1
            data-cms-field="heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.25] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
          >
            <HighlightedHeading text={heading} language={language} />
          </h1>

          {/* Description */}
          <p
            data-cms-field="description"
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10 animate-in fade-in duration-700"
            style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
          >
            {description}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in duration-700"
            style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}
          >
            {content.cta_label?.vi && (
              <Link
                data-cms-field="cta"
                href={content.cta_href || '#contact'}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 hover:from-sky-500 hover:via-blue-600 hover:to-blue-700 text-white font-semibold px-7 py-3.5 rounded-full text-base shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03] transition-all"
              >
                {t(content.cta_label.vi, content.cta_label.en)}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            <Link
              href="#story"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white font-medium px-6 py-3.5 rounded-full text-sm transition-all backdrop-blur-sm"
            >
              {t('Khám phá câu chuyện', 'Discover Our Story')}
            </Link>
          </div>

          {/* Tech pills */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-2 animate-in fade-in duration-700"
            style={{ animationDelay: '700ms', animationFillMode: 'backwards' }}
          >
            <span className="text-[11px] text-slate-500 uppercase tracking-wider mr-2">
              {t('Công nghệ ứng dụng', 'Tech stack')}:
            </span>
            {TECH_PILLS.map((pill, idx) => {
              const Icon = pill.icon
              return (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-300/40 rounded-full text-xs text-slate-200 transition-all cursor-default"
                  style={{
                    animationDelay: `${800 + idx * 80}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <Icon className="w-3 h-3 text-sky-300" />
                  {pill.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      {/* Keyframes for floating particles */}
      <style jsx>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-30px) scale(1.3); opacity: 1; }
        }
      `}</style>
    </section>
  )
}

/**
 * Highlight specific phrases in heading with gradient text.
 * Splits heading text at known anchor phrases and wraps them.
 */
function HighlightedHeading({ text, language }: { text: string; language: string }) {
  // Phrases (per language) to highlight with gradient
  const HIGHLIGHT_PHRASES_VI = [
    'sứ mệnh',
    'đồng hành',
    'chuyển đổi số',
    'doanh nghiệp vừa và nhỏ',
    'Click Star',
  ]
  const HIGHLIGHT_PHRASES_EN = [
    'mission',
    'digital transformation',
    'SMBs',
    'small and medium',
    'Click Star',
  ]

  const phrases = language === 'en' ? HIGHLIGHT_PHRASES_EN : HIGHLIGHT_PHRASES_VI

  // Build regex from phrases, longest first to match greedy
  const sorted = [...phrases].sort((a, b) => b.length - a.length)
  const escaped = sorted.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${escaped.join('|')})`, 'gi')

  const parts = text.split(re)

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        const isHighlight = phrases.some((p) => part.toLowerCase() === p.toLowerCase())
        if (isHighlight) {
          return (
            <span
              key={i}
              className="bg-gradient-to-r from-sky-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent"
            >
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
