import { ProjectDetailView, projectMetadata } from '@/app/projects/[slug]/_view'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return projectMetadata({ slug, lang: 'en' })
}

export default async function EnProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProjectDetailView slug={slug} lang="en" />
}
