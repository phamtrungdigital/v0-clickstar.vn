'use client'

import type { FeatureGridContent, FeatureItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

const COLORS: FeatureItem['color'][] = ['blue', 'purple', 'pink', 'amber', 'emerald', 'cyan', 'rose']

export function FeatureGridForm({
  content,
  onChange,
}: {
  content: FeatureGridContent
  onChange: (next: FeatureGridContent) => void
}) {
  const update = <K extends keyof FeatureGridContent>(key: K, value: FeatureGridContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateItem = (idx: number, next: FeatureItem) => {
    const items = [...content.items]
    items[idx] = next
    onChange({ ...content, items })
  }

  const removeItem = (idx: number) =>
    onChange({ ...content, items: content.items.filter((_, i) => i !== idx) })

  const addItem = () =>
    onChange({
      ...content,
      items: [
        ...content.items,
        { icon: 'Sparkles', color: 'blue', title: { vi: '', en: '' }, description: { vi: '', en: '' } },
      ],
    })

  return (
    <div className="space-y-4">
      <div id="form-feature_grid.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>
      <div id="form-feature_grid.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput label="Heading — phần đầu" value={content.heading_lead} onChange={(v) => update('heading_lead', v)} />
        <I18nInput label="Heading — chữ highlight" value={content.heading_highlight} onChange={(v) => update('heading_highlight', v)} />
      </div>
      <div id="form-feature_grid.description" className="scroll-mt-32">
        <I18nInput label="Mô tả" multiline rows={2} value={content.description} onChange={(v) => update('description', v)} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5">Số cột</label>
        <select
          value={content.columns ?? 3}
          onChange={(e) => update('columns', Number(e.target.value) as 2 | 3 | 4)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
        >
          <option value={2}>2 cột</option>
          <option value={3}>3 cột</option>
          <option value={4}>4 cột</option>
        </select>
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.items.length} features
          </p>
          <button onClick={addItem} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded">
            + Thêm
          </button>
        </div>
        {content.items.map((item, idx) => (
          <details key={idx} id={`form-feature_grid.item.${idx}`} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32">
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {item.title.vi || `(feature ${idx + 1})`}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput label="Icon (lucide)" value={item.icon} onChange={(v) => updateItem(idx, { ...item, icon: v })} hint="Vd: Zap, Shield, Globe, BarChart..." />
                <div>
                  <label className="block text-xs font-medium mb-1.5">Màu</label>
                  <select
                    value={item.color}
                    onChange={(e) => updateItem(idx, { ...item, color: e.target.value as FeatureItem['color'] })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <I18nInput label="Tiêu đề" value={item.title} onChange={(v) => updateItem(idx, { ...item, title: v })} />
              <I18nInput label="Mô tả" multiline rows={3} value={item.description} onChange={(v) => updateItem(idx, { ...item, description: v })} />
              <button onClick={() => removeItem(idx)} className="text-xs text-red-500 hover:underline">Xoá item</button>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
