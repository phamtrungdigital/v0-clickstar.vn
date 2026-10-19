import { BlogListView, blogListMetadata } from './_view'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => blogListMetadata('vi')

export default function BlogList() {
  return <BlogListView lang="vi" />
}
