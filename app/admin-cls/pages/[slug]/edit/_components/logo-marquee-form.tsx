'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { LogoMarqueeContent, LogoMarqueeStrip, ClientLogoItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'
import { ImagePicker } from './image-picker'

/**
 * Form khối "Dải logo tự trôi". Mỗi dải là 1 hàng logo chạy ngang vô hạn;
 * dải 1 trôi trái, dải 2 trôi phải, xen kẽ tiếp. Tên logo HIỂN THỊ dưới ảnh.
 */
export function LogoMarqueeForm({
  content,
  onChange,
}: {
  content: LogoMarqueeContent
  onChange: (next: LogoMarqueeContent) => void
}) {
  const strips = content.strips ?? []

  const updateStrip = (idx: number, next: LogoMarqueeStrip) => {
    const arr = [...strips]
    arr[idx] = next
    onChange({ ...content, strips: arr })
  }
  const addStrip = () => onChange({ ...content, strips: [...strips, { items: [] }] })
  const removeStrip = (idx: number) =>
    onChange({ ...content, strips: strips.filter((_, i) => i !== idx) })
  const moveStrip = (idx: number, dir: -1 | 1) => {
    const to = idx + dir
    if (to < 0 || to >= strips.length) return
    const arr = [...strips]
    ;[arr[idx], arr[to]] = [arr[to], arr[idx]]
    onChange({ ...content, strips: arr })
  }

  return (
    <div className="space-y-4">
      <div id="form-logo_marquee.eyebrow" className="scroll-mt-32">
        <I18nInput
          label="Dòng chữ nhỏ phía trên"
          value={content.eyebrow}
          onChange={(v) => onChange({ ...content, eyebrow: v })}
        />
        <p className="text-[10px] text-slate-500 mt-1">
          vd: CÔNG NGHỆ TÍCH HỢP &amp; AI. Để trống thì không hiện.
        </p>
      </div>

      <div id="form-logo_marquee.sub" className="scroll-mt-32">
        <I18nInput
          label="Câu mô tả dưới tiêu đề (tuỳ chọn)"
          value={content.sub ?? { vi: '', en: '' }}
          onChange={(v) => onChange({ ...content, sub: v })}
        />
      </div>

      <div id="form-logo_marquee.showNames" className="scroll-mt-32">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Tên dưới logo
        </label>
        <select
          value={(content.showNames ?? true) ? 'show' : 'hide'}
          onChange={(e) => onChange({ ...content, showNames: e.target.value === 'show' })}
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="show">Hiện tên dưới từng logo (mặc định)</option>
          <option value="hide">Chỉ logo, không tên</option>
        </select>
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {strips.length} dải (dải 1 trôi trái, dải 2 trôi phải, xen kẽ)
          </p>
          <button
            type="button"
            onClick={addStrip}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm dải
          </button>
        </div>

        {strips.map((strip, si) => (
          <details
            key={si}
            id={`form-logo_marquee.strip.${si}`}
            open={si === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span className="truncate">
                Dải {si + 1} — {strip.items?.length ?? 0} logo, trôi {si % 2 === 0 ? 'trái' : 'phải'}
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    moveStrip(si, -1)
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
                    moveStrip(si, 1)
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
                    if (confirm(`Xoá dải ${si + 1} và toàn bộ logo trong đó?`)) removeStrip(si)
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            </summary>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <StripItems strip={strip} stripIndex={si} onChange={(next) => updateStrip(si, next)} />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

function StripItems({
  strip,
  stripIndex,
  onChange,
}: {
  strip: LogoMarqueeStrip
  stripIndex: number
  onChange: (next: LogoMarqueeStrip) => void
}) {
  const items = strip.items ?? []

  const updateItem = (idx: number, next: ClientLogoItem) => {
    const arr = [...items]
    arr[idx] = next
    onChange({ ...strip, items: arr })
  }
  const addItem = () =>
    onChange({ ...strip, items: [...items, { logo: '', name: { vi: '', en: '' }, href: '' }] })
  const removeItem = (idx: number) => onChange({ ...strip, items: items.filter((_, i) => i !== idx) })
  const move = (idx: number, dir: -1 | 1) => {
    const to = idx + dir
    if (to < 0 || to >= items.length) return
    const arr = [...items]
    ;[arr[idx], arr[to]] = [arr[to], arr[idx]]
    onChange({ ...strip, items: arr })
  }

  return (
    <div className="space-y-2">
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
        <p className="text-xs text-slate-500 dark:text-slate-400 py-1">
          Dải chưa có logo nào sẽ tự ẩn khỏi trang.
        </p>
      )}

      {items.map((item, idx) => (
        <details
          key={idx}
          id={`form-logo_marquee.strip.${stripIndex}.item.${idx}`}
          className="bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
        >
          <summary className="px-3 py-1.5 cursor-pointer text-xs font-medium select-none flex items-center justify-between">
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
              hint="Ưu tiên SVG hoặc PNG nền trong suốt."
            />
            <div>
              <I18nInput
                label="Tên (bắt buộc — HIỂN THỊ dưới logo)"
                value={item.name}
                onChange={(v) => updateItem(idx, { ...item, name: v })}
              />
            </div>
            <TextInput
              label="Link (tuỳ chọn)"
              value={item.href ?? ''}
              onChange={(v) => updateItem(idx, { ...item, href: v })}
              hint="Để trống thì logo không bấm được. Có link sẽ mở ở tab mới."
            />
          </div>
        </details>
      ))}
    </div>
  )
}
