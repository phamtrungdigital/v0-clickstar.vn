import { BRAND, SITE_URL } from './site'
import type { SiteSettings } from '@/lib/cms/settings'
import { localizePath, type Lang } from '@/lib/i18n/locale'

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

/** Đổi đường dẫn tương đối thành địa chỉ tuyệt đối (Google yêu cầu URL tuyệt đối trong dữ liệu có cấu trúc). */
export function absoluteUrl(u: string | null | undefined): string | undefined {
  if (!u) return undefined
  if (/^https?:\/\//i.test(u)) return u
  return `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`
}

/** Số điện thoại dạng quốc tế (+84...) theo khuyến nghị của schema.org. Không đoán được thì giữ nguyên chuỗi. */
function phoneIntl(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (/^0\d{9,10}$/.test(digits)) return `+84${digits.slice(1)}`
  return raw
}

/** Tách địa chỉ dạng "số nhà, phường, thành phố, quốc gia" thành các trường PostalAddress. */
function postalAddress(raw: string) {
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length >= 4) {
    return {
      '@type': 'PostalAddress',
      streetAddress: parts.slice(0, parts.length - 3).join(', '),
      addressLocality: parts[parts.length - 3],
      addressRegion: parts[parts.length - 2].replace(/^Thành phố\s+/i, ''),
      addressCountry: 'VN',
    }
  }
  return { '@type': 'PostalAddress', streetAddress: raw, addressCountry: 'VN' }
}

/** Thông tin tổ chức, chỉ lấy từ Cài đặt trong admin (không tự bịa dữ liệu). Bản /en dùng chữ tiếng Anh nếu có. */
export function organizationSchema(s: SiteSettings | null, lang: Lang = 'vi') {
  const sameAs = [s?.zalo_url, s?.facebook_url, s?.linkedin_url, s?.youtube_url, s?.instagram_url, s?.twitter_url].filter(Boolean)
  const address = (lang === 'en' ? s?.address?.en : '') || s?.address?.vi
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND,
    legalName: (lang === 'en' ? s?.site_name?.en : '') || s?.site_name?.vi || undefined,
    url: s?.site_url || SITE_URL,
    foundingDate: '2025',
    description:
      lang === 'en'
        ? 'Click Star provides digital transformation solutions for businesses: digital marketing, website design, data dashboards, AI integration, automation, CRM and CDP, and custom software.'
        : 'Click Star cung cấp giải pháp chuyển đổi số cho doanh nghiệp: Digital Marketing, thiết kế website, dashboard dữ liệu, tích hợp AI, tự động hóa, CRM và CDP, phần mềm theo yêu cầu.',
    areaServed: { '@type': 'Country', name: lang === 'en' ? 'Vietnam' : 'Việt Nam' },
    logo: absoluteUrl(s?.logo_url),
    email: s?.contact_email || undefined,
    telephone: phoneIntl(s?.contact_phone),
    address: address ? postalAddress(address) : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint:
      s?.contact_phone || s?.contact_email
        ? [
            {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              telephone: phoneIntl(s?.contact_phone),
              email: s?.contact_email || undefined,
              areaServed: 'VN',
              availableLanguage: ['Vietnamese', 'English'],
            },
          ]
        : undefined,
  }
}

export function websiteSchema(s: SiteSettings | null, lang: Lang = 'vi') {
  const base = s?.site_url || SITE_URL
  return {
    '@type': 'WebSite',
    '@id': lang === 'en' ? `${SITE_URL}/en#website` : WEBSITE_ID,
    url: lang === 'en' ? `${base}/en` : base,
    name: BRAND,
    inLanguage: lang,
    publisher: { '@id': ORG_ID },
  }
}

export type Crumb = { name: string; path: string }

/** `path` là đường dẫn tiếng Việt (không tiền tố); bản /en tự được gắn tiền tố theo `lang`. */
export function breadcrumbSchema(items: Crumb[], lang: Lang = 'vi') {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(localizePath(it.path, lang)),
    })),
  }
}

export function serviceSchema(o: { name: string; description?: string; path: string; lang?: Lang }) {
  const lang = o.lang ?? 'vi'
  return {
    '@type': 'Service',
    name: o.name,
    description: o.description || undefined,
    url: absoluteUrl(localizePath(o.path, lang)),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: lang === 'en' ? 'Vietnam' : 'Việt Nam' },
  }
}

