// Client-safe types + defaults cho nội dung web động: Footer + CTA các trang dịch vụ.
// Dùng chung bởi context provider (client), footer, service pages, và admin form.
import type { I18n } from './types'

export type LinkItem = { label: I18n; href: string }

export type FooterSocial = {
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
  youtube: string
}

export type FooterContent = {
  description: I18n
  social: FooterSocial
  services_title: I18n
  services_links: LinkItem[]
  quick_title: I18n
  quick_links: LinkItem[]
  contact_title: I18n
  contact_address: I18n
  contact_phone: string
  contact_email: string
  newsletter_title: I18n
  newsletter_desc: I18n
  copyright: I18n
  policy_links: LinkItem[]
}

export type CtaButton = { label: I18n; href: string }
export type ServiceCta = {
  heading: I18n
  description: I18n
  primary: CtaButton
  secondary: CtaButton
}
export type ServiceCtas = Record<string, ServiceCta>

export type WebContent = {
  id: number
  footer: FooterContent
  service_ctas: ServiceCtas
  updated_at: string
}

export type WebContentUpdate = {
  footer: FooterContent
  service_ctas: ServiceCtas
}

/**
 * Slug các trang dịch vụ có CTA chỉnh được.
 * ⚠️ Thêm slug ở đây PHẢI thêm luôn entry tương ứng trong DEFAULT_SERVICE_CTAS bên dưới
 * (footer-cta-form dựng lại service_ctas CHỈ từ mảng này → thiếu là mất key khi admin Lưu).
 */
export const CTA_SLUGS = ['digital-marketing', 'website', 'speech-insight-ai'] as const

export const SOCIAL_KEYS: (keyof FooterSocial)[] = [
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'youtube',
]

export const DEFAULT_FOOTER: FooterContent = {
  description: {
    vi: 'Chúng tôi là đơn vị cung cấp giải pháp chuyển đổi số toàn diện, giúp doanh nghiệp tối ưu vận hành và tăng trưởng bền vững.',
    en: 'We provide comprehensive digital transformation solutions to help businesses optimize operations and achieve sustainable growth.',
  },
  social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#', youtube: '#' },
  services_title: { vi: 'Dịch vụ', en: 'Services' },
  services_links: [
    { label: { vi: 'Digital Marketing', en: 'Digital Marketing' }, href: '/services/digital-marketing' },
    { label: { vi: 'Thiết kế Website', en: 'Website Design' }, href: '/services/website' },
    { label: { vi: 'Dashboard dữ liệu', en: 'Data Dashboard' }, href: '/services/dashboard' },
    { label: { vi: 'Tích hợp AI', en: 'AI Integration' }, href: '/services/ai-integration' },
    { label: { vi: 'AI Automation', en: 'AI Automation' }, href: '/services/automation' },
    { label: { vi: 'CRM & CDP', en: 'CRM & CDP' }, href: '/services/crm-cdp' },
  ],
  quick_title: { vi: 'Liên kết', en: 'Quick Links' },
  quick_links: [
    { label: { vi: 'Về chúng tôi', en: 'About Us' }, href: '/about' },
    { label: { vi: 'Đội ngũ', en: 'Our Team' }, href: '/about#team' },
    { label: { vi: 'Dự án', en: 'Projects' }, href: '/projects' },
    { label: { vi: 'Bảng giá', en: 'Pricing' }, href: '/pricing' },
    { label: { vi: 'Tin tức', en: 'Blog' }, href: '/blog' },
    { label: { vi: 'Liên hệ', en: 'Contact' }, href: '/contact' },
  ],
  contact_title: { vi: 'Liên hệ', en: 'Contact' },
  contact_address: {
    vi: 'Tầng 6, Tòa MD Complex (Tòa VP), Số 68 Nguyễn Cơ Thạch, Phường Từ Liêm, Thành phố Hà Nội, Việt Nam',
    en: 'Floor 6, MD Complex Tower (Office Building), 68 Nguyen Co Thach, Tu Liem Ward, Hanoi, Vietnam',
  },
  contact_phone: '0977 713 428',
  contact_email: 'clickstar.vn@gmail.com',
  newsletter_title: { vi: 'Đăng ký nhận tin', en: 'Newsletter' },
  newsletter_desc: {
    vi: 'Đăng ký để nhận thông tin mới nhất về xu hướng công nghệ và chuyển đổi số.',
    en: 'Subscribe to get the latest updates on technology trends and digital transformation.',
  },
  copyright: {
    vi: 'CÔNG TY TNHH CLICK STAR DIGITAL. Bảo lưu mọi quyền.',
    en: 'CLICK STAR DIGITAL CO., LTD. All rights reserved.',
  },
  policy_links: [
    { label: { vi: 'Chính sách bảo mật', en: 'Privacy Policy' }, href: '#' },
    { label: { vi: 'Điều khoản sử dụng', en: 'Terms of Service' }, href: '#' },
    { label: { vi: 'Chính sách Cookie', en: 'Cookie Policy' }, href: '#' },
  ],
}

