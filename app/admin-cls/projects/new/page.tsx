import { ProjectEditor } from '../_components/project-editor'

export const dynamic = 'force-dynamic'

export default function NewProjectPage() {
  return <ProjectEditor project={null} mode="new" />
}
