import { getSiteSettings } from '@/lib/cms/settings'
import { SettingsForm } from './_components/settings-form'

export const dynamic = 'force-dynamic'

export default async function AdminSettings() {
  const settings = await getSiteSettings()
  if (!settings) {
    return (
      <div className="text-sm text-slate-500">
        Chưa khởi tạo site_settings. Liên hệ admin.
      </div>
    )
  }
  return <SettingsForm initial={settings} />
}
