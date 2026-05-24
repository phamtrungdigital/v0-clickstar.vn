'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { PricingSetupAddonsContent, PricingAddonItem } from '@/lib/cms/types'
import { I18nInput } from './i18n-input'

export function PricingSetupAddonsForm({
  content,
  onChange,
}: {
  content: PricingSetupAddonsContent
  onChange: (next: PricingSetupAddonsContent) => void
}) {
  const update = <K extends keyof PricingSetupAddonsContent>(
    key: K,
    value: PricingSetupAddonsContent[K],
  ) => onChange({ ...content, [key]: value })

  const updateItem = (idx: number, next: PricingAddonItem) => {
    const items = [...content.items]
    items[idx] = next
    onChange({ ...content, items })
  }
  const addItem = () =>
    onChange({
      ...content,
      items: [
        ...content.items,
        {
          name: { vi: '', en: '' },
          description: { vi: '', en: '' },
          price: { vi: '', en: '' },
          duration: { vi: '', en: '' },
        },
      ],
    })
  const removeItem = (idx: number) =>
    onChange({ ...content, items: content.items.filter((_, i) => i !== idx) })

  return (
    <div className="space-y-4">
      <div id="form-pricing_setup_addons.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-pricing_setup_addons.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div id="form-pricing_setup_addons.description" className="scroll-mt-32">
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
            {content.items.length} dịch vụ setup
          </p>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm dịch vụ
          </button>
        </div>
        {content.items.map((item, idx) => (
          <details
            key={idx}
            id={`form-pricing_setup_addons.item.${idx}`}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span>
                {idx + 1}. {item.name.vi || '(chưa đặt tên)'} — {item.price.vi || '???'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  removeItem(idx)
                }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput
                label="Tên dịch vụ"
                value={item.name}
                onChange={(v) => updateItem(idx, { ...item, name: v })}
              />
              <I18nInput
                label="Mô tả chi tiết"
                value={item.description}
                onChange={(v) => updateItem(idx, { ...item, description: v })}
                multiline
                rows={3}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <I18nInput
                  label="Giá"
                  value={item.price}
                  onChange={(v) => updateItem(idx, { ...item, price: v })}
                />
                <I18nInput
                  label="Thời gian (optional)"
                  value={item.duration ?? { vi: '', en: '' }}
                  onChange={(v) => updateItem(idx, { ...item, duration: v })}
                />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
