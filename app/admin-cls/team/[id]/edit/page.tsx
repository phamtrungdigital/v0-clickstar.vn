import { notFound } from 'next/navigation'
import { getTeamMemberForAdmin } from '@/lib/cms/team-members'
import { TeamEditor } from '../../_components/team-editor'

export const dynamic = 'force-dynamic'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getTeamMemberForAdmin(id)
  if (!member) notFound()
  return <TeamEditor member={member} mode="edit" />
}
