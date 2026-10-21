import { ProjectDetailView, projectMetadata } from './_view'
import { getPublishedCaseStudies } from '@/lib/cms/case-studies'

// Trang tĩnh làm mới định kỳ (ISR). Dữ liệu gắn tag cache nên bài/dự án mới hiện ngay khi admin Lưu hoặc khi xoá cache
// tag `posts` / `case_studies` (xem lib/cms/posts.ts, lib/cms/case-studies.ts).
export const revalidate = 3600

export async function generateStaticParams() {
  // Dựng sẵn mọi dự án đã đăng lúc build; dự án đăng sau đó được dựng ở lần mở đầu tiên rồi lưu lại (dynamicParams)
  const projects = await getPublishedCaseStudies()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return projectMetadata({ slug, lang: 'vi' })
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProjectDetailView slug={slug} lang="vi" />
}
