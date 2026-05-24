'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { PricingTabsNavContent, PricingTabItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function PricingTabsNavForm({
  content,
  onChange,
}: {
  content: PricingTabsNavContent
  onChange: (next: PricingTabsNavContent) => void
}) {
  const updateTab = (idx: number, next: PricingTabItem) => {
    const tabs = [...content.tabs]
    tabs[idx] = next
    onChange({ ...content, tabs })
  }
  const addTab = () =>
    onChange({ ...content, tabs: [...content.tabs, { label: { vi: '', en: '' }, anchor: '' }] })
  const removeTab = (idx: number) =>
    onChange({ ...content, tabs: content.tabs.filter((_, i) => i !== idx) })

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-md p-3 text-xs text-amber-800 dark:text-amber-200">
        💡 <strong>Anchor</strong> phải khớp với <code>section.id</code> của một section <code>pricing_tiers</code> trong page. Khi click tab, page sẽ scroll đến section đó.
      </div>

      <div id="form-pricing_tabs_nav.hint" className="scroll-mt-32">
        <I18nInput
          label="Hint text (hiển thị nhỏ dưới tabs)"
          value={content.hint ?? { vi: '', en: '' }}
          onChange={(v) => onChange({ ...content, hint: v })}
        />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.tabs.length} tab
          </p>
          <button
            type="button"
            onClick={addTab}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm tab
          </button>
        </div>
        {content.tabs.map((tab, idx) => (
          <details
            key={idx}
            id={`form-pricing_tabs_nav.tab.${idx}`}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span>
                {idx + 1}. {tab.label.vi || '(chưa đặt)'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  removeTab(idx)
                }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput
                label="Nhãn tab"
                value={tab.label}
                onChange={(v) => updateTab(idx, { ...tab, label: v })}
              />
              <TextInput
                label="Anchor (= section.id của pricing_tiers)"
                value={tab.anchor}
                onChange={(v) => updateTab(idx, { ...tab, anchor: v })}
                hint="UUID của section pricing_tiers tương ứng"
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
