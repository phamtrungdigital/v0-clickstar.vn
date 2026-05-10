import { notFound } from 'next/navigation'
import { getPageForAdmin } from '@/lib/cms/queries'
import { PageEditor } from './_components/page-editor'

export const dynamic = 'force-dynamic'

export default async function PageEditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPageForAdmin(slug)
  if (!page) notFound()

  return <PageEditor page={page} />
}
