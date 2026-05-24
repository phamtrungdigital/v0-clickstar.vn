'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit3, Trash2, Eye, EyeOff, UserCircle } from 'lucide-react'
import type { TeamMember } from '@/lib/cms/team-members-types'
import { deleteTeamMember, toggleTeamMember } from '../actions'

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
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-3 py-2 font-medium w-16">Ảnh</th>
            <th className="px-3 py-2 font-medium">Tên</th>
            <th className="px-3 py-2 font-medium hidden md:table-cell">Vai trò</th>
            <th className="px-3 py-2 font-medium w-20 text-center">Sort</th>
            <th className="px-3 py-2 font-medium w-24">Trạng thái</th>
            <th className="px-3 py-2 font-medium w-24 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {items.map((m) => (
            <tr key={m.id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/30 ${!m.enabled ? 'opacity-60' : ''}`}>
              <td className="px-3 py-2">
                {m.image ? (
                  <div className="w-12 h-12 relative rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <Image src={m.image} alt={m.name} fill className="object-cover" sizes="48px" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </td>
              <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{m.name}</td>
              <td className="px-3 py-2 hidden md:table-cell text-slate-700 dark:text-slate-300">
                {m.role_vi ?? '—'}
              </td>
              <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{m.sort_order}</td>
              <td className="px-3 py-2">
                <button
                  disabled={isPending}
                  onClick={() => handleToggle(m.id, !m.enabled)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    m.enabled
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  } disabled:opacity-50`}
                >
                  {m.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {m.enabled ? 'Hiện' : 'Ẩn'}
                </button>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin-cls/team/${m.id}/edit`}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded"
                    title="Sửa"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(m.id, m.name)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded disabled:opacity-50"
                    title="Xoá"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
