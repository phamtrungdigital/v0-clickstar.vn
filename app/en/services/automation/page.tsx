import Page from '@/app/services/automation/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/automation', undefined, 'en')

export default function EnServicesAutomationPage() {
  return (
    <CmsPageLayout slug="services/automation" lang="en" service>
      <Page />
    </CmsPageLayout>
  )
}
