import { notFound } from 'next/navigation'
import { getAdminUser, getCurrentUserId } from '@/lib/cms/users'
import { UserEditor } from './_components/user-editor'

export const dynamic = 'force-dynamic'

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getAdminUser(id)
  if (!user) notFound()
  const currentId = await getCurrentUserId()
  return <UserEditor user={user} isSelf={currentId === user.user_id} />
}
