'use client'

import type { AboutContent } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function AboutForm({
  content,
  onChange,
}: {
  content: AboutContent
  onChange: (next: AboutContent) => void
}) {
  const update = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) =>
    onChange({ ...content, [key]: value })

  return (
    <div className="space-y-4">
      <div id="form-about.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-about.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div id="form-about.description" className="scroll-mt-32">
        <I18nInput
          label="Mô tả"
          multiline
          value={content.description}
          onChange={(v) => update('description', v)}
        />
      </div>

      <div
        id="form-about.stats"
        className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
      >
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          3 chỉ số (stats)
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput
            label="Stat 1 — số"
            value={content.stat1_value}
            onChange={(v) => update('stat1_value', v)}
            placeholder="10+"
          />
          <I18nInput
            label="Stat 1 — nhãn"
            value={content.stat1_label}
            onChange={(v) => update('stat1_label', v)}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput
            label="Stat 2 — số"
            value={content.stat2_value}
            onChange={(v) => update('stat2_value', v)}
          />
          <I18nInput
            label="Stat 2 — nhãn"
            value={content.stat2_label}
            onChange={(v) => update('stat2_label', v)}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput
            label="Stat 3 — số"
            value={content.stat3_value}
            onChange={(v) => update('stat3_value', v)}
          />
          <I18nInput
            label="Stat 3 — nhãn"
            value={content.stat3_label}
            onChange={(v) => update('stat3_label', v)}
          />
        </div>
      </div>

      <div id="form-about.cta" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="CTA — text"
          value={content.cta_label}
          onChange={(v) => update('cta_label', v)}
        />
        <TextInput
          label="CTA — link"
          value={content.cta_href}
          onChange={(v) => update('cta_href', v)}
        />
      </div>

      <div id="form-about.video" className="space-y-3 scroll-mt-32">
        <TextInput
          label="Thumbnail image (URL)"
          value={content.thumbnail_src}
          onChange={(v) => update('thumbnail_src', v)}
          hint="Phase 2B sẽ thêm upload"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput
            label="Video embed URL"
            value={content.video_embed_url}
            onChange={(v) => update('video_embed_url', v)}
            placeholder="https://www.youtube.com/embed/..."
          />
          <TextInput
            label="Thời lượng video"
            value={content.video_duration}
            onChange={(v) => update('video_duration', v)}
            placeholder="2:45"
          />
        </div>
      </div>
    </div>
  )
}
