import { ProjectsListView, projectsListMetadata } from '@/app/projects/_view'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => projectsListMetadata('en')

export default function EnProjectsPage() {
  return <ProjectsListView lang="en" />
}
