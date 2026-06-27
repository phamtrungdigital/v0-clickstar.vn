'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ImageIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AdsHubScreenshotsContent } from '@/lib/cms/types'

export function AdsHubScreenshots({ content }: { content: AdsHubScreenshotsContent }) {
  const { t } = useLanguage()
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  return (
    <section
      data-cms-section="ads_hub_screenshots"
      className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-background to-primary/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p data-cms-field="description" className="text-muted-foreground text-lg">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {/* Gallery grid — featured 1st item large, rest 2x2 */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {content.items.map((item, idx) => (
            <article
              key={idx}
              data-cms-field="item"
              data-cms-item-index={idx}
              className={`group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300 ${
                idx === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <button
                onClick={() => item.image && setLightboxIdx(idx)}
                className="block w-full aspect-[16/9] relative bg-slate-100 overflow-hidden cursor-zoom-in"
                disabled={!item.image}
              >
                {item.image ? (
                  <Image quality={95}
                    src={item.image}
                    alt={t(item.title.vi, item.title.en)}
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    sizes={idx === 0 ? '(max-width: 1024px) 100vw, 1280px' : '(max-width: 1024px) 100vw, 50vw'}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <ImageIcon className="w-12 h-12" />
                    <p className="text-xs">Anh upload screenshot qua admin</p>
                  </div>
                )}
              </button>

              <div className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {t(item.title.vi, item.title.en)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(item.caption.vi, item.caption.en)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && content.items[lightboxIdx]?.image && (
        <div
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-6xl w-full max-h-full">
            <Image quality={95}
              src={content.items[lightboxIdx].image}
              alt={t(content.items[lightboxIdx].title.vi, content.items[lightboxIdx].title.en)}
              width={1600}
              height={900}
              className="w-full h-auto rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold">
                {t(content.items[lightboxIdx].title.vi, content.items[lightboxIdx].title.en)}
              </h3>
              <p className="text-sm text-white/70 mt-1">
                {t(content.items[lightboxIdx].caption.vi, content.items[lightboxIdx].caption.en)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
