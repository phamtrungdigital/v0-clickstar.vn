import { cache } from 'react'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export type AdminProfile = {
  user_id: string
  email: string
  full_name: string | null
  role: string
}

/** Headers are URI-encoded in middleware; decode defensively (old cookies may be raw). */
function safeDecode(v: string): string {
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
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
    // x-admin-email / x-admin-name are URI-encoded in middleware (full_name can
    // contain Vietnamese diacritics which are invalid in raw HTTP headers).
    const rawEmail = h.get('x-admin-email')
    const rawName = h.get('x-admin-name')
    return {
      user_id: headerUserId,
      email: rawEmail ? safeDecode(rawEmail) : '',
      full_name: rawName ? safeDecode(rawName) : null,
      role: h.get('x-admin-role') || 'viewer',
    }
  }

  // Fallback (no header): query DB
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_my_admin_profile')
  return data as AdminProfile | null
})
