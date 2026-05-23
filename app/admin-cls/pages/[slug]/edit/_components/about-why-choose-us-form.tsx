'use client'

import { Plus, Trash2 } from 'lucide-react'
import type {
  AboutWhyChooseUsContent,
  AboutWhyChooseUsImage,
  I18n,
} from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'
import { ImagePicker } from './image-picker'

export function AboutWhyChooseUsForm({
  content,
  onChange,
}: {
  content: AboutWhyChooseUsContent
  onChange: (next: AboutWhyChooseUsContent) => void
}) {
  const update = <K extends keyof AboutWhyChooseUsContent>(
    key: K,
    value: AboutWhyChooseUsContent[K],
  ) => onChange({ ...content, [key]: value })

  const updateFeature = (idx: number, val: I18n) => {
    const features = [...content.features]
    features[idx] = val
    onChange({ ...content, features })
  }
  const addFeature = () =>
    onChange({ ...content, features: [...content.features, { vi: '', en: '' }] })
  const removeFeature = (idx: number) =>
    onChange({ ...content, features: content.features.filter((_, i) => i !== idx) })

  const updateImage = (idx: number, next: AboutWhyChooseUsImage) => {
    const images = [...content.images]
    images[idx] = next
    onChange({ ...content, images })
  }
  const addImage = () =>
    onChange({
      ...content,
      images: [...content.images, { src: '', alt: { vi: '', en: '' }, aspect: '4/3' }],
    })
  const removeImage = (idx: number) =>
    onChange({ ...content, images: content.images.filter((_, i) => i !== idx) })

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
        label="Mô tả"
        value={content.description}
        onChange={(v) => update('description', v)}
        multiline
        rows={3}
      />

      {/* Features (checkmark list) */}
      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.features.length} checkmark feature
          </p>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm
          </button>
        </div>
        {content.features.map((f, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex-1">
              <I18nInput label={`Feature ${idx + 1}`} value={f} onChange={(v) => updateFeature(idx, v)} />
            </div>
            <button
              type="button"
              onClick={() => removeFeature(idx)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded mt-5"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <I18nInput
          label="Label nút CTA"
          value={content.cta_label}
          onChange={(v) => update('cta_label', v)}
        />
        <TextInput
          label="Link CTA"
          value={content.cta_href}
          onChange={(v) => update('cta_href', v)}
          hint="VD: /contact"
        />
      </div>

      {/* Images gallery */}
      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.images.length} ảnh gallery (nên 4 ảnh — 2x2 staggered)
          </p>
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm ảnh
          </button>
        </div>
        {content.images.map((img, idx) => (
          <details
            key={idx}
            open={idx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span>
                Ảnh {idx + 1} ({img.aspect})
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  removeImage(idx)
                }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <ImagePicker
                label="URL ảnh"
                value={img.src}
                onChange={(v) => updateImage(idx, { ...img, src: v })}
              />
              <I18nInput
                label="Alt text"
                value={img.alt}
                onChange={(v) => updateImage(idx, { ...img, alt: v })}
              />
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tỉ lệ khung
                </label>
                <select
                  value={img.aspect}
                  onChange={(e) =>
                    updateImage(idx, { ...img, aspect: e.target.value as '4/3' | '4/5' })
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                >
                  <option value="4/3">4:3 (ngang)</option>
                  <option value="4/5">4:5 (dọc)</option>
                </select>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
