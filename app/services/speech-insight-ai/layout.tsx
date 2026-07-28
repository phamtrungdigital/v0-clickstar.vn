import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'
import { FAQ_ITEMS } from './_data/faq'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('services/speech-insight-ai')

/** JSON-LD FAQPage — sinh từ đúng mảng FAQ mà trang render (bản .vi). */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q.vi,
    acceptedAnswer: { '@type': 'Answer', text: item.a.vi },
  })),
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const page = await getPublishedPage('services/speech-insight-ai')
  return (
    <PageDataProvider page={page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </PageDataProvider>
  )
}
