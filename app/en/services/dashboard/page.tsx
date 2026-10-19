import Page from '@/app/services/dashboard/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/dashboard', undefined, 'en')

export default function EnServicesDashboardPage() {
  return (
    <CmsPageLayout slug="services/dashboard" lang="en" service>
      <Page />
    </CmsPageLayout>
  )
}
