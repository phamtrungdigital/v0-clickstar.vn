'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import {
  loadVisits,
  shouldShowBanner,
  markBannerShown,
  dismissBanner,
  markConverted,
  getTopInterests,
  CATEGORY_TO_SERVICE,
} from '@/lib/personalize/tracker'
import { useTrackPage } from '@/hooks/use-track-page'

type ApiResponse = {
  message: string
  recommended_service: string
  cta_label: string
}

const CACHE_KEY = 'cs_personalize_msg_cache_v1'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1h

function loadCache(): { msg: ApiResponse; cached_at: number; interests: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.cached_at > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function saveCache(msg: ApiResponse, interests: string) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ msg, cached_at: Date.now(), interests }),
    )
  } catch {}
}

export function PersonalizeBanner() {
  useTrackPage() // auto-track current page

  const pathname = usePathname()
  const [state, setState] = useState<
    | { phase: 'hidden' }
    | { phase: 'loading' }
    | { phase: 'shown'; data: ApiResponse }
  >({ phase: 'hidden' })
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (!pathname) return

    // Debounce: wait 1.2s after route change before showing (let page settle)
    const timer = setTimeout(() => {
      if (!shouldShowBanner(pathname)) {
        setState({ phase: 'hidden' })
        return
      }

      const interests = getTopInterests(5)
      const interestsKey = interests.join(',')

      // Check cache first
      const cached = loadCache()
      if (cached && cached.interests === interestsKey) {
        setState({ phase: 'shown', data: cached.msg })
        markBannerShown()
        setAnimating(true)
        return
      }

      // Fetch from AI
      setState({ phase: 'loading' })
      const data = loadVisits()
      const recentPages = data.visits.slice(-5).map((v) => v.path)

      fetch('/api/ai/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, recent_pages: recentPages }),
      })
        .then((r) => r.json())
        .then((msg: ApiResponse) => {
          if (!msg.message) {
            setState({ phase: 'hidden' })
            return
          }
          saveCache(msg, interestsKey)
          setState({ phase: 'shown', data: msg })
          markBannerShown()
          setAnimating(true)
        })
        .catch(() => setState({ phase: 'hidden' }))
    }, 1200)

    return () => clearTimeout(timer)
  }, [pathname])

  if (state.phase === 'hidden') return null

  const handleDismiss = () => {
    setAnimating(false)
    setTimeout(() => {
      dismissBanner(7)
      setState({ phase: 'hidden' })
    }, 200)
  }

  const handleCtaClick = () => {
    markConverted()
  }

  if (state.phase === 'loading') {
    // Render silently — don't show loading spinner to avoid distracting user
    return null
  }

  const { data } = state
  const serviceParam = encodeURIComponent(data.recommended_service)
  const contactHref = `/contact?service=${serviceParam}&utm_source=banner_personalize`

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] max-w-[360px] transition-all duration-300 ${
        animating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-primary/20 border border-primary/20 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-primary-dark to-primary" />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">Click Star Digital</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Gợi ý cho bạn
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-4">{data.message}</p>

          <Link
            href={contactHref}
            onClick={handleCtaClick}
            className="group flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-full transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            {data.cta_label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <p className="text-[10px] text-muted-foreground text-center mt-2.5">
            Gợi ý dựa trên các trang bạn đã xem · <button onClick={handleDismiss} className="underline hover:text-foreground">Không hiện lại 7 ngày</button>
          </p>
        </div>
      </div>
    </div>
  )
}
