import { TeamEditor } from '../_components/team-editor'

export const dynamic = 'force-dynamic'

export default function NewTeamMemberPage() {
  return <TeamEditor member={null} mode="new" />
}
