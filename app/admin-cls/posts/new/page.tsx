import { getSiteSettingsRaw } from '@/lib/cms/settings'
import { PostEditor } from '../[id]/edit/_components/post-editor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function NewPostPage() {
  const settings = await getSiteSettingsRaw()
  return <PostEditor post={null} mode="new" siteUrl={settings?.site_url} />
}
