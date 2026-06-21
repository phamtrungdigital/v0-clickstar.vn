import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/dashboard')

export default async function Layout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('services/dashboard')
  return <PageDataProvider page={page}>{children}</PageDataProvider>
}
