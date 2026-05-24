'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  CampaignConditions,
  CampaignContent,
  CampaignStyles,
} from '@/lib/personalize/campaign-types'

export type CampaignFormData = {
  name: string
  enabled: boolean
  priority: number
  conditions: CampaignConditions
  content: CampaignContent
  styles: CampaignStyles
  delay_ms: number
  auto_dismiss_ms: number
  dismiss_days: number
}

function normalize(input: CampaignFormData) {
  return {
    name: input.name.trim(),
    enabled: !!input.enabled,
    priority: Number.isFinite(input.priority) ? Math.floor(input.priority) : 0,
    conditions: input.conditions ?? {},
    content: input.content,
    styles: input.styles ?? {},
    delay_ms: Number.isFinite(input.delay_ms) ? Math.max(0, input.delay_ms) : 1200,
    auto_dismiss_ms: Number.isFinite(input.auto_dismiss_ms) ? Math.max(0, input.auto_dismiss_ms) : 0,
    dismiss_days: Number.isFinite(input.dismiss_days) ? Math.max(1, input.dismiss_days) : 7,
  }
}

export async function createCampaign(input: CampaignFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }
  if (!input.name?.trim()) return { error: 'Tên campaign là bắt buộc' }

  const payload = { ...normalize(input), created_by: user.id, updated_by: user.id }
  const { data, error } = await supabase
    .from('personalize_campaigns')
    .insert(payload)
    .select('id')
    .single()
  if (error) return { error: error.message }

  revalidatePath('/admin-cls/personalize')
  return { ok: true, id: data.id }
}

export async function updateCampaign(id: string, input: CampaignFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const payload = { ...normalize(input), updated_by: user.id }
  const { error } = await supabase.from('personalize_campaigns').update(payload).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin-cls/personalize')
  return { ok: true }
}

export async function deleteCampaign(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('personalize_campaigns').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin-cls/personalize')
  return { ok: true }
}

export async function toggleCampaign(id: string, enabled: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }
  const { error } = await supabase
    .from('personalize_campaigns')
    .update({ enabled, updated_by: user.id })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin-cls/personalize')
  return { ok: true }
}
