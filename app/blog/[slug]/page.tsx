import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedPost } from '@/lib/cms/posts'
import { getServerLang, makeT, pickI18n, LOCALES } from '@/lib/i18n/server'

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
  const content = pickI18n(lang, post.content)
  const locale = LOCALES[lang]

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <article className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Quay lại danh sách', 'Back to list')}
          </Link>

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
              <Image
                src={post.cover_image}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 768px"
              />
            </div>
          )}

          {excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{excerpt}</p>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground">
            <ReactMarkdown>{content || ''}</ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
