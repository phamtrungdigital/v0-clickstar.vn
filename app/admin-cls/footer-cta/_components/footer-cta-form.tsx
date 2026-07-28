'use client'

import { useState, useTransition } from 'react'
import { PanelBottom, Megaphone, Save, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { saveWebContent } from '../actions'
import {
  CTA_SLUGS,
  SOCIAL_KEYS,
  DEFAULT_FOOTER,
  DEFAULT_SERVICE_CTAS,
  type WebContent,
  type WebContentUpdate,
  type FooterContent,
  type ServiceCta,
  type LinkItem,
} from '@/lib/cms/web-content-shared'
import type { I18n } from '@/lib/cms/types'

const CTA_LABELS: Record<string, string> = {
  'digital-marketing': 'Trang Digital Marketing — /services/digital-marketing',
  website: 'Trang Thiết kế Website — /services/website',
  'speech-insight-ai': 'Trang Phân tích cuộc gọi AI — /services/speech-insight-ai',
}

function initDraft(initial: WebContent | null): WebContentUpdate {
  const footer: FooterContent = { ...DEFAULT_FOOTER, ...(initial?.footer || {}) }
  const service_ctas: Record<string, ServiceCta> = {}
  for (const slug of CTA_SLUGS) {
    service_ctas[slug] = initial?.service_ctas?.[slug] ?? DEFAULT_SERVICE_CTAS[slug]
  }
  return { footer, service_ctas }
}

export function FooterCtaForm({ initial }: { initial: WebContent | null }) {
  const [draft, setDraft] = useState<WebContentUpdate>(() => initDraft(initial))
  const [tab, setTab] = useState<'footer' | 'cta'>('footer')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const dirty = () => setStatus('dirty')

  const setFooter = (patch: Partial<FooterContent>) => {
    setDraft((d) => ({ ...d, footer: { ...d.footer, ...patch } }))
    dirty()
  }
  const setCta = (slug: string, patch: Partial<ServiceCta>) => {
    setDraft((d) => ({ ...d, service_ctas: { ...d.service_ctas, [slug]: { ...d.service_ctas[slug], ...patch } } }))
    dirty()
  }

  const handleSave = () => {
    startTransition(async () => {
      const r = await saveWebContent(draft)
      if (r?.error) {
        setStatus('error')
        setErrorMsg(r.error)
      } else {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2500)
      }
    })
  }

  return (
    <div className="space-y-3 max-w-4xl">
      {/* Header */}
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <PanelBottom className="w-4 h-4 text-primary" />
            Footer &amp; CTA
          </h1>
          <p className="text-[11px] text-slate-500">Nội dung footer toàn site + khối kêu gọi (CTA) các trang dịch vụ</p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu
            </span>
          )}
          {status === 'dirty' && <span className="text-xs text-amber-600">● Chưa lưu</span>}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs text-red-600" title={errorMsg}>
              <AlertCircle className="w-3.5 h-3.5" /> Lỗi
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

      {/* Tabs */}
      <div className="flex gap-2">
        <TabBtn active={tab === 'footer'} onClick={() => setTab('footer')} icon={<PanelBottom className="w-4 h-4" />}>
          Footer
        </TabBtn>
        <TabBtn active={tab === 'cta'} onClick={() => setTab('cta')} icon={<Megaphone className="w-4 h-4" />}>
          CTA dịch vụ
        </TabBtn>
      </div>

      {tab === 'footer' ? (
        <FooterTab footer={draft.footer} setFooter={setFooter} />
      ) : (
        <CtaTab ctas={draft.service_ctas} setCta={setCta} />
      )}
    </div>
  )
}

/* ───────── Footer tab ───────── */

