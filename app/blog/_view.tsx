import Image from 'next/image'
import Link from '@/components/app-link'
import { Calendar, ArrowRight } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { listPublishedPostSummaries } from '@/lib/cms/posts'
import { makeT, pickI18n, LOCALES } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'
import { tagLabel } from '@/lib/cms/tags'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { notFound } from 'next/navigation'

/**
 * Số bài mỗi trang danh sách. Trước đây /blog in cả 124 bài trên một trang (1,8 MB HTML): Google đọc chậm và trang nặng.
 * Trang 1 là /blog, trang sau là /blog/trang/2... (bản tiếng Anh /en/blog/trang/2), mỗi trang có canonical riêng.
 */
export const BLOG_PAGE_SIZE = 24

/** Đường dẫn tiếng Việt của trang danh sách thứ `page`. */
export const blogPagePath = (page: number) => (page <= 1 ? '/blog' : `/blog/trang/${page}`)

/** Số trang danh sách ở ngôn ngữ `lang` (bản /en chỉ đếm bài đã có tiếng Anh). */
export async function blogPageCount(lang: Lang): Promise<number> {
  const all = await listPublishedPostSummaries()
  const n = lang === 'en' ? all.filter((p) => p.has_en).length : all.length
  return Math.max(1, Math.ceil(n / BLOG_PAGE_SIZE))
}

/** Metadata của trang danh sách bài viết ở ngôn ngữ `lang`, trang thứ `page`. */
export async function blogListMetadata(lang: Lang, page = 1) {
  const t = makeT(lang)
  const suffix = page > 1 ? t(` (trang ${page})`, ` (page ${page})`) : ''
  return buildMetadata({
    title: t('Blog chuyển đổi số, AI và Marketing', 'Blog: digital transformation, AI and marketing') + suffix,
    description: t(
      'Cập nhật xu hướng, mẹo hay và insight về chuyển đổi số, AI và Marketing từ các chuyên gia của Click Star',
      'Stay updated with trends, tips and insights on digital transformation, AI and marketing from Click Star experts'
    ),
    path: blogPagePath(page),
    lang,
    // Bản /en ít bài hơn nên ít trang hơn: trang tiếng Việt vượt quá số trang tiếng Anh thì không khai cặp hreflang.
    hasEn: page <= (await blogPageCount('en')),
    images: await ogImageOr(),
  })
}

/** Danh sách bài viết ở ngôn ngữ `lang`, trang thứ `page`. Bản /en chỉ liệt kê bài đã có bản tiếng Anh đủ nội dung. */
export async function BlogListView({ lang, page = 1 }: { lang: Lang; page?: number }) {
  const t = makeT(lang)
  const all = await listPublishedPostSummaries()
  const list = lang === 'en' ? all.filter((p) => p.has_en) : all
  const pageCount = Math.max(1, Math.ceil(list.length / BLOG_PAGE_SIZE))
  if (!Number.isInteger(page) || page < 1 || page > pageCount) notFound()
  const posts = list.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE)
  const locale = LOCALES[lang]
  const crumbs = [{ name: t('Trang chủ', 'Home'), path: '/' }, { name: 'Blog', path: '/blog' }]
  if (page > 1) crumbs.push({ name: t(`Trang ${page}`, `Page ${page}`), path: blogPagePath(page) })

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbSchema(crumbs, lang)} />
      <MainNav />

      <section className="pt-10 pb-16 sm:pt-16 lg:pt-24 lg:pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-[#144c97] font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t('Tin tức & Bài viết', 'News & Articles')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.2] mb-4 text-balance">
              {t('Kiến thức ', 'Knowledge on ')}
              <span className="text-[#1859b8]">
                {t('chuyển đổi số', 'digital transformation')}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t(
                'Xu hướng, mẹo hay và insight từ chuyên gia Click Star.',
                'Trends, tips and insights from Click Star experts.'
              )}
            </p>
          </div>

          {/* Grid */}
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t('Chưa có bài viết nào', 'No posts yet')}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post, i) => {
                const title = pickI18n(lang, post.title)
                const excerpt = pickI18n(lang, post.excerpt)
                return (
                  <article
                    key={post.id}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block relative aspect-video overflow-hidden"
                    >
                      {post.cover_image ? (
                        <Image quality={95}
                          src={post.cover_image}
                          alt={title}
                          fill
                          // Ảnh bài đầu là phần tử lớn nhất màn hình đầu (LCP) trên điện thoại; 3 bài đầu nằm trong màn hình đầu trên máy tính
                          priority={page === 1 && i === 0}
                          loading={page === 1 && i > 0 && i < 3 ? 'eager' : undefined}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#f5f5f7]" />
                      )}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-foreground"
                          >
                            {tagLabel(lang, tag)}
                          </span>
                        ))}
                      </div>
                    </Link>

                    <div className="p-6">
                      {post.published_at && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.published_at).toLocaleDateString(locale, { timeZone: 'Asia/Ho_Chi_Minh' })}
                        </div>
                      )}
                      <h2 className="font-bold text-lg text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        <Link href={`/blog/${post.slug}`}>{title}</Link>
                      </h2>
                      {excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{excerpt}</p>
                      )}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-[#1859b8] font-semibold text-sm group/link"
                      >
                        {t('Đọc thêm', 'Read more')}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <BlogPager page={page} pageCount={pageCount} lang={lang} />
        </div>
      </section>

      <Footer />
    </div>
  )
}

/** Thanh chuyển trang: liên kết thật (Google đi theo được tới mọi bài), trang hiện tại đánh dấu aria-current. */
function BlogPager({ page, pageCount, lang }: { page: number; pageCount: number; lang: Lang }) {
  if (pageCount <= 1) return null
  const t = makeT(lang)
  const pill = 'inline-flex min-w-10 h-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors'
  return (
    <nav aria-label={t('Chuyển trang bài viết', 'Blog pages')} className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={blogPagePath(page - 1)} rel="prev" className={`${pill} border border-border text-foreground hover:bg-black/[0.04]`}>
          {t('Trang trước', 'Previous')}
        </Link>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span key={n} aria-current="page" className={`${pill} bg-primary text-primary-foreground`}>
            {n}
          </span>
        ) : (
          <Link key={n} href={blogPagePath(n)} className={`${pill} border border-border text-foreground hover:bg-black/[0.04]`}>
            {n}
          </Link>
        )
      )}
      {page < pageCount && (
        <Link href={blogPagePath(page + 1)} rel="next" className={`${pill} border border-border text-foreground hover:bg-black/[0.04]`}>
          {t('Trang sau', 'Next')}
        </Link>
      )}
    </nav>
  )
}
