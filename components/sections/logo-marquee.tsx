'use client'

import { useState } from 'react'
import { useInView, useCountUp } from '@/lib/hooks/use-reveal'
import { useLanguage } from '@/contexts/language-context'
import type { LogoMarqueeContent, ClientLogoItem } from '@/lib/cms/types'

/**
 * Khối "Technology & AI we integrate" (18/10/2026, phương án B do anh chọn):
 * Máy tính: Click Star ở giữa, mô hình AI ở vòng trong, kênh và hạ tầng ở vòng ngoài, hai vòng quay
 * ngược chiều rất chậm, thẻ luôn thẳng đứng, rê chuột thì dừng.
 * Điện thoại và máy tính bảng (dưới 1024px): lưới thẻ màu thương hiệu, hiện dần lần lượt.
 * Màu thẻ là màu nhận diện của chính hãng (ngoại lệ có chủ đích so với bảng "một màu xanh" của site).
 * Tôn trọng prefers-reduced-motion: vòng đứng yên, số không đếm. Không có logo thì không render.
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
  vercel: '#9a9aa0',
  nextdotjs: '#9a9aa0',
  huggingface: '#FFB000',
  openai: '#10A37F',
  claude: '#D97757',
  gemini: '#8E75B2',
  grok: '#9a9aa0',
  deepseek: '#4D6BFE',
  mistral: '#FA520F',
  qwen: '#615CED',
  elevenlabs: '#9a9aa0',
  midjourney: '#9a9aa0',
  runway: '#9a9aa0',
}
/** Logo đen thuần: trên nền tối phải đổi sang trắng mới nhìn thấy */
const BLACK_LOGO = new Set(['vercel', 'nextdotjs', 'grok', 'elevenlabs', 'midjourney', 'runway', 'tiktok', 'openai'])

/** Logo dạng chữ dài (SVG không có kích thước gốc nên không đo được tỉ lệ): thu nhỏ vừa thẻ, bỏ tên lặp */
const WIDE_LOGO = new Set(['openai'])

const slug = (logo: string) => logo.split('/').pop()?.replace(/\.\w+$/, '') ?? ''
const brandOf = (logo: string) => BRAND[slug(logo)] ?? '#1e6dda'
const isAi = (it: ClientLogoItem) => it.logo.includes('/ai-tools/')

type T = (vi: string, en: string) => string

function categoryOf(it: ClientLogoItem, t: T) {
  if (it.logo.includes('/ai-tools/')) return t('Mô hình AI', 'AI model')
  if (it.logo.includes('/ai-core/')) return t('Hạ tầng', 'Infrastructure')
  return t('Kênh', 'Channel')
}

const CSS = `
@keyframes cs-spin { to { transform: rotate(360deg) } }
@keyframes cs-ping { from { transform: scale(1); opacity: .7 } to { transform: scale(2.2); opacity: 0 } }
@keyframes cs-rise { from { opacity: 0; transform: translateY(18px) scale(.97) } to { opacity: 1; transform: none } }
.cs-ring { position: absolute; left: 50%; top: 50%; translate: -50% -50%; border-radius: 50%; animation: cs-spin var(--s) linear infinite; animation-direction: var(--d) }
.cs-node { position: absolute; left: 50%; top: 50%; width: 0; height: 0 }
.cs-node-in { position: absolute; left: 0; top: 0; width: max-content; translate: -50% -50%; animation: cs-spin var(--s) linear infinite; animation-direction: var(--dr) }
.cs-orbit:hover .cs-ring, .cs-orbit:hover .cs-node-in { animation-play-state: paused }
.cs-pulse { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #1e6dda; animation: cs-ping 3.2s ease-out infinite }
.cs-tile { opacity: 0 }
.cs-in .cs-tile { animation: cs-rise .65s cubic-bezier(.2,.8,.2,1) forwards; animation-delay: calc(var(--i) * 45ms) }
@media (prefers-reduced-motion: reduce) {
  .cs-ring, .cs-node-in, .cs-pulse { animation: none }
  .cs-tile { opacity: 1; animation: none !important }
}
`

