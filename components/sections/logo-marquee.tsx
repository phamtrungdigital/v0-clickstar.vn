'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import type { LogoMarqueeContent, ClientLogoItem } from '@/lib/cms/types'

/**
 * Khối "Technology & AI we integrate" (18/10/2026): nền tối, hai hàng thẻ logo màu thương hiệu
 * trôi ngược chiều nhau, dừng khi rê chuột, hiện dần khi cuộn tới, số đếm chạy lên.
 * Màu mỗi thẻ là màu nhận diện của chính hãng (Claude cam, Supabase lục, YouTube đỏ...), đây là
 * ngoại lệ có chủ đích so với bảng "một màu xanh" của site vì đó là logo của bên thứ ba.
 * Tôn trọng prefers-reduced-motion: tắt trôi, thẻ xếp lưới đứng yên. Không có logo thì không render.
 * Mọi trường CMS (eyebrow, sub, showNames, strips) vẫn sửa được như cũ.
 */

const BRAND: Record<string, string> = {
  google: '#4285F4',
  googleads: '#4285F4',
  googleanalytics: '#E37400',
  meta: '#0866FF',
  instagram: '#E4405F',
  tiktok: '#FE2C55',
  zalo: '#0068FF',
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  wordpress: '#21759B',
  supabase: '#3ECF8E',
  vercel: '#1d1d1f',
  nextdotjs: '#1d1d1f',
  n8n: '#EA4B71',
  huggingface: '#FFB000',
  openai: '#10A37F',
  claude: '#D97757',
  gemini: '#8E75B2',
  grok: '#1d1d1f',
  deepseek: '#4D6BFE',
  mistral: '#FA520F',
  qwen: '#615CED',
  elevenlabs: '#1d1d1f',
  midjourney: '#1d1d1f',
  runway: '#1d1d1f',
}

const brandOf = (logo: string) => BRAND[logo.split('/').pop()?.replace(/\.\w+$/, '') ?? ''] ?? '#1e6dda'

/** Suy ra tiêu đề hàng từ thư mục chứa logo (CMS chưa có trường tiêu đề hàng) */
function inferTitle(items: ClientLogoItem[], t: (vi: string, en: string) => string): string {
  const ai = items.filter((i) => i.logo.includes('/ai-tools/')).length
  return ai >= items.length / 2
    ? t('Mô hình và công cụ AI', 'AI models and tools')
    : t('Nền tảng và hạ tầng', 'Platforms and infrastructure')
}

/** Báo true khi phần tử vào khung nhìn (một lần) */
function useInView<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen] as const
}

/** Số đếm chạy từ 0 đến `to` khi `run` bật; không chạy khi người dùng giảm chuyển động */
function useCountUp(to: number, run: boolean) {
  const [v, setV] = useState(to)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const t0 = performance.now()
    const dur = 1400
    setV(0)
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return v
}

const CSS = `
@keyframes cs-tech-l { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }
@keyframes cs-tech-r { from { transform: translate3d(-50%,0,0) } to { transform: translate3d(0,0,0) } }
.cs-tech-track { display: flex; width: max-content; will-change: transform; animation: var(--cs-anim) }
.cs-tech-row:hover .cs-tech-track, .cs-tech-row:focus-within .cs-tech-track { animation-play-state: paused }
@media (prefers-reduced-motion: reduce) {
  .cs-tech-track { animation: none; width: 100%; transform: none; justify-content: center }
  .cs-tech-track > div { flex-wrap: wrap; justify-content: center; row-gap: 12px; flex-shrink: 1 }
  .cs-tech-dup { display: none !important }
  .cs-tech-row { -webkit-mask-image: none !important; mask-image: none !important }
}
`

