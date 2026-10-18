'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { BlogContent } from '@/lib/cms/types'
import type { LatestPost } from '@/lib/cms/posts'

const tagColors: Record<string, string> = {
  AI: 'bg-primary/10 text-[#1859b8]',
  Marketing: 'bg-[#f5f5f7] text-[#1859b8]',
  Dashboard: 'bg-[#f5f5f7] text-[#1859b8]',
  Data: 'bg-[#f5f5f7] text-[#1859b8]',
  CRM: 'bg-[#f5f5f7] text-[#1859b8]',
  CDP: 'bg-[#f5f5f7] text-[#1859b8]',
  Website: 'bg-[#f5f5f7] text-[#1859b8]',
}

type CardPost = {
  key: string
  href: string
  image: string | null
  title: string
  excerpt: string
  tags: string[]
  date: string
}

export function BlogSection({ content, posts }: { content: BlogContent; posts?: LatestPost[] }) {
  const { t, language } = useLanguage()
  const lang = language === 'vi' ? 'vi' : 'en'

  // Tin mới nhất lấy thẳng từ bài đã đăng (tự đồng bộ). Chưa có bài nào thì dùng danh sách nhập tay trong CMS.
  const cards: CardPost[] =
    posts && posts.length > 0
      ? posts.map((p) => ({
          key: p.id,
          href: `/blog/${p.slug}`,
          image: p.cover_image,
          title: p.title?.[lang] || p.title?.vi || '',
          excerpt: p.excerpt?.[lang] || p.excerpt?.vi || '',
          tags: (p.tags ?? []).slice(0, 2),
          date: p.published_at
            ? new Date(p.published_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
            : '',
        }))
      : content.posts.map((p, i) => ({
          key: String(i),
          href: p.slug,
          image: p.image,
          title: t(p.title.vi, p.title.en),
          excerpt: '',
          tags: p.tags.slice(0, 2),
          date: t(p.date.vi, p.date.en),
        }))

  return (
    <section data-cms-section="blog" className="py-16 lg:py-24 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-[#144c97] font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </div>

          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-[#1859b8]">
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
          {cards.map((post, index) => (
            <article
              key={post.key}
              data-cms-field="post"
              data-cms-item-index={index}
              className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link href={post.href} className="block relative aspect-video overflow-hidden bg-[#f5f5f7]">
                {post.image && (
                  <Image quality={95}
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                {post.tags.length > 0 && (
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
                )}
              </Link>

              <div className="flex flex-1 flex-col p-6">
                {post.date && <p className="mb-2 text-xs font-medium text-muted-foreground">{post.date}</p>}
                <h3 className="font-bold text-lg text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  <Link href={post.href}>{post.title}</Link>
                </h3>
                {post.excerpt && <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}

                <Link
                  href={post.href}
                  className="mt-auto inline-flex items-center gap-2 text-[#1859b8] font-semibold text-sm group/link"
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
