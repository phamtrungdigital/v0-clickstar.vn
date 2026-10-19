import { BlogPostView, blogPostMetadata } from './_view'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return blogPostMetadata({ slug, lang: 'vi' })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostView slug={slug} lang="vi" />
}
