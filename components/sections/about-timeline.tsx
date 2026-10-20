'use client'

import { Rocket } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useInView } from '@/lib/hooks/use-reveal'
import type { AboutTimelineContent } from '@/lib/cms/types'
import { splitTimeline, type TimelineEntry } from '@/lib/cms/timeline'

/**
 * "Cột mốc quan trọng" kiểu lộ trình công nghệ (20/10/2026): đường ray phát sáng chạy ngang, mỗi mốc là một nút trên ray
 * và một thẻ kính có số thứ tự. Mốc "Hiện nay" (mốc đã qua cuối cùng) có nút nhấp nháy; mốc định hướng (năm lớn hơn năm nay)
 * nét đứt, mờ hơn. Điện thoại: ray dọc bên trái. Mô tả có dạng "2026: ... 2027: ... 2030: ..." tự tách thành danh sách theo năm.
 * Dữ liệu vẫn là các mốc năm + tiêu đề + mô tả trong CMS. Tôn trọng prefers-reduced-motion.
 */

/** Tách mô tả "2026: a. 2027: b." thành từng dòng theo năm; không có dạng đó thì trả null */
function parseSteps(text: string): { y: string; t: string }[] | null {
  const parts = text.split(/\s+(?=20\d{2}:\s)/)
  if (parts.length < 2) return null
  return parts.map((p) => {
    const m = p.match(/^(20\d{2}):\s*([\s\S]*)$/)
    return m ? { y: m[1], t: m[2] } : { y: '', t: p }
  })
}

function Milestone({
  m,
  order,
  now,
  future,
  seen,
}: {
  m: TimelineEntry
  order: number
  now: boolean
  future: boolean
  seen: boolean
}) {
  const { t } = useLanguage()
  const desc = t(m.description.vi, m.description.en)
  const steps = parseSteps(desc)

  const node = future
    ? 'border border-dashed border-white/40 bg-[#1d1d1f]'
    : now
      ? 'bg-[#7db8ff] shadow-[0_0_0_4px_rgba(125,184,255,0.25),0_0_18px_rgba(125,184,255,0.9)]'
      : 'bg-[#1e6dda] shadow-[0_0_0_4px_rgba(30,109,218,0.28),0_0_12px_rgba(30,109,218,0.7)]'

  return (
    <div
      data-cms-field="item"
      data-cms-item-index={m.index}
      className={`relative pl-10 transition-all duration-700 ease-out motion-reduce:transition-none lg:pl-0 lg:pt-11 ${
        seen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
      }`}
      style={{ transitionDelay: `${180 + order * 140}ms` }}
    >
      {/* Nút trên ray */}
      <span aria-hidden="true" className="absolute left-0 top-[22px] lg:top-0">
        {now && <span className="absolute inset-0 animate-ping rounded-full bg-[#7db8ff]/60 motion-reduce:hidden" />}
        <span className={`relative block h-4 w-4 rounded-full ${node}`} />
      </span>
      {/* Cọng nối nút với thẻ (máy tính) */}
      <span aria-hidden="true" className={`absolute left-[7px] top-4 hidden h-7 w-px lg:block ${future ? 'bg-white/15' : 'bg-gradient-to-b from-[#1e6dda] to-white/10'}`} />

      <div
        className={`group relative h-full overflow-hidden rounded-2xl p-6 text-left transition-colors duration-300 lg:p-7 ${
          future
            ? 'border border-dashed border-white/20 bg-white/[0.02]'
            : now
              ? 'border border-[#7db8ff]/50 bg-gradient-to-b from-[#1e6dda]/20 to-white/[0.04] shadow-[0_0_40px_-12px_rgba(30,109,218,0.8)]'
              : 'border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] hover:border-[#7db8ff]/40'
        }`}
      >
        {/* Vạch sáng phía trên thẻ */}
        {!future && (
          <span
            aria-hidden="true"
            className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#7db8ff]/70 to-transparent"
          />
        )}

        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-[0.18em] text-[#7db8ff]/80 tabular-nums">
            {String(order + 1).padStart(2, '0')}
          </span>
          {now && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e6dda] px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" />
              {t('Hiện nay', 'Now')}
            </span>
          )}
        </div>

        <p
          className={`font-semibold leading-none tracking-[-0.03em] tabular-nums ${future ? 'text-white/55' : 'bg-gradient-to-br from-white via-white to-[#7db8ff] bg-clip-text text-transparent'}`}
          style={{ fontSize: 'clamp(30px, 3.3vw, 44px)' }}
        >
          {m.year}
        </p>

        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.01em] text-white">{t(m.title.vi, m.title.en)}</h3>

        {steps ? (
          <ul className="m-0 mt-4 list-none space-y-3 p-0">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-white/70">
                {s.y && <span className="mt-0.5 shrink-0 text-[13px] font-semibold tabular-nums text-[#7db8ff]">{s.y}</span>}
                <span>{s.t}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-white/70">{desc}</p>
        )}
      </div>
    </div>
  )
}

export function AboutTimelineSection({ content }: { content: AboutTimelineContent }) {
  const { t } = useLanguage()
  const [ref, seen] = useInView<HTMLElement>(0.12)
  const { past, future } = splitTimeline(content.items)
  const all = [...past.map((m) => ({ m, future: false })), ...future.map((m) => ({ m, future: true }))]
  const cols = all.length >= 4 ? 'lg:grid-cols-4' : all.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'

  return (
    <section
      ref={ref}
      data-cms-section="about_timeline"
      className="relative isolate overflow-hidden bg-[#0b0d12] py-20 text-white lg:py-28"
    >
      {/* Nền lưới mờ và quầng sáng xanh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 50% 0%, rgba(30,109,218,0.28), rgba(30,109,218,0) 70%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 44px 44px, 44px 44px',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
          <span
            data-cms-field="eyebrow"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
          >
            <Rocket className="h-4 w-4 text-[#7db8ff]" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2 data-cms-field="heading" className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-[#7db8ff]">{t(content.heading_highlight.vi, content.heading_highlight.en)}</span>
          </h2>
        </div>

        <div className={`relative grid grid-cols-1 gap-6 lg:gap-5 ${cols}`}>
          {/* Ray dọc (điện thoại) */}
          <span aria-hidden="true" className="absolute bottom-4 left-[7px] top-6 w-0.5 rounded-full bg-white/10 lg:hidden">
            <span
              className={`block h-full w-full origin-top rounded-full bg-gradient-to-b from-[#1e6dda] to-[#7db8ff] transition-transform duration-[1600ms] ease-out motion-reduce:transition-none ${
                seen ? 'scale-y-100' : 'scale-y-0 motion-reduce:scale-y-100'
              }`}
            />
          </span>
          {/* Ray ngang (máy tính), vẽ dần từ trái sang khi vào khung nhìn */}
          <span aria-hidden="true" className="absolute left-2 right-2 top-[7px] hidden h-0.5 rounded-full bg-white/10 lg:block">
            <span
              className={`block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#1e6dda] via-[#7db8ff] to-[#1e6dda]/30 shadow-[0_0_14px_rgba(125,184,255,0.7)] transition-transform duration-[1800ms] ease-out motion-reduce:transition-none ${
                seen ? 'scale-x-100' : 'scale-x-0 motion-reduce:scale-x-100'
              }`}
            />
          </span>

          {all.map(({ m, future: isFuture }, i) => (
            <Milestone key={m.index} m={m} order={i} now={!isFuture && i === past.length - 1} future={isFuture} seen={seen} />
          ))}
        </div>
      </div>
    </section>
  )
}
