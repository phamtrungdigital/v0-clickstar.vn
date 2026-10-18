'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, X, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useInView, useCountUp } from '@/lib/hooks/use-reveal'
import type { AboutContent, AboutTimelineItem, I18n } from '@/lib/cms/types'
import { splitTimeline, type TimelineEntry } from '@/lib/cms/timeline'

/**
 * "About Us" trên trang chủ (18/10/2026, phương án A do anh chọn): nền tối, tiêu đề + mô tả từ CMS,
 * 3 con số đếm chạy, đường mốc 2014 đến nay vẽ dần, chip ngành nghề. Mốc và ngành lấy từ trang Giới thiệu
 * (truyền vào qua `timeline`, `industries`); thiếu thì ẩn phần đó.
 *
 * CHỖ SẴN CHO ẢNH THẬT VÀ VIDEO: không có ảnh stock nào được dựng nếu CMS chưa có dữ liệu thật.
 *  - `video_embed_url` có giá trị: hiện khung video 16:9 (poster = `thumbnail_src`), bấm mở bản đầy đủ.
 *  - `photos` có ít nhất 1 ảnh: hiện dải ảnh đội ngũ.
 * Cả hai trống thì khối chỉ gồm chữ, số, mốc. Tôn trọng prefers-reduced-motion.
 */

const CSS = `
@keyframes cs-draw { from { width: 0 } to { width: var(--to, 100%) } }
@keyframes cs-ping2 { from { transform: scale(1); opacity: .7 } to { transform: scale(2.1); opacity: 0 } }
.cs-line { width: 0 }
.cs-in .cs-line { animation: cs-draw 2.6s ease-out .3s forwards }
.cs-ping { position: absolute; inset: 0; border-radius: 9999px; border: 2px solid #1e6dda; animation: cs-ping2 2.6s ease-out infinite }
@media (prefers-reduced-motion: reduce) { .cs-line { width: var(--to, 100%) !important; animation: none !important } .cs-ping { animation: none } }
`

function parseStat(raw: string) {
  const m = raw.match(/^(\D*)(\d+(?:[.,]\d+)?)([\s\S]*)$/)
  return m ? { pre: m[1], num: Math.round(parseFloat(m[2].replace(',', '.'))), suf: m[3] } : null
}

function Counter({ value, run }: { value: string; run: boolean }) {
  const p = parseStat(value)
  const n = useCountUp(p?.num ?? 0, run)
  if (!p) return <>{value}</>
  return (
    <>
      {p.pre}
      {n}
      {p.suf}
    </>
  )
}

