import { getPublishedPage } from '@/lib/cms/queries'
import { breadcrumbSchema, serviceSchema, type Crumb } from '@/lib/seo/schema'
import { JsonLd } from './json-ld'

/**
 * Breadcrumb cho một trang CMS, kèm Service nếu là trang dịch vụ. Tên và mô tả lấy từ dòng `pages`
 * của chính trang đó nên khớp với nội dung đang hiển thị.
 */
export async function PageSchema({ slug, service = false }: { slug: string; service?: boolean }) {
  const page = await getPublishedPage(slug)
  if (!page) return null
  const path = `/${slug}`
  const name = page.title || slug
  const crumbs: Crumb[] = [{ name: 'Trang chủ', path: '/' }]
  if (slug.startsWith('services/')) crumbs.push({ name: 'Dịch vụ', path: '/services' })
  crumbs.push({ name, path })
  const nodes: object[] = [breadcrumbSchema(crumbs)]
  if (service) nodes.push(serviceSchema({ name, description: page.seo_description?.vi || undefined, path }))
  return <JsonLd data={nodes} />
}
