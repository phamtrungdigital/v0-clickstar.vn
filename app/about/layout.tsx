import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('about')

export default async function AboutLayout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('about')
  return <PageDataProvider page={page}>{children}</PageDataProvider>
}
