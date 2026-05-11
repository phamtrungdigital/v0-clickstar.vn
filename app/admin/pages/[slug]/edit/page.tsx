import { notFound } from 'next/navigation'
import { getPageForAdmin } from '@/lib/cms/queries'
import { PageEditor } from './_components/page-editor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// URL slug uses '__' as separator instead of '/' to fit within a single
// dynamic segment ('services__digital-marketing' → 'services/digital-marketing').
function decodeSlug(s: string) {
  return s.replace(/__/g, '/')
}

export default async function PageEditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dbSlug = decodeSlug(decodeURIComponent(slug))
  const page = await getPageForAdmin(dbSlug)
  if (!page) notFound()
  return <PageEditor page={page} />
}
