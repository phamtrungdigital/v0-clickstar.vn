'use client'

import { useState } from 'react'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/contexts/language-context'
import type { FaqContent } from '@/lib/cms/types'

export function FAQSection({ content }: { content: FaqContent }) {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section data-cms-section="faq" className="py-16 lg:py-24 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[35%_65%] gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div
              data-cms-field="eyebrow"
              className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t(content.eyebrow.vi, content.eyebrow.en)}
            </div>

            <h2
              data-cms-field="heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-6"
            >
              {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
              <span className="text-primary">
                {t(content.heading_highlight.vi, content.heading_highlight.en)}
              </span>
            </h2>

            <p
              data-cms-field="description"
              className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8"
            >
              {t(content.description.vi, content.description.en)}
            </p>

            <Link
              data-cms-field="view_more"
              href={content.view_more_href}
              className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full hover:bg-foreground/90 transition-all duration-200 group"
            >
              {t(content.view_more_label.vi, content.view_more_label.en)}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column - Accordion */}
          <div className="space-y-4">
            {content.items.map((faq, index) => (
              <Reveal key={index} delay={index * 80}>
                <div
                  data-cms-field="item"
                  data-cms-item-index={index}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-background-soft border-primary/20'
                      : 'bg-background border-border hover:border-primary/30'
                  }`}
                >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span
                    className={`font-semibold text-base lg:text-lg transition-colors duration-200 ${
                      openIndex === index ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {t(faq.question.vi, faq.question.en)}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      openIndex === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {openIndex === index ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {t(faq.answer.vi, faq.answer.en)}
                    </p>
                  </div>
                </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
