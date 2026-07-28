'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PricingTierGroup } from './types'

/**
 * Cầu nối để trang dịch vụ hiển thị ĐÚNG nhóm giá của nó lấy từ trang /pricing.
 *
 * 🔴 LUẬT: bảng giá chỉ có MỘT nguồn duy nhất — section `pricing_grouped_tiers`
 * của page slug `pricing` trong DB. Trang dịch vụ KHÔNG được hardcode giá riêng,
 * nếu không hai nơi sẽ lệch nhau (anh Trung yêu cầu đồng bộ 28/7/2026).
 *
 * Vì `getPublishedPage` cache theo tag `pages`, admin bấm Lưu ở trang Bảng giá
 * sẽ làm mới cả /pricing lẫn trang dịch vụ — không cần deploy lại.
 */

const ServicePricingContext = createContext<PricingTierGroup | null>(null)

export function ServicePricingProvider({
  group,
  children,
}: {
  group: PricingTierGroup | null
  children: ReactNode
}) {
  return (
    <ServicePricingContext.Provider value={group}>{children}</ServicePricingContext.Provider>
  )
}

/** Nhóm giá của trang dịch vụ hiện tại; null nếu chưa cấu hình trong admin. */
export function useServicePricingGroup(): PricingTierGroup | null {
  return useContext(ServicePricingContext)
}

// findPricingGroup() nằm ở ./service-pricing-shared.ts — KHÔNG chuyển về đây,
// file này có 'use client' nên server layout sẽ không gọi được.
