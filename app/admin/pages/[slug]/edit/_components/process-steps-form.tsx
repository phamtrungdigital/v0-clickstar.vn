'use client'

import type { ProcessStepsContent, ProcessStepItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function ProcessStepsForm({
  content,
  onChange,
}: {
  content: ProcessStepsContent
  onChange: (next: ProcessStepsContent) => void
}) {
  const update = <K extends keyof ProcessStepsContent>(key: K, value: ProcessStepsContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateStep = (idx: number, next: ProcessStepItem) => {
    const steps = [...content.steps]
    steps[idx] = next
    onChange({ ...content, steps })
  }

  const removeStep = (idx: number) =>
    onChange({ ...content, steps: content.steps.filter((_, i) => i !== idx) })

  const addStep = () => {
    const next = String(content.steps.length + 1).padStart(2, '0')
    onChange({
      ...content,
      steps: [
        ...content.steps,
        {
          step_number: next,
          title: { vi: '', en: '' },
          description: { vi: '', en: '' },
        },
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div id="form-process_steps.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>
      <div id="form-process_steps.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput label="Heading — phần đầu" value={content.heading_lead} onChange={(v) => update('heading_lead', v)} />
        <I18nInput label="Heading — chữ highlight" value={content.heading_highlight} onChange={(v) => update('heading_highlight', v)} />
      </div>
      <div id="form-process_steps.description" className="scroll-mt-32">
        <I18nInput label="Mô tả" multiline rows={2} value={content.description} onChange={(v) => update('description', v)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={content.dark_theme ?? false}
          onChange={(e) => update('dark_theme', e.target.checked)}
          className="w-4 h-4"
        />
        Dark theme (nền tối)
      </label>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.steps.length} bước
          </p>
          <button onClick={addStep} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded">
            + Thêm bước
          </button>
        </div>
        {content.steps.map((step, idx) => (
          <details key={idx} id={`form-process_steps.step.${idx}`} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32">
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {step.step_number}. {step.title.vi || `(bước ${idx + 1})`}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput label="Số bước" value={step.step_number} onChange={(v) => updateStep(idx, { ...step, step_number: v })} placeholder="01" />
                <I18nInput label="Thời gian (vd 1-2 tuần)" value={step.duration ?? { vi: '', en: '' }} onChange={(v) => updateStep(idx, { ...step, duration: v })} />
              </div>
              <I18nInput label="Tiêu đề bước" value={step.title} onChange={(v) => updateStep(idx, { ...step, title: v })} />
              <I18nInput label="Mô tả" multiline rows={3} value={step.description} onChange={(v) => updateStep(idx, { ...step, description: v })} />
              <button onClick={() => removeStep(idx)} className="text-xs text-red-500 hover:underline">Xoá bước</button>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
