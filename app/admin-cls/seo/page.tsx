import { getAdminProfile } from '@/lib/admin-cls/auth'
import { loadSeoItems, loadSiteChecks } from '@/lib/seo/admin-seo-data'
import { SeoWorkspace } from './_components/seo-workspace'

export const dynamic = 'force-dynamic'

export default async function AdminSEOPage() {
  const [profile, items] = await Promise.all([getAdminProfile(), loadSeoItems()])
  const { checks, siteUrl } = await loadSiteChecks(items)

  return <SeoWorkspace items={items} checks={checks} siteUrl={siteUrl} role={profile?.role ?? 'viewer'} />
}
