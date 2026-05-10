'use client'

import { ServiceCard } from './service-card'
import * as Icons from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import type { ServicesContent, ServiceItem } from '@/lib/cms/types'
import type { LucideIcon } from 'lucide-react'

const colorMap: Record<ServiceItem['color'], { iconText: string; iconBg: string; tag: string }> = {
  blue: { iconText: 'text-blue-600', iconBg: 'bg-blue-50', tag: 'bg-blue-50 text-blue-600' },
  purple: { iconText: 'text-purple-600', iconBg: 'bg-purple-50', tag: 'bg-purple-50 text-purple-600' },
  pink: { iconText: 'text-pink-600', iconBg: 'bg-pink-50', tag: 'bg-pink-50 text-pink-600' },
  amber: { iconText: 'text-amber-600', iconBg: 'bg-amber-50', tag: 'bg-amber-50 text-amber-600' },
  emerald: { iconText: 'text-emerald-600', iconBg: 'bg-emerald-50', tag: 'bg-emerald-50 text-emerald-600' },
  cyan: { iconText: 'text-cyan-600', iconBg: 'bg-cyan-50', tag: 'bg-cyan-50 text-cyan-600' },
}

function renderIcon(name: string, className: string) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles
  return <Icon className={className} />
}

export function ServicesSection({ content }: { content: ServicesContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="services" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>

          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>

          <p data-cms-field="description" className="text-muted-foreground text-lg leading-relaxed">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {content.services.map((service, index) => {
            const colors = colorMap[service.color] ?? colorMap.blue
            return (
              <div key={index} data-cms-field="item" data-cms-item-index={index}>
                <ServiceCard
                  icon={renderIcon(service.icon, `w-6 h-6 ${colors.iconText}`)}
                  title={t(service.title.vi, service.title.en)}
                  description={t(service.description.vi, service.description.en)}
                  tag={t(service.tag.vi, service.tag.en)}
                  iconBgColor={colors.iconBg}
                  tagColor={colors.tag}
                  href={service.href}
                />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Link */}
        <div className="text-center mt-14">
          <Link
            data-cms-field="footer_link"
            href={content.footer_link_href}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="text-base">
              {t(content.footer_link_prefix.vi, content.footer_link_prefix.en)}
              <span className="text-primary font-semibold underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary">
                {t(content.footer_link_label.vi, content.footer_link_label.en)}
              </span>
            </span>
            <svg
              className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Data Pipeline Architecture Diagram */}
        <div data-cms-field="pipeline" className="mt-16 lg:mt-24 pt-16 lg:pt-24 border-t border-border/50">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              {t(content.pipeline_eyebrow.vi, content.pipeline_eyebrow.en)}
            </span>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
              {t(content.pipeline_heading.vi, content.pipeline_heading.en)}
            </h3>

            <p className="text-muted-foreground text-lg">
              {t(content.pipeline_subtitle.vi, content.pipeline_subtitle.en)}
            </p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.pipeline_image_src}
            alt={t(content.pipeline_image_alt.vi, content.pipeline_image_alt.en)}
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>
    </section>
  )
}