/** Một mốc: năm, tiêu đề, mô tả. `soft` là mốc định hướng (chữ nhạt hơn). */
function MilestoneItem({ it, now, soft }: { it: TimelineEntry; now?: boolean; soft?: boolean }) {
  const { t } = useLanguage()
  return (
    <li className="relative pt-0 xl:pt-9">
      <span
        className={`absolute left-0 top-0 hidden h-5 w-5 rounded-full border-2 xl:block ${
          soft
            ? 'border-dashed border-[#7d7d85] bg-[#272729]'
            : now
              ? 'border-[#7db8ff] bg-[#7db8ff] shadow-[0_0_0_6px_rgba(125,184,255,0.18)]'
              : 'border-[#7db8ff] bg-[#272729]'
        }`}
      />
      <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[28px] font-semibold leading-none tracking-[-0.03em] ${soft ? 'text-[#b0b0b6]' : 'text-white'}`}>
        {it.year}
        {now && (
          <span className="rounded-full bg-[#1e6dda] px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-[0.06em] text-white">
            {t('Hiện nay', 'Now')}
          </span>
        )}
      </p>
      <h3 className={`mt-2 text-[15px] font-semibold ${soft ? 'text-[#e5e5ea]' : 'text-white'}`}>{t(it.title.vi, it.title.en)}</h3>
      <p className="mt-1.5 text-[13.5px] leading-snug text-[#b0b0b6]">{t(it.description.vi, it.description.en)}</p>
    </li>
  )
}

function Milestones({ items, rise }: { items: AboutTimelineItem[]; rise: string }) {
  const { t } = useLanguage()
  const { past, future } = splitTimeline(items)
  const nowAt = past.length - 1
  // Vị trí cột thứ k trên lưới n cột cách nhau 16px: k * (100% + 16px) / n
  const col = (k: number, n: number) => `calc(${k} * (100% + 16px) / ${n})`
  return (
    <div className={`relative mt-14 lg:mt-20 ${rise}`} style={{ transitionDelay: '350ms' }}>
      {past.length > 0 && (
        <div className="relative">
          <div className="absolute left-0 right-0 top-[9px] hidden h-[2px] bg-[#4a4a4f] xl:block" />
          <div
            className="cs-line absolute left-0 top-[9px] hidden h-[2px] bg-[#7db8ff] xl:block"
            style={{ ['--to' as string]: nowAt > 0 ? `calc(${col(nowAt, past.length)} + 10px)` : '10px' } as React.CSSProperties}
          />
          <ol
            className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4 xl:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
            style={{ ['--n' as string]: past.length } as React.CSSProperties}
          >
            {past.map((it, i) => (
              <MilestoneItem key={it.index} it={it} now={i === nowAt} />
            ))}
          </ol>
        </div>
      )}

      {future.length > 0 && (
        <div className="relative mt-12 xl:mt-14">
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7db8ff]">
            {t('Định hướng', 'Direction')} {future[0].year}
            {future.length > 1 ? ` - ${future[future.length - 1].year}` : ''}
          </p>
          <div className="relative">
            <div className="absolute left-0 right-0 top-[9px] hidden border-t-2 border-dashed border-[#4a4a4f] xl:block" />
            <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
              {future.map((it) => (
                <MilestoneItem key={it.index} it={it} soft />
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export function AboutSection({
  content,
  timeline,
  industries,
}: {
  content: AboutContent
  timeline?: AboutTimelineItem[]
  industries?: I18n[]
}) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { t } = useLanguage()
  const [ref, seen] = useInView<HTMLElement>(0.2)

  const stats = [
    { v: content.stat1_value, l: content.stat1_label },
    { v: content.stat2_value, l: content.stat2_label },
    { v: content.stat3_value, l: content.stat3_label },
  ].filter((s) => s.v)
  const photos = (content.photos ?? []).filter((p) => p.src)
  const hasVideo = !!content.video_embed_url

  const rise = `transition-all duration-700 ease-out motion-reduce:transition-none ${
    seen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
  }`

  return (
    <>
      <section
        ref={ref}
        data-cms-section="about"
        className={`bg-[#272729] text-white ${seen ? 'cs-in' : ''}`}
        style={{ paddingBlock: 'clamp(64px, 9vw, 112px)' }}
      >
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className={rise}>
              <p
                data-cms-field="eyebrow"
                style={{ color: '#7db8ff', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 0 }}
              >
                {t(content.eyebrow.vi, content.eyebrow.en)}
              </p>
              <h2
                data-cms-field="heading"
                className="mt-3 text-[34px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.08] tracking-[-0.035em] text-white text-balance"
              >
                {t(content.heading_lead.vi, content.heading_lead.en)}
                <span className="text-[#7db8ff]">{t(content.heading_highlight.vi, content.heading_highlight.en)}</span>
              </h2>
              <p data-cms-field="description" className="mt-5 max-w-[56ch] text-lg leading-relaxed text-[#d2d2d7]">
                {t(content.description.vi, content.description.en)}
              </p>
              {content.cta_label?.vi && (
                <a
                  data-cms-field="cta"
                  href={content.cta_href}
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#1e6dda] px-7 py-3.5 text-[15px] font-semibold text-white transition-transform active:scale-95"
                >
                  {t(content.cta_label.vi, content.cta_label.en)}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              )}
            </div>

            <dl data-cms-field="stats" className={`grid grid-cols-3 gap-3 ${rise}`} style={{ transitionDelay: '150ms' }}>
              {stats.map((s, i) => (
                <div key={i} className="rounded-[18px] bg-[#1d1d1f] p-4 sm:p-5">
                  <dt className="text-[34px] sm:text-[42px] lg:text-[32px] xl:text-[42px] 2xl:text-[46px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-white">
                    <Counter value={s.v} run={seen} />
                  </dt>
                  <dd className="mt-2 text-[13px] leading-snug text-[#b0b0b6]">{t(s.l.vi, s.l.en)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Chỗ sẵn: video thật */}
          {hasVideo && (
            <div className={`mt-14 ${rise}`} style={{ transitionDelay: '250ms' }}>
              <button
                type="button"
                data-cms-field="video"
                onClick={() => setIsVideoOpen(true)}
                aria-label={t('Phát video giới thiệu', 'Play the introduction video')}
                className="group relative block aspect-video w-full overflow-hidden rounded-[24px] bg-[#1d1d1f] shadow-[rgba(0,0,0,0.4)_3px_5px_40px_0]"
              >
                {content.thumbnail_src && (
                  <Image
                    quality={90}
                    src={content.thumbnail_src}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1180px) 100vw, 1180px"
                  />
                )}
                <span className="absolute inset-0 bg-black/25" />
                <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
                  <span className="cs-ping" />
                  <span className="cs-ping" style={{ animationDelay: '1.3s' }} />
                  <span className="relative grid h-full w-full place-items-center rounded-full bg-[#1e6dda]">
                    <Play className="ml-1 h-9 w-9 fill-white text-white" />
                  </span>
                </span>
                {content.video_duration && (
                  <span className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-3 py-1 text-sm font-medium text-white">{content.video_duration}</span>
                )}
              </button>
            </div>
          )}

          {/* Chỗ sẵn: ảnh đội ngũ thật */}
          {photos.length > 0 && (
            <ul className={`m-0 mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 ${rise}`} style={{ transitionDelay: '300ms' }}>
              {photos.slice(0, 8).map((p, i) => (
                <li key={i} className={`relative overflow-hidden rounded-[18px] bg-[#1d1d1f] ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-[4/3]'}`}>
                  <Image quality={90} src={p.src} alt={p.alt ? t(p.alt.vi, p.alt.en) : ''} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                  {p.caption && (
                    <span className="absolute bottom-0 left-0 rounded-tr-xl bg-white/90 px-3 py-1.5 text-[12.5px] font-semibold text-[#1d1d1f]">
                      {t(p.caption.vi, p.caption.en)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Mốc phát triển: mốc đã qua có đường vẽ dần tới "Hiện nay", mốc định hướng nằm riêng bên dưới */}
          {timeline && timeline.length > 0 && <Milestones items={timeline} rise={rise} />}

          {industries && industries.length > 0 && (
            <ul className={`m-0 mt-10 flex list-none flex-wrap gap-2 p-0 ${rise}`} style={{ transitionDelay: '450ms' }}>
              {industries.map((x, i) => (
                <li key={i} className="rounded-full border border-[#4a4a4f] px-3.5 py-1.5 text-[13.5px] text-[#d2d2d7]">
                  {t(x.vi, x.en)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && hasVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 z-10 text-white transition-colors duration-200 hover:text-[#7db8ff]"
              aria-label={t('Đóng video', 'Close video')}
            >
              <X className="h-8 w-8" />
            </button>
            <iframe
              src={content.video_embed_url}
              title={t('Video giới thiệu Click Star', 'Click Star introduction video')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  )
}
