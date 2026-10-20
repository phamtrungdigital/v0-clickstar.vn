'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { AboutStoryContent, I18n } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'
import { ImagePicker } from './image-picker'

export function AboutStoryForm({
  content,
  onChange,
}: {
  content: AboutStoryContent
  onChange: (next: AboutStoryContent) => void
}) {
  const update = <K extends keyof AboutStoryContent>(key: K, value: AboutStoryContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateParagraph = (idx: number, val: I18n) => {
    const paragraphs = [...content.paragraphs]
    paragraphs[idx] = val
    onChange({ ...content, paragraphs })
  }
  const addParagraph = () =>
    onChange({ ...content, paragraphs: [...content.paragraphs, { vi: '', en: '' }] })
  const removeParagraph = (idx: number) =>
    onChange({ ...content, paragraphs: content.paragraphs.filter((_, i) => i !== idx) })

  const updateIndustry = (idx: number, val: I18n) => {
    const industries = [...content.industries]
    industries[idx] = val
    onChange({ ...content, industries })
  }
  const addIndustry = () =>
    onChange({ ...content, industries: [...content.industries, { vi: '', en: '' }] })
  const removeIndustry = (idx: number) =>
    onChange({ ...content, industries: content.industries.filter((_, i) => i !== idx) })

  return (
    <div className="space-y-4">
      <div id="form-about_story.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-about_story.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div id="form-about_story.image" className="scroll-mt-32">
        <ImagePicker
          label="Ảnh story (4:3, ~800×600)"
          value={content.image}
          onChange={(v) => update('image', v)}
        />
      </div>
      <div id="form-about_story.image_alt" className="scroll-mt-32">
        <I18nInput
          label="Alt text ảnh"
          value={content.image_alt}
          onChange={(v) => update('image_alt', v)}
        />
      </div>

      {/* Floating stat card */}
      <div id="form-about_story.stat" className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32">
        <p className="lg:col-span-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          Card nổi (Award badge)
        </p>
        <TextInput
          label="Số nổi bật"
          value={content.stat_value}
          onChange={(v) => update('stat_value', v)}
          hint="VD: 10+"
        />
        <I18nInput
          label="Mô tả số"
          value={content.stat_label}
          onChange={(v) => update('stat_label', v)}
        />
      </div>

      {/* Paragraphs */}
      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.paragraphs.length} đoạn văn
          </p>
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm đoạn
          </button>
        </div>
        {content.paragraphs.map((p, idx) => (
          <details
            key={idx}
            id={`form-about_story.paragraph.${idx}`}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span>
                {idx + 1}. {p.vi.slice(0, 60) || '(trống)'}
                {p.vi.length > 60 ? '…' : ''}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  removeParagraph(idx)
                }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </summary>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput
                label={`Đoạn ${idx + 1}`}
                value={p}
                onChange={(v) => updateParagraph(idx, v)}
                multiline
                rows={4}
              />
            </div>
          </details>
        ))}
      </div>

      {/* Industries chip list */}
      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div id="form-about_story.industries_label" className="scroll-mt-32">
          <I18nInput
            label="Label trước chip"
            value={content.industries_label}
            onChange={(v) => update('industries_label', v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.industries.length} chip ngành
          </p>
          <button
            type="button"
            onClick={addIndustry}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm chip
          </button>
        </div>
        {content.industries.map((ind, idx) => (
          <div
            key={idx}
            id={`form-about_story.industry.${idx}`}
            className="flex items-start gap-2 scroll-mt-32"
          >
            <div className="flex-1">
              <I18nInput
                label={`Chip ${idx + 1}`}
                value={ind}
                onChange={(v) => updateIndustry(idx, v)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeIndustry(idx)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded mt-5"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
