'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function TopBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useLanguage()

  if (!isVisible) return null

  return (
    <div className="bg-foreground text-background py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1" />
        <p className="text-sm font-medium text-center">
          {t('Ưu đãi đặc biệt: Giảm 30% tất cả dịch vụ trong tháng này!', 'Special offer: 30% off all services this month!')}{' '}
          <a 
            href="#pricing" 
            className="underline underline-offset-2 hover:text-primary-foreground/80 transition-colors"
          >
            {t('Nhận ngay', 'Claim now')}
          </a>
        </p>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
