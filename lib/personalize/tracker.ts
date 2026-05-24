/**
 * Client-side visitor tracker stored in localStorage.
 * Used by PersonalizeBanner to show contextual CTA based on browsing history.
 *
 * Schema versioned (cs_personalize_v1) — bump version if breaking changes.
 */

const STORAGE_KEY = 'cs_personalize_v1'
const MAX_VISITS = 30 // keep last 30 pages
const DEFAULT_DISMISS_DAYS = 7

// Map URL path → interest category for scoring
const PAGE_INTEREST: { match: (p: string) => boolean; category: string; weight: number }[] = [
  { match: (p) => p === '/pricing', category: 'pricing', weight: 5 },
  { match: (p) => p.startsWith('/services/digital-marketing'), category: 'marketing', weight: 3 },
  { match: (p) => p.startsWith('/services/website'), category: 'website', weight: 3 },
  { match: (p) => p.startsWith('/services/dashboard'), category: 'dashboard', weight: 3 },
  { match: (p) => p.startsWith('/services/ai-integration'), category: 'ai', weight: 3 },
  { match: (p) => p.startsWith('/services/automation'), category: 'automation', weight: 3 },
  { match: (p) => p.startsWith('/services/crm-cdp'), category: 'crm', weight: 3 },
  { match: (p) => p.startsWith('/projects'), category: 'projects', weight: 2 },
  { match: (p) => p.startsWith('/blog'), category: 'content', weight: 1 },
  { match: (p) => p === '/about', category: 'about', weight: 1 },
]

// Map interest category → user-facing service label (matches /contact dropdown)
export const CATEGORY_TO_SERVICE: Record<string, string> = {
  marketing: 'Digital Marketing',
  website: 'Thiết kế Website',
  dashboard: 'Dashboard dữ liệu',
  ai: 'Tích hợp AI',
  automation: 'AI Automation',
  crm: 'CRM & CDP',
  pricing: 'Tư vấn tổng thể',
}

export type VisitData = {
  visits: { path: string; ts: number }[]
  interests: Record<string, number>
  last_banner_shown_at: number | null
  dismissed_until: number | null
  converted: boolean
}

const empty = (): VisitData => ({
  visits: [],
  interests: {},
  last_banner_shown_at: null,
  dismissed_until: null,
  converted: false,
})

export function loadVisits(): VisitData {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty()
    return { ...empty(), ...(JSON.parse(raw) as VisitData) }
  } catch {
    return empty()
  }
}

function saveData(data: VisitData) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

/** Track a page visit + bump interest score */
export function trackVisit(path: string): void {
  if (typeof window === 'undefined') return
  // Skip admin and API routes
  if (path.startsWith('/admin-cls') || path.startsWith('/api')) return

  const data = loadVisits()
  const now = Date.now()

  // Append visit (dedup if same as last)
  const lastVisit = data.visits[data.visits.length - 1]
  if (!lastVisit || lastVisit.path !== path) {
    data.visits.push({ path, ts: now })
    if (data.visits.length > MAX_VISITS) {
      data.visits = data.visits.slice(-MAX_VISITS)
    }
  }

  // Bump interest scores
  for (const rule of PAGE_INTEREST) {
    if (rule.match(path)) {
      data.interests[rule.category] = (data.interests[rule.category] || 0) + rule.weight
    }
  }

  saveData(data)
}

/** Get top N interest categories sorted by score desc */
export function getTopInterests(n = 3): string[] {
  const data = loadVisits()
  return Object.entries(data.interests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([cat]) => cat)
}

/**
 * Decide if banner should show on current page.
 * Trigger: user visited /pricing in last 30 days AND current page is NOT /pricing
 * Skip if: dismissed recently, already converted, or just shown < 60s ago
 */
export function shouldShowBanner(currentPath: string): boolean {
  if (typeof window === 'undefined') return false
  if (currentPath === '/pricing') return false
  if (currentPath.startsWith('/admin-cls')) return false
  if (currentPath === '/contact') return false // don't show on contact page

  const data = loadVisits()
  if (data.converted) return false

  const now = Date.now()
  if (data.dismissed_until && data.dismissed_until > now) return false
  if (data.last_banner_shown_at && now - data.last_banner_shown_at < 60_000) return false

  // Has user visited /pricing recently?
  const hasPricingVisit = data.visits.some((v) => v.path === '/pricing')
  return hasPricingVisit
}

/** Mark banner as shown (for rate-limit between shows) */
export function markBannerShown(): void {
  const data = loadVisits()
  data.last_banner_shown_at = Date.now()
  saveData(data)
}

/** User dismissed banner — hide for N days */
export function dismissBanner(days = DEFAULT_DISMISS_DAYS): void {
  const data = loadVisits()
  data.dismissed_until = Date.now() + days * 86_400_000
  saveData(data)
}

/** User clicked CTA — mark as converted, never show again */
export function markConverted(): void {
  const data = loadVisits()
  data.converted = true
  saveData(data)
}

/** Reset (for debugging / testing) — exposed via window.__resetCSPersonalize() */
export function reset(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

if (typeof window !== 'undefined') {
  ;(window as any).__resetCSPersonalize = reset
}
