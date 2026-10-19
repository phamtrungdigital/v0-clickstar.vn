import { BRAND, SITE_URL } from './site'
import type { SiteSettings } from '@/lib/cms/settings'

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

/** Thông tin tổ chức, chỉ lấy từ Cài đặt trong admin (không tự bịa dữ liệu). */
export function organizationSchema(s: SiteSettings | null) {
  const sameAs = [s?.facebook_url, s?.linkedin_url, s?.youtube_url, s?.instagram_url, s?.twitter_url].filter(Boolean)
  const address = s?.address?.vi
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND,
    legalName: s?.site_name?.vi || undefined,
    url: s?.site_url || SITE_URL,
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

export function websiteSchema(s: SiteSettings | null) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: s?.site_url || SITE_URL,
    name: BRAND,
    inLanguage: 'vi',
    publisher: { '@id': ORG_ID },
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

export function serviceSchema(o: { name: string; description?: string; path: string }) {
  return {
    '@type': 'Service',
    name: o.name,
    description: o.description || undefined,
    url: absoluteUrl(o.path),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Việt Nam' },
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
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(o.path) },
    author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: BRAND,
      logo: o.logoUrl ? { '@type': 'ImageObject', url: absoluteUrl(o.logoUrl) } : undefined,
    },
  }
}