export function blogPostingSchema(o: {
  title: string
  description?: string
  path: string
  image?: string | null
  publishedAt?: string | null
  modifiedAt?: string | null
  lang: 'vi' | 'en'
  logoUrl?: string | null
}) {
  return {
    '@type': 'BlogPosting',
    headline: o.title.slice(0, 110),
    description: o.description || undefined,
    image: o.image ? [absoluteUrl(o.image)] : undefined,
    datePublished: o.publishedAt || undefined,
    dateModified: o.modifiedAt || o.publishedAt || undefined,
    inLanguage: o.lang,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(localizePath(o.path, o.lang)) },
    author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: BRAND,
      logo: o.logoUrl ? { '@type': 'ImageObject', url: absoluteUrl(o.logoUrl) } : undefined,
    },
  }
}

/** FAQPage từ danh sách hỏi đáp có cả hai ngôn ngữ; dùng đúng chữ của ngôn ngữ trang đang render. */
export function faqPageSchema(items: { q: { vi: string; en: string }; a: { vi: string; en: string } }[], lang: Lang = 'vi') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q[lang] || item.q.vi,
      acceptedAnswer: { '@type': 'Answer', text: item.a[lang] || item.a.vi },
    })),
  }
}

/** Trang Giới thiệu: khai báo đây là trang nói về tổ chức (Organization) của site. */
export function aboutPageSchema(o: { name: string; description?: string; path: string; lang?: Lang }) {
  const lang = o.lang ?? 'vi'
  const url = absoluteUrl(localizePath(o.path, lang))
  return {
    '@type': 'AboutPage',
    '@id': `${url}#webpage`,
    name: o.name,
    description: o.description || undefined,
    url,
    inLanguage: lang,
    isPartOf: { '@id': lang === 'en' ? `${SITE_URL}/en#website` : WEBSITE_ID },
    about: { '@id': ORG_ID },
  }
}

/** "Từ 8 triệu", "Từ 25 triệu", "From 15M VND" thành số đồng; không đọc được (ví dụ "Liên hệ", "10.000 phút") thì trả null. */
export function parseVndFrom(text: string | null | undefined): number | null {
  if (!text) return null
  const vi = /từ\s*([\d.,]+)\s*triệu/i.exec(text)
  const en = /from\s*([\d.,]+)\s*m\b/i.exec(text)
  const m = vi || en
  if (!m) return null
  const n = Number(m[1].replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? Math.round(n * 1_000_000) : null
}

type PriceTier = {
  name?: { vi?: string; en?: string }
  price?: { vi?: string; en?: string }
  price_period?: { vi?: string; en?: string }
  description?: { vi?: string; en?: string }
}
type PriceGroup = { id?: string; label?: { vi?: string; en?: string }; tiers?: PriceTier[] }

/**
 * Bảng giá thành dữ liệu có cấu trúc: mỗi nhóm dịch vụ là một OfferCatalog, mỗi gói có giá "từ" là một Offer
 * với khoảng giá (minPrice, VND). Gói không công bố giá (Liên hệ, tính theo phút) vẫn được liệt kê nhưng không có giá.
 * Chỉ dùng chữ đang hiển thị trên trang nên không bịa số.
 */
export function pricingSchema(groups: PriceGroup[], lang: Lang = 'vi', path = '/pricing') {
  const pick = (v?: { vi?: string; en?: string }) => (lang === 'en' ? v?.en || v?.vi : v?.vi) || ''
  const catalogs = groups
    .map((g) => {
      const offers = (g.tiers ?? [])
        .map((t) => {
          const name = pick(t.name)
          if (!name) return null
          const min = parseVndFrom(t.price?.vi) ?? parseVndFrom(t.price?.en)
          const period = pick(t.price_period)
          return {
            '@type': 'Offer',
            name,
            description: pick(t.description) || undefined,
            priceSpecification: min
              ? {
                  '@type': 'PriceSpecification',
                  priceCurrency: 'VND',
                  minPrice: min,
                  ...(period.includes('tháng') || /month/i.test(period) ? { unitText: lang === 'en' ? 'per month' : 'mỗi tháng' } : {}),
                }
              : undefined,
            itemOffered: { '@type': 'Service', name: `${pick(g.label)}: ${name}` },
          }
        })
        .filter(Boolean)
      if (!offers.length) return null
      return { '@type': 'OfferCatalog', name: pick(g.label), itemListElement: offers }
    })
    .filter(Boolean)
  if (!catalogs.length) return null
  return {
    '@type': 'Service',
    name: lang === 'en' ? 'Click Star service pricing' : 'Bảng giá dịch vụ Click Star',
    url: absoluteUrl(localizePath(path, lang)),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: lang === 'en' ? 'Vietnam' : 'Việt Nam' },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: lang === 'en' ? 'Service plans' : 'Các gói dịch vụ', itemListElement: catalogs },
  }
}
