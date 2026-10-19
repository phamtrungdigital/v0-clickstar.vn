import Page from '@/app/services/ai-integration/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/ai-integration', undefined, 'en')

export default function EnServicesAiIntegrationPage() {
  return (
    <CmsPageLayout slug="services/ai-integration" lang="en" service>
      <Page />
    </CmsPageLayout>
  )
}
