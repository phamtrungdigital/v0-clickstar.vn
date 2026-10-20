'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Loader2, Send, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD } from '@/app/admin-cls/seo/_components/seo-panel'
import { btn } from '@/components/admin/ui'
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

  return (
    <section className={cn(CARD, 'px-5 py-4')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-semibold tracking-[-0.018em] text-[var(--ad-fg)]">Báo công cụ tìm kiếm có bài mới (IndexNow)</h2>
          <p className="mt-1 text-[13px] leading-snug text-[var(--ad-fg-3)]">
            Khi anh lưu hoặc đăng bài trong trình sửa, site tự báo cho Bing, Yandex và các công cụ cùng chuẩn. Bài đăng theo cách khác (không qua
            trình sửa) thì bấm nút bên cạnh. Google chưa hỗ trợ IndexNow, vẫn đọc bài mới qua sơ đồ trang web (sitemap).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={pending} onClick={() => run('recent')} className={btn('primary')}>
            {pending && which === 'recent' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Gửi bài 7 ngày gần đây
          </button>
          <button type="button" disabled={pending} onClick={() => run('all')} className={btn('secondary')}>
            {pending && which === 'all' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Gửi tất cả bài đã đăng
          </button>
        </div>
      </div>

      {outcome && (
        <div
          role="status"
          className={cn(
            'mt-3 flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-[13.5px]',
            outcome.ok ? 'bg-[rgba(52,199,89,.12)] text-[#248a3d]' : 'bg-[rgba(255,59,48,.10)] text-[#d70015]'
          )}
        >
          {outcome.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" /> : <XCircle className="mt-0.5 h-4 w-4 flex-none" />}
          <span>
            {outcome.message}
            {outcome.ok && ` (${outcome.posts} bài, ${outcome.submitted} địa chỉ gồm bản tiếng Anh và trang danh sách Blog)`}
          </span>
        </div>
      )}
    </section>
  )
}
