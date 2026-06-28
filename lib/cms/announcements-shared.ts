// Client-safe types + constants cho hệ thống Thông báo / Popup (social-proof).
import type { I18n } from './types'

export type AnnouncementType = 'contract' | 'logo' | 'partner' | 'award' | 'custom'
export type DisplayMode = 'toast' | 'modal'
export type ToastPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export type Announcement = {
  id: string
  type: AnnouncementType
  display_mode: DisplayMode
  title: I18n
  body: I18n
  image_url: string | null
  link_url: string | null
  link_label: I18n
  enabled: boolean
  starts_at: string | null
  ends_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

/** Field admin nhập khi tạo/sửa 1 thông báo. */
export type AnnouncementInput = {
  type: AnnouncementType
  display_mode: DisplayMode
  title: I18n
  body: I18n
  image_url: string | null
  link_url: string | null
  link_label: I18n
  enabled: boolean
  starts_at: string | null
  ends_at: string | null
  sort_order: number
}

export type AnnouncementSettings = {
  id: number
  enabled: boolean
  toast_position: ToastPosition
  toast_delay_ms: number
  toast_show_ms: number
  toast_gap_ms: number
  modal_delay_ms: number
  hidden_paths: string[]
  show_on_desktop: boolean
  show_on_mobile: boolean
  updated_at: string
}

export type AnnouncementSettingsUpdate = Omit<AnnouncementSettings, 'id' | 'updated_at'>

/** Loại tin → nhãn admin + tên icon lucide (dùng cho widget Phần 2). */
export const ANNOUNCEMENT_TYPES: { value: AnnouncementType; label: string; icon: string }[] = [
  { value: 'contract', label: 'Ký hợp đồng', icon: 'FileSignature' },
  { value: 'logo', label: 'Logo / Nhận diện mới', icon: 'Sparkles' },
  { value: 'partner', label: 'Đối tác mới', icon: 'Handshake' },
  { value: 'award', label: 'Giải thưởng', icon: 'Award' },
  { value: 'custom', label: 'Tùy chỉnh', icon: 'Megaphone' },
]

export const DISPLAY_MODES: { value: DisplayMode; label: string; desc: string }[] = [
  { value: 'toast', label: 'Toast', desc: 'Thẻ nhỏ góc màn hình, xoay vòng' },
  { value: 'modal', label: 'Modal', desc: 'Popup giữa màn hình, 1 lần/phiên' },
]

export const TOAST_POSITIONS: { value: ToastPosition; label: string }[] = [
  { value: 'bottom-left', label: 'Dưới — trái' },
  { value: 'bottom-right', label: 'Dưới — phải' },
  { value: 'top-left', label: 'Trên — trái' },
  { value: 'top-right', label: 'Trên — phải' },
]

export function typeMeta(type: AnnouncementType) {
  return ANNOUNCEMENT_TYPES.find((t) => t.value === type) ?? ANNOUNCEMENT_TYPES[4]
}

export function emptyAnnouncement(): AnnouncementInput {
  return {
    type: 'contract',
    display_mode: 'toast',
    title: { vi: '', en: '' },
    body: { vi: '', en: '' },
    image_url: null,
    link_url: null,
    link_label: { vi: '', en: '' },
    enabled: true,
    starts_at: null,
    ends_at: null,
    sort_order: 0,
  }
}

export const DEFAULT_ANNOUNCEMENT_SETTINGS: AnnouncementSettingsUpdate = {
  enabled: true,
  toast_position: 'bottom-left',
  toast_delay_ms: 8000,
  toast_show_ms: 6000,
  toast_gap_ms: 10000,
  modal_delay_ms: 3000,
  hidden_paths: ['/admin-cls', '/contact'],
  show_on_desktop: true,
  show_on_mobile: true,
}
