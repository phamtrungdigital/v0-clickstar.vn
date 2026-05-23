'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { AboutValuesContent, AboutValueItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

const ICON_HINT = 'Tên Lucide icon: Target, Heart, Zap, Shield, Award, Sparkles, Rocket, Users, Star, CheckCircle2...'

export function AboutValuesForm({
  content,
  onChange,
}: {
  content: AboutValuesContent
  onChange: (next: AboutValuesContent) => void
}) {
  const update = <K extends keyof AboutValuesContent>(key: K, value: AboutValuesContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateItem = (idx: number, next: AboutValueItem) => {
    const items = [...content.items]
    items[idx] = next
    onChange({ ...content, items })
  }
  const addItem = () =>
    onChange({
      ...content,
      items: [...content.items, { icon: 'Sparkles', title: { vi: '', en: '' }, description: { vi: '', en: '' } }],
    })
  const removeItem = (idx: number) =>
    onChange({ ...content, items: content.items.filter((_, i) => i !== idx) })

  return (
    <div className="space-y-4">
      <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

      <I18nInput
        label="Mô tả ngắn dưới heading"
        value={content.description}
        onChange={(v) => update('description', v)}
        multiline
        rows={2}
      />

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.items.length} giá trị
          </p>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm giá trị
          </button>
        </div>
        {content.items.map((item, idx) => (
          <details
            key={idx}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span>
                {idx + 1}. {item.icon} — {item.title.vi || '(chưa đặt)'}
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
              <TextInput
                label="Icon name (Lucide)"
                value={item.icon}
                onChange={(v) => updateItem(idx, { ...item, icon: v })}
                hint={ICON_HINT}
              />
              <I18nInput
                label="Tiêu đề"
                value={item.title}
                onChange={(v) => updateItem(idx, { ...item, title: v })}
              />
              <I18nInput
                label="Mô tả"
                value={item.description}
                onChange={(v) => updateItem(idx, { ...item, description: v })}
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
