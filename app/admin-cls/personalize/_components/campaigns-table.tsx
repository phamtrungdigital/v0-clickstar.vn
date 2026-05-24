'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Edit3, Trash2, Eye, EyeOff } from 'lucide-react'
import type { PersonalizeCampaign } from '@/lib/personalize/campaign-types'
import { deleteCampaign, toggleCampaign } from '../actions'

export function CampaignsTable({ items }: { items: PersonalizeCampaign[] }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, enabled: boolean) => {
    startTransition(async () => {
      await toggleCampaign(id, enabled)
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Xoá campaign "${name}"? Không thể hoàn tác.`)) return
    startTransition(async () => {
      await deleteCampaign(id)
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-3 py-2 font-medium w-12">#</th>
            <th className="px-3 py-2 font-medium">Tên campaign</th>
            <th className="px-3 py-2 font-medium hidden md:table-cell">Điều kiện</th>
            <th className="px-3 py-2 font-medium hidden lg:table-cell">Vị trí</th>
            <th className="px-3 py-2 font-medium w-20 text-center">Priority</th>
            <th className="px-3 py-2 font-medium w-24">Trạng thái</th>
            <th className="px-3 py-2 font-medium w-28 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {items.map((c, idx) => {
            const triggerPages = c.conditions.visited_pages?.slice(0, 2).join(', ') || '—'
            const more = (c.conditions.visited_pages?.length ?? 0) > 2 ? '…' : ''
            const useAi = c.content.use_ai ? 'AI' : 'Static'
            return (
              <tr
                key={c.id}
                className={`hover:bg-slate-50 dark:hover:bg-slate-900/30 ${!c.enabled ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                <td className="px-3 py-2">
                  <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {useAi} · delay {c.delay_ms}ms · dismiss {c.dismiss_days}d
                  </div>
                </td>
                <td className="px-3 py-2 hidden md:table-cell text-xs text-slate-600 dark:text-slate-400">
                  <div className="font-mono">
                    {triggerPages}
                    {more}
                  </div>
                  {c.conditions.min_pages_visited && (
                    <div className="text-[10px]">≥{c.conditions.min_pages_visited} pages</div>
                  )}
                </td>
                <td className="px-3 py-2 hidden lg:table-cell text-xs text-slate-600 dark:text-slate-400">
                  {c.styles.position ?? 'bottom-right'}
                </td>
                <td className="px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-300">
                  {c.priority}
                </td>
                <td className="px-3 py-2">
                  <button
                    disabled={isPending}
                    onClick={() => handleToggle(c.id, !c.enabled)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      c.enabled
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    } disabled:opacity-50`}
                  >
                    {c.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {c.enabled ? 'Bật' : 'Tắt'}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin-cls/personalize/${c.id}/edit`}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded"
                      title="Sửa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded disabled:opacity-50"
                      title="Xoá"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
