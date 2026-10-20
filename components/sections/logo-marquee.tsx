'use client'

import { useState } from 'react'
import { useInView, useCountUp } from '@/lib/hooks/use-reveal'
import { useLanguage } from '@/contexts/language-context'
import type { LogoMarqueeContent, ClientLogoItem } from '@/lib/cms/types'

/**
 * Khối "Technology & AI we integrate" (20/10/2026, phương án "Quỹ đạo tinh gọn" do anh chọn):
 * Máy tính: chữ và số "17" ở bên trái kèm chú giải hai vòng; bên phải là quỹ đạo: Click Star ở giữa,
 * mô hình AI ở vòng trong, kênh và hạ tầng ở vòng ngoài. Mỗi công nghệ là một huy hiệu tròn chỉ có logo
 * (tên hiện khi rê chuột, người đọc màn hình nghe danh sách đầy đủ), phát sáng theo màu hãng; hai vòng quay
 * ngược chiều rất chậm, huy hiệu luôn thẳng đứng, rê chuột thì dừng.
 * Điện thoại và máy tính bảng (dưới 1024px): lưới thẻ màu thương hiệu, hiện dần lần lượt.
 * Màu thẻ là màu nhận diện của chính hãng (ngoại lệ có chủ đích so với bảng "một màu xanh" của site).
 * Tôn trọng prefers-reduced-motion: vòng đứng yên, số không đếm. Không có logo thì không render.
 * Mọi trường CMS (eyebrow, sub, strips) vẫn sửa được như cũ; cờ showNames chỉ còn tác dụng ở lưới thẻ điện thoại.
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
  const { t, language } = useLanguage()
  const [ref, seen] = useInView<HTMLElement>()

  const items = (content.strips ?? []).flatMap((s) => (s.items ?? []).filter((i) => i.logo))
  const counted = useCountUp(items.length, seen)
  if (items.length === 0) return null

  const inner = items.filter(isAi)
  const outer = items.filter((i) => !isAi(i))
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

      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center lg:gap-8">
          {/* Chữ: giữa trang ở điện thoại, bên trái ở máy tính */}
          <div className="text-center lg:text-left">
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
            <div
              className={`mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-5 lg:flex-col lg:items-start lg:justify-start lg:gap-3 ${reveal}`}
              style={{ transitionDelay: '120ms' }}
            >
              {m && (
                <span className="text-[56px] sm:text-[72px] lg:text-[128px] font-semibold leading-[0.9] tracking-[-0.045em] tabular-nums text-white" aria-label={m[1]}>
                  {counted}
                </span>
              )}
              {subRest && (
                <p data-cms-field="sub" className="max-w-[28ch] text-lg sm:text-xl lg:text-[30px] lg:font-semibold leading-[1.2] lg:tracking-[-0.02em] text-[#d2d2d7] lg:text-white sm:text-left">
                  {subRest}
                </p>
              )}
            </div>
            <div className={`mt-9 hidden border-t border-white/10 pt-7 lg:block ${reveal}`} style={{ transitionDelay: '200ms' }} aria-hidden>
              <GroupRow count={outer.length} dot="#7db8ff" title={t('Kênh và hạ tầng', 'Channels and infrastructure')} items={outer} language={language} />
              <GroupRow count={inner.length} dot="#D97757" title={t('Mô hình AI', 'AI models')} items={inner} language={language} className="mt-6" />
            </div>
          </div>

          {/* Máy tính: quỹ đạo tinh gọn */}
          <div className={`hidden lg:block ${reveal}`} style={{ transitionDelay: '260ms' }} aria-hidden>
            <div className="cs-orbit relative mx-auto" style={{ width: 500, height: 500 }}>
              <div className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/15" style={{ width: 280, height: 280, translate: '-50% -50%' }} />
              <div className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/15" style={{ width: 460, height: 460, translate: '-50% -50%' }} />
              {outer.length > 0 && <Ring items={outer} radius={230} seconds={110} reverse />}
              {inner.length > 0 && <Ring items={inner} radius={140} seconds={70} />}
              <div className="absolute left-1/2 top-1/2 z-[3]" style={{ width: 118, height: 118, translate: '-50% -50%' }}>
                <span className="cs-pulse" />
                <span className="cs-pulse" style={{ animationDelay: '1.6s' }} />
                <div
                  className="relative z-[2] grid h-full w-full place-content-center rounded-full text-center"
                  style={{ background: 'radial-gradient(circle at 30% 25%, #3b8bf0, #144c97)', boxShadow: '0 0 0 8px rgba(30,109,218,.15), 0 0 48px rgba(30,109,218,.55)' }}
                >
                  <span className="text-[18px] font-semibold tracking-[-0.02em]">Click Star</span>
                  <span className="mt-0.5 text-[11px] text-[#cfe1fb]">{t('một hệ thống', 'one system')}</span>
                </div>
              </div>
            </div>
          </div>
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

/** Một nhóm công nghệ ở cột chữ: số lớn, tên nhóm, vài tên tiêu biểu (chấm màu khớp màu vòng trên quỹ đạo) */
function GroupRow({ count, dot, title, items, language, className = '' }: { count: number; dot: string; title: string; items: ClientLogoItem[]; language: string; className?: string }) {
  const shown = items.slice(0, 4).map((it) => nameOf(it, language)).filter(Boolean)
  const more = items.length - shown.length
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <span className="w-[72px] text-[52px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-white">{String(count).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 text-[20px] font-semibold leading-tight tracking-[-0.01em] text-white">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: dot, boxShadow: `0 0 12px ${dot}` }} />
          {title}
        </p>
        <p className="mt-1.5 text-[15px] leading-snug text-[#a1a1a6]">
          {shown.join(' · ')}
          {more > 0 && <span className="text-[#7db8ff]"> +{more}</span>}
        </p>
      </div>
    </div>
  )
}

function Ring({ items, radius, seconds, reverse = false }: { items: ClientLogoItem[]; radius: number; seconds: number; reverse?: boolean }) {
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
            {/* rotate: bù góc đặt tĩnh; animation cs-spin ngược chiều bù góc quay của vòng → huy hiệu luôn thẳng */}
            <div className="cs-node-in" style={{ rotate: `${-ang}deg` }}>
              <OrbitBadge item={it} small={isAi(it)} />
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

/** Huy hiệu tròn trên quỹ đạo: chỉ logo, nền pha màu hãng, viền và quầng sáng theo màu hãng (tên ở title khi rê chuột) */
function OrbitBadge({ item, small }: { item: ClientLogoItem; small: boolean }) {
  const { language } = useLanguage()
  const name = nameOf(item, language)
  const brand = brandOf(item.logo)
  const white = BLACK_LOGO.has(slug(item.logo))
  const [wide, setWide] = useState(WIDE_LOGO.has(slug(item.logo)))
  const size = small ? 46 : 54
  return (
    <span
      className="grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `color-mix(in srgb, ${brand} 20%, #1d1d20)`,
        border: `1px solid color-mix(in srgb, ${brand} 55%, transparent)`,
        boxShadow: `0 0 22px color-mix(in srgb, ${brand} 35%, transparent)`,
      }}
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
        className={wide ? 'h-auto w-[30px]' : small ? 'h-6 w-6 object-contain' : 'h-7 w-7 object-contain'}
        style={white ? { filter: 'brightness(0) invert(1)' } : undefined}
      />
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
