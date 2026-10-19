import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/website')

export default function ServicesWebsiteLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageLayout slug="services/website" service>{children}</CmsPageLayout>
}
