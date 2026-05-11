'use client'

import type { TeamContent, TeamMemberItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function TeamForm({
  content,
  onChange,
}: {
  content: TeamContent
  onChange: (next: TeamContent) => void
}) {
  const update = <K extends keyof TeamContent>(key: K, value: TeamContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateMember = (index: number, next: TeamMemberItem) => {
    const members = [...content.members]
    members[index] = next
    onChange({ ...content, members })
  }

  return (
    <div className="space-y-4">
      <div id="form-team.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-team.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div id="form-team.description" className="scroll-mt-32">
        <I18nInput
          label="Mô tả"
          multiline
          value={content.description}
          onChange={(v) => update('description', v)}
        />
      </div>

      <div id="form-team.cta" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
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

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.members.length} thành viên
        </p>
        {content.members.map((m, idx) => (
          <details
            key={idx}
            id={`form-team.member.${idx}`}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {m.name || `(thành viên ${idx + 1})`} — {m.role.vi}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput
                  label="Tên"
                  value={m.name}
                  onChange={(v) => updateMember(idx, { ...m, name: v })}
                />
                <TextInput
                  label="Avatar (URL)"
                  value={m.image}
                  onChange={(v) => updateMember(idx, { ...m, image: v })}
                />
              </div>
              <I18nInput
                label="Vai trò"
                value={m.role}
                onChange={(v) => updateMember(idx, { ...m, role: v })}
              />
              <p className="text-[10px] uppercase font-semibold text-slate-500">Social links (để trống nếu không có)</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput
                  label="Facebook"
                  value={m.facebook ?? ''}
                  onChange={(v) =>
                    updateMember(idx, { ...m, facebook: v.trim() === '' ? undefined : v })
                  }
                />
                <TextInput
                  label="Twitter"
                  value={m.twitter ?? ''}
                  onChange={(v) =>
                    updateMember(idx, { ...m, twitter: v.trim() === '' ? undefined : v })
                  }
                />
                <TextInput
                  label="LinkedIn"
                  value={m.linkedin ?? ''}
                  onChange={(v) =>
                    updateMember(idx, { ...m, linkedin: v.trim() === '' ? undefined : v })
                  }
                />
                <TextInput
                  label="Instagram"
                  value={m.instagram ?? ''}
                  onChange={(v) =>
                    updateMember(idx, { ...m, instagram: v.trim() === '' ? undefined : v })
                  }
                />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
