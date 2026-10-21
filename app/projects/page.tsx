import { ProjectsListView, projectsListMetadata } from './_view'

// Trang tĩnh làm mới định kỳ (ISR). Dữ liệu gắn tag cache nên bài/dự án mới hiện ngay khi admin Lưu hoặc khi xoá cache
// tag `posts` / `case_studies` (xem lib/cms/posts.ts, lib/cms/case-studies.ts).
export const revalidate = 300
export const generateMetadata = () => projectsListMetadata('vi')

export default function ProjectsPage() {
  return <ProjectsListView lang="vi" />
}
