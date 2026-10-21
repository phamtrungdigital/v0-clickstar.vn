import { BlogPostView, blogPostMetadata } from './_view'
import { listPublishedPostSummaries } from '@/lib/cms/posts'

// Trang tĩnh làm mới định kỳ (ISR). Dữ liệu gắn tag cache nên bài/dự án mới hiện ngay khi admin Lưu hoặc khi xoá cache
// tag `posts` / `case_studies` (xem lib/cms/posts.ts, lib/cms/case-studies.ts).
export const revalidate = 3600

export async function generateStaticParams() {
  // Dựng sẵn mọi bài đã đăng lúc build; bài đăng sau đó được dựng ở lần mở đầu tiên rồi lưu lại (dynamicParams)
  const posts = await listPublishedPostSummaries()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return blogPostMetadata({ slug, lang: 'vi' })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostView slug={slug} lang="vi" />
}
