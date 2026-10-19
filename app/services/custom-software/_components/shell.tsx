import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { PageSchema } from '@/components/seo/page-schema'
import { faqPageSchema } from '@/lib/seo/schema'
import type { Lang } from '@/lib/i18n/locale'
import { FAQ, SERVICE_SLUG } from '../_data/content'

// Font chữ code chỉ tải cho trang này (khung code, nhãn kỹ thuật). Trang dùng qua class
// MONO trong page.tsx — KHÔNG dùng `font-mono` vì globals.css khai `@theme inline`
// (giá trị bị chép cứng vào class, đổi biến --font-mono không có tác dụng).
const mono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

/** Dùng khi chưa có dòng `pages` cho trang này (admin chưa tạo SEO). */
const FALLBACK_META: Record<Lang, Metadata> = {
  vi: {
    title: 'Phát triển phần mềm theo yêu cầu, bảo mật và vận hành ổn định | Click Star',
    description:
      'Click Star thiết kế, lập trình và vận hành phần mềm riêng cho doanh nghiệp: bảo mật theo OWASP và Nghị định 13/2023, môi trường thử tách biệt, sao lưu hằng ngày, bàn giao 100% mã nguồn.',
  },
  en: {
    title: 'Custom software development with strong security and stable operations | Click Star',
    description:
      'Click Star designs, builds and runs bespoke software for businesses: OWASP-aligned security and Vietnam Decree 13/2023 compliance, isolated test environments, daily backups and 100% source-code handover.',
  },
}

export async function customSoftwareMetadata(lang: Lang = 'vi'): Promise<Metadata> {
  const fromCms = await pageMetadata(SERVICE_SLUG, undefined, lang)
  return fromCms.description ? fromCms : FALLBACK_META[lang]
}

/** Khung của trang Phần mềm theo yêu cầu: font code, FAQPage và Service/breadcrumb đúng ngôn ngữ. */
export function CustomSoftwareShell({ lang = 'vi', children }: { lang?: Lang; children: ReactNode }) {
  return (
    <div className={mono.variable}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQ.items, lang)) }} />
      <PageSchema slug={SERVICE_SLUG} service lang={lang} />
      {children}
    </div>
  )
}
