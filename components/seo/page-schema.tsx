import { getPublishedPage } from '@/lib/cms/queries'
import { breadcrumbSchema, serviceSchema, type Crumb } from '@/lib/seo/schema'
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
  return <JsonLd data={nodes} />
}
