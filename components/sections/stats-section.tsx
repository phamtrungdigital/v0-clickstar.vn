'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage, type Language } from '@/contexts/language-context'

interface StatItemProps {
  value: number
  suffix: string
  label: string
  isVisible: boolean
}

function useCountUp(end: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isVisible) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)
      
      // Easing function - easeOutExpo
      const easeOutExpo = 1 - Math.pow(2, -10 * percentage)
      const currentCount = Math.floor(end * easeOutExpo)
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }

      if (percentage < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      startTimeRef.current = null
    }
  }, [end, duration, isVisible])

  return count
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M'
  }
  if (num >= 1000) {
    return num.toLocaleString()
  }
  return num.toString()
}

function StatItem({ value, suffix, label, isVisible }: StatItemProps) {
  const count = useCountUp(value, 2500, isVisible)
  
  return (
    <div className="text-center px-4 lg:px-8">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-3">
        {formatNumber(count)}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-sm lg:text-base text-muted-foreground max-w-[200px] mx-auto">
        {label}
      </p>
    </div>
  )
}

const statsData: Record<Language, { value: number; suffix: string; label: string }[]> = {
  vi: [
    { value: 500, suffix: '+', label: 'Doanh nghiệp đã tin tưởng và hợp tác' },
    { value: 50, suffix: '+', label: 'Chuyên gia công nghệ và marketing' },
    { value: 10, suffix: 'M+', label: 'Dữ liệu được xử lý mỗi tháng' },
    { value: 98, suffix: '%', label: 'Khách hàng hài lòng và giới thiệu' }
  ],
  en: [
    { value: 500, suffix: '+', label: 'Businesses trusted and partnered' },
    { value: 50, suffix: '+', label: 'Technology and marketing experts' },
    { value: 10, suffix: 'M+', label: 'Data processed per month' },
    { value: 98, suffix: '%', label: 'Satisfied and referring clients' }
  ]
}

export function StatsSection() {
  const { language, t } = useLanguage()
  const stats = statsData[language]
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
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="bg-[#EEF3FF] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t('Ai cũng có thể hứa, nhưng', 'Anyone can promise, but')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground text-balance">
            {t('Chúng tôi chứng minh bằng', 'We prove it with')}{' '}
            <span className="text-primary">{t('kết quả', 'results')}</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative"
            >
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                isVisible={isVisible}
              />
              
              {/* Vertical Divider - hidden on last item and mobile */}
              {index < stats.length - 1 && (
                <div 
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20 bg-border"
                  aria-hidden="true"
                />
              )}
              
              {/* Mobile divider - only show between first row and second row items */}
              {index === 0 && (
                <div 
                  className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-border"
                  aria-hidden="true"
                />
              )}
              {index === 2 && (
                <div 
                  className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-border"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
