import { pageMetadata } from '@/lib/cms/page-metadata'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => pageMetadata('pricing')

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
