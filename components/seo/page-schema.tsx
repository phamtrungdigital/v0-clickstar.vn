import { getPublishedPage } from '@/lib/cms/queries'
import { aboutPageSchema, breadcrumbSchema, faqPageSchema, pricingSchema, serviceSchema, type Crumb } from '@/lib/seo/schema'
import { HOME_NAME, SERVICES_NAME, pageDisplayName } from '@/lib/seo/page-names'
import type { Lang } from '@/lib/i18n/locale'
import { JsonLd } from './json-ld'

/**
 * Breadcrumb cho một trang CMS, kèm Service nếu là trang dịch vụ. Tên và mô tả lấy từ dòng `pages`
 * của chính trang đó nên khớp với nội dung đang hiển thị. Bản `lang="en"` dùng tên/mô tả tiếng Anh và địa chỉ /en.
 */
export async function PageSchema({ slug, service = false, lang = 'vi' }: { slug: string; service?: boolean; lang?: Lang }) {
  const page = await getPublishedPage(slug)
  if (!page) return null
  const path = `/${slug}`
  const name = pageDisplayName(slug, page.title || slug, lang)
  const crumbs: Crumb[] = [{ name: HOME_NAME[lang], path: '/' }]
  if (slug.startsWith('services/')) crumbs.push({ name: SERVICES_NAME[lang], path: '/services' })
  crumbs.push({ name, path })
  const description = (lang === 'en' ? page.seo_description?.en : '') || page.seo_description?.vi || undefined
  const nodes: object[] = [breadcrumbSchema(crumbs, lang)]
  if (service) nodes.push(serviceSchema({ name, description, path, lang }))
  if (slug === 'about') nodes.push(aboutPageSchema({ name, description, path, lang }))
  if (slug === 'pricing') {
    // Bảng giá và khối câu hỏi thường gặp lấy thẳng từ các khối đang hiển thị trên trang
    const sections = (page.sections ?? []).filter((x) => x.enabled)
    const groups = sections.find((x) => x.type === 'pricing_grouped_tiers')?.content as { groups?: Parameters<typeof pricingSchema>[0] } | undefined
    const priceNode = pricingSchema(groups?.groups ?? [], lang, path)
    if (priceNode) nodes.push(priceNode)
    const faq = sections.find((x) => x.type === 'faq')?.content as
      | { items?: { question: { vi: string; en: string }; answer: { vi: string; en: string } }[] }
      | undefined
    if (faq?.items?.length) {
      // Trong @graph không lặp @context của từng nút
      const { '@context': _ctx, ...faqNode } = faqPageSchema(faq.items.map((i) => ({ q: i.question, a: i.answer })), lang)
      nodes.push(faqNode)
    }
  }
  return <JsonLd data={nodes} />
}
