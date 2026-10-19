import Page from '@/app/services/digital-marketing/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/digital-marketing', undefined, 'en')

export default function EnServicesDigitalMarketingPage() {
  return (
    <CmsPageLayout slug="services/digital-marketing" lang="en" service>
      <Page />
    </CmsPageLayout>
  )
}
