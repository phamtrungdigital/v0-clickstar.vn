import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/digital-marketing')

export default function ServicesDigitalMarketingLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageLayout slug="services/digital-marketing" service>{children}</CmsPageLayout>
}
