'use client'

import { Heart } from 'lucide-react'
import { iconByName } from '@/lib/icons'
import { useLanguage } from '@/contexts/language-context'
import type { AboutValuesContent } from '@/lib/cms/types'

function renderIcon(name: string, className: string) {
  const Icon = iconByName(name, Heart)
  return <Icon className={className} />
}

export function AboutValuesSection({ content }: { content: AboutValuesContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="about_values" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-[#144c97] font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            {renderIcon('Heart', 'w-4 h-4')}
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-[#1859b8]">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p data-cms-field="description" className="text-muted-foreground text-lg">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {(content.vision?.vi || content.mission?.vi) && (
          <div className="mx-auto mb-10 grid max-w-5xl gap-5 md:grid-cols-2 lg:mb-14 lg:gap-6">
            {[
              { key: 'vision', icon: 'Compass', label: t('Tầm nhìn', 'Vision'), text: content.vision },
              { key: 'mission', icon: 'Flag', label: t('Sứ mệnh', 'Mission'), text: content.mission },
            ]
              .filter((x) => x.text?.vi)
              .map((x) => (
                <div
                  key={x.key}
                  data-cms-field={x.key}
                  className="relative overflow-hidden rounded-3xl p-8 text-white lg:p-10"
                  style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #0d2142 100%)' }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(30,109,218,0.45), rgba(30,109,218,0) 70%)' }}
                  />
                  <div className="relative">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1e6dda]/25 text-[#7db8ff] ring-1 ring-[#7db8ff]/40">
                        {renderIcon(x.icon, 'w-5 h-5')}
                      </span>
                      <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#7db8ff]">{x.label}</span>
                    </div>
                    <p className="text-xl font-semibold leading-normal tracking-[-0.01em] text-white lg:text-[26px]">
                      {x.text ? t(x.text.vi, x.text.en) : ''}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((value, index) => (
            <div
              key={index}
              data-cms-field="item"
              data-cms-item-index={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-[#144c97] mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {renderIcon(value.icon, 'w-6 h-6')}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {t(value.title.vi, value.title.en)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(value.description.vi, value.description.en)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
