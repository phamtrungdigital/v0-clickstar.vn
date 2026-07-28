import { getPublishedPage } from '@/lib/cms/queries'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageDataProvider } from '@/lib/cms/page-data-context'
import { ServicePricingProvider } from '@/lib/cms/service-pricing'
import { findPricingGroup } from '@/lib/cms/service-pricing-shared'
import { FAQ_ITEMS } from './_data/faq'

/** Id nhóm giá của dịch vụ này trong section `pricing_grouped_tiers` của page `pricing`. */
const PRICING_GROUP_ID = 'speech-insight-ai'

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
  // Lấy song song: nội dung trang này + bảng giá (nguồn giá DUY NHẤT là page `pricing`).
  const [page, pricingPage] = await Promise.all([
    getPublishedPage('services/speech-insight-ai'),
    getPublishedPage('pricing'),
  ])

  return (
    <PageDataProvider page={page}>
      <ServicePricingProvider group={findPricingGroup(pricingPage, PRICING_GROUP_ID)}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {children}
      </ServicePricingProvider>
    </PageDataProvider>
  )
}
