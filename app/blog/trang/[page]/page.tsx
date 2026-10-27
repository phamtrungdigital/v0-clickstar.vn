import { BlogListView, blogListMetadata, blogPageCount } from '@/app/blog/_view'

// Trang 2 trở đi của danh sách bài viết (/blog/trang/2...). Dựng sẵn các trang đang có, trang mới dựng khi có người mở;
// làm mới định kỳ như /blog.
export const revalidate = 300

export async function generateStaticParams() {
  const n = await blogPageCount('vi')
  return Array.from({ length: Math.max(0, n - 1) }, (_, i) => ({ page: String(i + 2) }))
}

type Props = { params: Promise<{ page: string }> }

// Chỉ nhận số nguyên từ 2 trở lên ("1" hay "02" là địa chỉ trùng: trả 404 để không sinh trang lặp).
const toPage = (raw: string) => (/^[1-9]\d*$/.test(raw) && raw !== '1' ? Number(raw) : NaN)

export async function generateMetadata({ params }: Props) {
  const page = toPage((await params).page)
  return Number.isNaN(page) ? {} : blogListMetadata('vi', page)
}

export default async function BlogListPage({ params }: Props) {
  return <BlogListView lang="vi" page={toPage((await params).page)} />
}
