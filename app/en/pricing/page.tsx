import Page from '@/app/pricing/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('pricing', undefined, 'en')

export default function EnPricingPage() {
  return (
    <CmsPageLayout slug="pricing" lang="en">
      <Page />
    </CmsPageLayout>
  )
}
