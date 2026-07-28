// Helper THUẦN, KHÔNG 'use client' — server layout gọi trực tiếp được.
// Tách khỏi service-pricing.tsx vì file đó có 'use client' → mọi export thành
// client-only, server gọi sẽ vỡ build ("Attempted to call ... from the server").
import type { Page, PricingTierGroup, PricingGroupedTiersContent } from './types'

/**
 * Rút một nhóm giá theo id từ page `pricing` — nguồn giá DUY NHẤT của cả site.
 * Trả null nếu trang chưa publish, section bị tắt, hoặc chưa có nhóm id đó
 * (trang dịch vụ sẽ tự ẩn khối bảng giá thay vì vỡ layout).
 */
export function findPricingGroup(
  pricingPage: Page | null,
  groupId: string
): PricingTierGroup | null {
  if (!pricingPage) return null
  const section = pricingPage.sections.find(
    (s) => s.type === 'pricing_grouped_tiers' && s.enabled
  )
  if (!section) return null
  const content = section.content as PricingGroupedTiersContent
  return content.groups?.find((g) => g.id === groupId) ?? null
}
