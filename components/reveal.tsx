'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  variant?: 'fade-up' | 'fade-in' | 'fade-right' | 'scale-up'
  threshold?: number
  /** Distance offset (default 24px) */
  offset?: number
  /** Animation duration ms (default 700) */
  duration?: number
  /** If true, animate every time element enters viewport (default false = once) */
  repeat?: boolean
  as?: keyof JSX.IntrinsicElements
  /** Arbitrary HTML attrs forwarded to the underlying element (e.g. data-cms-field) */
  [key: `data-${string}`]: string | number | undefined
  id?: string
  role?: string
}

/**
 * Reveal — IntersectionObserver-based scroll reveal wrapper.
 * Respects prefers-reduced-motion (skips animation, just shows content).
 *
 * Usage:
 *   <Reveal delay={100}>...</Reveal>
 *   <Reveal variant="fade-right">...</Reveal>
 *
 * For staggered lists, increment delay per item: 0, 80, 160, 240ms…
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'fade-up',
  threshold = 0.12,
  offset = 24,
  duration = 700,
  repeat = false,
  as: Tag = 'div',
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (!repeat) observer.unobserve(entry.target)
          } else if (repeat) {
            setVisible(false)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, repeat, prefersReducedMotion])

  // Off-state transforms per variant
  const offTransform =
    variant === 'fade-right'
      ? `translateX(-${offset}px)`
      : variant === 'scale-up'
      ? 'scale(0.96)'
      : variant === 'fade-in'
      ? 'none'
      : `translateY(${offset}px)`

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : offTransform,
    transition: `opacity ${duration}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  }

  // @ts-expect-error generic ref + dynamic tag
  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  )
}
