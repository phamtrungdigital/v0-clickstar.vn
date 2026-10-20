'use client'

import { cn } from '@/lib/utils'

/** Bộ chọn dạng đoạn (segmented control) kiểu iOS: lọc danh sách hoặc đổi chế độ xem. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: {
  value: T
  options: { id: T; label: string; count?: number; disabled?: boolean; title?: string }[]
  onChange: (id: T) => void
  ariaLabel?: string
  className?: string
}) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn('inline-flex flex-wrap gap-0.5 rounded-[10px] bg-[var(--ad-fill)] p-0.5', className)}>
      {options.map((o) => {
        const on = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            disabled={o.disabled}
            title={o.title}
            aria-pressed={on}
            onClick={() => onChange(o.id)}
            className={cn(
              'h-7 rounded-lg px-3.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
              on
                ? 'bg-[var(--ad-surface)] text-[var(--ad-fg)] shadow-[0_1px_3px_rgba(0,0,0,.14)]'
                : 'text-[var(--ad-fg-2)] hover:text-[var(--ad-fg)]'
            )}
          >
            {o.label}
            {o.count !== undefined ? <span className="ml-1.5 text-[var(--ad-fg-3)]">{o.count}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
