import { getAdminProfile } from '@/lib/admin-cls/auth'
import { loadSeoItems, loadSiteChecks } from '@/lib/seo/admin-seo-data'
import { loadContentAnalysis } from '@/lib/seo/content-data'
import { SeoWorkspace } from './_components/seo-workspace'

export const dynamic = 'force-dynamic'

export default async function AdminSEOPage() {
  const [profile, items, content] = await Promise.all([getAdminProfile(), loadSeoItems(), loadContentAnalysis()])
  const { checks, siteUrl } = await loadSiteChecks(items)

  return <SeoWorkspace items={items} checks={checks} siteUrl={siteUrl} role={profile?.role ?? 'viewer'} content={content} />
}
