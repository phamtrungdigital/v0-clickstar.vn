'use client'

import type { TestimonialsContent, TestimonialItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'
import { ImagePicker } from './image-picker'

export function TestimonialsForm({
  content,
  onChange,
}: {
  content: TestimonialsContent
  onChange: (next: TestimonialsContent) => void
}) {
  const update = <K extends keyof TestimonialsContent>(key: K, value: TestimonialsContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateItem = (index: number, next: TestimonialItem) => {
    const items = [...content.items]
    items[index] = next
    onChange({ ...content, items })
  }

  return (
    <div className="space-y-4">
      <div id="form-testimonials.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div
        id="form-testimonials.heading"
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32"
      >
        <I18nInput
          label="Heading — phần đầu"
          value={content.heading_lead}
          onChange={(v) => update('heading_lead', v)}
        />
        <I18nInput
          label="Heading — chữ highlight"
          value={content.heading_highlight}
          onChange={(v) => update('heading_highlight', v)}
        />
      </div>

      <div id="form-testimonials.subtitle" className="scroll-mt-32">
        <I18nInput
          label="Subtitle"
          multiline
          value={content.subtitle}
          onChange={(v) => update('subtitle', v)}
        />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.items.length} đánh giá
        </p>
        {content.items.map((item, idx) => (
          <details
            key={idx}
            id={`form-testimonials.item.${idx}`}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {item.name || `(KH ${idx + 1})`} — {item.rating}⭐
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput
                  label="Tên khách hàng"
                  value={item.name}
                  onChange={(v) => updateItem(idx, { ...item, name: v })}
                />
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Số sao (1-5)
                  </label>
                  <select
                    value={item.rating}
                    onChange={(e) => updateItem(idx, { ...item, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}⭐
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ImagePicker
                label="Avatar khách hàng"
                value={item.avatar}
                onChange={(v) => updateItem(idx, { ...item, avatar: v })}
              />
              <I18nInput
                label="Chức danh / nguồn"
                value={item.source}
                onChange={(v) => updateItem(idx, { ...item, source: v })}
              />
              <I18nInput
                label="Quote (lời đánh giá)"
                multiline
                rows={3}
                value={item.quote}
                onChange={(v) => updateItem(idx, { ...item, quote: v })}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
