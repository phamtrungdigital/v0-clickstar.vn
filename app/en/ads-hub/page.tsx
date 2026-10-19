import Page from '@/app/ads-hub/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('ads-hub', undefined, 'en')

export default function EnAdsHubPage() {
  return (
    <CmsPageLayout slug="ads-hub" lang="en" service>
      <Page />
    </CmsPageLayout>
  )
}
