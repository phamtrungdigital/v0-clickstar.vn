'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import type { PersonalizeCampaign } from '@/lib/personalize/campaign-types'
import { Card, Chip } from '@/components/admin/ui'
import { Switch } from '@/components/admin/switch'
import { deleteCampaign, toggleCampaign } from '../actions'

const POSITION_LABEL: Record<string, string> = {
  'bottom-right': 'Góc dưới phải',
  'bottom-left': 'Góc dưới trái',
  'bottom-center': 'Giữa phía dưới',
  'top-banner': 'Dải đầu trang',
}

const ICON_BTN =
  'grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] transition-colors hover:bg-[var(--ad-fill)] hover:text-[var(--ad-fg)] disabled:opacity-50'

export function CampaignsTable({ items }: { items: PersonalizeCampaign[] }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, enabled: boolean) => {
    startTransition(async () => {
      await toggleCampaign(id, enabled)
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Xoá chiến dịch "${name}"? Không thể hoàn tác.`)) return
    startTransition(async () => {
      await deleteCampaign(id)
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-[var(--ad-line)] text-left">
              <th className="w-14 px-5 py-3">#</th>
              <th className="px-3 py-3">Tên chiến dịch</th>
              <th className="px-3 py-3">Điều kiện</th>
              <th className="px-3 py-3">Vị trí</th>
              <th className="px-3 py-3 text-center">Ưu tiên</th>
              <th className="px-3 py-3">Đang bật</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c, idx) => {
              const triggerPages = c.conditions.visited_pages?.slice(0, 2).join(', ') || '—'
              const more = (c.conditions.visited_pages?.length ?? 0) > 2 ? '…' : ''
              return (
                <tr key={c.id} className={`border-t border-[var(--ad-line)] first:border-t-0 ${!c.enabled ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-3 text-[13px] tabular-nums text-[var(--ad-fg-3)]">{idx + 1}</td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin-cls/personalize/${c.id}/edit`}
                      className="text-[14.5px] font-medium text-[var(--ad-fg)] hover:text-[var(--ad-accent)]"
                    >
                      {c.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Chip tone={c.content.use_ai ? 'blue' : 'neutral'}>{c.content.use_ai ? 'AI viết nội dung' : 'Nội dung cố định'}</Chip>
                      <span className="text-[12.5px] text-[var(--ad-fg-3)]">
                        Hiện sau {c.delay_ms}ms · ẩn {c.dismiss_days} ngày sau khi đóng
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[var(--ad-fg-2)]">
                    <div>
                      {triggerPages}
                      {more}
                    </div>
                    {c.conditions.min_pages_visited ? (
                      <div className="text-[12.5px] text-[var(--ad-fg-3)]">Từ {c.conditions.min_pages_visited} trang trở lên</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[var(--ad-fg-2)]">
                    {POSITION_LABEL[c.styles.position ?? 'bottom-right'] ?? c.styles.position}
                  </td>
                  <td className="px-3 py-3 text-center text-[14px] font-medium tabular-nums text-[var(--ad-fg)]">{c.priority}</td>
                  <td className="px-3 py-3">
                    <Switch
                      checked={c.enabled}
                      disabled={isPending}
                      onChange={(v) => handleToggle(c.id, v)}
                      label={c.enabled ? `Tắt chiến dịch ${c.name}` : `Bật chiến dịch ${c.name}`}
                      title={c.enabled ? 'Đang bật, bấm để tắt' : 'Đang tắt, bấm để bật'}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <Link href={`/admin-cls/personalize/${c.id}/edit`} className={ICON_BTN + ' hover:!text-[var(--ad-accent)]'} title="Sửa" aria-label="Sửa">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(c.id, c.name)}
                        className={ICON_BTN + ' hover:!text-[#d70015]'}
                        title="Xoá"
                        aria-label="Xoá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
