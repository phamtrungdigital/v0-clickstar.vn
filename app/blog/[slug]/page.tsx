import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedPost } from '@/lib/cms/posts'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) return { title: 'Không tìm thấy bài viết' }
  return {
    title: post.seo_title?.vi || post.title.vi,
    description: post.seo_description?.vi || post.excerpt.vi,
    openGraph: { images: post.og_image || post.cover_image ? [post.og_image || post.cover_image!] : [] },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()

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
            Quay lại danh sách
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
            {post.title.vi}
          </h1>

          {post.published_at && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('vi-VN', {
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
                alt={post.title.vi}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 768px"
              />
            </div>
          )}

          {post.excerpt.vi && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{post.excerpt.vi}</p>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground">
            <ReactMarkdown>{post.content.vi || ''}</ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
