import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('pricing')

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageLayout slug="pricing">{children}</CmsPageLayout>
}
