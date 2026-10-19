import Page from '@/app/services/website/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/website', undefined, 'en')

export default function EnServicesWebsitePage() {
  return (
    <CmsPageLayout slug="services/website" lang="en" service>
      <Page />
    </CmsPageLayout>
  )
}
