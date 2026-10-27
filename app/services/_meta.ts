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
      '8 dịch vụ của Click Star: Digital Marketing, Website, Dashboard dữ liệu, Tích hợp AI, Tự động hóa, CRM & CDP, Phân tích cuộc gọi AI và Phần mềm theo yêu cầu.',
      '8 Click Star services: digital marketing, websites, data dashboards, AI integration, automation, CRM & CDP, AI call analytics and custom software.'
    ),
    path: '/services',
    lang,
    images: await ogImageOr(),
  })
}
