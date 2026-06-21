'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { TeamMemberFormData } from '@/lib/cms/team-members-types'

function normalize(input: TeamMemberFormData) {
  return {
    name: input.name.trim(),
    role_vi: input.role_vi?.trim() || null,
    role_en: input.role_en?.trim() || null,
    image: input.image?.trim() || null,
    bio_vi: input.bio_vi?.trim() || null,
    bio_en: input.bio_en?.trim() || null,
    linkedin: input.linkedin?.trim() || null,
    facebook: input.facebook?.trim() || null,
    twitter: input.twitter?.trim() || null,
    instagram: input.instagram?.trim() || null,
    sort_order: Number.isFinite(input.sort_order) ? Math.floor(input.sort_order) : 0,
    enabled: !!input.enabled,
  }
}

export async function createTeamMember(input: TeamMemberFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }
  if (!input.name?.trim()) return { error: 'Tên là bắt buộc' }

  const payload = { ...normalize(input), created_by: user.id, updated_by: user.id }
  const { data, error } = await supabase
    .from('team_members')
    .insert(payload)
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidateTag('team_members')
  revalidatePath('/admin-cls/team')
  revalidatePath('/')
  revalidatePath('/about')
  return { ok: true, id: data.id }
}

export async function updateTeamMember(id: string, input: TeamMemberFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const payload = { ...normalize(input), updated_by: user.id }
  const { error } = await supabase.from('team_members').update(payload).eq('id', id)
  if (error) return { error: error.message }
  revalidateTag('team_members')
  revalidatePath('/admin-cls/team')
  revalidatePath('/')
  revalidatePath('/about')
  return { ok: true }
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateTag('team_members')
  revalidatePath('/admin-cls/team')
  revalidatePath('/')
  revalidatePath('/about')
  return { ok: true }
}

export async function toggleTeamMember(id: string, enabled: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }
  const { error } = await supabase
    .from('team_members')
    .update({ enabled, updated_by: user.id })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidateTag('team_members')
  revalidatePath('/admin-cls/team')
  revalidatePath('/')
  revalidatePath('/about')
  return { ok: true }
}
