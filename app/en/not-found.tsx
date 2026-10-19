import type { Metadata } from 'next'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { NotFoundContent } from '@/components/not-found-content'

// Bản tiếng Anh của app/not-found.tsx: chỉ khác tiêu đề tab. Nội dung tự theo địa chỉ /en (NotFoundContent đọc ngôn ngữ từ URL).
export const metadata: Metadata = {
  title: 'Page not found | Click Star',
  robots: { index: false, follow: false },
}

export default function EnNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <NotFoundContent />
      <Footer />
    </div>
  )
}
