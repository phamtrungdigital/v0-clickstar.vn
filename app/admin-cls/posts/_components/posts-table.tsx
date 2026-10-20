'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, ExternalLink, Pencil, Trash2, CheckCircle2, FileEdit, Loader2, Search } from 'lucide-react'
import type { Post } from '@/lib/cms/posts'
import { Card, Chip, Toolbar, btn, searchInputClass } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'
import { bulkDeletePosts, bulkSetStatus } from '../bulk-actions'

type StatusFilter = 'all' | 'published' | 'draft'

function plain(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
}

export function PostsTable({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ ok?: string; error?: string } | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === 'published').length,
      draft: posts.filter((p) => p.status !== 'published').length,
    }),
    [posts]
  )

  const visible = useMemo(() => {
    const q = plain(query.trim())
    return posts.filter((p) => {
      if (status === 'published' && p.status !== 'published') return false
      if (status === 'draft' && p.status === 'published') return false
      if (!q) return true
      return plain(`${p.title.vi} ${p.slug} ${p.tags.join(' ')}`).includes(q)
    })
  }, [posts, query, status])

  // Chỉ thao tác trên bài đang hiển thị: bài đã chọn nhưng bị bộ lọc ẩn đi sẽ không bị xoá nhầm.
  const chosen = useMemo(() => visible.filter((p) => selected.has(p.id)).map((p) => p.id), [visible, selected])
  const allSelected = visible.length > 0 && chosen.length === visible.length
  const someSelected = chosen.length > 0

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(visible.map((p) => p.id)))
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
    if (!confirm(`Xoá ${chosen.length} bài? Hành động không thể hoàn tác.`)) return
    runBulk(
      () => bulkDeletePosts(chosen),
      (n) => `Đã xoá ${n} bài`
    )
  }

  const handleBulkPublish = () =>
    runBulk(
      () => bulkSetStatus(chosen, 'published'),
      (n) => `Đã đăng ${n} bài`
    )

  const handleBulkDraft = () =>
    runBulk(
      () => bulkSetStatus(chosen, 'draft'),
      (n) => `Đã chuyển ${n} bài về bản nháp`
    )

  return (
    <>
      <Toolbar>
        <Segmented
          ariaLabel="Lọc theo trạng thái"
          value={status}
          onChange={setStatus}
          options={[
            { id: 'all', label: 'Tất cả', count: counts.all },
            { id: 'published', label: 'Đã đăng', count: counts.published },
            { id: 'draft', label: 'Bản nháp', count: counts.draft },
          ]}
        />
        <label className="relative ml-auto block w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ad-fg-3)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, đường dẫn, thẻ"
            aria-label="Tìm bài viết"
            className={searchInputClass + ' w-full pl-9'}
          />
        </label>
      </Toolbar>

      {someSelected && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--ad-line)] bg-[var(--ad-accent-soft)] px-4 py-2.5">
          <span className="text-[14px] font-medium text-[var(--ad-accent)]">Đã chọn {chosen.length} bài</span>
          <button onClick={handleBulkPublish} disabled={isPending} className={btn('secondary', 'sm')}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đăng
          </button>
          <button onClick={handleBulkDraft} disabled={isPending} className={btn('secondary', 'sm')}>
            <FileEdit className="h-3.5 w-3.5" />
            Về bản nháp
          </button>
          <button onClick={handleBulkDelete} disabled={isPending} className={btn('danger', 'sm')}>
            <Trash2 className="h-3.5 w-3.5" />
            Xoá
          </button>
          {isPending && <Loader2 className="h-4 w-4 animate-spin text-[var(--ad-accent)]" />}
          <button onClick={() => setSelected(new Set())} className="ml-auto text-[13px] text-[var(--ad-fg-2)] hover:text-[var(--ad-fg)]">
            Bỏ chọn
          </button>
        </div>
      )}

      {feedback && (
        <div
          role="status"
          className={`mb-3 rounded-2xl px-4 py-2.5 text-[14px] ${
            feedback.error ? 'bg-[rgba(255,59,48,.10)] text-[#d70015]' : 'bg-[rgba(52,199,89,.12)] text-[#248a3d]'
          }`}
        >
          {feedback.error ? `Chưa thực hiện được: ${feedback.error}` : feedback.ok}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-[var(--ad-line)] text-left">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Chọn tất cả bài đang hiển thị"
                    className="h-4 w-4 rounded"
                  />
                </th>
                <th className="px-3 py-3">Bài viết</th>
                <th className="px-3 py-3">Đường dẫn</th>
                <th className="px-3 py-3">Thẻ</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3">Ngày đăng</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-[14px] text-[var(--ad-fg-3)]">
                    Không có bài nào khớp bộ lọc.
                  </td>
                </tr>
              ) : null}
              {visible.map((post) => (
                <tr
                  key={post.id}
                  className={`border-t border-[var(--ad-line)] first:border-t-0 ${selected.has(post.id) ? 'bg-[var(--ad-accent-soft)]' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(post.id)}
                      onChange={() => toggleOne(post.id)}
                      aria-label={`Chọn bài ${post.title.vi}`}
                      className="h-4 w-4 rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt=""
                          width={56}
                          height={40}
                          className="h-10 w-14 flex-none rounded-lg object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-10 w-14 flex-none items-center justify-center rounded-lg bg-[var(--ad-fill)]">
                          <FileText className="h-4 w-4 text-[var(--ad-fg-3)]" />
                        </div>
                      )}
                      <Link
                        href={`/admin-cls/posts/${post.id}/edit`}
                        className="line-clamp-2 max-w-[360px] text-[14.5px] font-medium text-[var(--ad-fg)] hover:text-[var(--ad-accent)]"
                      >
                        {post.title.vi}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[var(--ad-fg-3)]">
                    <span className="block max-w-[220px] truncate" title={post.slug}>
                      {post.slug}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Chip tone={post.status === 'published' ? 'ok' : 'warn'}>
                      {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                    </Chip>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[var(--ad-fg-3)]">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
                      : 'Chưa đăng'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {post.status === 'published' && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] hover:bg-[var(--ad-fill)] hover:text-[var(--ad-fg)]"
                          title="Xem bài trên website"
                          aria-label="Xem bài trên website"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      <Link href={`/admin-cls/posts/${post.id}/edit`} className={btn('secondary', 'sm')}>
                        <Pencil className="h-3.5 w-3.5" />
                        Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
