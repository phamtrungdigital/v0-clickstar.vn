'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { TeamMember } from '@/lib/cms/team-members-types'

const Ctx = createContext<TeamMember[] | null>(null)

export function TeamMembersProvider({
  members,
  children,
}: {
  members: TeamMember[]
  children: ReactNode
}) {
  return <Ctx.Provider value={members}>{children}</Ctx.Provider>
}

/** Returns shared team members from context, or null if provider missing */
export function useTeamMembers(): TeamMember[] | null {
  return useContext(Ctx)
}
