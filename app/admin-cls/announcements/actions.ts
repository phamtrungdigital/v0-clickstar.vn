'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  AnnouncementInput,
  AnnouncementSettingsUpdate,
  AnnouncementType,
  DisplayMode,
  ToastPosition,
} from '@/lib/cms/announcements-shared'

const TYPES: AnnouncementType[] = ['contract', 'logo', 'partner', 'award', 'custom']
const MODES: DisplayMode[] = ['toast', 'modal']
const POSITIONS: ToastPosition[] = ['bottom-left', 'bottom-right', 'top-left', 'top-right']

function cleanI18n(v: any): { vi: string; en: string } {
  return { vi: typeof v?.vi === 'string' ? v.vi : '', en: typeof v?.en === 'string' ? v.en : '' }
}
function nullableTs(v: unknown): string | null {
  if (!v || typeof v !== 'string') return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d.toISOString()
}
function clampInt(v: unknown, min: number, max: number, fb: number): number {
  const n = Math.round(Number(v))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fb
}

function normalize(input: AnnouncementInput) {
  return {
    type: TYPES.includes(input.type) ? input.type : 'custom',
    display_mode: MODES.includes(input.display_mode) ? input.display_mode : 'toast',
    title: cleanI18n(input.title),
    body: cleanI18n(input.body),
    image_url: typeof input.image_url === 'string' && input.image_url.trim() ? input.image_url.trim() : null,
    link_url: typeof input.link_url === 'string' && input.link_url.trim() ? input.link_url.trim() : null,
    link_label: cleanI18n(input.link_label),
    enabled: !!input.enabled,
    starts_at: nullableTs(input.starts_at),
    ends_at: nullableTs(input.ends_at),
    sort_order: clampInt(input.sort_order, 0, 9999, 0),
  }
}

function revalidateAll() {
  revalidateTag('announcements')
  revalidatePath('/admin-cls/announcements')
  revalidatePath('/', 'layout')
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function createAnnouncement(input: AnnouncementInput) {
  const { supabase, user } = await requireUser()
  if (!user) return { error: 'not_authenticated' }
  if (!input.title?.vi?.trim()) return { error: 'Tiêu đề (VI) là bắt buộc' }
  const { error } = await supabase
    .from('announcements')
    .insert({ ...normalize(input), updated_by: user.id })
  if (error) return { error: error.message }
  revalidateAll()
  return { ok: true }
}

export async function updateAnnouncement(id: string, input: AnnouncementInput) {
  const { supabase, user } = await requireUser()
  if (!user) return { error: 'not_authenticated' }
  const { error } = await supabase
    .from('announcements')
    .update({ ...normalize(input), updated_at: new Date().toISOString(), updated_by: user.id })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return { ok: true }
}

export async function toggleAnnouncement(id: string, enabled: boolean) {
  const { supabase, user } = await requireUser()
  if (!user) return { error: 'not_authenticated' }
  const { error } = await supabase
    .from('announcements')
    .update({ enabled: !!enabled, updated_by: user.id })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return { ok: true }
}

export async function deleteAnnouncement(id: string) {
  const { supabase, user } = await requireUser()
  if (!user) return { error: 'not_authenticated' }
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return { ok: true }
}

export async function saveAnnouncementSettings(input: AnnouncementSettingsUpdate) {
  const { supabase, user } = await requireUser()
  if (!user) return { error: 'not_authenticated' }
  const payload = {
    enabled: !!input.enabled,
    toast_position: POSITIONS.includes(input.toast_position) ? input.toast_position : 'bottom-left',
    toast_delay_ms: clampInt(input.toast_delay_ms, 0, 120000, 8000),
    toast_show_ms: clampInt(input.toast_show_ms, 1000, 60000, 6000),
    toast_gap_ms: clampInt(input.toast_gap_ms, 0, 120000, 10000),
    modal_delay_ms: clampInt(input.modal_delay_ms, 0, 120000, 3000),
    hidden_paths: Array.isArray(input.hidden_paths)
      ? input.hidden_paths.map((p) => String(p).trim()).filter(Boolean).slice(0, 50)
      : [],
    show_on_desktop: !!input.show_on_desktop,
    show_on_mobile: !!input.show_on_mobile,
    updated_by: user.id,
  }
  const { error } = await supabase.from('announcement_settings').update(payload).eq('id', 1)
  if (error) return { error: error.message }
  revalidateTag('announcement_settings')
  revalidatePath('/admin-cls/announcements')
  revalidatePath('/', 'layout')
  return { ok: true }
}
