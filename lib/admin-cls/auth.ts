import { cache } from 'react'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_TOKEN_HEADER, verifyAdminToken } from '@/lib/admin-cls/admin-token'

export type AdminProfile = {
  user_id: string
  email: string
  full_name: string | null
  role: string
}

/**
 * Get current admin profile — memoized PER REQUEST via React.cache().
 *
 * Fast path: proxy.ts verified admin and forwarded the HMAC-signed token in
 * x-admin-token; we verify the signature + expiry again here because the proxy
 * only runs on /admin-cls/* — on any other route (or a server action POSTed to
 * one) the client controls every header. Plain x-admin-* headers are never read.
 * Fallback: get_my_admin_profile() RPC (session-bound via auth.uid()).
 *
 * For authorization (who may do what), server actions/APIs must still check
 * the DB/RPC themselves (get_my_admin_profile / RLS is_admin()) — use this
 * for display and per-page UX only.
 */
export const getAdminProfile = cache(async (): Promise<AdminProfile | null> => {
  const h = await headers()
  const token = verifyAdminToken(h.get(ADMIN_TOKEN_HEADER))
  if (token) {
    return {
      user_id: token.uid,
      email: token.email,
      full_name: token.name,
      role: token.role,
    }
  }

  const supabase = await createClient()
  const { data } = await supabase.rpc('get_my_admin_profile')
  return data as AdminProfile | null
})
