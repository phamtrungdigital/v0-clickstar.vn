import { ContactView, contactMetadata } from './_view'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => contactMetadata('vi')

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  return <ContactView lang="vi" service={service} />
}
