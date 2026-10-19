import { BlogPostView, blogPostMetadata } from '@/app/blog/[slug]/_view'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return blogPostMetadata({ slug, lang: 'en' })
}

export default async function EnBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostView slug={slug} lang="en" />
}
