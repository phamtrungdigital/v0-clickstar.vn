'use client'

import { Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePageData } from '@/lib/cms/page-data-context'

/**
 * Dòng "Cập nhật lần cuối" ở cuối trang CMS (dịch vụ, bảng giá, giới thiệu): ngày lấy từ lần lưu gần nhất của trang trong admin.
 * Hiện bằng thẻ <time> để người đọc, công cụ tìm kiếm và AI thấy trang còn mới. Ngày tính theo giờ Việt Nam để máy chủ và trình duyệt cùng ra một kết quả.
 */
export function PageUpdated({ className = '' }: { className?: string }) {
  const { t, language } = useLanguage()
  const page = usePageData()
  if (!page?.updated_at) return null
  const d = new Date(page.updated_at)
  if (Number.isNaN(d.getTime())) return null
  const label = d.toLocaleDateString(language === 'en' ? 'en-GB' : 'vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  return (
    <p className={`flex items-center justify-center gap-1.5 px-4 py-6 text-[13px] text-[#6b7280] ${className}`}>
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      {t('Cập nhật lần cuối', 'Last updated')}:{' '}
      <time dateTime={d.toISOString()}>{label}</time>
    </p>
  )
}
