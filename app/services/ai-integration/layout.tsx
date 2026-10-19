import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/ai-integration')

export default function ServicesAiIntegrationLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageLayout slug="services/ai-integration" service>{children}</CmsPageLayout>
}
