import type { ReactNode } from 'react'
import { getPublishedPage } from '@/lib/cms/queries'
import { PageDataProvider } from '@/lib/cms/page-data-context'
import { PageSchema } from '@/components/seo/page-schema'
import type { Lang } from '@/lib/i18n/locale'

/**
 * Khung dùng chung của các trang CMS (about, pricing, ads-hub, các trang dịch vụ): nạp dòng `pages` của trang,
 * cấp dữ liệu cho các khối bên trong và gắn dữ liệu có cấu trúc (breadcrumb, Service) đúng ngôn ngữ.
 * Bản tiếng Việt dùng ở layout.tsx của từng trang, bản tiếng Anh dùng ở app/en/.../page.tsx.
 */
export async function CmsPageLayout({
  slug,
  lang = 'vi',
  service = false,
  children,
}: {
  slug: string
  lang?: Lang
  service?: boolean
  children: ReactNode
}) {
  const page = await getPublishedPage(slug)
  return (
    <PageDataProvider page={page}>
      <PageSchema slug={slug} service={service} lang={lang} />
      {children}
    </PageDataProvider>
  )
}
