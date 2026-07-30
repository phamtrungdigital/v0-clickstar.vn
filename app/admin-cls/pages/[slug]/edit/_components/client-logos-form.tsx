'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { ClientLogosContent, ClientLogoItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'
import { ImagePicker } from './image-picker'

export function ClientLogosForm({
  content,
  onChange,
}: {
  content: ClientLogosContent
  onChange: (next: ClientLogosContent) => void
}) {
  const items = content.items ?? []

  const updateItem = (idx: number, next: ClientLogoItem) => {
    const arr = [...items]
    arr[idx] = next
    onChange({ ...content, items: arr })
  }
  const addItem = () =>
    onChange({ ...content, items: [...items, { logo: '', name: { vi: '', en: '' }, href: '' }] })
  const removeItem = (idx: number) =>
    onChange({ ...content, items: items.filter((_, i) => i !== idx) })

  const move = (idx: number, dir: -1 | 1) => {
    const to = idx + dir
    if (to < 0 || to >= items.length) return
    const arr = [...items]
    ;[arr[idx], arr[to]] = [arr[to], arr[idx]]
    onChange({ ...content, items: arr })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3">
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Chỉ đăng logo khách đã đồng ý.</strong> Logo là nhãn hiệu của doanh nghiệp khác —
          cần điều khoản trong hợp đồng hoặc email xác nhận trước khi đưa lên web.
        </p>
      </div>

      <div id="form-client_logos.eyebrow" className="scroll-mt-32">
        <I18nInput
          label="Dòng chữ nhỏ phía trên"
          value={content.eyebrow}
          onChange={(v) => onChange({ ...content, eyebrow: v })}
        />
        <p className="text-[10px] text-slate-500 mt-1">
          vd: ĐƯỢC TIN DÙNG BỞI. Để trống thì không hiện dòng này.
        </p>
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {items.length} logo
          </p>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm logo
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
            Chưa có logo nào. Khi danh sách trống, khối này tự ẩn khỏi trang chủ.
          </p>
        )}

        {items.map((item, idx) => (
          <details
            key={idx}
            id={`form-client_logos.item.${idx}`}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span className="truncate">
                {idx + 1}. {item.name?.vi || '(chưa đặt tên)'}
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    move(idx, -1)
                  }}
                  className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  title="Lên trên"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    move(idx, 1)
                  }}
                  className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  title="Xuống dưới"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    if (confirm(`Xoá logo "${item.name?.vi || idx + 1}"?`)) removeItem(idx)
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            </summary>

            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <ImagePicker
                label="Ảnh logo"
                value={item.logo}
                onChange={(v) => updateItem(idx, { ...item, logo: v })}
                hint="Ưu tiên SVG hoặc PNG nền trong suốt. Logo hiện xám, rê chuột mới lên màu."
              />
              <div>
                <I18nInput
                  label="Tên khách hàng (bắt buộc)"
                  value={item.name}
                  onChange={(v) => updateItem(idx, { ...item, name: v })}
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Không hiện trên trang — dùng làm mô tả ảnh cho Google và trình đọc màn hình.
                </p>
              </div>
              <TextInput
                label="Link website khách (tuỳ chọn)"
                value={item.href ?? ''}
                onChange={(v) => updateItem(idx, { ...item, href: v })}
                hint="Để trống thì logo không bấm được. Có link sẽ mở ở tab mới."
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
