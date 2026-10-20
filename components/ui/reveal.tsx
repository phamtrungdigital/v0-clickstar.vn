'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Hiện dần khi cuộn tới (mờ vào + trượt lên nhẹ), một lần cho mỗi khối.
 * - Máy chủ và trình duyệt tắt script: nội dung hiện đầy đủ ngay (trạng thái "init" không ẩn gì).
 * - Khối đã nằm trong khung nhìn lúc tải trang: không chạy hiệu ứng, tránh nháy.
 * - prefers-reduced-motion: không chạy hiệu ứng.
 * - Dùng thuộc tính `translate` và trả về `none` khi xong để khối con dùng position: fixed không bị nhốt trong khung biến đổi.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  /** Trễ (ms) để các khối cùng hàng hiện lần lượt */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<'init' | 'hidden' | 'shown'>('init')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown')
          io.disconnect()
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-[opacity,translate] duration-700 ease-out ${
        state === 'hidden' ? 'opacity-0 [translate:0_28px]' : 'opacity-100 [translate:none]'
      } ${className}`}
      style={state === 'shown' && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
