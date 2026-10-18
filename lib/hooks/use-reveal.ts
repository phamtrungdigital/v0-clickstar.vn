'use client'

import { useEffect, useRef, useState } from 'react'

/** Báo true khi phần tử vào khung nhìn (một lần). Trình duyệt cũ không có IntersectionObserver: báo true ngay. */
export function useInView<E extends Element>(threshold = 0.15) {
  const ref = useRef<E | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen] as const
}

/** Số đếm chạy từ 0 đến `to` khi `run` bật; giảm chuyển động thì giữ nguyên số cuối. */
export function useCountUp(to: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(to)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const t0 = performance.now()
    setV(0)
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to, ms])
  return v
}
