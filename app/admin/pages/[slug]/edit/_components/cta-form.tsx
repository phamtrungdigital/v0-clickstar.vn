'use client'

import type { CtaContent } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function CtaForm({
  content,
  onChange,
}: {
  content: CtaContent
  onChange: (next: CtaContent) => void
}) {
  const update = <K extends keyof CtaContent>(key: K, value: CtaContent[K]) =>
    onChange({ ...content, [key]: value })

  return (
    <div className="space-y-4">
      <div id="form-cta.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-cta.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div id="form-cta.cta" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="CTA — text nút"
          value={content.cta_label}
          onChange={(v) => update('cta_label', v)}
        />
        <TextInput
          label="CTA — link"
          value={content.cta_href}
          onChange={(v) => update('cta_href', v)}
        />
      </div>

      <div id="form-cta.phone" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="Hotline — label"
          value={content.phone_label}
          onChange={(v) => update('phone_label', v)}
        />
        <TextInput
          label="Số điện thoại"
          value={content.phone}
          onChange={(v) => update('phone', v)}
        />
      </div>

      <div id="form-cta.partners" className="space-y-3 scroll-mt-32">
        <I18nInput
          label="Trust label"
          value={content.trust_label}
          onChange={(v) => update('trust_label', v)}
        />
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Đối tác (mỗi tên 1 dòng)
          </label>
          <textarea
            value={content.partner_names.join('\n')}
            onChange={(e) =>
              update(
                'partner_names',
                e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            rows={6}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-mono"
          />
        </div>
      </div>
    </div>
  )
}
