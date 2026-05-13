import { cache } from 'react'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export type AdminProfile = {
  user_id: string
  email: string
  full_name: string | null
  role: string
}

/**
 * Get current admin profile — memoized PER REQUEST via React.cache().
 *
 * Fast path: middleware (proxy.ts) verified admin and set x-admin-* headers.
 * Fallback: queries get_my_admin_profile() RPC if headers absent (eg. local dev).
 *
 * Multiple callers in the same request → 1 query at most (often 0 with header).
 */
export const getAdminProfile = cache(async (): Promise<AdminProfile | null> => {
  const h = await headers()
  const headerUserId = h.get('x-admin-user-id')

  if (headerUserId) {
    return {
      user_id: headerUserId,
      email: h.get('x-admin-email') || '',
      full_name: h.get('x-admin-name') || null,
      role: h.get('x-admin-role') || 'viewer',
    }
  }

  // Fallback (no header): query DB
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_my_admin_profile')
  return data as AdminProfile | null
})
