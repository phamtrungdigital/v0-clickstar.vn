'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'
import {
  loadVisits,
  markBannerShown,
  dismissBanner,
  markConverted,
  getDistinctPaths,
  detectDevice,
  isReturningVisitor,
} from '@/lib/personalize/tracker'
import { useTrackPage } from '@/hooks/use-track-page'
import type { PersonalizeCampaign } from '@/lib/personalize/campaign-types'

type AiMessageResponse = {
  message: string
  recommended_service: string
  cta_label: string
}

const MATCH_CACHE_KEY = 'cs_match_cache_v1'
const MATCH_CACHE_TTL = 60 * 1000 // 60s — refresh campaign config

const AI_CACHE_KEY = 'cs_ai_msg_cache_v1'
const AI_CACHE_TTL = 60 * 60 * 1000 // 1h — AI message stable per browsing pattern

function renderIcon(name: string, className: string) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles
  return <Icon className={className} />
}

export function PersonalizeBanner() {
  useTrackPage()

  const pathname = usePathname()
  const [campaign, setCampaign] = useState<PersonalizeCampaign | null>(null)
  const [aiMessage, setAiMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/admin-cls') || pathname.startsWith('/api')) return

    const data = loadVisits()
    // Respect global dismiss/convert state
    if (data.converted) return
    if (data.dismissed_until && data.dismissed_until > Date.now()) return
    if (data.last_banner_shown_at && Date.now() - data.last_banner_shown_at < 60_000) return

    // Match campaign first — delay applied AFTER match (each campaign has own delay)
    const ctx = {
      visited_pages: getDistinctPaths(),
      current_path: pathname,
      device: detectDevice(),
      is_returning: isReturningVisitor(),
      total_visits: getDistinctPaths().length,
    }

    // Try cache first
    const cacheKey = `${MATCH_CACHE_KEY}:${pathname}`
    let matched: PersonalizeCampaign | null = null
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.ts < MATCH_CACHE_TTL) matched = parsed.campaign
      }
    } catch {}

    const showMatched = (camp: PersonalizeCampaign | null) => {
      if (!camp) return

      const delayTimer = setTimeout(async () => {
        setCampaign(camp)

        // AI mode: fetch dynamic message
        if (camp.content.use_ai) {
          // Try AI cache (key = campaign.id + interests hash)
          const interests = ctx.visited_pages.slice(-10).join('|')
          const aiCacheKey = `${AI_CACHE_KEY}:${camp.id}:${interests}`
          try {
            const cached = sessionStorage.getItem(aiCacheKey)
            if (cached) {
              const p = JSON.parse(cached)
              if (Date.now() - p.ts < AI_CACHE_TTL) {
                setAiMessage(p.message)
                showBanner()
                return
              }
            }
          } catch {}

          try {
            const res = await fetch('/api/ai/personalize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                interests: ctx.visited_pages.slice(-5),
                recent_pages: ctx.visited_pages.slice(-5),
                prompt_hint: camp.content.ai_prompt_hint || '',
              }),
            })
            const json = (await res.json()) as Partial<AiMessageResponse>
            const msg = json.message || camp.content.fallback_message
            setAiMessage(msg)
            try {
              sessionStorage.setItem(aiCacheKey, JSON.stringify({ message: msg, ts: Date.now() }))
            } catch {}
          } catch {
            setAiMessage(camp.content.fallback_message)
          }
        } else {
          setAiMessage(camp.content.fallback_message)
        }

        showBanner()
      }, camp.delay_ms)

      return () => clearTimeout(delayTimer)
    }

    const showBanner = () => {
      setVisible(true)
      setAnimating(true)
      markBannerShown()
    }

    if (matched !== null) {
      showMatched(matched)
      return
    }

    // Fetch match from API
    fetch('/api/personalize/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ctx),
    })
      .then((r) => r.json())
      .then((json) => {
        const camp: PersonalizeCampaign | null = json.campaign
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ campaign: camp, ts: Date.now() }))
        } catch {}
        showMatched(camp)
      })
      .catch(() => {})
  }, [pathname])

  if (!visible || !campaign || !aiMessage) return null

  const styles = campaign.styles ?? {}
  const position = styles.position ?? 'bottom-right'
  const size = styles.size ?? 'default'
  const gradientFrom = styles.gradient_from ?? '#1B7BFF'
  const gradientTo = styles.gradient_to ?? '#0055d4'
  const buttonColor = styles.button_color ?? '#FF6B35'

  const ctaHref = campaign.content.service_param
    ? `${campaign.content.cta_href}?service=${encodeURIComponent(campaign.content.service_param)}&utm_source=banner_personalize&utm_campaign=${encodeURIComponent(campaign.name)}`
    : `${campaign.content.cta_href}?utm_source=banner_personalize&utm_campaign=${encodeURIComponent(campaign.name)}`

  const handleDismiss = () => {
    setAnimating(false)
    setTimeout(() => {
      dismissBanner(campaign.dismiss_days || 7)
      setVisible(false)
    }, 200)
  }

  const handleCtaClick = () => {
    markConverted()
  }

  const posClass = (() => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6'
      case 'bottom-center':
        return 'bottom-6 left-1/2 -translate-x-1/2'
      case 'top-banner':
        return 'top-4 left-1/2 -translate-x-1/2'
      case 'bottom-right':
      default:
        return 'bottom-6 right-6'
    }
  })()

  const widthClass = (() => {
    if (position === 'top-banner') return 'max-w-3xl w-[calc(100vw-2rem)]'
    if (size === 'compact') return 'max-w-[280px]'
    if (size === 'expanded') return 'max-w-[480px]'
    return 'max-w-[360px]'
  })()

  return (
    <div
      className={`fixed ${posClass} z-[60] ${widthClass} transition-all duration-300 ${
        animating
          ? 'opacity-100 translate-y-0'
          : position === 'top-banner'
            ? 'opacity-0 -translate-y-4 pointer-events-none'
            : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border-2 overflow-hidden" style={{ borderColor: gradientFrom, boxShadow: `0 20px 50px -10px ${gradientFrom}40` }}>
        {/* Gradient header */}
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center animate-pulse">
              {renderIcon(campaign.content.icon, 'w-4.5 h-4.5 text-white')}
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Click Star</div>
              <div className="text-[10px] uppercase tracking-widest text-white/85 font-semibold">
                {campaign.content.header_label}
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-colors flex-shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 bg-white">
          <p className="text-[15px] text-foreground leading-relaxed mb-4">{aiMessage}</p>

          <Link
            href={ctaHref}
            onClick={handleCtaClick}
            className="group flex items-center justify-center gap-2 w-full text-white text-sm font-bold py-3 px-5 rounded-full transition-all hover:shadow-lg"
            style={{ backgroundColor: buttonColor, boxShadow: `0 4px 14px ${buttonColor}50` }}
          >
            {campaign.content.cta_label}
            <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <p className="text-[10px] text-muted-foreground text-center mt-3">
            Gợi ý dựa trên trang bạn đã xem ·{' '}
            <button onClick={handleDismiss} className="underline hover:text-foreground">
              Không hiện lại {campaign.dismiss_days || 7} ngày
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
