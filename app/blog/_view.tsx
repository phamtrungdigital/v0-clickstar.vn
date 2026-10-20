import Image from 'next/image'
import Link from '@/components/app-link'
import { Calendar, ArrowRight } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { listPublishedPosts } from '@/lib/cms/posts'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { makeT, pickI18n, LOCALES } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'
import { tagLabel } from '@/lib/cms/tags'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema } from '@/lib/seo/schema'

/** Metadata của trang danh sách bài viết ở ngôn ngữ `lang`. */
export async function blogListMetadata(lang: Lang) {
  const t = makeT(lang)
  return buildMetadata({
    title: t('Blog chuyển đổi số, AI và Marketing', 'Blog: digital transformation, AI and marketing'),
    description: t(
      'Cập nhật xu hướng, mẹo hay và insight về chuyển đổi số, AI và Marketing từ các chuyên gia của Click Star',
      'Stay updated with trends, tips and insights on digital transformation, AI and marketing from Click Star experts'
    ),
    path: '/blog',
    lang,
    images: await ogImageOr(),
  })
}

/** Danh sách bài viết ở ngôn ngữ `lang`. Bản /en chỉ liệt kê bài đã có bản tiếng Anh đủ nội dung. */
export async function BlogListView({ lang }: { lang: Lang }) {
  const t = makeT(lang)
  const all = await listPublishedPosts()
  const posts = lang === 'en' ? all.filter(postHasEnglish) : all
  const locale = LOCALES[lang]

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbSchema([{ name: t('Trang chủ', 'Home'), path: '/' }, { name: 'Blog', path: '/blog' }], lang)} />
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
                          priority={i === 0}
                          loading={i > 0 && i < 3 ? 'eager' : undefined}
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
