import type { Lang } from '@/lib/i18n/locale'

/**
 * Tên tiếng Anh của các trang CMS (bảng pages chỉ có tiêu đề tiếng Việt) dùng cho breadcrumb/Service của bản /en.
 * Giữ khớp với nhãn trong menu (components/layout/main-nav.tsx). Trang không có trong bảng thì dùng tên tiếng Việt.
 */
const NAMES_EN: Record<string, string> = {
  home: 'Home',
  about: 'About us',
  pricing: 'Pricing',
  'ads-hub': 'ADS hub',
  services: 'Services',
  'services/digital-marketing': 'Digital Marketing',
  'services/website': 'Website Design',
  'services/dashboard': 'Data Dashboard',
  'services/ai-integration': 'AI Integration',
  'services/automation': 'AI Automation',
  'services/crm-cdp': 'CRM & CDP',
  'services/speech-insight-ai': 'AI Call Analytics',
  'services/custom-software': 'Custom Software',
}

export function pageDisplayName(slug: string, viTitle: string, lang: Lang): string {
  return lang === 'en' ? NAMES_EN[slug] || viTitle : viTitle
}

export const HOME_NAME = { vi: 'Trang chủ', en: 'Home' } as const
export const SERVICES_NAME = { vi: 'Dịch vụ', en: 'Services' } as const
