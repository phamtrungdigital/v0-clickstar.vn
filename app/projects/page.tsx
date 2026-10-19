import { ProjectsListView, projectsListMetadata } from './_view'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => projectsListMetadata('vi')

export default function ProjectsPage() {
  return <ProjectsListView lang="vi" />
}
