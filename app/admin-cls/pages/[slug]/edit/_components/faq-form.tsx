'use client'

import type { FaqContent, FaqItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function FaqForm({
  content,
  onChange,
}: {
  content: FaqContent
  onChange: (next: FaqContent) => void
}) {
  const update = <K extends keyof FaqContent>(key: K, value: FaqContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateItem = (index: number, next: FaqItem) => {
    const items = [...content.items]
    items[index] = next
    onChange({ ...content, items })
  }

  return (
    <div className="space-y-4">
      <div id="form-faq.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-faq.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div id="form-faq.description" className="scroll-mt-32">
        <I18nInput
          label="Mô tả"
          multiline
          value={content.description}
          onChange={(v) => update('description', v)}
        />
      </div>

      <div id="form-faq.view_more" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="Nút 'Xem thêm' — text"
          value={content.view_more_label}
          onChange={(v) => update('view_more_label', v)}
        />
        <TextInput
          label="Nút 'Xem thêm' — link"
          value={content.view_more_href}
          onChange={(v) => update('view_more_href', v)}
        />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.items.length} câu hỏi
        </p>
        {content.items.map((item, idx) => (
          <details
            key={idx}
            id={`form-faq.item.${idx}`}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {item.question.vi || `(chưa có câu hỏi ${idx + 1})`}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput
                label="Câu hỏi"
                value={item.question}
                onChange={(v) => updateItem(idx, { ...item, question: v })}
              />
              <I18nInput
                label="Trả lời"
                multiline
                rows={4}
                value={item.answer}
                onChange={(v) => updateItem(idx, { ...item, answer: v })}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
