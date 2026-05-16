'use client'

import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  end: number
  duration?: number
  startWhenInView?: boolean
  className?: string
  prefix?: string
  suffix?: string
}

/**
 * CountUp — animates a number from 0 to `end` when it enters viewport.
 * Uses requestAnimationFrame with easing for smooth count.
 * Respects prefers-reduced-motion (skips animation).
 */
export function CountUp({
  end,
  duration = 1500,
  startWhenInView = true,
  className = '',
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(startWhenInView ? 0 : end)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startWhenInView) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(end)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true
            observer.unobserve(entry.target)
            const startTime = performance.now()
            const animate = (now: number) => {
              const elapsed = now - startTime
              const t = Math.min(elapsed / duration, 1)
              // easeOutExpo
              const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
              setValue(Math.round(end * eased))
              if (t < 1) requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
          }
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, startWhenInView])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString('vi-VN')}
      {suffix}
    </span>
  )
}
