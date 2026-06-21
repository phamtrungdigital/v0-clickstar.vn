// Server-only queries for shared team_members table

import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import type { TeamMember } from './team-members-types'

/** Public: enabled members sorted by sort_order desc — cached, revalidate khi admin sửa đội ngũ. */
export const getActiveTeamMembers = unstable_cache(
  async (): Promise<TeamMember[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('enabled', true)
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: true })
    return (data as unknown as TeamMember[]) ?? []
  },
  ['active-team-members'],
  { tags: ['team_members'], revalidate: 3600 }
)

/** Admin: all members incl. disabled */
export async function listTeamMembersForAdmin(): Promise<TeamMember[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: false })
    .order('updated_at', { ascending: false })
  return (data as unknown as TeamMember[]) ?? []
}

export async function getTeamMemberForAdmin(id: string): Promise<TeamMember | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('team_members').select('*').eq('id', id).maybeSingle()
  return (data as unknown as TeamMember) ?? null
}
