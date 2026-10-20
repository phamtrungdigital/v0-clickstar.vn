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
    <details className="group rounded-2xl border border-[var(--ad-line)] bg-[var(--ad-surface)] shadow-[var(--ad-shadow)]">
      <summary className="flex cursor-pointer select-none items-center gap-2 px-4 py-3 group-open:border-b group-open:border-[var(--ad-line)]">
        <Search className="h-4 w-4 text-[var(--ad-fg-3)]" />
        <span className="text-[14.5px] font-semibold text-[var(--ad-fg)]">SEO và chia sẻ mạng xã hội</span>
      </summary>

      <div className="space-y-3.5 p-5">
        <I18nInput
          label="Tiêu đề SEO (hiện ở tab trình duyệt và kết quả Google)"
          value={value.seo_title}
          onChange={(v) => onChange({ ...value, seo_title: v })}
        />
        <I18nInput
          label="Mô tả SEO (hiện dưới tiêu đề trong Google)"
          multiline
          rows={2}
          value={value.seo_description}
          onChange={(v) => onChange({ ...value, seo_description: v })}
        />
        <ImagePicker
          label="Ảnh chia sẻ (hiện khi gửi link lên Facebook, Zalo)"
          value={value.og_image ?? ''}
          onChange={(v) => onChange({ ...value, og_image: v.trim() === '' ? null : v })}
          hint="Tỷ lệ tốt nhất 1200×630px"
        />
      </div>
    </details>
  )
}
