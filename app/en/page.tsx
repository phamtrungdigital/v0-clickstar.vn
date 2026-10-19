import { HomeView } from '@/components/pages/home-view'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('home', undefined, 'en')

export default function EnHome() {
  return <HomeView lang="en" />
}
