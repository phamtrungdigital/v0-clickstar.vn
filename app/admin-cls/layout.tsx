import { Inter } from 'next/font/google'
import { getAdminProfile } from '@/lib/admin-cls/auth'
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
  // Read admin profile from headers set by proxy.ts (no DB query for warm cache)
  const profile = await getAdminProfile()

  const wrap = (node: React.ReactNode) => (
    <div className={`${inter.variable} admin-scope`}>{node}</div>
  )

  if (!profile) {
    // Login page or not logged in — bare layout
    return wrap(children)
  }

  return wrap(
    <AdminShell
      user={{ email: profile.email, full_name: profile.full_name, role: profile.role }}
    >
      {children}
    </AdminShell>
  )
}
