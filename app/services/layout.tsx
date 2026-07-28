import type { Metadata } from 'next'

export const revalidate = 3600

/**
 * Metadata cho /services (trang tổng hợp).
 * Các trang con /services/<slug> có generateMetadata riêng ở layout của chúng
 * nên sẽ ghi đè metadata này — layout ở đây chỉ bọc children, không đổi giao diện.
 */
export const metadata: Metadata = {
  title: 'Dịch vụ — Giải pháp chuyển đổi số toàn diện | Clickstar',
  description:
    'Bảy dịch vụ của Clickstar: Digital Marketing, Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, AI Automation, CRM & CDP và Phân tích cuộc gọi AI.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