export function LogoMarquee({ content }: { content: LogoMarqueeContent }) {
  const { t } = useLanguage()
  const [ref, seen] = useInView<HTMLElement>()

  const strips = (content.strips ?? [])
    .map((s) => ({ items: (s.items ?? []).filter((i) => i.logo) }))
    .filter((s) => s.items.length > 0)

  const total = strips.reduce((n, s) => n + s.items.length, 0)
  const counted = useCountUp(total, seen)
  if (strips.length === 0) return null

  const showNames = content.showNames ?? true
  const sub = content.sub?.vi ? t(content.sub.vi, content.sub.en) : ''
  const m = sub.match(/^\s*(\d+)\s+([\s\S]*)$/)
  const subRest = m ? m[2] : sub

  const reveal = (delay: number) =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${seen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'}`
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` })

  return (
    <section
      ref={ref}
      data-cms-section="logo_marquee"
      className="bg-[#272729] text-white overflow-hidden"
      style={{ paddingBlock: 'clamp(56px, 8vw, 96px)' }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {content.eyebrow?.vi && (
          <p
            data-cms-field="eyebrow"
            className={reveal(0)}
            // style nội tuyến vì globals.css có luật ép mọi nhãn data-cms-field=eyebrow về chữ xám thường
            style={{ color: '#7db8ff', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 0 }}
          >
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
        )}
        <div className={`mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-5 ${reveal(0)}`} style={delay(120)}>
          {m && (
            <span className="text-[56px] sm:text-[72px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-white" aria-label={m[1]}>
              {counted}
            </span>
          )}
          {subRest && (
            <p data-cms-field="sub" className="max-w-[28ch] text-lg sm:text-xl leading-snug text-[#d2d2d7] sm:text-left">
              {subRest}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 sm:mt-12 flex flex-col gap-7">
        {strips.map((strip, si) => (
          <div key={si} className={reveal(0)} style={delay(260 + si * 160)}>
            <p className="mb-3 text-center text-[12.5px] font-medium uppercase tracking-[0.12em] text-[#a1a1a6]">
              {inferTitle(strip.items, t)}
            </p>
            <MarqueeRow items={strip.items} showNames={showNames} reverse={si % 2 === 1} seconds={si % 2 === 1 ? 46 : 56} />
          </div>
        ))}
      </div>

      {/* Người dùng đọc màn hình chỉ nghe một danh sách, không nghe lặp lại */}
      <ul className="sr-only">
        {strips.flatMap((s) => s.items).map((it, i) => (
          <li key={i}>{(t(it.name?.vi ?? '', it.name?.en ?? '') || it.name?.vi) ?? ''}</li>
        ))}
      </ul>
    </section>
  )
}

function MarqueeRow({ items, showNames, reverse, seconds }: { items: ClientLogoItem[]; showNames: boolean; reverse: boolean; seconds: number }) {
  // Một nửa vòng = danh sách lặp 2 lần để đủ dài hơn khung nhìn; vòng đủ = 2 nửa giống hệt nhau.
  const half = [...items, ...items]
  const style = {
    ['--cs-anim' as string]: `${reverse ? 'cs-tech-r' : 'cs-tech-l'} ${seconds}s linear infinite`,
    WebkitMaskImage: 'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)',
    maskImage: 'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)',
  } as React.CSSProperties
  return (
    <div className="cs-tech-row overflow-hidden py-1.5" style={style} aria-hidden>
      <div className="cs-tech-track">
        {[0, 1].map((copy) => (
          <div key={copy} className={`flex shrink-0 ${copy === 1 ? 'cs-tech-dup' : ''}`}>
            {half.map((item, idx) => (
              <LogoChip key={`${copy}-${idx}`} item={item} showName={showNames} dup={idx >= items.length} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function LogoChip({ item, showName, dup = false }: { item: ClientLogoItem; showName: boolean; dup?: boolean }) {
  const { language } = useLanguage()
  const name = (language === 'en' ? item.name?.en : item.name?.vi) || item.name?.vi || ''
  const brand = brandOf(item.logo)
  const [wide, setWide] = useState(false)

  const body = (
    <span
      className={`${dup ? 'cs-tech-dup ' : ''}group relative mr-3 sm:mr-4 inline-flex shrink-0 items-center gap-3 overflow-hidden rounded-[14px] bg-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-[color-mix(in_srgb,var(--b)_9%,white)] hover:shadow-[0_0_0_2px_var(--b)]`}
      style={{ ['--b' as string]: brand } as React.CSSProperties}
    >
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: brand }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.logo}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          const el = e.currentTarget
          if (el.naturalWidth / Math.max(1, el.naturalHeight) > 2.2) setWide(true)
        }}
        className={wide ? 'h-5 w-auto max-w-[110px]' : 'h-7 w-7 object-contain'}
      />
      {showName && !wide && <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.016em] text-[#1d1d1f]">{name}</span>}
    </span>
  )

  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" title={name} tabIndex={-1}>
      {body}
    </a>
  ) : (
    body
  )
}
