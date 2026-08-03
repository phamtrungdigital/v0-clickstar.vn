'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import type { ClientLogosContent, ClientLogoItem, ClientLogoSize } from '@/lib/cms/types'

/**
 * Cỡ logo — CHIỀU CAO là thứ quyết định với logo vuông (object-contain co ảnh
 * theo cạnh ngắn nhất của ô). Class phải viết NGUYÊN CHUỖI, không ghép động,
 * nếu không Tailwind sẽ không sinh ra class lúc build.
 */
const SIZE_STYLE: Record<ClientLogoSize, { box: string; cols: string; sizes: string }> = {
  md: {
    box: 'h-10 sm:h-12',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    sizes: '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 160px',
  },
  lg: {
    box: 'h-16 sm:h-20',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    sizes: '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px',
  },
  xl: {
    box: 'h-20 sm:h-28',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    sizes: '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px',
  },
}

/**
 * Dải logo khách hàng — "Kiểu A" anh Trung chọn 28/7/2026:
 * lưới phẳng, logo xám nhạt, rê chuột mới hồi màu.
 *
 * 3 LUẬT KHI SỬA FILE NÀY:
 * 1. CHƯA có logo thì KHÔNG render gì cả (return null) — thà không có khối còn
 *    hơn để một dải trống trên trang chủ.
 * 2. Logo là nhãn hiệu của doanh nghiệp khác → chỉ đăng khi họ đã đồng ý.
 *    Đừng tự thêm logo vào code; toàn bộ danh sách do admin quản lý.
 * 3. `name` bắt buộc có để làm alt text. Ảnh logo hỏng hoặc người dùng trình đọc
 *    màn hình vẫn phải biết đó là khách nào.
 */

export function ClientLogos({ content }: { content: ClientLogosContent }) {
  const { t } = useLanguage()

  // Bỏ qua item chưa up ảnh (admin vừa bấm "Thêm logo" nhưng chưa chọn file)
  const items = (content.items ?? []).filter((i) => i.logo)
  if (items.length === 0) return null

  const style = SIZE_STYLE[content.size ?? 'lg']
  // Mặc định logo HIỆN MÀU luôn. Bật grayscale trong admin thì mới xám → hover ra màu.
  // 2 chuỗi class phải viết NGUYÊN VẸN, không ghép động (JIT sẽ không sinh class).
  const effect = content.grayscale
    ? 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
    : 'group-hover:scale-105'

  return (
    <section
      data-cms-section="client_logos"
      className="py-10 lg:py-14 bg-background border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.eyebrow?.vi && (
          <p
            data-cms-field="eyebrow"
            className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-8"
          >
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
        )}

        <div className={`grid ${style.cols} gap-x-8 gap-y-10 items-center`}>
          {items.map((item, idx) => (
            <LogoCell key={idx} item={item} index={idx} style={style} effect={effect} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LogoCell({
  item,
  index,
  style,
  effect,
}: {
  item: ClientLogoItem
  index: number
  style: { box: string; sizes: string }
  effect: string
}) {
  const { language } = useLanguage()
  const name = (language === 'en' ? item.name?.en : item.name?.vi) || item.name?.vi || ''

  const logo = (
    <span
      className={`relative block ${style.box} w-full transition-all duration-300 ${effect}`}
    >
      <Image
        src={item.logo}
        alt={name}
        fill
        quality={95}
        sizes={style.sizes}
        className="object-contain"
      />
    </span>
  )

  // Có link thì bọc thẻ <a>; không thì vẫn giữ class `group` để hiệu ứng hover chạy
  return item.href ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      data-cms-field="logo"
      data-cms-item-index={index}
      className="group block"
    >
      {logo}
    </a>
  ) : (
    <div data-cms-field="logo" data-cms-item-index={index} className="group">
      {logo}
    </div>
  )
}
