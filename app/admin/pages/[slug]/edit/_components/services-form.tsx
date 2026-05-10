'use client'

import type { ServicesContent, ServiceItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

const COLORS: ServiceItem['color'][] = ['blue', 'purple', 'pink', 'amber', 'emerald', 'cyan']

export function ServicesForm({
  content,
  onChange,
}: {
  content: ServicesContent
  onChange: (next: ServicesContent) => void
}) {
  const update = <K extends keyof ServicesContent>(key: K, value: ServicesContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateService = (index: number, next: ServiceItem) => {
    const services = [...content.services]
    services[index] = next
    onChange({ ...content, services })
  }

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
        multiline
        value={content.description}
        onChange={(v) => update('description', v)}
      />

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.services.length} dịch vụ
        </p>
        {content.services.map((service, idx) => (
          <details key={idx} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {service.title.vi || `(chưa đặt tên ${idx + 1})`}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput
                  label="Icon (lucide-react)"
                  value={service.icon}
                  onChange={(v) => updateService(idx, { ...service, icon: v })}
                  hint="Vd: Megaphone, Globe, Bot, Database, Workflow, LayoutDashboard"
                />
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Màu
                  </label>
                  <select
                    value={service.color}
                    onChange={(e) => updateService(idx, { ...service, color: e.target.value as ServiceItem['color'] })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    {COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <I18nInput
                label="Tiêu đề"
                value={service.title}
                onChange={(v) => updateService(idx, { ...service, title: v })}
              />
              <I18nInput
                label="Mô tả"
                multiline
                rows={2}
                value={service.description}
                onChange={(v) => updateService(idx, { ...service, description: v })}
              />
              <I18nInput
                label="Tag"
                value={service.tag}
                onChange={(v) => updateService(idx, { ...service, tag: v })}
              />
            </div>
          </details>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <I18nInput
          label="Footer link — prefix"
          value={content.footer_link_prefix}
          onChange={(v) => update('footer_link_prefix', v)}
        />
        <I18nInput
          label="Footer link — text"
          value={content.footer_link_label}
          onChange={(v) => update('footer_link_label', v)}
        />
      </div>
      <TextInput
        label="Footer link — URL"
        value={content.footer_link_href}
        onChange={(v) => update('footer_link_href', v)}
      />

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          Pipeline architecture diagram
        </p>
        <I18nInput
          label="Eyebrow"
          value={content.pipeline_eyebrow}
          onChange={(v) => update('pipeline_eyebrow', v)}
        />
        <I18nInput
          label="Heading"
          value={content.pipeline_heading}
          onChange={(v) => update('pipeline_heading', v)}
        />
        <I18nInput
          label="Subtitle"
          multiline
          rows={2}
          value={content.pipeline_subtitle}
          onChange={(v) => update('pipeline_subtitle', v)}
        />
        <TextInput
          label="Image src"
          value={content.pipeline_image_src}
          onChange={(v) => update('pipeline_image_src', v)}
        />
        <I18nInput
          label="Image alt"
          value={content.pipeline_image_alt}
          onChange={(v) => update('pipeline_image_alt', v)}
        />
      </div>
    </div>
  )
}
