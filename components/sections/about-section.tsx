'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, X, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AboutContent } from '@/lib/cms/types'

export function AboutSection({ content }: { content: AboutContent }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <section data-cms-section="about" className="pt-16 pb-20 lg:pt-24 lg:pb-28 bg-background">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[40%_60%] gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <span
                data-cms-field="eyebrow"
                className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                {t(content.eyebrow.vi, content.eyebrow.en)}
              </span>

              {/* Heading */}
              <h2
                data-cms-field="heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 text-balance"
              >
                {t(content.heading_lead.vi, content.heading_lead.en)}
                <span className="text-primary">
                  {t(content.heading_highlight.vi, content.heading_highlight.en)}
                </span>
              </h2>

              {/* Description */}
              <p
                data-cms-field="description"
                className="text-muted-foreground text-lg leading-relaxed mb-8"
              >
                {t(content.description.vi, content.description.en)}
              </p>

              {/* Stats */}
              <div data-cms-field="stats" className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {content.stat1_value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(content.stat1_label.vi, content.stat1_label.en)}
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {content.stat2_value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(content.stat2_label.vi, content.stat2_label.en)}
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {content.stat3_value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(content.stat3_label.vi, content.stat3_label.en)}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                data-cms-field="cta"
                href={content.cta_href}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 group"
              >
                {t(content.cta_label.vi, content.cta_label.en)}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right Video Thumbnail */}
            <div className="order-1 lg:order-2">
              <div
                data-cms-field="video"
                className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setIsVideoOpen(true)}
              >
                <Image quality={95}
                  src={content.thumbnail_src}
                  alt="Video thumbnail"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-300" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span className="absolute inset-0 w-20 h-20 bg-primary/30 rounded-full animate-ping" />
                    <span
                      className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <button
                      className="relative w-20 h-20 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
                      aria-label="Play video"
                    >
                      <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-foreground/80 text-background text-sm font-medium px-3 py-1 rounded-lg">
                  {content.video_duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors duration-200 z-10"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>

            <iframe
              src={content.video_embed_url}
              title="About video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  )
}
