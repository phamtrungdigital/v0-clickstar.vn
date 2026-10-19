import Image from 'next/image'
import Link from '@/components/app-link'
import { Calendar, Clock, ArrowLeft, ArrowRight, MessageCircle, Phone, Sparkles } from 'lucide-react'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedPost, listPublishedPosts } from '@/lib/cms/posts'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { getSiteSettings } from '@/lib/cms/settings'
import { makeT, pickI18n, LOCALES } from '@/lib/i18n/server'
import { localizePath, type Lang } from '@/lib/i18n/locale'
import { SITE_URL } from '@/lib/seo/site'
import { tagLabel } from '@/lib/cms/tags'
import { MarkdownLink } from '@/components/markdown-link'
import { TableOfContents } from './_components/table-of-contents'
import { BackToTop, BodyReveal, CopyLinkButton, CoverParallax, PostStyles, ReadingProgress } from './_components/post-effects'
import { parseHeadings, slugifyId } from '@/lib/blog/headings'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { JsonLd } from '@/components/seo/json-ld'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/seo/schema'

/** Metadata của một bài viết ở ngôn ngữ `lang` (dùng cho cả /blog/<slug> và /en/blog/<slug>). */
export async function blogPostMetadata({ slug, lang }: { slug: string; lang: Lang }) {
  const post = await getPublishedPost(slug)
  if (!post) {
    return { title: lang === 'vi' ? 'Không tìm thấy bài viết' : 'Post not found' }
  }
  const title = pickI18n(lang, post.seo_title) || pickI18n(lang, post.title)
  const description = pickI18n(lang, post.seo_description) || pickI18n(lang, post.excerpt)
  return buildMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    lang,
    // Bài chưa có bản tiếng Anh đủ nội dung: /en/blog/<slug> noindex và không khai báo hreflang
    hasEn: postHasEnglish(post),
    images: await ogImageOr(post.og_image, post.cover_image),
    type: 'article',
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
  })
}

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    // @ts-expect-error - children có thể có props
    return extractText(children.props?.children ?? '')
  }
  return ''
}

