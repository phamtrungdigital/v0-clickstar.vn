// Server-only: đọc thông báo. Types/constants client-safe ở announcements-shared.ts.
import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'

export * from './announcements-shared'
import type { Announcement, AnnouncementSettings } from './announcements-shared'

/** Admin: TẤT CẢ tin (kể cả tắt / hết hạn) để quản lý. */
export async function listAnnouncementsForAdmin(): Promise<Announcement[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  return (data as unknown as Announcement[]) ?? []
}

/** Admin: cấu hình hiển thị chung. */
export async function getAnnouncementSettings(): Promise<AnnouncementSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('announcement_settings').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as AnnouncementSettings) || null
}

/** Public (cached): tin ĐANG BẬT — widget Phần 2 lọc thêm theo lịch ở client. */
export const getActiveAnnouncements = unstable_cache(
  async (): Promise<Announcement[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
    return (data as unknown as Announcement[]) ?? []
  },
  ['active-announcements'],
  { tags: ['announcements'], revalidate: 300 }
)

/** Public (cached): cấu hình hiển thị. */
export const getPublicAnnouncementSettings = unstable_cache(
  async (): Promise<AnnouncementSettings | null> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('announcement_settings').select('*').eq('id', 1).maybeSingle()
    return (data as unknown as AnnouncementSettings) || null
  },
  ['announcement-settings'],
  { tags: ['announcement_settings'], revalidate: 300 }
)
