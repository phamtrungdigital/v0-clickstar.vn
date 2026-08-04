import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowLeft, ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedPost, listPublishedPosts } from '@/lib/cms/posts'
import { getSiteSettings } from '@/lib/cms/settings'
import { getServerLang, makeT, pickI18n, LOCALES } from '@/lib/i18n/server'
import { TableOfContents } from './_components/table-of-contents'
import { NewsletterCard } from './_components/newsletter-card'
import { parseHeadings, slugifyId } from '@/lib/blog/headings'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const lang = await getServerLang()
  const post = await getPublishedPost(slug)
  if (!post) {
    return { title: lang === 'vi' ? 'Không tìm thấy bài viết' : 'Post not found' }
  }
  const title = pickI18n(lang, post.seo_title) || pickI18n(lang, post.title)
  const description = pickI18n(lang, post.seo_description) || pickI18n(lang, post.excerpt)
  const ogImage = post.og_image || post.cover_image
  return {
    title,
    description,
    openGraph: { title, description, images: ogImage ? [ogImage] : [] },
  }
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const lang = await getServerLang()
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
    .slice(0, 4)

  const settings = await getSiteSettings()
  const zaloUrl = settings?.zalo_url

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <article className="pt-12 lg:pt-16 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Quay lại danh sách', 'Back to list')}
          </Link>

          {/* Layout: 3 columns desktop — ToC left | content center | sidebar right */}
          <div className="grid lg:grid-cols-[200px_minmax(0,1fr)_300px] gap-8 lg:gap-12">
            {/* LEFT — Table of Contents (mobile = collapsible top, desktop = sticky left) */}
            <aside className="order-2 lg:order-1">
              <TableOfContents headings={headings} />
            </aside>

            {/* CENTER — Article content */}
            <div className="order-1 lg:order-2 min-w-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance">
                {title}
              </h1>

              {post.published_at && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at).toLocaleDateString(locale, {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              )}

              {post.cover_image && (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10">
                  <Image quality={95}
                    src={post.cover_image}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
              )}

              {excerpt && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary/30 pl-4">
                  {excerpt}
                </p>
              )}

              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-24 prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:mt-6 prose-h3:scroll-mt-24 prose-p:leading-relaxed prose-img:rounded-xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-foreground/80">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const id = slugifyId(extractText(children))
                      return <h2 id={id}>{children}</h2>
                    },
                    h3: ({ children }) => {
                      const id = slugifyId(extractText(children))
                      return <h3 id={id}>{children}</h3>
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* End of article CTA */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-2xl p-6 lg:p-8 text-center">
                  <h3 className="text-xl font-extrabold text-foreground mb-2">
                    {t('Cần tư vấn cụ thể cho doanh nghiệp?', 'Need tailored advice for your business?')}
                  </h3>
                  <p className="text-muted-foreground mb-5 text-sm">
                    {t(
                      'Click Star sẽ giúp anh/chị xây dựng giải pháp phù hợp ngành nghề và quy mô.',
                      'Click Star will help you build a solution that fits your industry and scale.',
                    )}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-primary/30"
                  >
                    {t('Đặt lịch tư vấn miễn phí', 'Book a free consultation')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — Sidebar (mobile = below content, desktop = sticky right) */}
            <aside className="order-3 space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* CTA tư vấn nhanh */}
              <div className="bg-foreground text-background rounded-2xl p-6">
                <h3 className="text-base font-bold mb-2">{t('Hỗ trợ trực tiếp', 'Talk to us directly')}</h3>
                <p className="text-xs text-white/60 mb-4">
                  {t('Trả lời mọi câu hỏi trong giờ làm việc', 'We answer every question during business hours')}
                </p>
                <div className="space-y-2">
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {t('Liên hệ tư vấn', 'Contact us for advice')}
                  </Link>
                  {zaloUrl && (
                    <a
                      href={zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-[#0068FF] hover:bg-[#0055d4] rounded-lg text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t('Chat Zalo', 'Chat on Zalo')}
                    </a>
                  )}
                </div>
              </div>

              {/* Newsletter */}
              <NewsletterCard />

              {/* Related posts */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {t('Bài liên quan', 'Related posts')}
                  </h3>
                  <ul className="space-y-3">
                    {related.map((p) => {
                      const rTitle = pickI18n(lang, p.title)
                      return (
                        <li key={p.id}>
                          <Link
                            href={`/blog/${p.slug}`}
                            className="group flex gap-3 items-start"
                          >
                            {p.cover_image && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <Image quality={95}
                                  src={p.cover_image}
                                  alt={rTitle}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="64px"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                {rTitle}
                              </h4>
                              {p.published_at && (
                                <p className="text-[11px] text-muted-foreground mt-1">
                                  {new Date(p.published_at).toLocaleDateString(locale, {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {t('Chủ đề', 'Topics')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-secondary text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
