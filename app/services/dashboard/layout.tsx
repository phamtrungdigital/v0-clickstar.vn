import { pageMetadata } from '@/lib/cms/page-metadata'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => pageMetadata('services/dashboard')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
