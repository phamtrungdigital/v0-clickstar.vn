'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { TeamMember, TeamMemberFormData } from '@/lib/cms/team-members-types'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { EditorBar, SaveStatus, SectionCard, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
import { createTeamMember, updateTeamMember } from '../actions'

export function TeamEditor({
  member,
  mode,
}: {
  member: TeamMember | null
  mode: 'new' | 'edit'
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [draft, setDraft] = useState<TeamMemberFormData>(() => ({
    name: member?.name ?? '',
    role_vi: member?.role_vi ?? '',
    role_en: member?.role_en ?? '',
    image: member?.image ?? '',
    bio_vi: member?.bio_vi ?? '',
    bio_en: member?.bio_en ?? '',
    linkedin: member?.linkedin ?? '',
    facebook: member?.facebook ?? '',
    twitter: member?.twitter ?? '',
    instagram: member?.instagram ?? '',
    sort_order: member?.sort_order ?? 50,
    enabled: member?.enabled ?? true,
  }))

  const update = <K extends keyof TeamMemberFormData>(key: K, value: TeamMemberFormData[K]) => {
    setDraft((p) => ({ ...p, [key]: value }))
    setStatus('dirty')
  }

  const handleSave = () => {
    startTransition(async () => {
      const result =
        mode === 'new' ? await createTeamMember(draft) : await updateTeamMember(member!.id, draft)
      if ('error' in result && result.error) {
        setStatus('error')
        setErrorMsg(result.error)
        return
      }
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
      if (mode === 'new' && 'id' in result && result.id) {
        router.push(`/admin-cls/team/${result.id}/edit`)
      }
    })
  }

  return (
    <div>
      <EditorBar
        backHref="/admin-cls/team"
        title={mode === 'new' ? 'Thành viên mới' : draft.name || '(không tên)'}
        subtitle="Đồng bộ ở trang chủ, trang Giới thiệu và mọi trang có khối Đội ngũ"
      >
        <SaveStatus status={status} errorMsg={errorMsg} />
        <button onClick={handleSave} disabled={isPending} className={btn('primary')}>
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isPending ? 'Đang lưu' : 'Lưu'}
        </button>
      </EditorBar>

      <div className="mx-auto max-w-3xl space-y-4">
      {/* Trạng thái + thứ tự */}
      <Section title="Trạng thái">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Trạng thái</Label>
            <label className="mt-0.5 flex h-9 items-center gap-2.5">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => update('enabled', e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-[14px] text-[var(--ad-fg)]">{draft.enabled ? 'Hiện trên website' : 'Ẩn'}</span>
            </label>
          </div>
          <div>
            <Label>Thứ tự hiển thị (cao trước)</Label>
            <input
              type="number"
              value={draft.sort_order}
              onChange={(e) => update('sort_order', parseInt(e.target.value) || 0)}
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      {/* Info chung */}
      <Section title="Thông tin">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <Label required>Tên</Label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputCls}
              placeholder="VD: Quỳnh Hương"
            />
          </div>
          <div>
            <Label>Vai trò (VI)</Label>
            <input
              type="text"
              value={draft.role_vi ?? ''}
              onChange={(e) => update('role_vi', e.target.value)}
              className={inputCls}
              placeholder="VD: Co-Founder"
            />
          </div>
          <div>
            <Label>Vai trò (EN)</Label>
            <input
              type="text"
              value={draft.role_en ?? ''}
              onChange={(e) => update('role_en', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <ImagePicker
          label="Ảnh đại diện (avatar tròn — vuông 1:1, ~400×400)"
          value={draft.image ?? ''}
          onChange={(v) => update('image', v)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <Label>Bio (VI)</Label>
            <textarea
              value={draft.bio_vi ?? ''}
              onChange={(e) => update('bio_vi', e.target.value)}
              rows={3}
              className={inputCls}
              placeholder="Mô tả ngắn về thành viên..."
            />
          </div>
          <div>
            <Label>Bio (EN)</Label>
            <textarea
              value={draft.bio_en ?? ''}
              onChange={(e) => update('bio_en', e.target.value)}
              rows={3}
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      {/* Social links */}
      <Section title="Social links (để trống = ẩn icon)">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <Label>LinkedIn URL</Label>
            <input
              type="url"
              value={draft.linkedin ?? ''}
              onChange={(e) => update('linkedin', e.target.value)}
              className={inputCls}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <Label>Facebook URL</Label>
            <input
              type="url"
              value={draft.facebook ?? ''}
              onChange={(e) => update('facebook', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Twitter / X URL</Label>
            <input
              type="url"
              value={draft.twitter ?? ''}
              onChange={(e) => update('twitter', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Instagram URL</Label>
            <input
              type="url"
              value={draft.instagram ?? ''}
              onChange={(e) => update('instagram', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </Section>
      </div>
    </div>
  )
}

const inputCls = fieldInputClass

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className={fieldLabelClass}>
      {children}
      {required && <span className="ml-0.5 text-[#d70015]">*</span>}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SectionCard title={title} bodyClassName="space-y-3.5 px-5 pb-5 pt-3">
      {children}
    </SectionCard>
  )
}
