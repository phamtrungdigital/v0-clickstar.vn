import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'
import { PageSchema } from '@/components/seo/page-schema'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('ads-hub')

export default async function AdsHubLayout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('ads-hub')
  return (
    <PageDataProvider page={page}>
      <PageSchema slug="ads-hub" service />
      {children}
    </PageDataProvider>
  )
}
