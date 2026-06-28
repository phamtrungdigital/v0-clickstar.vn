import { listAnnouncementsForAdmin, getAnnouncementSettings } from '@/lib/cms/announcements'
import { AnnouncementsManager } from './_components/announcements-manager'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
  const [list, settings] = await Promise.all([
    listAnnouncementsForAdmin(),
    getAnnouncementSettings(),
  ])
  return <AnnouncementsManager list={list} initialSettings={settings} />
}
