'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import type { LogoMarqueeContent, ClientLogoItem } from '@/lib/cms/types'

/**
 * Dải logo theo mockup Apple: hàng logo tĩnh, màu xám, CÓ TÊN bên cạnh (bài học vụ không nhận ra
 * logo Claude). Thay cho dải tự trôi trước đây. Mỗi "strip" trong CMS là một hàng, xuống dòng khi hẹp.
 * Không có logo nào thì không render, không để khối trống.
 */
export function LogoMarquee({ content }: { content: LogoMarqueeContent }) {
  const { t } = useLanguage()

  const strips = (content.strips ?? [])
    .map((s) => ({ items: (s.items ?? []).filter((i) => i.logo) }))
    .filter((s) => s.items.length > 0)
  if (strips.length === 0) return null

  const showNames = content.showNames ?? true

  return (
    <section data-cms-section="logo_marquee" className="ap-tile ap-light" style={{ paddingBlock: 'clamp(40px, 6vw, 64px)' }}>
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        {content.eyebrow?.vi && (
          <p data-cms-field="eyebrow" className="text-sm text-muted-foreground tracking-[-0.016em]">
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
        )}
        {content.sub?.vi && (
          <p data-cms-field="sub" className="text-sm text-muted-foreground mt-1">
            {t(content.sub.vi, content.sub.en)}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-6">
          {strips.map((strip, si) => (
            <ul key={si} className="m-0 p-0 list-none flex flex-wrap justify-center gap-x-9 gap-y-5">
              {strip.items.map((item, idx) => (
                <li key={idx}>
                  <LogoItem item={item} showName={showNames} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

function LogoItem({ item, showName }: { item: ClientLogoItem; showName: boolean }) {
  const { language } = useLanguage()
  const name = (language === 'en' ? item.name?.en : item.name?.vi) || item.name?.vi || ''

  const inner = (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative block w-7 h-7 shrink-0">
        <Image
          src={item.logo}
          alt=""
          fill
          quality={95}
          sizes="28px"
          className="object-contain grayscale opacity-60"
        />
      </span>
      {showName && <span className="text-sm text-[#515154] tracking-[-0.016em] whitespace-nowrap">{name}</span>}
    </span>
  )

  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" title={name}>
      {inner}
    </a>
  ) : (
    inner
  )
}
