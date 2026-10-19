import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('ads-hub')

export default function AdsHubLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageLayout slug="ads-hub" service>{children}</CmsPageLayout>
}
