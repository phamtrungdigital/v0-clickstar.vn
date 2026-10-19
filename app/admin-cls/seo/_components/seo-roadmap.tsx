'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROADMAP, ROADMAP_UPDATED, roadmapCounts, type RoadmapStatus } from '@/lib/seo/roadmap'
import { CARD } from './seo-panel'

const STATUS: Record<RoadmapStatus, { label: string; chip: string }> = {
  done: { label: 'Đã làm', chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  wait: { label: 'Chờ Google', chip: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  todo: { label: 'Sẽ làm', chip: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  mine: { label: 'Cần quản trị', chip: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
}

type Filter = 'all' | RoadmapStatus

/** Lộ trình SEO: việc đã làm, đang chờ, sẽ làm và việc của chủ site, kèm cách làm chi tiết. Dữ liệu ở lib/seo/roadmap.ts. */
export function SeoRoadmap() {
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const c = roadmapCounts()
  const pct = Math.round((c.done * 100) / c.total)
  const chips: [Filter, string, number][] = [
    ['all', 'Tất cả', c.total],
    ['done', 'Đã làm', c.done],
    ['wait', 'Chờ Google', c.wait],
    ['todo', 'Sẽ làm', c.todo],
    ['mine', 'Cần quản trị', c.mine],
  ]

  return (
    <div className="space-y-3">
      <div className={cn(CARD, 'px-4 py-3')}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Lộ trình SEO clickstar.vn</div>
            <div className="text-xs text-slate-500">
              Việc đã làm, đang chờ và sắp làm, gồm cả phần SEO cho AI (ChatGPT, Perplexity, Gemini). Bấm một việc để xem cách làm. Cập nhật {ROADMAP_UPDATED}.
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{pct}%</span>
            <span className="ml-1.5 text-xs text-slate-500">
              {c.done}/{c.total} việc xong
            </span>
          </div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {chips.map(([id, label, n]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full border',
              filter === id
                ? 'bg-primary/10 border-primary/40 text-primary'
                : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
            )}
          >
            {label} {n}
          </button>
        ))}
      </div>

      {ROADMAP.map((g) => {
        const items = g.items.filter((i) => filter === 'all' || i.status === filter)
        if (!items.length) return null
        const gDone = g.items.filter((i) => i.status === 'done').length
        return (
          <section key={g.id} className={cn(CARD, 'overflow-hidden')}>
            <div className="flex items-baseline justify-between gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{g.title}</h2>
                <p className="text-[11px] text-slate-500">{g.hint}</p>
              </div>
              <span className="text-[11px] text-slate-500 tabular-nums shrink-0">
                {gDone}/{g.items.length} xong
              </span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {items.map((it) => {
                const open = openId === it.id
                const done = it.status === 'done'
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : it.id)}
                      aria-expanded={open}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30"
                    >
                      <span
                        className={cn(
                          'w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0',
                          done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                        )}
                        aria-hidden="true"
                      >
                        {done && <Check className="w-3 h-3" />}
                      </span>
                      <span className={cn('flex-1 min-w-0 text-sm', done ? 'text-slate-500' : 'text-slate-900 dark:text-slate-100')}>
                        {it.title}
                      </span>
                      {it.prio && !done && (
                        <span className="text-[11px] text-red-600 dark:text-red-400 shrink-0">Ưu tiên cao</span>
                      )}
                      {it.date && <span className="text-[11px] text-slate-400 shrink-0">{it.date}</span>}
                      <span className={cn('text-[11px] px-2 py-0.5 rounded-md shrink-0', STATUS[it.status].chip)}>
                        {STATUS[it.status].label}
                      </span>
                      <span className="text-[11px] text-slate-400 w-16 shrink-0 hidden sm:block">{it.who}</span>
                      <ChevronDown className={cn('w-4 h-4 text-slate-400 shrink-0 transition-transform', open && 'rotate-180')} />
                    </button>
                    {open && (
                      <div className="px-4 pb-3 pl-[46px] space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        <p>
                          <span className="font-medium text-slate-800 dark:text-slate-100">Vì sao: </span>
                          {it.why}
                        </p>
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-100">Các bước</div>
                          <ol className="mt-1 list-decimal pl-4 space-y-0.5">
                            {it.steps.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ol>
                        </div>
                        {it.note && (
                          <p className="rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5">
                            {it.note}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
