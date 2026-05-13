'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateAdminUser, resetAdminPassword } from '../../../actions'
import type { AdminUser } from '@/lib/cms/users'

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
    if (!confirm(`Reset password cho ${user.email}?`)) return
    startTransition(async () => {
      const result = await resetAdminPassword(user.user_id, newPassword)
      if (result?.error) setMsg({ type: 'err', text: result.error })
      else {
        setMsg({ type: 'ok', text: `Đã reset password. Share cho user: ${newPassword}` })
        setNewPassword('')
      }
    })
  }

  return (
    <div className="max-w-xl space-y-3">
      <Link
        href="/admin-cls/users"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Quay lại danh sách
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            {user.full_name || user.email}
          </h1>
          <p className="text-xs text-slate-500 font-mono">{user.email}</p>
        </div>

        {msg && (
          <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs ${
              msg.type === 'ok'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {msg.type === 'ok' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {msg.text}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium mb-1.5">Họ tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5">Vai trò</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminUser['role'])}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSelf}
              className="w-4 h-4"
            />
            Active (cho phép đăng nhập)
            {isSelf && (
              <span className="text-[10px] text-slate-500">— không thể disable chính mình</span>
            )}
          </label>
        </div>

        <button
          onClick={save}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Reset mật khẩu</h2>
        <p className="text-xs text-slate-500">
          Tạo mật khẩu mới cho user này. Sau khi reset, share password cho user qua kênh an toàn.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mật khẩu mới (≥8 ký tự)"
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-mono"
          />
          <button
            onClick={resetPwd}
            disabled={isPending || newPassword.length < 8}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600 disabled:opacity-50"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
