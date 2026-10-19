import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

/**
 * Metadata cho /services (trang tổng hợp).
 * Các trang con /services/<slug> có generateMetadata riêng ở layout của chúng
 * nên sẽ ghi đè metadata này — layout ở đây chỉ bọc children, không đổi giao diện.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Dịch vụ chuyển đổi số toàn diện',
  description:
    'Tám dịch vụ của Click Star: Digital Marketing, Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, AI Automation, CRM & CDP, Phân tích cuộc gọi AI (Call to Text) và Phần mềm theo yêu cầu.',
  path: '/services',
})

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
