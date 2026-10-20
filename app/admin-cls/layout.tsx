import type { Metadata } from 'next'
import './admin.css'
import { Inter } from 'next/font/google'
import { getAdminProfile } from '@/lib/admin-cls/auth'
import AdminShell from './_components/admin-shell'
import { AdminTheme } from './_components/admin-theme'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

/** Khu quản trị không được xuất hiện trên công cụ tìm kiếm. */
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read admin profile from headers set by proxy.ts (no DB query for warm cache)
  const profile = await getAdminProfile()

  const wrap = (node: React.ReactNode) => (
    <div className={`${inter.variable} admin-scope`}>
      <AdminTheme />
      {node}
    </div>
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
