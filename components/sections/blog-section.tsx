'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { BlogContent } from '@/lib/cms/types'

const tagColors: Record<string, string> = {
  AI: 'bg-primary/10 text-primary',
  Marketing: 'bg-emerald-100 text-emerald-700',
  Dashboard: 'bg-purple-100 text-purple-700',
  Data: 'bg-amber-100 text-amber-700',
  CRM: 'bg-rose-100 text-rose-700',
  CDP: 'bg-cyan-100 text-cyan-700',
  Website: 'bg-indigo-100 text-indigo-700',
}

export function BlogSection({ content }: { content: BlogContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="blog" className="py-16 lg:py-24 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </div>

          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>

          <p
            data-cms-field="subtitle"
            className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto"
          >
            {t(content.subtitle.vi, content.subtitle.en)}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {content.posts.map((post, index) => (
            <article
              key={index}
              data-cms-field="post"
              data-cms-item-index={index}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link href={post.slug} className="block relative aspect-video overflow-hidden">
                <Image quality={95}
                  src={post.image}
                  alt={t(post.title.vi, post.title.en)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
                        tagColors[tag] || 'bg-white/90 text-foreground'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-foreground">
                  {t(post.date.vi, post.date.en)}
                </span>
              </Link>

              <div className="p-6">
                <h3 className="font-bold text-lg text-foreground leading-snug mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  <Link href={post.slug}>{t(post.title.vi, post.title.en)}</Link>
                </h3>

                <Link
                  href={post.slug}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm group/link"
                >
                  {t(content.read_more_label.vi, content.read_more_label.en)}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            data-cms-field="view_all"
            href={content.view_all_href}
            className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-full hover:bg-foreground/90 transition-all duration-200 group"
          >
            {t(content.view_all_label.vi, content.view_all_label.en)}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
