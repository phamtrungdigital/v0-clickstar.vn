'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { btn } from './ui'

/**
 * Thanh lưu nổi ở đáy màn hình (kiểu Apple, thay cho nút Lưu cố định ở đầu trang).
 * - `show`: có thay đổi chưa lưu, hiện nút Lưu và Huỷ.
 * - `saved`: vừa lưu xong, hiện "Đã lưu" (kèm `savedNote` nếu có lưu ý), thanh tự ẩn khi nơi dùng tắt `saved`.
 * - `error`: lần lưu gần nhất lỗi, giữ thanh để thử lại.
 */
export function SaveBar({
  show,
  saving,
  saved = false,
  savedNote,
  error,
  onSave,
  onCancel,
}: {
  show: boolean
  saving: boolean
  saved?: boolean
  savedNote?: string
  error?: string | null
  onSave: () => void
  onCancel?: () => void
}) {
  const visible = show || saved
  const justSaved = saved && !show
  return (
    <div
      role="region"
      aria-label="Lưu thay đổi"
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        'ad-glass fixed bottom-5 left-1/2 z-40 flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--ad-line-2)] py-2 shadow-[0_14px_36px_-8px_rgba(0,0,0,.28)] transition-all duration-300 lg:ml-[124px]',
        justSaved ? 'pl-4 pr-5' : 'pl-5 pr-2',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      )}
    >
      {justSaved ? (
        <span className="flex items-center gap-2 text-[14px] text-[var(--ad-fg)]">
          <CheckCircle2 className="h-4 w-4 flex-none text-[#248a3d]" />
          {savedNote ?? 'Đã lưu'}
        </span>
      ) : (
        <>
          <span className={cn('text-[14px]', error ? 'text-[#d70015]' : 'text-[var(--ad-fg)]')}>
            {error ? `Chưa lưu được: ${error}` : 'Có thay đổi chưa lưu'}
          </span>
          {onCancel ? (
            <button type="button" onClick={onCancel} disabled={saving} className={btn('secondary')}>
              Huỷ
            </button>
          ) : null}
          <button type="button" onClick={onSave} disabled={saving} className={btn('primary')}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Lưu thay đổi
          </button>
        </>
      )}
    </div>
  )
}
