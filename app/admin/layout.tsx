import { Inter } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import AdminShell from './_components/admin-shell'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const wrap = (node: React.ReactNode) => (
    <div className={`${inter.variable} admin-scope`}>{node}</div>
  )

  // No user → /admin/login (proxy.ts redirects, but this also covers it)
  if (!user) {
    return wrap(children)
  }

  const { data: profile } = await supabase
    .from('admin_users')
    .select('email, full_name, role')
    .eq('user_id', user.id)
    .maybeSingle()

  // Should never happen — middleware guards this. But fall back to bare layout.
  if (!profile) {
    return wrap(children)
  }

  return wrap(<AdminShell user={profile}>{children}</AdminShell>)
}
