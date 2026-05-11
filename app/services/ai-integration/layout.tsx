import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => pageMetadata('services/ai-integration')

export default async function Layout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('services/ai-integration')
  return <PageDataProvider page={page}>{children}</PageDataProvider>
}