export function LogoMarquee({ content }: { content: LogoMarqueeContent }) {
  const { t } = useLanguage()
  const [ref, seen] = useInView<HTMLElement>()

  const items = (content.strips ?? []).flatMap((s) => (s.items ?? []).filter((i) => i.logo))
  const counted = useCountUp(items.length, seen)
  if (items.length === 0) return null

  const inner = items.filter(isAi)
  const outer = items.filter((i) => !isAi(i))
  const showNames = content.showNames ?? true
  const sub = content.sub?.vi ? t(content.sub.vi, content.sub.en) : ''
  const m = sub.match(/^\s*(\d+)\s+([\s\S]*)$/)
  const subRest = m ? m[2] : sub

  const reveal = `transition-all duration-700 ease-out motion-reduce:transition-none ${
    seen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
  }`

  return (
    <section
      ref={ref}
      data-cms-section="logo_marquee"
      className={`bg-[#272729] text-white overflow-hidden ${seen ? 'cs-in' : ''}`}
      style={{ paddingBlock: 'clamp(56px, 8vw, 96px)' }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {content.eyebrow?.vi && (
          <p
            data-cms-field="eyebrow"
            className={reveal}
            // style nội tuyến vì globals.css có luật ép mọi nhãn data-cms-field=eyebrow về chữ xám thường
            style={{ color: '#7db8ff', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 0 }}
          >
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
        )}
        <div className={`mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-5 ${reveal}`} style={{ transitionDelay: '120ms' }}>
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

      {/* Máy tính: quỹ đạo */}
      <div className={`hidden lg:block ${reveal}`} style={{ transitionDelay: '260ms' }} aria-hidden>
        <div className="cs-orbit relative mx-auto mt-2" style={{ height: 720, maxWidth: 1080 }}>
          <div className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-[#4a4a4f]" style={{ width: 340, height: 340, translate: '-50% -50%' }} />
          <div className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-[#4a4a4f]" style={{ width: 600, height: 600, translate: '-50% -50%' }} />
          {outer.length > 0 && <Ring items={outer} radius={300} seconds={110} reverse showNames={showNames} />}
          {inner.length > 0 && <Ring items={inner} radius={170} seconds={70} showNames={showNames} />}
          <div className="absolute left-1/2 top-1/2 z-[3]" style={{ width: 150, height: 150, translate: '-50% -50%' }}>
            <span className="cs-pulse" />
            <span className="cs-pulse" style={{ animationDelay: '1.6s' }} />
            <div className="relative z-[2] grid h-full w-full place-content-center rounded-full bg-[#1e6dda] text-center">
              <span className="text-[20px] font-semibold tracking-[-0.02em]">Click Star</span>
              <span className="mt-0.5 text-[12px] text-white">{t('một hệ thống', 'one system')}</span>
            </div>
          </div>
          <p className="absolute bottom-6 left-2 text-sm text-[#d2d2d7]">
            <b className="mr-1 text-[28px] font-semibold text-white">{inner.length}</b>
            {t('mô hình AI', 'AI models')}
          </p>
          <p className="absolute bottom-6 right-2 text-sm text-[#d2d2d7]">
            <b className="mr-1 text-[28px] font-semibold text-white">{outer.length}</b>
            {t('kênh và hạ tầng', 'channels and infrastructure')}
          </p>
        </div>
      </div>

      {/* Điện thoại, máy tính bảng: lưới thẻ */}
      <div className="lg:hidden max-w-[760px] mx-auto px-4 sm:px-6 mt-10">
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
          {items.map((it, i) => (
            <li key={i} className="cs-tile" style={{ ['--i' as string]: i } as React.CSSProperties}>
              <Tile item={it} />
            </li>
          ))}
        </ul>
      </div>

      {/* Người dùng đọc màn hình chỉ nghe một danh sách */}
      <ul className="sr-only">
        {items.map((it, i) => (
          <li key={i}>{(t(it.name?.vi ?? '', it.name?.en ?? '') || it.name?.vi) ?? ''}</li>
        ))}
      </ul>
    </section>
  )
}

function Ring({ items, radius, seconds, reverse = false, showNames }: { items: ClientLogoItem[]; radius: number; seconds: number; reverse?: boolean; showNames: boolean }) {
  const n = items.length
  const style = {
    width: radius * 2,
    height: radius * 2,
    ['--s' as string]: `${seconds}s`,
    ['--d' as string]: reverse ? 'reverse' : 'normal',
    ['--dr' as string]: reverse ? 'normal' : 'reverse',
  } as React.CSSProperties
  return (
    <div className="cs-ring" style={style}>
      {items.map((it, i) => {
        const ang = (360 / n) * i
        return (
          <div key={i} className="cs-node" style={{ transform: `rotate(${ang}deg) translateY(-${radius}px)` }}>
            {/* rotate: bù góc đặt tĩnh; animation cs-spin ngược chiều bù góc quay của vòng → thẻ luôn thẳng */}
            <div className="cs-node-in" style={{ rotate: `${-ang}deg` }}>
              <OrbitChip item={it} showName={showNames} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function nameOf(item: ClientLogoItem, language: string) {
  return (language === 'en' ? item.name?.en : item.name?.vi) || item.name?.vi || ''
}

/** Thẻ trắng trên quỹ đạo: logo đúng màu hãng + tên */
function OrbitChip({ item, showName }: { item: ClientLogoItem; showName: boolean }) {
  const { language } = useLanguage()
  const name = nameOf(item, language)
  const brand = brandOf(item.logo)
  const [wide, setWide] = useState(WIDE_LOGO.has(slug(item.logo)))
  return (
    <span
      className="flex items-center gap-2.5 whitespace-nowrap rounded-[14px] bg-white py-2.5 pl-3 pr-3.5 text-[#1d1d1f]"
      style={{ boxShadow: `0 0 0 1.5px ${brand}99` }}
      title={name}
    >
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
        className={wide ? 'h-[18px] w-auto max-w-[92px]' : 'h-7 w-7 object-contain'}
      />
      {showName && !wide && <span className="text-[15px] font-semibold tracking-[-0.01em]">{name}</span>}
    </span>
  )
}

/** Thẻ tối cho điện thoại: nền pha màu hãng, logo trắng nếu là logo đen */
function Tile({ item }: { item: ClientLogoItem }) {
  const { t, language } = useLanguage()
  const name = nameOf(item, language)
  const brand = brandOf(item.logo)
  const white = BLACK_LOGO.has(slug(item.logo))
  const [wide, setWide] = useState(WIDE_LOGO.has(slug(item.logo)))
  return (
    <span
      className="flex h-full min-h-[104px] flex-col justify-between rounded-[16px] p-4 text-left"
      style={{
        background: `color-mix(in srgb, ${brand} 16%, #1d1d1f)`,
        border: `1px solid color-mix(in srgb, ${brand} 38%, transparent)`,
      }}
    >
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
        className={wide ? 'h-5 w-auto max-w-[96px]' : 'h-8 w-8 object-contain'}
        style={white ? { filter: 'brightness(0) invert(1)' } : undefined}
      />
      <span>
        {!wide && <span className="block text-[15px] font-semibold leading-tight text-white">{name}</span>}
        <span className="mt-0.5 block text-[12px] text-[#b0b0b6]">{categoryOf(item, t)}</span>
      </span>
    </span>
  )
}
