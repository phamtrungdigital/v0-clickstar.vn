import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => pageMetadata('pricing')

export default async function PricingLayout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('pricing')
  return <PageDataProvider page={page}>{children}</PageDataProvider>
}
