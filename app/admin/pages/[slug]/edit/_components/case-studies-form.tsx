'use client'

import type { CaseStudiesContent, CaseStudyItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function CaseStudiesForm({
  content,
  onChange,
}: {
  content: CaseStudiesContent
  onChange: (next: CaseStudiesContent) => void
}) {
  const update = <K extends keyof CaseStudiesContent>(key: K, value: CaseStudiesContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateItem = (index: number, next: CaseStudyItem) => {
    const items = [...content.items]
    items[index] = next
    onChange({ ...content, items })
  }

  return (
    <div className="space-y-4">
      <div id="form-case_studies.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-case_studies.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div id="form-case_studies.view_all" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="'Xem tất cả' — text"
          value={content.view_all_label}
          onChange={(v) => update('view_all_label', v)}
        />
        <TextInput
          label="'Xem tất cả' — link"
          value={content.view_all_href}
          onChange={(v) => update('view_all_href', v)}
        />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.items.length} dự án
        </p>
        {content.items.map((item, idx) => (
          <details
            key={idx}
            id={`form-case_studies.item.${idx}`}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {item.title.vi || `(dự án ${idx + 1})`}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput
                label="Tên dự án"
                value={item.title}
                onChange={(v) => updateItem(idx, { ...item, title: v })}
              />
              <I18nInput
                label="Category"
                value={item.category}
                onChange={(v) => updateItem(idx, { ...item, category: v })}
              />
              <TextInput
                label="Hình ảnh (URL)"
                value={item.image}
                onChange={(v) => updateItem(idx, { ...item, image: v })}
              />
              <TextInput
                label="Tags (cách nhau bởi dấu phẩy)"
                value={item.tags.join(', ')}
                onChange={(v) =>
                  updateItem(idx, {
                    ...item,
                    tags: v
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                hint="VD: Dashboard, Analytics"
              />
              <TextInput
                label="🔗 Link khi click vào card"
                value={item.href ?? ''}
                onChange={(v) =>
                  updateItem(idx, { ...item, href: v.trim() === '' ? undefined : v })
                }
                placeholder="/portfolio/du-an-abc"
                hint="Để trống = không click được. Nội bộ: /. Bên ngoài: https://…"
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
