import Page from '@/app/services/crm-cdp/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/crm-cdp', undefined, 'en')

export default function EnServicesCrmCdpPage() {
  return (
    <CmsPageLayout slug="services/crm-cdp" lang="en" service>
      <Page />
    </CmsPageLayout>
  )
}
