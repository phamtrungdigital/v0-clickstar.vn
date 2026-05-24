// Pure types — safe for both client + server imports.

export type CampaignConditions = {
  // User must have visited AT LEAST ONE of these paths (substring match on start)
  visited_pages?: string[]
  // User must have visited at least N pages total (counts deduped paths)
  min_pages_visited?: number
  // Don't show on these current paths (exact match)
  exclude_current_pages?: string[]
  // Device targeting
  device?: 'all' | 'desktop' | 'mobile'
  // Trigger only on exit-intent (mouseleave top of viewport)
  exit_intent?: boolean
  // Show only to returning visitors (visited site before today)
  returning_visitor?: boolean
}

export type CampaignContent = {
  use_ai: boolean // if true, call /api/ai/personalize for dynamic message; else use fallback
  ai_prompt_hint?: string // extra context appended to Claude prompt
  fallback_message: string // static message (used if AI fails/disabled or use_ai=false)
  cta_label: string
  cta_href: string
  service_param?: string // appended as ?service=... to cta_href (matches /contact dropdown)
  icon: string // lucide-react icon name (Sparkles, Bot, Gift, Bell, Megaphone, Star, ...)
  header_label: string // "Gợi ý cho bạn", "Phù hợp với bạn", "Ưu đãi dành cho bạn"
}

export type CampaignStyles = {
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-banner'
  color_theme?: 'primary' | 'orange' | 'dark' | 'custom'
  gradient_from?: string // hex color
  gradient_to?: string // hex color
  button_color?: string // hex color for CTA button bg
  size?: 'compact' | 'default' | 'expanded'
}

export type PersonalizeCampaign = {
  id: string
  name: string
  enabled: boolean
  priority: number
  conditions: CampaignConditions
  content: CampaignContent
  styles: CampaignStyles
  delay_ms: number
  auto_dismiss_ms: number // 0 = no auto-close; otherwise self-close after N ms
  dismiss_days: number
  created_at: string
  updated_at: string
}

export type MatchContext = {
  visited_pages: string[] // distinct paths visited
  current_path: string
  device: 'desktop' | 'mobile'
  is_returning: boolean // visit_count > 1
  total_visits: number
}

/** Pure matching logic — used by both server API + admin live preview */
export function matchCampaign(
  campaign: PersonalizeCampaign,
  ctx: MatchContext,
): boolean {
  if (!campaign.enabled) return false
  const c = campaign.conditions

  // Exclude current page
  if (c.exclude_current_pages?.includes(ctx.current_path)) return false

  // Visited pages: at least one must match (substring startsWith)
  if (c.visited_pages && c.visited_pages.length > 0) {
    const hasMatch = c.visited_pages.some((target) =>
      ctx.visited_pages.some((v) => v === target || v.startsWith(target + '/')),
    )
    if (!hasMatch) return false
  }

  // Min pages visited
  if (c.min_pages_visited && ctx.total_visits < c.min_pages_visited) return false

  // Device
  if (c.device && c.device !== 'all' && c.device !== ctx.device) return false

  // Returning visitor
  if (c.returning_visitor && !ctx.is_returning) return false

  return true
}
