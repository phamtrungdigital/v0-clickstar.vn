'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import type { LogoMarqueeContent, ClientLogoItem } from '@/lib/cms/types'

/**
 * Dải logo tự trôi — bố cục P2 anh Trung duyệt 3/8/2026.
 * - Dải chẵn trôi TRÁI, dải lẻ trôi PHẢI (ngược chiều nhau).
 * - Rê chuột vào dải thì dừng để đọc; prefers-reduced-motion thì đứng yên hẳn.
 * - Mỗi dải render danh sách logo 2 LẦN trong 2 <ul> bề rộng hệt nhau rồi
 *   translateX(-50%) → vòng lặp không giật. KHÔNG dùng flex-gap trên track
 *   (lệch nửa gap tại điểm nối) — gap nằm TRONG mỗi <ul> qua pr-10.
 * - Logo CÓ TÊN hiển thị bên dưới (bài học vụ không nhận ra logo Claude).
 * - Không có logo nào → return null, không để dải trống.
 */

const KEYFRAMES = `
@keyframes lm-scroll { to { transform: translateX(-50%) } }
.lm-mask { -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.lm-mask:hover .lm-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .lm-track { animation: none !important } }
`

export function LogoMarquee({ content }: { content: LogoMarqueeContent }) {
  const { t } = useLanguage()

  const strips = (content.strips ?? [])
    .map((s) => ({ items: (s.items ?? []).filter((i) => i.logo) }))
    .filter((s) => s.items.length > 0)
  if (strips.length === 0) return null

  const showNames = content.showNames ?? true

  return (
    <section
      data-cms-section="logo_marquee"
      className="py-10 lg:py-14 bg-background border-y border-border overflow-hidden"
    >
      <style>{KEYFRAMES}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.eyebrow?.vi && (
          <p
            data-cms-field="eyebrow"
            className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2"
          >
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
        )}
        {content.sub?.vi && (
          <p data-cms-field="sub" className="text-center text-sm text-muted-foreground/80 mb-4">
            {t(content.sub.vi, content.sub.en)}
          </p>
        )}
      </div>

      <div className="space-y-1">
        {strips.map((strip, si) => (
          <Strip key={si} items={strip.items} reverse={si % 2 === 1} showNames={showNames} />
        ))}
      </div>
    </section>
  )
}

function Strip({
  items,
  reverse,
  showNames,
}: {
  items: ClientLogoItem[]
  reverse: boolean
  showNames: boolean
}) {
  // Ít logo thì trôi chậm lại cho khỏi chóng mặt; nhiều logo thì nhanh vừa
  const duration = Math.max(22, items.length * 3.2)

  const half = (
    <ul className="flex shrink-0 items-start [&>li]:pr-10 m-0 p-0 list-none">
      {items.map((item, idx) => (
        <li key={idx}>
          <LogoFigure item={item} showName={showNames} />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="lm-mask overflow-hidden">
      <div
        className="lm-track flex w-max py-3"
        style={{
          animation: `lm-scroll ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {half}
        {/* Bản sao chỉ để lấp vòng lặp — ẩn khỏi trình đọc màn hình */}
        <div aria-hidden>{half}</div>
      </div>
    </div>
  )
}

function LogoFigure({ item, showName }: { item: ClientLogoItem; showName: boolean }) {
  const { language } = useLanguage()
  const name = (language === 'en' ? item.name?.en : item.name?.vi) || item.name?.vi || ''

  const figure = (
    <figure className="w-24 flex flex-col items-center gap-1.5 group m-0">
      <span className="relative block h-10 sm:h-11 w-full transition-transform duration-300 group-hover:scale-110">
        <Image src={item.logo} alt={name} fill quality={95} sizes="96px" className="object-contain" />
      </span>
      {showName && (
        <figcaption className="text-[11px] font-medium text-muted-foreground leading-none whitespace-nowrap">
          {name}
        </figcaption>
      )}
    </figure>
  )

  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" title={name}>
      {figure}
    </a>
  ) : (
    figure
  )
}
