// Server-only: Supabase queries for personalize campaigns.

import { createClient } from '@/lib/supabase/server'
import type { PersonalizeCampaign } from './campaign-types'

/** Get all enabled campaigns sorted by priority desc — for public match endpoint */
export async function getActiveCampaigns(): Promise<PersonalizeCampaign[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('personalize_campaigns')
    .select('*')
    .eq('enabled', true)
    .order('priority', { ascending: false })

  if (error || !data) return []
  return data as unknown as PersonalizeCampaign[]
}

/** Get all campaigns for admin list (incl. disabled) */
export async function listCampaignsForAdmin(): Promise<PersonalizeCampaign[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('personalize_campaigns')
    .select('*')
    .order('priority', { ascending: false })
    .order('updated_at', { ascending: false })
  return (data as unknown as PersonalizeCampaign[]) ?? []
}

export async function getCampaignForAdmin(id: string): Promise<PersonalizeCampaign | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('personalize_campaigns')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return (data as unknown as PersonalizeCampaign) ?? null
}
