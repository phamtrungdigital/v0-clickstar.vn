import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { Placement } from './code-templates'

/** Mã đang bật, đủ để website chèn vào trang. Khách chỉ đọc được các cột này (quyền cột ở cơ sở dữ liệu). */
export type PublicSnippet = {
  id: string
  placement: Placement
  name: string
  code: string
  sort_order: number
}

/** Một mã đầy đủ cho màn quản trị. */
export type Snippet = PublicSnippet & {
  kind: string
  config: Record<string, string>
  enabled: boolean
  updatedLabel: string
}

export type HistoryItem = {
  id: number
  note: string | null
  atLabel: string
  count: number
}

const PLACEMENTS: Placement[] = ['head', 'body_start', 'body_end']

// Cache cross-request như getSiteSettings: tự làm mới khi admin lưu (updateTag('site_code')) hoặc sau 1 giờ.
// Chỉ chọn đúng các cột được cấp cho anon, KHÔNG dùng select('*') (sẽ bị từ chối).
export const getEnabledSnippets = unstable_cache(
  async (): Promise<PublicSnippet[]> => {
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('site_code_snippets')
        .select('id, placement, name, code, sort_order')
        .eq('enabled', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
      if (error || !data) return []
      return (data as PublicSnippet[]).filter((s) => PLACEMENTS.includes(s.placement) && s.code?.trim())
    } catch {
      // Thiếu bảng hay lỗi mạng thì website vẫn chạy bình thường, chỉ không có mã.
      return []
    }
  },
  ['site-code-snippets'],
  { tags: ['site_code'], revalidate: 3600 }
)

/** Ngày giờ theo giờ Việt Nam cố định, tính ở máy chủ để khỏi lệch giữa máy chủ và trình duyệt. */
export function viDateTime(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}
