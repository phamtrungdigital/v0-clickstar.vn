import type { ReactNode } from 'react'
import { getPublishedPage } from '@/lib/cms/queries'
import { PageDataProvider } from '@/lib/cms/page-data-context'
import { ServicePricingProvider } from '@/lib/cms/service-pricing'
import { findPricingGroup } from '@/lib/cms/service-pricing-shared'
import { PageSchema } from '@/components/seo/page-schema'
import { faqPageSchema } from '@/lib/seo/schema'
import type { Lang } from '@/lib/i18n/locale'
import { FAQ_ITEMS } from '../_data/faq'

export const SPEECH_SLUG = 'services/speech-insight-ai'

/** Id nhóm giá của dịch vụ này trong section `pricing_grouped_tiers` của page `pricing`. */
const PRICING_GROUP_ID = 'speech-insight-ai'

/** Khung của trang Phân tích cuộc gọi AI: dữ liệu CMS, bảng giá (nguồn duy nhất là page `pricing`), FAQPage, Service. */
export async function SpeechInsightShell({ lang = 'vi', children }: { lang?: Lang; children: ReactNode }) {
  // Lấy song song: nội dung trang này + bảng giá.
  const [page, pricingPage] = await Promise.all([getPublishedPage(SPEECH_SLUG), getPublishedPage('pricing')])

  return (
    <PageDataProvider page={page}>
      <ServicePricingProvider group={findPricingGroup(pricingPage, PRICING_GROUP_ID)}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQ_ITEMS, lang)) }} />
        <PageSchema slug={SPEECH_SLUG} service lang={lang} />
        {children}
      </ServicePricingProvider>
    </PageDataProvider>
  )
}
