'use client'

import { Search } from 'lucide-react'
import { I18nInput } from './i18n-input'
import { ImagePicker } from './image-picker'

export type SeoFields = {
  seo_title: { vi: string; en: string }
  seo_description: { vi: string; en: string }
  og_image: string | null
}

export function SeoForm({
  value,
  onChange,
}: {
  value: SeoFields
  onChange: (next: SeoFields) => void
}) {
  return (
    <details className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <summary className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none border-b border-slate-200 dark:border-slate-700">
        <Search className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          SEO & Social Share
        </span>
        <span className="text-[10px] uppercase font-mono text-slate-400 ml-auto">seo</span>
      </summary>

      <div className="p-4 space-y-3">
        <I18nInput
          label="Meta Title (hiện ở tab trình duyệt + Google search)"
          value={value.seo_title}
          onChange={(v) => onChange({ ...value, seo_title: v })}
        />
        <I18nInput
          label="Meta Description (hiện dưới title trong Google)"
          multiline
          rows={2}
          value={value.seo_description}
          onChange={(v) => onChange({ ...value, seo_description: v })}
        />
        <ImagePicker
          label="OG Image (ảnh khi share Facebook/Zalo/Twitter)"
          value={value.og_image ?? ''}
          onChange={(v) => onChange({ ...value, og_image: v.trim() === '' ? null : v })}
          hint="Tỷ lệ tốt nhất: 1200×630px (1.91:1)"
        />
      </div>
    </details>
  )
}
