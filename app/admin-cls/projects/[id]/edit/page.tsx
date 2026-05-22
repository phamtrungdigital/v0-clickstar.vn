import { notFound } from 'next/navigation'
import { getCaseStudyForAdmin } from '@/lib/cms/case-studies'
import { ProjectEditor } from '../../_components/project-editor'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getCaseStudyForAdmin(id)
  if (!project) notFound()
  return <ProjectEditor project={project} mode="edit" />
}
