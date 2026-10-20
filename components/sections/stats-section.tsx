'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import type { StatsContent } from '@/lib/cms/types'

function useCountUp(end: number, duration: number, isVisible: boolean) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isVisible) return
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)
      const easeOutExpo = 1 - Math.pow(2, -10 * percentage)
      const currentCount = Math.floor(end * easeOutExpo)
      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }
      if (percentage < 1) requestAnimationFrame(animate)
      else setCount(end)
    }
    requestAnimationFrame(animate)
    return () => {
      startTimeRef.current = null
    }
  }, [end, duration, isVisible])

  return count
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M'
  if (num >= 1000) return num.toLocaleString()
  return num.toString()
}

export function StatsSection({ content }: { content: StatsContent }) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} data-cms-section="stats" className="ap-tile ap-dark" id="results">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ap-stack">
          <span data-cms-field="eyebrow" className="text-sm text-[#d2d2d7] tracking-[-0.016em]">
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2 data-cms-field="heading" className="ap-display">
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            {t(content.heading_highlight.vi, content.heading_highlight.en)}
          </h2>
        </div>

        <div
          className={`mt-10 sm:mt-14 grid gap-x-6 gap-y-12 ${
            content.items.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {content.items.map((stat, index) => (
            <div key={index} data-cms-field="item" data-cms-item-index={index} className="min-w-0">
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                label={t(stat.label.vi, stat.label.en)}
                isVisible={isVisible}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({
  value,
  suffix,
  label,
  isVisible,
}: {
  value: number
  suffix: string
  label: string
  isVisible: boolean
}) {
  const count = useCountUp(value, 2500, isVisible)
  return (
    <div className="text-center px-2">
      <div className="text-[clamp(44px,8vw,80px)] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums">
        {formatNumber(count)}
        {suffix}
      </div>
      <p className="mt-2 text-base lg:text-[17px] text-[#d2d2d7] max-w-[220px] mx-auto">{label}</p>
    </div>
  )
}
