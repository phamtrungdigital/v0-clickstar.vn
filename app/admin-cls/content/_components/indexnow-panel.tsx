'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Loader2, Send, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD } from '@/app/admin-cls/seo/_components/seo-panel'
import { sendIndexNow } from '../actions'

type Outcome = { ok: boolean; message: string; submitted: number; posts: number } | null

export function IndexNowPanel() {
  const [pending, start] = useTransition()
  const [which, setWhich] = useState<'recent' | 'all' | null>(null)
  const [outcome, setOutcome] = useState<Outcome>(null)

  const run = (scope: 'recent' | 'all') => {
    setWhich(scope)
    setOutcome(null)
    start(async () => {
      try {
        setOutcome(await sendIndexNow(scope))
      } catch {
        setOutcome({ ok: false, message: 'Không gửi được, hãy thử lại sau.', submitted: 0, posts: 0 })
      }
    })
  }

  const btn =
    'inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed'

  return (
    <section className={cn(CARD, 'px-4 py-3')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Báo công cụ tìm kiếm có bài mới (IndexNow)</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Khi anh lưu hoặc đăng bài trong trình sửa, site tự báo cho Bing, Yandex và các công cụ cùng chuẩn. Bài đăng theo cách khác (không qua
            trình sửa) thì bấm nút bên cạnh. Google chưa hỗ trợ IndexNow, vẫn đọc bài mới qua sơ đồ trang web (sitemap).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => run('recent')}
            className={cn(btn, 'border-primary bg-primary text-white hover:bg-primary/90')}
          >
            {pending && which === 'recent' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Gửi bài 7 ngày gần đây
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => run('all')}
            className={cn(btn, 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700/40')}
          >
            {pending && which === 'all' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Gửi tất cả bài đã đăng
          </button>
        </div>
      </div>

      {outcome && (
        <div
          role="status"
          className={cn(
            'mt-2.5 flex items-start gap-2 rounded-md border px-3 py-2 text-xs',
            outcome.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200'
          )}
        >
          {outcome.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none" /> : <XCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />}
          <span>
            {outcome.message}
            {outcome.ok && ` (${outcome.posts} bài, ${outcome.submitted} địa chỉ gồm bản tiếng Anh và trang danh sách Blog)`}
          </span>
        </div>
      )}
    </section>
  )
}
