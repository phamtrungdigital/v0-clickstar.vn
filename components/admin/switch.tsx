'use client'

import { cn } from '@/lib/utils'

/** Công tắc bật tắt kiểu iOS. `label` là tên đọc cho người dùng trình đọc màn hình. */
export function Switch({
  checked,
  onChange,
  label,
  title,
  disabled,
  className,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  title?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-[26px] w-[44px] flex-none items-center rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-[#34c759]' : 'bg-[rgba(120,120,128,.32)]',
        className
      )}
    >
      <span
        className={cn(
          'inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,.25)] transition-transform',
          checked ? 'translate-x-[20px]' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}
