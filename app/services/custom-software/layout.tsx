import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { pageMetadata } from '@/lib/cms/page-metadata'
import { FAQ, SERVICE_SLUG } from './_data/content'

export const revalidate = 3600

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
const FALLBACK_META: Metadata = {
  title: 'Phát triển phần mềm theo yêu cầu, bảo mật và vận hành ổn định | Click Star',
  description:
    'Click Star thiết kế, lập trình và vận hành phần mềm riêng cho doanh nghiệp: bảo mật theo OWASP và Nghị định 13/2023, môi trường thử tách biệt, sao lưu hằng ngày, bàn giao 100% mã nguồn.',
}

export async function generateMetadata(): Promise<Metadata> {
  const fromCms = await pageMetadata(SERVICE_SLUG)
  return fromCms.description ? fromCms : FALLBACK_META
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.items.map((item) => ({
    '@type': 'Question',
    name: item.q.vi,
    acceptedAnswer: { '@type': 'Answer', text: item.a.vi },
  })),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={mono.variable}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </div>
  )
}
