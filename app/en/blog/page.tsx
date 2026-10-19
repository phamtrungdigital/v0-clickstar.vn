import { BlogListView, blogListMetadata } from '@/app/blog/_view'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => blogListMetadata('en')

export default function EnBlogList() {
  return <BlogListView lang="en" />
}
