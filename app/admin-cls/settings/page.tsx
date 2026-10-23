import { getSiteSettingsRaw } from '@/lib/cms/settings'
import { getAdminProfile } from '@/lib/admin-cls/auth'
import { createClient } from '@/lib/supabase/server'
import { loadCodeState, type CodeState } from '@/lib/cms/code-admin'
import { SettingsForm } from './_components/settings-form'
import { CodeSnippetsManager } from './_components/code-snippets-manager'

export const dynamic = 'force-dynamic'

export default async function AdminSettings() {
  const [settings, profile] = await Promise.all([getSiteSettingsRaw(), getAdminProfile()])
  if (!settings) {
    return (
      <div className="text-sm text-slate-500">
        Chưa khởi tạo site_settings. Liên hệ admin.
      </div>
    )
  }

  // Chỉ admin cấp cao xem và sửa được Mã tuỳ chỉnh (mã chạy trực tiếp trên trình duyệt của mọi khách).
  // Quyền thật nằm ở cơ sở dữ liệu và ở từng hành động máy chủ; kiểm ở đây chỉ để không hiện giao diện thừa.
  const canEdit = profile?.role === 'admin'
  const initial: CodeState = canEdit ? await loadCodeState(await createClient()) : { snippets: [], history: [] }

  return (
    <SettingsForm
      initial={settings}
      codeSection={<CodeSnippetsManager initial={initial} canEdit={canEdit} legacyHead={canEdit ? settings.head_code : null} />}
    />
  )
}
