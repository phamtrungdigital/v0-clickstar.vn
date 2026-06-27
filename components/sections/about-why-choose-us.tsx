'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AboutWhyChooseUsContent } from '@/lib/cms/types'

export function AboutWhyChooseUsSection({ content }: { content: AboutWhyChooseUsContent }) {
  const { t } = useLanguage()
  const leftImages = content.images.slice(0, 2)
  const rightImages = content.images.slice(2, 4)

  return (
    <section
      data-cms-section="about_why_choose_us"
      className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span
              data-cms-field="eyebrow"
              className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
            >
              <TrendingUp className="w-4 h-4" />
              {t(content.eyebrow.vi, content.eyebrow.en)}
            </span>

            <h2
              data-cms-field="heading"
              className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-6"
            >
              {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
              <span className="text-primary">
                {t(content.heading_highlight.vi, content.heading_highlight.en)}
              </span>
            </h2>

            <p
              data-cms-field="description"
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              {t(content.description.vi, content.description.en)}
            </p>

            <ul className="space-y-4 mb-8">
              {content.features.map((feature, index) => (
                <li
                  key={index}
                  data-cms-field="feature"
                  data-cms-item-index={index}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{t(feature.vi, feature.en)}</span>
                </li>
              ))}
            </ul>

            <Link
              data-cms-field="cta"
              href={content.cta_href}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg group"
            >
              {t(content.cta_label.vi, content.cta_label.en)}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 2x2 staggered image grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {leftImages.map((img, i) => (
                  <div
                    key={i}
                    data-cms-field="image"
                    data-cms-item-index={i}
                    className={`${
                      img.aspect === '4/5' ? 'aspect-[4/5]' : 'aspect-[4/3]'
                    } rounded-2xl overflow-hidden shadow-lg cursor-pointer`}
                  >
                    <Image quality={95}
                      src={img.src}
                      alt={t(img.alt.vi, img.alt.en)}
                      width={400}
                      height={img.aspect === '4/5' ? 500 : 300}
                      className="object-cover w-full h-full"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-8">
                {rightImages.map((img, i) => (
                  <div
                    key={i}
                    data-cms-field="image"
                    data-cms-item-index={i + 2}
                    className={`${
                      img.aspect === '4/5' ? 'aspect-[4/5]' : 'aspect-[4/3]'
                    } rounded-2xl overflow-hidden shadow-lg cursor-pointer`}
                  >
                    <Image quality={95}
                      src={img.src}
                      alt={t(img.alt.vi, img.alt.en)}
                      width={400}
                      height={img.aspect === '4/5' ? 500 : 300}
                      className="object-cover w-full h-full"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
