import { createClient } from '@/lib/supabase/server'
import AdminShell from './_components/admin-shell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // No user → /admin/login (proxy.ts redirects, but this also covers it)
  if (!user) {
    return <>{children}</>
  }

  const { data: profile } = await supabase
    .from('admin_users')
    .select('email, full_name, role')
    .eq('user_id', user.id)
    .maybeSingle()

  // Should never happen — middleware guards this. But fall back to bare layout.
  if (!profile) {
    return <>{children}</>
  }

  return <AdminShell user={profile}>{children}</AdminShell>
}
