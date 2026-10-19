import { HomeView } from '@/components/pages/home-view'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('home')

export default function Home() {
  return <HomeView lang="vi" />
}
