'use client'

import type { HeroContent } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function HeroForm({
  content,
  onChange,
}: {
  content: HeroContent
  onChange: (next: HeroContent) => void
}) {
  const update = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) =>
    onChange({ ...content, [key]: value })

  return (
    <div className="space-y-4">
      <div id="form-hero.badge" className="scroll-mt-32">
        <I18nInput label="Badge" value={content.badge} onChange={(v) => update('badge', v)} />
      </div>

      <div
        id="form-hero.heading"
        className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
      >
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          Heading (5 phần ghép lại)
        </p>
        <I18nInput
          label="Heading — phần đầu"
          value={content.heading_lead}
          onChange={(v) => update('heading_lead', v)}
        />
        <TextInput
          label="Heading — số nổi bật (vd 500+)"
          value={content.heading_number}
          onChange={(v) => update('heading_number', v)}
        />
        <I18nInput
          label="Heading — phần giữa"
          value={content.heading_middle}
          onChange={(v) => update('heading_middle', v)}
        />
        <I18nInput
          label="Heading — chữ highlight"
          value={content.heading_highlight}
          onChange={(v) => update('heading_highlight', v)}
        />
        <I18nInput
          label="Heading — phần cuối"
          value={content.heading_tail}
          onChange={(v) => update('heading_tail', v)}
        />
      </div>

      <div id="form-hero.description" className="scroll-mt-32">
        <I18nInput
          label="Mô tả"
          multiline
          value={content.description}
          onChange={(v) => update('description', v)}
        />
      </div>

      <div id="form-hero.cta" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="CTA — text nút"
          value={content.cta_label}
          onChange={(v) => update('cta_label', v)}
        />
        <TextInput
          label="CTA — link"
          value={content.cta_href}
          onChange={(v) => update('cta_href', v)}
          placeholder="#contact"
        />
      </div>

      <div id="form-hero.support" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="Hỗ trợ — label"
          value={content.support_label}
          onChange={(v) => update('support_label', v)}
        />
        <TextInput
          label="Số điện thoại"
          value={content.support_phone}
          onChange={(v) => update('support_phone', v)}
        />
      </div>

      <div id="form-hero.image" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <TextInput
          label="Hero image (URL)"
          value={content.image_src}
          onChange={(v) => update('image_src', v)}
          hint="Phase 2B sẽ thêm upload"
        />
        <I18nInput
          label="Hero image — alt text"
          value={content.image_alt}
          onChange={(v) => update('image_alt', v)}
        />
      </div>
    </div>
  )
}
