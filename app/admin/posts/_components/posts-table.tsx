'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, ExternalLink, Edit, Trash2, CheckCircle2, FileEdit, Loader2 } from 'lucide-react'
import type { Post } from '@/lib/cms/posts'
import { bulkDeletePosts, bulkSetStatus } from '../bulk-actions'

export function PostsTable({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ ok?: string; error?: string } | null>(null)

  const allSelected = posts.length > 0 && selected.size === posts.length
  const someSelected = selected.size > 0

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(posts.map((p) => p.id)))
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const runBulk = (
    action: () => Promise<{ ok?: number; error?: string }>,
    successMsg: (n: number) => string
  ) => {
    startTransition(async () => {
      setFeedback(null)
      const result = await action()
      if (result.error) setFeedback({ error: result.error })
      else {
        setFeedback({ ok: successMsg(result.ok ?? 0) })
        setSelected(new Set())
        setTimeout(() => setFeedback(null), 4000)
      }
    })
  }

  const handleBulkDelete = () => {
    if (!confirm(`Xoá ${selected.size} bài? Hành động không thể hoàn tác.`)) return
    runBulk(
      () => bulkDeletePosts(Array.from(selected)),
      (n) => `Đã xoá ${n} bài`
    )
  }

  const handleBulkPublish = () =>
    runBulk(
      () => bulkSetStatus(Array.from(selected), 'published'),
      (n) => `Đã publish ${n} bài`
    )

  const handleBulkDraft = () =>
    runBulk(
      () => bulkSetStatus(Array.from(selected), 'draft'),
      (n) => `Đã chuyển ${n} bài về draft`
    )

  return (
    <>
      {/* Bulk action bar — sticks above table when selection active */}
      {someSelected && (
        <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg">
          <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
            Đã chọn {selected.size} bài
          </span>
          <button
            onClick={handleBulkPublish}
            disabled={isPending}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3 h-3" />
            Publish
          </button>
          <button
            onClick={handleBulkDraft}
            disabled={isPending}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50"
          >
            <FileEdit className="w-3 h-3" />
            Về Draft
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
            Xoá
          </button>
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />}
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-[11px] text-slate-600 hover:text-slate-900"
          >
            Huỷ chọn
          </button>
        </div>
      )}

      {feedback && (
        <div
          className={`px-3 py-2 rounded text-xs ${
            feedback.error
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          }`}
        >
          {feedback.error ? `⚠ ${feedback.error}` : `✓ ${feedback.ok}`}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
              <th className="px-3 py-2.5 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-2.5">Bài viết</th>
              <th className="px-4 py-2.5">Slug</th>
              <th className="px-4 py-2.5">Tags</th>
              <th className="px-4 py-2.5">Trạng thái</th>
              <th className="px-4 py-2.5">Đăng</th>
              <th className="px-4 py-2.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {posts.map((post) => (
              <tr
                key={post.id}
                className={`hover:bg-slate-50 dark:hover:bg-slate-900/30 ${
                  selected.has(post.id) ? 'bg-violet-50/50 dark:bg-violet-950/10' : ''
                }`}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(post.id)}
                    onChange={() => toggleOne(post.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt=""
                        width={48}
                        height={36}
                        className="w-12 h-9 rounded object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-9 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <span className="font-medium text-slate-900 dark:text-white line-clamp-2">
                      {post.title.vi}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500">{post.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('vi-VN')
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {post.status === 'published' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        title="Xem"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
                    >
                      <Edit className="w-3 h-3" />
                      Sửa
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