/** Nội dung một bài viết ở ngôn ngữ `lang`. */
export async function BlogPostView({ slug, lang }: { slug: string; lang: Lang }) {
  const t = makeT(lang)
  const post = await getPublishedPost(slug)
  if (!post) notFound()

  const title = pickI18n(lang, post.title)
  const excerpt = pickI18n(lang, post.excerpt)
  const content = pickI18n(lang, post.content) || ''
  const locale = LOCALES[lang]

  // ToC headings
  const headings = parseHeadings(content)

  // Related posts: cùng tag, exclude current
  const allPosts = await listPublishedPosts()
  const related = allPosts
    .filter((p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3)

  // Thời gian đọc: khoảng 220 từ mỗi phút.
  const minutes = Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 220))
  const dateFmt: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }
  const publishedLabel = post.published_at ? new Date(post.published_at).toLocaleDateString(locale, dateFmt) : ''
  // Chỉ hiện "cập nhật" khi sửa sau ngày đăng ít nhất một ngày.
  const showUpdated =
    !!post.published_at && new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 24 * 3600 * 1000
  const updatedLabel = showUpdated ? new Date(post.updated_at).toLocaleDateString(locale, dateFmt) : ''

  const settings = await getSiteSettings()
  const zaloUrl = settings?.zalo_url
  const postUrl = `${settings?.site_url || SITE_URL}${localizePath(`/blog/${slug}`, lang)}`

  const postSchema = blogPostingSchema({
    title,
    description: excerpt,
    path: `/blog/${slug}`,
    image: post.cover_image,
    publishedAt: post.published_at,
    modifiedAt: post.updated_at,
    lang,
    logoUrl: settings?.logo_url,
  })
  const crumbs = breadcrumbSchema(
    [
      { name: t('Trang chủ', 'Home'), path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: title, path: `/blog/${slug}` },
    ],
    lang
  )

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[postSchema, crumbs]} />
      <PostStyles />
      <ReadingProgress />
      <BackToTop />
      <MainNav />

      <article id="bp-article" className="relative isolate pt-12 lg:pt-16 pb-16 lg:pb-24">
        {/* Nền đầu bài: quầng sáng trôi chậm và lưới chấm */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] overflow-hidden" aria-hidden="true">
          <div className="bp-dots absolute inset-0" />
          <div className="bp-orb left-[8%] top-[-8%] h-[340px] w-[340px] bg-[#3687FC]/40" />
          <div className="bp-orb right-[6%] top-[4%] h-[300px] w-[300px] bg-[#fb923c]/30" style={{ animationDelay: '-6s' }} />
        </div>

        {/* Đầu bài: căn giữa, cùng trục với ảnh bìa bên dưới */}
        <header className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <Link
            href="/blog"
            className="bp-up group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Blog
          </Link>

          <div className="bp-up flex flex-wrap justify-center gap-2 mb-6" style={{ ['--d' as string]: '.06s' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-[#144c97] transition-transform hover:-translate-y-0.5"
              >
                {tagLabel(lang, tag)}
              </span>
            ))}
          </div>

          <h1 className="text-[32px] sm:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.08] tracking-[-0.03em] text-balance">
            {title.split(' ').map((word, i, arr) => (
              <span key={i}>
                <span className="bp-wm">
                  <span className="bp-w" style={{ ['--i' as string]: i }}>
                    {word}
                  </span>
                </span>
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <div
            className="bp-up mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            style={{ ['--d' as string]: `${0.25 + title.split(' ').length * 0.07}s` }}
          >
            <span className="inline-flex items-center gap-2.5">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 ring-4 ring-primary/10">
                <svg viewBox="0 0 24 24" className="bp-star h-[18px] w-[18px]" aria-hidden="true">
                  <polygon points="12,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.4 5.8,21 7.4,14 2,9.3 9.1,8.6" fill="#4f93f5" stroke="#bfdcff" strokeWidth="0.8" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-medium text-foreground">Click Star Team</span>
            </span>
            <span className="hidden sm:block h-4 w-px bg-border" aria-hidden="true" />
            {publishedLabel && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {publishedLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {t(`${minutes} phút đọc`, `${minutes} min read`)}
            </span>
            {updatedLabel && (
              <span className="text-xs">
                {t('Cập nhật', 'Updated')} {updatedLabel}
              </span>
            )}
          </div>
        </header>

        {post.cover_image && (
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 mt-12">
            <div className="relative">
              {/* Ánh sáng bao quanh lấy màu từ ảnh bìa */}
              <div className="bp-ambient" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_image} alt="" className="h-full w-full object-cover rounded-[32px]" loading="lazy" decoding="async" />
              </div>
              <div className="bp-cover relative aspect-video rounded-3xl overflow-hidden bg-muted shadow-[0_30px_70px_-32px_rgba(15,23,42,0.45)]">
                <CoverParallax>
                  <Image
                    quality={95}
                    src={post.cover_image}
                    alt={title}
                    fill
                    priority
                    className="bp-zoom object-cover"
                    sizes="(max-width: 900px) 100vw, 900px"
                  />
                </CoverParallax>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 mt-10">
          <TableOfContents headings={headings} />

          {excerpt && (
            <div className="bp-up bp-lead mt-9" style={{ ['--d' as string]: '.5s' }}>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-[#1859b8]">
                <Sparkles className="w-3.5 h-3.5" />
                {t('TÓM TẮT', 'SUMMARY')}
              </div>
              <p className="text-xl sm:text-[22px] leading-[1.6] text-foreground/85 text-pretty">{excerpt}</p>
            </div>
          )}

          <BodyReveal className="bp-prose prose prose-slate dark:prose-invert max-w-none mt-10 prose-lg prose-p:text-[19px] prose-li:text-[19px] prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl lg:prose-h2:text-[28px] prose-h2:mt-14 prose-h2:mb-4 prose-h2:scroll-mt-24 prose-h3:text-xl prose-h3:mt-8 prose-h3:scroll-mt-24 prose-p:leading-[1.85] prose-li:leading-[1.8] prose-img:rounded-2xl prose-a:text-primary prose-a:no-underline prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-foreground/80">
            <ReactMarkdown
              components={{
                // Trang đã có đúng một <h1> (tiêu đề bài). "# ..." trong nội dung được hạ thành <h2>.
                h1: ({ children }) => {
                  const id = slugifyId(extractText(children))
                  return <h2 id={id}>{children}</h2>
                },
                h2: ({ children }) => {
                  const id = slugifyId(extractText(children))
                  return <h2 id={id}>{children}</h2>
                },
                h3: ({ children }) => {
                  const id = slugifyId(extractText(children))
                  return <h3 id={id}>{children}</h3>
                },
                // Liên kết nội bộ trong bài tự trỏ sang bản /en khi đang xem bản tiếng Anh
                a: ({ node: _n, ...props }) => <MarkdownLink {...props} />,
                // Ảnh minh họa trong bài nằm dưới màn hình đầu: tải trễ để không tranh băng thông với ảnh bìa (LCP) và CSS/JS.
                img: ({ node: _node, alt, ...props }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img {...props} alt={alt ?? ''} loading="lazy" decoding="async" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </BodyReveal>

          {/* Chia sẻ */}
          <div className="mt-14 pt-7 border-t border-border flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-foreground mr-1">{t('Chia sẻ bài viết', 'Share this article')}</span>
            <CopyLinkButton url={postUrl} />
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-10 px-4 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-10 px-4 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Bài liên quan: ba thẻ */}
        {related.length > 0 && (
          <section className="max-w-[900px] mx-auto px-4 sm:px-6 mt-20" aria-labelledby="bp-related">
            <h2 id="bp-related" className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-6">
              {t('Bài liên quan', 'Related posts')}
            </h2>
            <ul className="grid gap-5 md:grid-cols-3">
              {related.map((p, i) => {
                const rTitle = pickI18n(lang, p.title)
                return (
                  <li key={p.id} className="bp-up" style={{ ['--d' as string]: `${i * 0.08}s` }}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block h-full rounded-2xl border border-border bg-background overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]"
                    >
                      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                        {p.cover_image && (
                          <Image
                            quality={90}
                            src={p.cover_image}
                            alt={rTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 340px"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        {p.published_at && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(p.published_at).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' })}
                          </p>
                        )}
                        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                          {rTitle}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                          {t('Đọc tiếp', 'Read more')}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Kêu gọi liên hệ: một khối tối ở cuối bài */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 mt-16">
          <div className="bp-glow rounded-3xl bg-zinc-950 text-white px-6 py-10 sm:px-12 sm:py-14 text-center">
            <span className="bp-tw left-[8%] top-[18%] text-xl" aria-hidden="true">+</span>
            <span className="bp-tw right-[10%] top-[28%] text-2xl" style={{ animationDelay: '1.1s' }} aria-hidden="true">+</span>
            <span className="bp-tw left-[16%] bottom-[16%] text-lg" style={{ animationDelay: '2.1s' }} aria-hidden="true">+</span>
            <span className="bp-tw right-[18%] bottom-[14%] text-xl" style={{ animationDelay: '.5s' }} aria-hidden="true">+</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              {t('Cần tư vấn cụ thể cho doanh nghiệp?', 'Need tailored advice for your business?')}
            </h2>
            <p className="mt-3 mx-auto max-w-xl text-sm sm:text-base text-zinc-300">
              {t(
                'Click Star giúp anh/chị xây dựng giải pháp phù hợp ngành nghề và quy mô. Trả lời mọi câu hỏi trong giờ làm việc.',
                'Click Star helps you build a solution that fits your industry and scale. We answer every question during business hours.',
              )}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                <Phone className="w-4 h-4" />
                {t('Đặt lịch tư vấn miễn phí', 'Book a free consultation')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {zaloUrl && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 hover:border-white/60 text-white font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('Chat Zalo', 'Chat on Zalo')}
                </a>
              )}
            </div>
          </div>
        </section>
      </article>

      <Footer />
    </div>
  )
}
