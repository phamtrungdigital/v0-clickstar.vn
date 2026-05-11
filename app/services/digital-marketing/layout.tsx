import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => pageMetadata('services/digital-marketing')

export default async function Layout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('services/digital-marketing')
  return <PageDataProvider page={page}>{children}</PageDataProvider>
}
