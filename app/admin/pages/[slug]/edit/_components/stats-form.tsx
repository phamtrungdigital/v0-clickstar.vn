'use client'

import type { StatsContent, StatItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function StatsForm({
  content,
  onChange,
}: {
  content: StatsContent
  onChange: (next: StatsContent) => void
}) {
  const update = <K extends keyof StatsContent>(key: K, value: StatsContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateItem = (index: number, next: StatItem) => {
    const items = [...content.items]
    items[index] = next
    onChange({ ...content, items })
  }

  return (
    <div className="space-y-4">
      <div id="form-stats.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-stats.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.items.length} chỉ số
        </p>
        {content.items.map((item, idx) => (
          <details
            key={idx}
            id={`form-stats.item.${idx}`}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {item.value}
              {item.suffix} — {item.label.vi}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput
                  label="Số (number)"
                  value={String(item.value)}
                  onChange={(v) => updateItem(idx, { ...item, value: Number(v) || 0 })}
                  hint="Animation đếm từ 0 đến số này"
                />
                <TextInput
                  label="Suffix (vd +, %, M+)"
                  value={item.suffix}
                  onChange={(v) => updateItem(idx, { ...item, suffix: v })}
                />
              </div>
              <I18nInput
                label="Nhãn"
                value={item.label}
                onChange={(v) => updateItem(idx, { ...item, label: v })}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
