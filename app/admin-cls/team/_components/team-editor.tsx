'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import type { TeamMember, TeamMemberFormData } from '@/lib/cms/team-members-types'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
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
    <div className="space-y-3 max-w-3xl">
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin-cls/team" className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              {mode === 'new' ? 'Thành viên mới' : draft.name || '(không tên)'}
            </h1>
            <p className="text-[11px] text-slate-500">
              Sync giữa /, /about và mọi page có section Team
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã lưu
            </span>
          )}
          {status === 'dirty' && <span className="text-xs text-amber-600">● Chưa lưu</span>}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs text-red-600" title={errorMsg}>
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg.slice(0, 40)}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Trạng thái + thứ tự */}
      <Section title="Trạng thái">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Trạng thái</Label>
            <label className="flex items-center gap-2 h-9 mt-0.5">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => update('enabled', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">{draft.enabled ? 'Hiện trên website' : 'Ẩn'}</span>
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
  )
}

const inputCls =
  'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h2>
      {children}
    </div>
  )
}
