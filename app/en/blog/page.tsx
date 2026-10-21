import { BlogListView, blogListMetadata } from '@/app/blog/_view'

// Trang tĩnh làm mới định kỳ (ISR). Dữ liệu gắn tag cache nên bài/dự án mới hiện ngay khi admin Lưu hoặc khi xoá cache
// tag `posts` / `case_studies` (xem lib/cms/posts.ts, lib/cms/case-studies.ts).
export const revalidate = 300
export const generateMetadata = () => blogListMetadata('en')

export default function EnBlogList() {
  return <BlogListView lang="en" />
}
