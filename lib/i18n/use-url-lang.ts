'use client'

import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { langFromPathname, type Lang } from './locale'

const noSubscribe = () => () => {}

/**
 * Ngôn ngữ suy ra từ địa chỉ đang xem (/en/... là tiếng Anh, còn lại tiếng Việt).
 *
 * Riêng lần render đầu khi hydrate phải KHỚP HTML máy chủ đã gửi: trang 404 được dựng sẵn lúc build với địa chỉ
 * `/_not-found` nên luôn là tiếng Việt, trong khi khách mở `/en/<địa chỉ lạ>` (HTTP vẫn 404). Dùng ngay ngôn ngữ của URL
 * ở lần đầu sẽ lệch HTML (React báo lỗi hydration #418 và dựng lại cả trang). Vì vậy lần hydrate đầu đọc ngôn ngữ máy chủ
 * từ thẻ <html lang> rồi chuyển sang ngôn ngữ của URL ngay sau đó (useSyncExternalStore làm đúng việc này, không lỗi).
 * Với mọi trang khác hai giá trị trùng nhau nên không có gì thay đổi.
 */
export function useUrlLang(): Lang {
  const urlLang = langFromPathname(usePathname())
  return useSyncExternalStore(
    noSubscribe,
    () => urlLang,
    () => (typeof document === 'undefined' ? urlLang : document.documentElement.lang === 'en' ? 'en' : 'vi'),
  )
}
