'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import type { TechPipelineContent, TechPipelineGroup, ClientLogoItem } from '@/lib/cms/types'

/**
 * Sơ đồ hệ sinh thái công nghệ — bố cục "pipeline khoa học" anh Trung duyệt
 * mockup 3/8/2026: các tầng xếp theo chiều dữ liệu chảy, giữa các tầng có
 * chấm xanh chảy xuống, tầng có `terminal` thì hiện khung code gõ từng dòng.
 *
 * LUẬT KHI SỬA (kế thừa từ client-logos):
 * 1. Không có group nào có logo → return null, không để dải trống.
 * 2. Class Tailwind viết NGUYÊN CHUỖI. Keyframes đặc thù (chấm chảy, fade dòng
 *    code) nằm trong <style> ngay trong section — tên prefix `tp-` tránh đụng.
 * 3. `name` ở đây HIỂN THỊ dưới logo (khác client_logos chỉ làm alt) — nhờ vậy
 *    ai không quen logo vẫn đọc được tên (bài học vụ không nhận ra Claude).
 */

const KEYFRAMES = `
@keyframes tp-drop { 0% { top: 0; opacity: 0 } 25% { opacity: 1 } 100% { top: 36px; opacity: 0 } }
@keyframes tp-fade { from { opacity: 0; transform: translateY(2px) } to { opacity: 1; transform: none } }
@keyframes tp-blink { 50% { opacity: 0 } }
`

export function TechPipeline({ content }: { content: TechPipelineContent }) {
  const { t } = useLanguage()

  // Bỏ item chưa chọn ảnh, bỏ group không còn logo nào
  const groups = (content.groups ?? [])
    .map((g) => ({ ...g, items: (g.items ?? []).filter((i) => i.logo) }))
    .filter((g) => g.items.length > 0)
  if (groups.length === 0) return null

  return (
    <section
      data-cms-section="tech_pipeline"
      className="py-12 lg:py-16 bg-background border-y border-border"
    >
      <style>{KEYFRAMES}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.eyebrow?.vi && (
          <p
            data-cms-field="eyebrow"
            className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2"
          >
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
        )}
        {content.sub?.vi && (
          <p data-cms-field="sub" className="text-center text-sm text-muted-foreground/80 mb-8">
            {t(content.sub.vi, content.sub.en)}
          </p>
        )}

        {groups.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <Connector delayMs={gi * 800} />}
            <GroupBand group={group} index={gi} />
          </div>
        ))}
      </div>
    </section>
  )
}

/** Đường nối giữa 2 tầng: kẻ dọc + chấm xanh chảy xuống theo chiều dữ liệu */
function Connector({ delayMs }: { delayMs: number }) {
  return (
    <div className="relative flex justify-center h-11" aria-hidden>
      <span className="w-px h-full bg-border" />
      <span
        className="absolute w-2 h-2 rounded-full bg-primary"
        style={{ animation: `tp-drop 1.6s linear ${delayMs}ms infinite` }}
      />
    </div>
  )
}

function GroupBand({ group, index }: { group: TechPipelineGroup; index: number }) {
  const { t } = useLanguage()
  const hasTerminal = (group.terminal ?? []).length > 0

  return (
    <div
      data-cms-field="pipeline_group"
      data-cms-item-index={index}
      className="rounded-2xl border border-border bg-gradient-to-b from-secondary/40 to-background px-4 py-5 sm:px-6"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-[0.1em] text-primary mb-1">
        {t(group.title?.vi ?? '', group.title?.en)}
      </p>
      {group.caption?.vi && (
        <p className="text-center text-xs text-muted-foreground mb-5">
          {t(group.caption.vi, group.caption.en)}
        </p>
      )}

      {hasTerminal ? (
        <div className="grid md:grid-cols-[5fr_4fr] gap-6 items-center">
          <Terminal lines={group.terminal!} />
          <LogoRow items={group.items} />
        </div>
      ) : (
        <LogoRow items={group.items} />
      )}
    </div>
  )
}

function LogoRow({ items }: { items: ClientLogoItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-5">
      {items.map((item, idx) => (
        <LogoFigure key={idx} item={item} />
      ))}
    </div>
  )
}

function LogoFigure({ item }: { item: ClientLogoItem }) {
  const { language } = useLanguage()
  const name = (language === 'en' ? item.name?.en : item.name?.vi) || item.name?.vi || ''

  const figure = (
    <figure className="w-24 flex flex-col items-center gap-1.5 group">
      <span className="relative block h-10 sm:h-11 w-full transition-transform duration-300 group-hover:scale-110">
        <Image src={item.logo} alt={name} fill quality={95} sizes="96px" className="object-contain" />
      </span>
      {/* Tên HIỂN THỊ — ai không quen logo vẫn đọc được */}
      <figcaption className="text-[11px] font-medium text-muted-foreground leading-none">
        {name}
      </figcaption>
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

/**
 * Khung terminal gõ từng dòng rồi lặp lại. Tô màu theo quy ước ký tự đầu
 * (xem TechPipelineGroup.terminal trong types.ts) — parse thành React node,
 * KHÔNG dùng dangerouslySetInnerHTML dù nội dung do admin quản lý.
 */
function Terminal({ lines }: { lines: NonNullable<TechPipelineGroup['terminal']> }) {
  const { t } = useLanguage()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const delay = shown >= lines.length ? 2800 : shown === 0 ? 400 : 640
    const timer = setTimeout(() => {
      setShown((n) => (n >= lines.length ? 0 : n + 1))
    }, delay)
    return () => clearTimeout(timer)
  }, [shown, lines.length])

  return (
    <div className="rounded-xl bg-slate-900 dark:bg-slate-950 px-4 pt-3 pb-4 font-mono text-xs leading-7 min-h-[13.5rem] overflow-hidden">
      <div className="flex gap-1.5 mb-2" aria-hidden>
        <i className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <i className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <i className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      {lines.slice(0, shown).map((line, idx) => (
        <TermLine key={idx} text={t(line.vi, line.en)} />
      ))}
      <span
        className="inline-block w-1.5 h-3.5 bg-green-400 align-middle"
        style={{ animation: 'tp-blink 1s steps(1) infinite' }}
        aria-hidden
      />
    </div>
  )
}

function TermLine({ text }: { text: string }) {
  const fade = { animation: 'tp-fade 0.35s both' }
  if (text.startsWith('✦')) {
    return (
      <div style={fade} className="text-green-400">
        {text}
      </div>
    )
  }
  const hasCheck = text.endsWith('✓')
  const body = hasCheck ? text.slice(0, -1) : text
  const check = hasCheck ? <span className="text-green-400">✓</span> : null
  if (text.startsWith('$')) {
    return (
      <div style={fade}>
        <span className="text-slate-500">$</span>
        <span className="text-sky-300">{body.slice(1)}</span>
        {check}
      </div>
    )
  }
  if (text.startsWith('→')) {
    return (
      <div style={fade}>
        <span className="text-slate-500">→</span>
        <span className="text-slate-200">{body.slice(1)}</span>
        {check}
      </div>
    )
  }
  return (
    <div style={fade} className="text-slate-200">
      {text}
      {check}
    </div>
  )
}
