import type { Metadata } from 'next'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { NotFoundContent } from '@/components/not-found-content'

// Trang lỗi không được lập chỉ mục (Next đã trả mã 404, thẻ robots chỉ là lớp bảo vệ thêm).
export const metadata: Metadata = {
  title: 'Không tìm thấy trang | Click Star',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <NotFoundContent />
      <Footer />
    </div>
  )
}
