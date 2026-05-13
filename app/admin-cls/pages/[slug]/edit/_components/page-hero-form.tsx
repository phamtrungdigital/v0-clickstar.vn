'use client'

import type { PageHeroContent } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function PageHeroForm({
  content,
  onChange,
}: {
  content: PageHeroContent
  onChange: (next: PageHeroContent) => void
}) {
  const update = <K extends keyof PageHeroContent>(key: K, value: PageHeroContent[K]) =>
    onChange({ ...content, [key]: value })

  return (
    <div className="space-y-4">
      <div id="form-page_hero.badge" className="scroll-mt-32">
        <I18nInput label="Badge (chữ nhỏ trên cùng)" value={content.badge} onChange={(v) => update('badge', v)} />
      </div>

      <div id="form-page_hero.heading" className="scroll-mt-32">
        <I18nInput
          label="Heading (tiêu đề lớn)"
          multiline
          rows={2}
          value={content.heading}
          onChange={(v) => update('heading', v)}
        />
      </div>

      <div id="form-page_hero.description" className="scroll-mt-32">
        <I18nInput
          label="Mô tả"
          multiline
          rows={3}
          value={content.description}
          onChange={(v) => update('description', v)}
        />
      </div>

      <div id="form-page_hero.cta" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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
    </div>
  )
}
