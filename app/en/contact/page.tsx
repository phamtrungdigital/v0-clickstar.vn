import { ContactView, contactMetadata } from '@/app/contact/_view'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => contactMetadata('en')

export default async function EnContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  return <ContactView lang="en" service={service} />
}
