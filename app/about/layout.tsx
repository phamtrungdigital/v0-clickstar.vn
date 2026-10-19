import { CmsPageLayout } from '@/components/pages/cms-page-layout'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('about')

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageLayout slug="about">{children}</CmsPageLayout>
}
