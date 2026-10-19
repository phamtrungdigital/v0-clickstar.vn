import Page from '@/app/about/page'
import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('about', undefined, 'en')

export default function EnAboutPage() {
  return (
    <CmsPageLayout slug="about" lang="en">
      <Page />
    </CmsPageLayout>
  )
}
