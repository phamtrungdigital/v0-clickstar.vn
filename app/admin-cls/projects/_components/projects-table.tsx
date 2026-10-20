'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Eye, EyeOff, ExternalLink, Archive } from 'lucide-react'
import type { CaseStudy, CaseStudyStatus } from '@/lib/cms/case-studies-types'
import { Card, Chip } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'
import { deleteProject, setProjectStatus } from '../actions'

const STATUS_LABEL: Record<CaseStudyStatus, { vi: string; tone: 'neutral' | 'ok' | 'warn' }> = {
  draft: { vi: 'Bản nháp', tone: 'neutral' },
  published: { vi: 'Đã đăng', tone: 'ok' },
  archived: { vi: 'Lưu trữ', tone: 'warn' },
}

const ICON_BTN =
  'grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] transition-colors hover:bg-[var(--ad-fill)] hover:text-[var(--ad-fg)] disabled:opacity-50'

export function ProjectsTable({ items }: { items: CaseStudy[] }) {
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<'all' | CaseStudyStatus>('all')

  const handleStatus = (id: string, status: CaseStudyStatus) => {
    startTransition(async () => {
      await setProjectStatus(id, status)
    })
  }

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Xoá dự án "${title}"? Hành động này không thể hoàn tác.`)) return
    startTransition(async () => {
      await deleteProject(id)
    })
  }

  const count = (s: CaseStudyStatus) => items.filter((p) => p.status === s).length
  const visible = filter === 'all' ? items : items.filter((p) => p.status === filter)

  return (
    <>
      <div className="mb-3.5">
        <Segmented
          ariaLabel="Lọc theo trạng thái"
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: 'Tất cả', count: items.length },
            { id: 'published', label: 'Đã đăng', count: count('published') },
            { id: 'draft', label: 'Bản nháp', count: count('draft') },
            { id: 'archived', label: 'Lưu trữ', count: count('archived') },
          ]}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-[var(--ad-line)] text-left">
                <th className="w-20 px-5 py-3">Ảnh</th>
                <th className="px-3 py-3">Tên dự án</th>
                <th className="px-3 py-3">Khách hàng</th>
                <th className="px-3 py-3">Ngành</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3 text-center">Thứ tự</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-[14px] text-[var(--ad-fg-3)]">
                    Không có dự án nào ở trạng thái này.
                  </td>
                </tr>
              ) : null}
              {visible.map((p) => {
                const status = STATUS_LABEL[p.status]
                return (
                  <tr key={p.id} className="border-t border-[var(--ad-line)] first:border-t-0">
                    <td className="px-5 py-3">
                      {p.cover_image ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[var(--ad-fill)]">
                          <Image src={p.cover_image} alt={p.title_vi} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-[var(--ad-fill)]" />
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin-cls/projects/${p.id}/edit`}
                        className="block max-w-[340px] text-[14.5px] font-medium text-[var(--ad-fg)] hover:text-[var(--ad-accent)]"
                      >
                        {p.title_vi}
                      </Link>
                      <div className="text-[12.5px] text-[var(--ad-fg-3)]">/{p.slug}</div>
                    </td>
                    <td className="px-3 py-3 text-[13.5px] text-[var(--ad-fg-2)]">{p.client_name ?? '—'}</td>
                    <td className="px-3 py-3 text-[13.5px] text-[var(--ad-fg-2)]">{p.industry_vi ?? '—'}</td>
                    <td className="px-3 py-3">
                      <Chip tone={status.tone}>{status.vi}</Chip>
                    </td>
                    <td className="px-3 py-3 text-center text-[13.5px] tabular-nums text-[var(--ad-fg-3)]">{p.sort_order}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        {p.status === 'published' && (
                          <Link
                            href={`/projects/${p.slug}`}
                            target="_blank"
                            className={ICON_BTN}
                            title="Xem trang trên website"
                            aria-label="Xem trang trên website"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        {p.status !== 'published' ? (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatus(p.id, 'published')}
                            className={ICON_BTN + ' hover:!text-[#248a3d]'}
                            title="Đăng lên website"
                            aria-label="Đăng lên website"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatus(p.id, 'draft')}
                            className={ICON_BTN}
                            title="Chuyển về bản nháp"
                            aria-label="Chuyển về bản nháp"
                          >
                            <EyeOff className="h-4 w-4" />
                          </button>
                        )}
                        {p.status !== 'archived' && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatus(p.id, 'archived')}
                            className={ICON_BTN + ' hover:!text-[#b25e00]'}
                            title="Lưu trữ"
                            aria-label="Lưu trữ"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        <Link href={`/admin-cls/projects/${p.id}/edit`} className={ICON_BTN + ' hover:!text-[var(--ad-accent)]'} title="Sửa" aria-label="Sửa">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          disabled={isPending}
                          onClick={() => handleDelete(p.id, p.title_vi)}
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
    </>
  )
}
