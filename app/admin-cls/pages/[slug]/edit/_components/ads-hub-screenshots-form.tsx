'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { AdsHubScreenshotsContent, AdsHubScreenshotItem } from '@/lib/cms/types'
import { I18nInput } from './i18n-input'
import { ImagePicker } from './image-picker'

export function AdsHubScreenshotsForm({
  content,
  onChange,
}: {
  content: AdsHubScreenshotsContent
  onChange: (next: AdsHubScreenshotsContent) => void
}) {
  const update = <K extends keyof AdsHubScreenshotsContent>(
    key: K,
    value: AdsHubScreenshotsContent[K],
  ) => onChange({ ...content, [key]: value })

  const updateItem = (idx: number, next: AdsHubScreenshotItem) => {
    const items = [...content.items]
    items[idx] = next
    onChange({ ...content, items })
  }
  const addItem = () =>
    onChange({
      ...content,
      items: [
        ...content.items,
        { image: '', title: { vi: '', en: '' }, caption: { vi: '', en: '' } },
      ],
    })
  const removeItem = (idx: number) =>
    onChange({ ...content, items: content.items.filter((_, i) => i !== idx) })

  return (
    <div className="space-y-4">
      <div id="form-ads_hub_screenshots.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div
        id="form-ads_hub_screenshots.heading"
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

      <div id="form-ads_hub_screenshots.description" className="scroll-mt-32">
        <I18nInput
          label="Mô tả"
          value={content.description}
          onChange={(v) => update('description', v)}
          multiline
          rows={2}
        />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.items.length} screenshot
          </p>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm screenshot
          </button>
        </div>

        {content.items.map((item, idx) => (
          <details
            key={idx}
            id={`form-ads_hub_screenshots.item.${idx}`}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span>
                {idx + 1}. {item.title.vi || '(chưa đặt title)'}
                {idx === 0 && <span className="ml-2 text-[10px] text-primary">★ FEATURED (full width)</span>}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (confirm(`Xoá screenshot ${idx + 1}?`)) removeItem(idx)
                }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <ImagePicker
                label="Ảnh screenshot (16:9, ~1600×900)"
                value={item.image}
                onChange={(v) => updateItem(idx, { ...item, image: v })}
              />
              <I18nInput
                label="Title"
                value={item.title}
                onChange={(v) => updateItem(idx, { ...item, title: v })}
              />
              <I18nInput
                label="Caption (mô tả ngắn 1-2 câu)"
                value={item.caption}
                onChange={(v) => updateItem(idx, { ...item, caption: v })}
                multiline
                rows={3}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