export const DEFAULT_SERVICE_CTAS: ServiceCtas = {
  'digital-marketing': {
    heading: { vi: 'Sẵn sàng tăng trưởng?', en: 'Ready to grow?' },
    description: {
      vi: 'Đặt lịch tư vấn miễn phí với chuyên gia Digital Marketing của chúng tôi ngay hôm nay.',
      en: 'Schedule a free consultation with our Digital Marketing experts today.',
    },
    primary: { label: { vi: 'Đặt lịch tư vấn', en: 'Book Consultation' }, href: '/contact' },
    secondary: {
      label: { vi: 'Gọi ngay: 0977 713 428', en: 'Call now: 0977 713 428' },
      href: 'tel:0977713428',
    },
  },
  website: {
    heading: { vi: 'Sẵn sàng có website mới?', en: 'Ready for a new website?' },
    description: {
      vi: 'Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.',
      en: 'Contact us now for free consultation and detailed quote for your project.',
    },
    primary: {
      label: { vi: 'Gọi ngay: 0977 713 428', en: 'Call now: 0977 713 428' },
      href: 'tel:0977713428',
    },
    secondary: { label: { vi: 'Nhận báo giá qua email', en: 'Get quote via email' }, href: '/contact' },
  },
  'speech-insight-ai': {
    heading: {
      vi: 'Gửi chúng tôi 50 cuộc gọi thật. Nhận lại bản phân tích của chính đội bạn.',
      en: 'Send us 50 real calls. Get back an analysis of your own team.',
    },
    description: {
      vi: 'Không cần đổi tổng đài, không cần cam kết trước. Chúng tôi bóc băng, chấm điểm, trích xuất dữ liệu rồi ngồi cùng bạn soát kết quả. Sau buổi review, bạn quyết định có triển khai hay không.',
      en: 'No phone system change, no upfront commitment. We transcribe, score and extract the data, then review the results together with you. After that session, you decide whether to proceed.',
    },
    primary: {
      label: { vi: 'Nhận phân tích thử', en: 'Get a free trial analysis' },
      href: '/contact?service=Ph%C3%A2n%20t%C3%ADch%20cu%E1%BB%99c%20g%E1%BB%8Di%20AI',
    },
    secondary: {
      label: { vi: 'Gọi ngay: 0977 713 428', en: 'Call now: 0977 713 428' },
      href: 'tel:0977713428',
    },
  },
}

export const DEFAULT_WEB_CONTENT: { footer: FooterContent; service_ctas: ServiceCtas } = {
  footer: DEFAULT_FOOTER,
  service_ctas: DEFAULT_SERVICE_CTAS,
}

/** Chuẩn hoá row DB (có thể thiếu field) về shape đầy đủ, fallback default. */
export function normalizeWebContent(row: WebContent | null): {
  footer: FooterContent
  service_ctas: ServiceCtas
} {
  if (!row) return DEFAULT_WEB_CONTENT
  return {
    footer: { ...DEFAULT_FOOTER, ...(row.footer || {}) },
    service_ctas: { ...DEFAULT_SERVICE_CTAS, ...(row.service_ctas || {}) },
  }
}