function FooterTab({
  footer,
  setFooter,
}: {
  footer: FooterContent
  setFooter: (patch: Partial<FooterContent>) => void
}) {
  return (
    <>
      <Section title="Giới thiệu & mạng xã hội">
        <I18nField
          label="Mô tả ngắn"
          value={footer.description}
          onChange={(v) => setFooter({ description: v })}
          textarea
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOCIAL_KEYS.map((key) => (
            <Field key={key} label={`${key[0].toUpperCase()}${key.slice(1)} URL`}>
              <TextInput
                value={footer.social?.[key] ?? ''}
                onChange={(v) => setFooter({ social: { ...footer.social, [key]: v } })}
                placeholder="https://… (để trống = ẩn icon)"
              />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Liên hệ">
        <I18nField label="Tiêu đề cột" value={footer.contact_title} onChange={(v) => setFooter({ contact_title: v })} />
        <I18nField
          label="Địa chỉ"
          value={footer.contact_address}
          onChange={(v) => setFooter({ contact_address: v })}
          textarea
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Số điện thoại">
            <TextInput value={footer.contact_phone} onChange={(v) => setFooter({ contact_phone: v })} />
          </Field>
          <Field label="Email">
            <TextInput value={footer.contact_email} onChange={(v) => setFooter({ contact_email: v })} />
          </Field>
        </div>
      </Section>

      <Section title="Cột “Dịch vụ”">
        <I18nField label="Tiêu đề cột" value={footer.services_title} onChange={(v) => setFooter({ services_title: v })} />
        <LinkListEditor list={footer.services_links} onChange={(l) => setFooter({ services_links: l })} />
      </Section>

      <Section title="Cột “Liên kết”">
        <I18nField label="Tiêu đề cột" value={footer.quick_title} onChange={(v) => setFooter({ quick_title: v })} />
        <LinkListEditor list={footer.quick_links} onChange={(l) => setFooter({ quick_links: l })} />
      </Section>

      <Section title="Đăng ký nhận tin">
        <I18nField label="Tiêu đề" value={footer.newsletter_title} onChange={(v) => setFooter({ newsletter_title: v })} />
        <I18nField
          label="Mô tả"
          value={footer.newsletter_desc}
          onChange={(v) => setFooter({ newsletter_desc: v })}
          textarea
        />
      </Section>

      <Section title="Thanh dưới (bản quyền & chính sách)">
        <I18nField label="Dòng bản quyền (tự thêm © + năm)" value={footer.copyright} onChange={(v) => setFooter({ copyright: v })} />
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Link chính sách</label>
          <LinkListEditor list={footer.policy_links} onChange={(l) => setFooter({ policy_links: l })} />
        </div>
      </Section>
    </>
  )
}

/* ───────── CTA tab ───────── */

function CtaTab({
  ctas,
  setCta,
}: {
  ctas: Record<string, ServiceCta>
  setCta: (slug: string, patch: Partial<ServiceCta>) => void
}) {
  return (
    <>
      {CTA_SLUGS.map((slug) => {
        const c = ctas[slug]
        if (!c) return null
        return (
          <Section key={slug} title={CTA_LABELS[slug] || slug}>
            <I18nField label="Tiêu đề" value={c.heading} onChange={(v) => setCta(slug, { heading: v })} />
            <I18nField label="Mô tả" value={c.description} onChange={(v) => setCta(slug, { description: v })} textarea />
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-1">
              <p className="text-xs font-semibold text-slate-500 mb-2">Nút chính</p>
              <I18nField label="Nhãn nút" value={c.primary.label} onChange={(v) => setCta(slug, { primary: { ...c.primary, label: v } })} />
              <Field label="Đường dẫn (vd /contact hoặc tel:0977713428)">
                <TextInput value={c.primary.href} onChange={(v) => setCta(slug, { primary: { ...c.primary, href: v } })} />
              </Field>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">Nút phụ</p>
              <I18nField label="Nhãn nút" value={c.secondary.label} onChange={(v) => setCta(slug, { secondary: { ...c.secondary, label: v } })} />
              <Field label="Đường dẫn">
                <TextInput value={c.secondary.href} onChange={(v) => setCta(slug, { secondary: { ...c.secondary, href: v } })} />
              </Field>
            </div>
          </Section>
        )
      })}
    </>
  )
}

/* ───────── reusable UI ───────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
    />
  )
}

/** Nhập song ngữ vi/en (1 dòng 2 input, hoặc textarea). */
function I18nField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string
  value: I18n
  onChange: (v: I18n) => void
  textarea?: boolean
}) {
  const cls =
    'w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm'
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(['vi', 'en'] as const).map((lng) =>
          textarea ? (
            <textarea
              key={lng}
              value={value[lng]}
              rows={2}
              placeholder={lng.toUpperCase()}
              onChange={(e) => onChange({ ...value, [lng]: e.target.value })}
              className={cls}
            />
          ) : (
            <input
              key={lng}
              type="text"
              value={value[lng]}
              placeholder={lng.toUpperCase()}
              onChange={(e) => onChange({ ...value, [lng]: e.target.value })}
              className={cls}
            />
          )
        )}
      </div>
    </div>
  )
}

/** Danh sách link: mỗi dòng nhãn vi/en + đường dẫn. */
function LinkListEditor({ list, onChange }: { list: LinkItem[]; onChange: (l: LinkItem[]) => void }) {
  const update = (i: number, patch: Partial<LinkItem>) => {
    const next = [...list]
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }
  const updateLabel = (i: number, lng: 'vi' | 'en', v: string) =>
    update(i, { label: { ...list[i].label, [lng]: v } })

  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item.label.vi}
            placeholder="Nhãn VI"
            onChange={(e) => updateLabel(i, 'vi', e.target.value)}
            className="flex-1 min-w-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
          />
          <input
            type="text"
            value={item.label.en}
            placeholder="Nhãn EN"
            onChange={(e) => updateLabel(i, 'en', e.target.value)}
            className="flex-1 min-w-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
          />
          <input
            type="text"
            value={item.href}
            placeholder="/duong-dan"
            onChange={(e) => update(i, { href: e.target.value })}
            className="flex-1 min-w-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
          />
          <button
            type="button"
            onClick={() => onChange(list.filter((_, idx) => idx !== i))}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
            aria-label="Xoá"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...list, { label: { vi: '', en: '' }, href: '' }])}
        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-primary hover:bg-primary/5 rounded"
      >
        <Plus className="w-3 h-3" /> Thêm dòng
      </button>
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition-colors ${
        active
          ? 'bg-primary/5 border-primary/40 text-primary'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
