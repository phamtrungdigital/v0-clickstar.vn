'use client'

import Image from 'next/image'
import Link from '@/components/app-link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { tagLabel } from '@/lib/cms/tags'
import type { BlogContent } from '@/lib/cms/types'
import type { LatestPost } from '@/lib/cms/posts'

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

  const [featured, ...rest] = cards
  const side = rest.slice(0, 3)
  const readMore = t(content.read_more_label.vi, content.read_more_label.en)

  const tagChips = (tags: string[], onDark: boolean) =>
    tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${
              onDark ? 'bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/25' : 'bg-[#eaf2fd] text-[#144c97]'
            }`}
          >
            {tagLabel(lang, tag)}
          </span>
        ))}
      </div>
    )

  return (
    <section data-cms-section="blog" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header: tiêu đề bên trái, nút xem tất cả bên phải (PC) */}
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div
              data-cms-field="eyebrow"
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-[#144c97]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t(content.eyebrow.vi, content.eyebrow.en)}
            </div>
            <h2
              data-cms-field="heading"
              className="mb-3 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-[42px]"
            >
              {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
              <span className="text-[#1859b8]">{t(content.heading_highlight.vi, content.heading_highlight.en)}</span>
            </h2>
            <p data-cms-field="subtitle" className="text-base text-muted-foreground lg:text-lg">
              {t(content.subtitle.vi, content.subtitle.en)}
            </p>
          </div>
          <Link
            data-cms-field="view_all"
            href={content.view_all_href}
            className="group inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            {t(content.view_all_label.vi, content.view_all_label.en)}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {featured && (
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            {/* Bài nổi bật: ảnh bìa nguyên vẹn ở trên (ảnh đã có chữ riêng), tiêu đề và tóm tắt ở dưới */}
            <article
              data-cms-field="post"
              data-cms-item-index={0}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow duration-300 hover:shadow-xl lg:col-span-7"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0b1b33]">
                {featured.image && (
                  <Image
                    quality={95}
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-[#1e6dda] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-white shadow-md sm:left-6 sm:top-6">
                  {t('Mới nhất', 'Latest')}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  {tagChips(featured.tags, false)}
                  {featured.date && <span className="text-sm font-medium text-muted-foreground">{featured.date}</span>}
                </div>
                <h3 className="line-clamp-3 text-balance text-2xl font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary sm:text-[28px]">
                  <Link href={featured.href} className="after:absolute after:inset-0">
                    {featured.title}
                  </Link>
                </h3>
                {featured.excerpt && <p className="line-clamp-2 text-base text-muted-foreground">{featured.excerpt}</p>}
                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[#1859b8]">
                  {readMore}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </article>

            {/* Các bài tiếp theo: danh sách thẻ ngang */}
            {side.length > 0 && (
              <div className="flex flex-col gap-4 lg:col-span-5">
                {side.map((post, i) => (
                  <article
                    key={post.key}
                    data-cms-field="post"
                    data-cms-item-index={i + 1}
                    className="group relative flex flex-1 items-stretch gap-4 rounded-2xl border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b9d4f8] hover:shadow-lg sm:gap-5"
                  >
                    <div className="relative my-auto aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7] sm:w-44">
                      {post.image && (
                        <Image
                          quality={90}
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="176px"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1 pr-2">
                      {tagChips(post.tags.slice(0, 1), false)}
                      <h3 className="line-clamp-3 text-base font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary sm:text-[17px]">
                        <Link href={post.href} className="after:absolute after:inset-0">
                          {post.title}
                        </Link>
                      </h3>
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        {post.date && <span className="font-medium">{post.date}</span>}
                        <span className="inline-flex items-center gap-1 font-semibold text-[#1859b8]">
                          {readMore}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
