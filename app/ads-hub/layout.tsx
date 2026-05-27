import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => pageMetadata('ads-hub')

export default async function AdsHubLayout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('ads-hub')
  return <PageDataProvider page={page}>{children}</PageDataProvider>
}
