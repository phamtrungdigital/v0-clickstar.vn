import { pageMetadata } from '@/lib/cms/page-metadata'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => pageMetadata('about')

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
