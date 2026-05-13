'use client'

import type { ProblemsGridContent, ProblemItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

const COLORS: ProblemItem['color'][] = ['blue', 'purple', 'pink', 'amber', 'emerald', 'cyan', 'rose']

export function ProblemsGridForm({
  content,
  onChange,
}: {
  content: ProblemsGridContent
  onChange: (next: ProblemsGridContent) => void
}) {
  const update = <K extends keyof ProblemsGridContent>(key: K, value: ProblemsGridContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateItem = (idx: number, next: ProblemItem) => {
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
        {
          icon: 'AlertCircle',
          color: 'blue',
          problem: { vi: '', en: '' },
          solution: { vi: '', en: '' },
        },
      ],
    })

  return (
    <div className="space-y-4">
      <div id="form-problems_grid.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>
      <div id="form-problems_grid.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput label="Heading — phần đầu" value={content.heading_lead} onChange={(v) => update('heading_lead', v)} />
        <I18nInput label="Heading — chữ highlight" value={content.heading_highlight} onChange={(v) => update('heading_highlight', v)} />
      </div>
      <div id="form-problems_grid.description" className="scroll-mt-32">
        <I18nInput label="Mô tả" multiline rows={2} value={content.description} onChange={(v) => update('description', v)} />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.items.length} vấn đề + giải pháp
          </p>
          <button onClick={addItem} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded">
            + Thêm
          </button>
        </div>
        {content.items.map((item, idx) => (
          <details key={idx} id={`form-problems_grid.item.${idx}`} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32">
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {item.problem.vi || `(vấn đề ${idx + 1})`}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput label="Icon (lucide)" value={item.icon} onChange={(v) => updateItem(idx, { ...item, icon: v })} hint="Vd: AlertCircle, TrendingDown, Frown..." />
                <div>
                  <label className="block text-xs font-medium mb-1.5">Màu</label>
                  <select
                    value={item.color}
                    onChange={(e) => updateItem(idx, { ...item, color: e.target.value as ProblemItem['color'] })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <I18nInput label="Vấn đề" multiline rows={2} value={item.problem} onChange={(v) => updateItem(idx, { ...item, problem: v })} />
              <I18nInput label="Giải pháp" multiline rows={2} value={item.solution} onChange={(v) => updateItem(idx, { ...item, solution: v })} />
              <button onClick={() => removeItem(idx)} className="text-xs text-red-500 hover:underline">Xoá item</button>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
