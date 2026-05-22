'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit3, Trash2, Eye, EyeOff, ExternalLink, Archive } from 'lucide-react'
import type { CaseStudy, CaseStudyStatus } from '@/lib/cms/case-studies-types'
import { deleteProject, setProjectStatus } from '../actions'

const STATUS_LABEL: Record<CaseStudyStatus, { vi: string; cls: string }> = {
  draft: { vi: 'Bản nháp', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  published: { vi: 'Đã đăng', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  archived: { vi: 'Lưu trữ', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
}

export function ProjectsTable({ items }: { items: CaseStudy[] }) {
  const [isPending, startTransition] = useTransition()

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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-3 py-2 font-medium w-16">Ảnh</th>
            <th className="px-3 py-2 font-medium">Tên dự án</th>
            <th className="px-3 py-2 font-medium hidden md:table-cell">Khách hàng</th>
            <th className="px-3 py-2 font-medium hidden lg:table-cell">Ngành</th>
            <th className="px-3 py-2 font-medium w-24">Trạng thái</th>
            <th className="px-3 py-2 font-medium w-16 text-center">Thứ tự</th>
            <th className="px-3 py-2 font-medium w-32 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {items.map((p) => {
            const status = STATUS_LABEL[p.status]
            return (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                <td className="px-3 py-2">
                  {p.cover_image ? (
                    <div className="w-12 h-12 relative rounded overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <Image src={p.cover_image} alt={p.title_vi} fill className="object-cover" sizes="48px" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded" />
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-slate-900 dark:text-white">{p.title_vi}</div>
                  <div className="text-xs text-slate-500 font-mono">/{p.slug}</div>
                </td>
                <td className="px-3 py-2 hidden md:table-cell text-slate-700 dark:text-slate-300">
                  {p.client_name ?? '—'}
                </td>
                <td className="px-3 py-2 hidden lg:table-cell text-slate-700 dark:text-slate-300">
                  {p.industry_vi ?? '—'}
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${status.cls}`}>
                    {status.vi}
                  </span>
                </td>
                <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{p.sort_order}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    {p.status === 'published' && (
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-500 hover:text-primary rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Xem trang public"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {p.status !== 'published' ? (
                      <button
                        disabled={isPending}
                        onClick={() => handleStatus(p.id, 'published')}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded disabled:opacity-50"
                        title="Đăng lên public"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        disabled={isPending}
                        onClick={() => handleStatus(p.id, 'draft')}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-50"
                        title="Chuyển về nháp"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {p.status !== 'archived' && (
                      <button
                        disabled={isPending}
                        onClick={() => handleStatus(p.id, 'archived')}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded disabled:opacity-50"
                        title="Lưu trữ"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <Link
                      href={`/admin-cls/projects/${p.id}/edit`}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded"
                      title="Sửa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(p.id, p.title_vi)}
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
