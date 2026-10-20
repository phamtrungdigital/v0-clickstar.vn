'use client'

import { useState, useTransition } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { updateAdminUser, resetAdminPassword } from '../../../actions'
import type { AdminUser } from '@/lib/cms/users'
import { EditorBar, SectionCard, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
import { Switch } from '@/components/admin/switch'

export function UserEditor({ user, isSelf }: { user: AdminUser; isSelf: boolean }) {
  const [name, setName] = useState(user.full_name ?? '')
  const [role, setRole] = useState<AdminUser['role']>(user.role)
  const [isActive, setIsActive] = useState(user.is_active)
  const [newPassword, setNewPassword] = useState('')

  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const save = () => {
    startTransition(async () => {
      const result = await updateAdminUser({
        user_id: user.user_id,
        name,
        role,
        is_active: isActive,
      })
      if (result?.error) setMsg({ type: 'err', text: result.error })
      else setMsg({ type: 'ok', text: 'Đã lưu thay đổi' })
    })
  }

  const resetPwd = () => {
    if (newPassword.length < 8) {
      setMsg({ type: 'err', text: 'Mật khẩu mới phải tối thiểu 8 ký tự' })
      return
    }
    if (!confirm(`Đặt lại mật khẩu cho ${user.email}?`)) return
    startTransition(async () => {
      const result = await resetAdminPassword(user.user_id, newPassword)
      if (result?.error) setMsg({ type: 'err', text: result.error })
      else {
        setMsg({ type: 'ok', text: `Đã đặt lại mật khẩu. Gửi cho người dùng: ${newPassword}` })
        setNewPassword('')
      }
    })
  }

  return (
    <div>
      <EditorBar backHref="/admin-cls/users" title={user.full_name || user.email} subtitle={user.email}>
        <button onClick={save} disabled={isPending} className={btn('primary')}>
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isPending ? 'Đang lưu' : 'Lưu thay đổi'}
        </button>
      </EditorBar>

      <div className="mx-auto max-w-xl space-y-4">
        {msg && (
          <div
            role="status"
            className={`rounded-xl px-4 py-2.5 text-[13.5px] ${
              msg.type === 'ok' ? 'bg-[rgba(52,199,89,.12)] text-[#248a3d]' : 'bg-[rgba(255,59,48,.10)] text-[#d70015]'
            }`}
          >
            {msg.text}
          </div>
        )}

        <SectionCard title="Thông tin tài khoản" bodyClassName="space-y-4 px-5 pb-5 pt-4">
          <div>
            <label className={fieldLabelClass}>Họ tên</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldInputClass} />
          </div>

          <div>
            <label className={fieldLabelClass}>Vai trò</label>
            <select value={role} onChange={(e) => setRole(e.target.value as AdminUser['role'])} className={fieldInputClass}>
              <option value="admin">Quản trị viên</option>
              <option value="editor">Biên tập viên</option>
              <option value="viewer">Người xem</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onChange={setIsActive}
              disabled={isSelf}
              label="Cho phép đăng nhập"
            />
            <div>
              <div className="text-[14px] text-[var(--ad-fg)]">Cho phép đăng nhập</div>
              {isSelf && <div className="text-[12.5px] text-[var(--ad-fg-3)]">Không thể khoá chính mình.</div>}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Đặt lại mật khẩu"
          description="Tạo mật khẩu mới cho người dùng này, rồi gửi cho họ qua kênh an toàn."
          bodyClassName="px-5 pb-5 pt-4"
        >
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới (từ 8 ký tự)"
              className={fieldInputClass + ' min-w-0 flex-1 font-mono'}
            />
            <button onClick={resetPwd} disabled={isPending || newPassword.length < 8} className={btn('secondary')}>
              <KeyRound className="h-4 w-4" />
              Đặt lại
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
