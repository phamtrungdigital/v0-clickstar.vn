import type { AboutTimelineItem } from './types'

/** Năm hiện tại theo giờ Việt Nam. Cố định múi giờ để server (UTC) và trình duyệt cho cùng kết quả quanh giao thừa. */
export function currentYearVN(): number {
  return Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric' }).format(new Date()))
}

export type TimelineEntry = AboutTimelineItem & {
  /** Vị trí trong mảng gốc, dùng cho data-cms-item-index của trình sửa trực quan. */
  index: number
}

/**
 * Tách mốc đã qua và mốc định hướng theo năm hiện tại: mốc có năm lớn hơn năm nay là định hướng.
 * Không cần cờ riêng trong dữ liệu nên người dùng sửa ở admin vẫn đúng, và qua năm mới tự chuyển
 * mốc cũ sang "đã qua". Mốc đã qua cuối cùng là mốc "Hiện nay". Năm không đọc được (ví dụ "Sắp tới") tính là đã qua.
 */
export function splitTimeline(items: AboutTimelineItem[]): { past: TimelineEntry[]; future: TimelineEntry[] } {
  const now = currentYearVN()
  const past: TimelineEntry[] = []
  const future: TimelineEntry[] = []
  items.forEach((it, index) => {
    const y = parseInt(String(it.year), 10)
    ;(y > now ? future : past).push({ ...it, index })
  })
  return { past, future }
}
