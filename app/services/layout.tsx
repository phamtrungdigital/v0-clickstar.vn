import { servicesIndexMetadata } from './_meta'

export const revalidate = 3600

/**
 * Metadata cho /services (trang tổng hợp).
 * Các trang con /services/<slug> có generateMetadata riêng ở layout của chúng
 * nên sẽ ghi đè metadata này — layout ở đây chỉ bọc children, không đổi giao diện.
 */
export const generateMetadata = () => servicesIndexMetadata('vi')

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
