import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { makeT } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'

/** Metadata cho /services (trang tổng hợp) ở ngôn ngữ `lang`. */
export async function servicesIndexMetadata(lang: Lang): Promise<Metadata> {
  const t = makeT(lang)
  return buildMetadata({
    title: t('Dịch vụ chuyển đổi số toàn diện', 'Comprehensive digital transformation services'),
    description: t(
      '8 dịch vụ của Click Star: Digital Marketing, Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, AI Automation, CRM & CDP, Phân tích cuộc gọi AI (Call to Text) và Phần mềm theo yêu cầu.',
      '8 services from Click Star: Digital Marketing, Website Design, Data Dashboards, AI Integration, AI Automation, CRM & CDP, AI Call Analytics (Call to Text) and Custom Software.'
    ),
    path: '/services',
    lang,
    images: await ogImageOr(),
  })
}
