import ServicesIndexPage from '@/app/services/page'
import { servicesIndexMetadata } from '@/app/services/_meta'

export const revalidate = 3600
export const generateMetadata = () => servicesIndexMetadata('en')

export default function EnServicesIndexPage() {
  return <ServicesIndexPage />
}
