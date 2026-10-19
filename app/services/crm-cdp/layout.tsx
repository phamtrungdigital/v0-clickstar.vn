import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/crm-cdp')

export default function ServicesCrmCdpLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageLayout slug="services/crm-cdp" service>{children}</CmsPageLayout>
}
