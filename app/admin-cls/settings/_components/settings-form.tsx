'use client'

import { useState, useTransition } from 'react'
import { Save, CheckCircle2, AlertCircle, Globe, Phone, Share2 } from 'lucide-react'
import type { SiteSettings } from '@/lib/cms/settings'
import { saveSettings, type SettingsUpdate } from '../actions'
import { I18nInput, TextInput } from '@/app/admin-cls/pages/[slug]/edit/_components/i18n-input'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { EditLangProvider, LangSwitcher } from '@/lib/cms/edit-lang-context'

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  return (
    <EditLangProvider initial="vi">
      <SettingsFormInner initial={initial} />
    </EditLangProvider>
  )
}

function SettingsFormInner({ initial }: { initial: SiteSettings }) {
  const [draft, setDraft] = useState<SettingsUpdate>(stripMeta(initial))
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const update = <K extends keyof SettingsUpdate>(key: K, value: SettingsUpdate[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setStatus('dirty')
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSettings(draft)
      if (result?.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2500)
      }
    })
  }

  return (
    <div className="space-y-3 max-w-3xl">
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">Cài đặt</h1>
          <p className="text-[11px] text-slate-500">Thông tin chung của website</p>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitcher />

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
              Lỗi
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* General info */}
      <Section icon={<Globe className="w-4 h-4 text-slate-400" />} title="Thông tin website">
        <I18nInput label="Tên website" value={draft.site_name} onChange={(v) => update('site_name', v)} />
        <I18nInput label="Tagline" value={draft.tagline} onChange={(v) => update('tagline', v)} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput label="URL website" value={draft.site_url} onChange={(v) => update('site_url', v)} />
          <TextInput
            label="Ngôn ngữ mặc định"
            value={draft.default_language}
            onChange={(v) => update('default_language', (v === 'en' ? 'en' : 'vi') as 'vi' | 'en')}
            hint="vi hoặc en"
          />
        </div>
      </Section>

      {/* Contact */}
      <Section icon={<Phone className="w-4 h-4 text-slate-400" />} title="Thông tin liên hệ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput label="Email liên hệ" value={draft.contact_email} onChange={(v) => update('contact_email', v)} />
          <TextInput label="Số điện thoại" value={draft.contact_phone} onChange={(v) => update('contact_phone', v)} />
        </div>
        <I18nInput label="Địa chỉ" value={draft.address} onChange={(v) => update('address', v)} />
        <TextInput label="Múi giờ" value={draft.timezone} onChange={(v) => update('timezone', v)} hint="VD: Asia/Ho_Chi_Minh" />
      </Section>

      {/* Social */}
      <Section icon={<Share2 className="w-4 h-4 text-slate-400" />} title="Mạng xã hội">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput label="Facebook URL" value={draft.facebook_url ?? ''} onChange={(v) => update('facebook_url', v.trim() === '' ? null : v)} />
          <TextInput label="Twitter / X URL" value={draft.twitter_url ?? ''} onChange={(v) => update('twitter_url', v.trim() === '' ? null : v)} />
          <TextInput label="LinkedIn URL" value={draft.linkedin_url ?? ''} onChange={(v) => update('linkedin_url', v.trim() === '' ? null : v)} />
          <TextInput label="Instagram URL" value={draft.instagram_url ?? ''} onChange={(v) => update('instagram_url', v.trim() === '' ? null : v)} />
          <TextInput label="YouTube URL" value={draft.youtube_url ?? ''} onChange={(v) => update('youtube_url', v.trim() === '' ? null : v)} />
        </div>
      </Section>

      {/* Default SEO */}
      <Section title="Default SEO (cho các trang không override)">
        <I18nInput
          label="Default Meta Title"
          value={draft.default_seo_title ?? { vi: '', en: '' }}
          onChange={(v) => update('default_seo_title', v)}
        />
        <I18nInput
          label="Default Meta Description"
          multiline
          rows={2}
          value={draft.default_seo_description ?? { vi: '', en: '' }}
          onChange={(v) => update('default_seo_description', v)}
        />
        <ImagePicker
          label="Default OG image"
          value={draft.default_og_image ?? ''}
          onChange={(v) => update('default_og_image', v.trim() === '' ? null : v)}
        />
      </Section>
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function stripMeta(s: SiteSettings) {
  const { id: _id, updated_at: _u, ...rest } = s as any
  return rest as SettingsUpdate
}
