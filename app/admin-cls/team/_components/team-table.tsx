'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Eye, EyeOff, UserCircle } from 'lucide-react'
import type { TeamMember } from '@/lib/cms/team-members-types'
import { Card } from '@/components/admin/ui'
import { deleteTeamMember, toggleTeamMember } from '../actions'

const ICON_BTN =
  'grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] transition-colors hover:bg-[var(--ad-fill)] hover:text-[var(--ad-fg)] disabled:opacity-50'

export function TeamTable({ items }: { items: TeamMember[] }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, enabled: boolean) => {
    startTransition(async () => {
      await toggleTeamMember(id, enabled)
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Xoá thành viên "${name}"? Sẽ ẩn khỏi tất cả trang.`)) return
    startTransition(async () => {
      await deleteTeamMember(id)
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-[var(--ad-line)] text-left">
              <th className="w-20 px-5 py-3">Ảnh</th>
              <th className="px-3 py-3">Tên</th>
              <th className="px-3 py-3">Vai trò</th>
              <th className="px-3 py-3 text-center">Thứ tự</th>
              <th className="px-3 py-3">Hiển thị</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className={`border-t border-[var(--ad-line)] first:border-t-0 ${!m.enabled ? 'opacity-60' : ''}`}>
                <td className="px-5 py-3">
                  {m.image ? (
                    <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[var(--ad-fill)]">
                      <Image src={m.image} alt={m.name} fill className="object-cover" sizes="44px" />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ad-fill)]">
                      <UserCircle className="h-6 w-6 text-[var(--ad-fg-3)]" />
                    </div>
                  )}
                </td>
                <td className="px-3 py-3">
                  <Link href={`/admin-cls/team/${m.id}/edit`} className="text-[14.5px] font-medium text-[var(--ad-fg)] hover:text-[var(--ad-accent)]">
                    {m.name}
                  </Link>
                </td>
                <td className="px-3 py-3 text-[13.5px] text-[var(--ad-fg-2)]">{m.role_vi ?? '—'}</td>
                <td className="px-3 py-3 text-center text-[13.5px] tabular-nums text-[var(--ad-fg-3)]">{m.sort_order}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={m.enabled}
                    aria-label={m.enabled ? `Ẩn ${m.name}` : `Hiện ${m.name}`}
                    title={m.enabled ? 'Đang hiện trên website, bấm để ẩn' : 'Đang ẩn, bấm để hiện'}
                    disabled={isPending}
                    onClick={() => handleToggle(m.id, !m.enabled)}
                    className={`relative inline-flex h-[26px] w-[44px] flex-none items-center rounded-full transition-colors disabled:opacity-50 ${
                      m.enabled ? 'bg-[#34c759]' : 'bg-[rgba(120,120,128,.32)]'
                    }`}
                  >
                    <span
                      className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,.25)] transition-transform ${
                        m.enabled ? 'translate-x-[20px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <Link href={`/admin-cls/team/${m.id}/edit`} className={ICON_BTN + ' hover:!text-[var(--ad-accent)]'} title="Sửa" aria-label="Sửa">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(m.id, m.name)}
                      className={ICON_BTN + ' hover:!text-[#d70015]'}
                      title="Xoá"
                      aria-label="Xoá"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
