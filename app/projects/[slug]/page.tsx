import { ProjectDetailView, projectMetadata } from './_view'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return projectMetadata({ slug, lang: 'vi' })
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProjectDetailView slug={slug} lang="vi" />
}
