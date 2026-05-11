import { createClient } from '@/lib/supabase/server'
import type { Lead } from './leads-shared'

export type { Lead, LeadStatus } from './leads-shared'
export { LEAD_STATUS_LABEL, LEAD_STATUS_COLOR } from './leads-shared'

export async function listLeads(): Promise<Lead[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  return (data as unknown as Lead[]) || []
}

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('leads').select('*').eq('id', id).maybeSingle()
  return (data as unknown as Lead) || null
}
