'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, AlertCircle, Upload, Loader2, Eye, ImageIcon } from 'lucide-react'
import {
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncement,
  deleteAnnouncement,
  saveAnnouncementSettings,
} from '../actions'
import { uploadMedia } from '@/lib/cms/upload'
import {
  ANNOUNCEMENT_TYPES,
  DISPLAY_MODES,
  TOAST_POSITIONS,
  typeMeta,
  emptyAnnouncement,
  DEFAULT_ANNOUNCEMENT_SETTINGS,
  type Announcement,
  type AnnouncementInput,
  type AnnouncementSettings,
  type AnnouncementSettingsUpdate,
} from '@/lib/cms/announcements-shared'
import type { I18n } from '@/lib/cms/types'
import { Card, Chip, EmptyState, PageHeader, SaveStatus, SectionCard, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
import { Switch } from '@/components/admin/switch'

function isoToLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function toInput(a: Announcement): AnnouncementInput {
  return {
    type: a.type,
    display_mode: a.display_mode,
    title: a.title,
    body: a.body,
    image_url: a.image_url,
    link_url: a.link_url,
    link_label: a.link_label,
    enabled: a.enabled,
    starts_at: a.starts_at,
    ends_at: a.ends_at,
    sort_order: a.sort_order,
  }
}

export function AnnouncementsManager({
  list,
  initialSettings,
}: {
  list: Announcement[]
  initialSettings: AnnouncementSettings | null
}) {
  const router = useRouter()
  const [editing, setEditing] = useState<{ id: string | null; draft: AnnouncementInput } | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const startNew = () => setEditing({ id: null, draft: emptyAnnouncement() })
  const startEdit = (a: Announcement) => setEditing({ id: a.id, draft: toInput(a) })

  const onToggle = (a: Announcement) => {
    setBusyId(a.id)
    toggleAnnouncement(a.id, !a.enabled).then(() => {
      setBusyId(null)
      router.refresh()
    })
  }
  const onDelete = (a: Announcement) => {
    if (!confirm('Xoá thông báo này?')) return
    setBusyId(a.id)
    deleteAnnouncement(a.id).then(() => {
      setBusyId(null)
      router.refresh()
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <PageHeader
        className="mb-1"
        title="Thông báo và popup"
        description="Tin tạo uy tín hiện cho khách khi vào website (ký hợp đồng, logo mới, đối tác). Giao diện popup công khai sẽ làm ở phần sau."
        actions={
          <button onClick={startNew} className={btn('primary')}>
            <Plus className="h-4 w-4" /> Thêm thông báo
          </button>
        }
      />

      {/* Editor */}
      {editing && (
        <AnnouncementEditor
          key={editing.id ?? 'new'}
          id={editing.id}
          initial={editing.draft}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            router.refresh()
          }}
        />
      )}

      {/* List */}
      <Card className="divide-y divide-[var(--ad-line)]">
        {list.length === 0 && (
          <EmptyState
            icon={<ImageIcon className="h-5 w-5" />}
            title="Chưa có thông báo nào"
            description="Bấm “Thêm thông báo” để tạo tin đầu tiên."
          />
        )}
        {list.map((a) => {
          const meta = typeMeta(a.type)
          return (
            <div key={a.id} className="flex items-center gap-3.5 px-5 py-3.5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--ad-fill)]">
                {a.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-[var(--ad-fg-3)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Chip tone="blue">{meta.label}</Chip>
                  <Chip>{a.display_mode === 'toast' ? 'Toast' : 'Modal'}</Chip>
                  {(a.starts_at || a.ends_at) && <Chip tone="warn">Có lịch</Chip>}
                </div>
                <div className="mt-1 truncate text-[14.5px] font-medium text-[var(--ad-fg)]">
                  {a.title.vi || a.title.en || '(chưa có tiêu đề)'}
                </div>
                {a.body.vi && <div className="truncate text-[13px] text-[var(--ad-fg-3)]">{a.body.vi}</div>}
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <Switch
                  checked={a.enabled}
                  disabled={busyId === a.id}
                  onChange={() => onToggle(a)}
                  label={a.enabled ? 'Đang bật, bấm để tắt' : 'Đang tắt, bấm để bật'}
                  title={a.enabled ? 'Đang bật, bấm để tắt' : 'Đang tắt, bấm để bật'}
                />
                <button
                  onClick={() => startEdit(a)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] hover:bg-[var(--ad-fill)] hover:text-[var(--ad-accent)]"
                  aria-label="Sửa"
                  title="Sửa"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(a)}
                  disabled={busyId === a.id}
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] hover:bg-[rgba(255,59,48,.10)] hover:text-[#d70015] disabled:opacity-50"
                  aria-label="Xoá"
                  title="Xoá"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </Card>

      {/* Settings */}
      <SettingsPanel initial={initialSettings} onSaved={() => router.refresh()} />
    </div>
  )
}

/* ───────── Editor ───────── */

function AnnouncementEditor({
  id,
  initial,
  onClose,
  onSaved,
}: {
  id: string | null
  initial: AnnouncementInput
  onClose: () => void
  onSaved: () => void
}) {
  const [draft, setDraft] = useState<AnnouncementInput>(initial)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const up = <K extends keyof AnnouncementInput>(k: K, v: AnnouncementInput[K]) =>
    setDraft((d) => ({ ...d, [k]: v }))

  const save = () => {
    setError('')
    startTransition(async () => {
      const r = id ? await updateAnnouncement(id, draft) : await createAnnouncement(draft)
      if (r?.error) setError(r.error)
      else onSaved()
    })
  }

  return (
    <Card className="space-y-4 p-5 ring-2 ring-[var(--ad-accent-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold tracking-[-0.018em] text-[var(--ad-fg)]">
          {id ? 'Sửa thông báo' : 'Thông báo mới'}
        </h2>
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] hover:bg-[var(--ad-fill)] hover:text-[var(--ad-fg)]"
          aria-label="Đóng"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Loại">
          <select
            value={draft.type}
            onChange={(e) => up('type', e.target.value as AnnouncementInput['type'])}
            className={inputCls}
          >
            {ANNOUNCEMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Kiểu hiển thị">
          <select
            value={draft.display_mode}
            onChange={(e) => up('display_mode', e.target.value as AnnouncementInput['display_mode'])}
            className={inputCls}
          >
            {DISPLAY_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label} — {m.desc}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <I18nField label="Tiêu đề" value={draft.title} onChange={(v) => up('title', v)} />
      <I18nField label="Mô tả" value={draft.body} onChange={(v) => up('body', v)} textarea />

      <ImageField label="Ảnh / logo (tùy chọn)" value={draft.image_url} onChange={(v) => up('image_url', v)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Link khi bấm (tùy chọn)">
          <input
            type="text"
            value={draft.link_url ?? ''}
            placeholder="/projects hoặc https://…"
            onChange={(e) => up('link_url', e.target.value || null)}
            className={inputCls}
          />
        </Field>
        <Field label="Nhãn nút (nếu có link)">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={draft.link_label.vi}
              placeholder="VI (vd Xem chi tiết)"
              onChange={(e) => up('link_label', { ...draft.link_label, vi: e.target.value })}
              className={inputCls}
            />
            <input
              type="text"
              value={draft.link_label.en}
              placeholder="EN"
              onChange={(e) => up('link_label', { ...draft.link_label, en: e.target.value })}
              className={inputCls}
            />
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Bắt đầu hiện (tùy chọn)">
          <input
            type="datetime-local"
            value={isoToLocal(draft.starts_at)}
            onChange={(e) => up('starts_at', e.target.value || null)}
            className={inputCls}
          />
        </Field>
        <Field label="Kết thúc (tùy chọn)">
          <input
            type="datetime-local"
            value={isoToLocal(draft.ends_at)}
            onChange={(e) => up('ends_at', e.target.value || null)}
            className={inputCls}
          />
        </Field>
        <Field label="Thứ tự ưu tiên">
          <input
            type="number"
            value={draft.sort_order}
            onChange={(e) => up('sort_order', Number(e.target.value))}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={draft.enabled} onChange={(v) => up('enabled', v)} label="Bật hiển thị tin này" />
        <span className="text-[14px] text-[var(--ad-fg)]">Bật hiển thị tin này</span>
      </div>

      {/* Preview nội dung (giao diện cuối ở Phần 2) */}
      <ContentPreview draft={draft} />

      {error && (
        <div className="flex items-center gap-1.5 rounded-xl bg-[rgba(255,59,48,.10)] px-3.5 py-2.5 text-[13.5px] text-[#d70015]">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onClose} className={btn('secondary')}>
          Huỷ
        </button>
        <button onClick={save} disabled={isPending} className={btn('primary')}>
          {isPending ? 'Đang lưu' : id ? 'Cập nhật' : 'Tạo thông báo'}
        </button>
      </div>
    </Card>
  )
}

function ContentPreview({ draft }: { draft: AnnouncementInput }) {
  const meta = typeMeta(draft.type)
  return (
    <div className="rounded-2xl border border-dashed border-[var(--ad-line-2)] p-4">
      <div className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--ad-fg-3)]">
        <Eye className="h-3.5 w-3.5" /> Xem thử nội dung (giao diện popup cuối làm ở phần sau)
      </div>
      <div className="flex max-w-sm items-start gap-3 rounded-xl bg-[var(--ad-fill-soft)] p-3.5">
        {draft.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.image_url} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--ad-accent-soft)] text-[11px] font-semibold text-[var(--ad-accent)]">
            {meta.label.slice(0, 2)}
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate text-[14.5px] font-semibold text-[var(--ad-fg)]">{draft.title.vi || '(tiêu đề)'}</div>
          <div className="line-clamp-2 text-[13px] text-[var(--ad-fg-3)]">{draft.body.vi}</div>
          {draft.link_url && draft.link_label.vi && (
            <span className="mt-1 inline-block text-[12.5px] font-medium text-[var(--ad-accent)]">{draft.link_label.vi}</span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────── Settings panel ───────── */

function SettingsPanel({
  initial,
  onSaved,
}: {
  initial: AnnouncementSettings | null
  onSaved: () => void
}) {
  const [draft, setDraft] = useState<AnnouncementSettingsUpdate>(() => ({
    enabled: initial?.enabled ?? DEFAULT_ANNOUNCEMENT_SETTINGS.enabled,
    toast_position: initial?.toast_position ?? DEFAULT_ANNOUNCEMENT_SETTINGS.toast_position,
    toast_delay_ms: initial?.toast_delay_ms ?? DEFAULT_ANNOUNCEMENT_SETTINGS.toast_delay_ms,
    toast_show_ms: initial?.toast_show_ms ?? DEFAULT_ANNOUNCEMENT_SETTINGS.toast_show_ms,
    toast_gap_ms: initial?.toast_gap_ms ?? DEFAULT_ANNOUNCEMENT_SETTINGS.toast_gap_ms,
    modal_delay_ms: initial?.modal_delay_ms ?? DEFAULT_ANNOUNCEMENT_SETTINGS.modal_delay_ms,
    hidden_paths: initial?.hidden_paths ?? DEFAULT_ANNOUNCEMENT_SETTINGS.hidden_paths,
    show_on_desktop: initial?.show_on_desktop ?? DEFAULT_ANNOUNCEMENT_SETTINGS.show_on_desktop,
    show_on_mobile: initial?.show_on_mobile ?? DEFAULT_ANNOUNCEMENT_SETTINGS.show_on_mobile,
  }))
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')

  const up = <K extends keyof AnnouncementSettingsUpdate>(k: K, v: AnnouncementSettingsUpdate[K]) =>
    {
      setDraft((d) => ({ ...d, [k]: v }))
      setStatus('dirty')
    }

  const save = () => {
    startTransition(async () => {
      const r = await saveAnnouncementSettings(draft)
      if (r?.error) setStatus('error')
      else {
        setStatus('saved')
        setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), 2500)
        onSaved()
      }
    })
  }

  const sec = (ms: number) => Math.round(ms / 1000)

  return (
    <SectionCard
      title="Cấu hình hiển thị chung"
      description="Áp dụng cho mọi thông báo trên website."
      actions={
        <>
          <SaveStatus status={status} />
          <button onClick={save} disabled={isPending} className={btn('primary')}>
            {isPending ? 'Đang lưu' : 'Lưu cấu hình'}
          </button>
        </>
      }
      bodyClassName="space-y-4 px-5 pb-5 pt-4"
    >
      <div className="flex items-center gap-3">
        <Switch checked={draft.enabled} onChange={(v) => up('enabled', v)} label="Bật hệ thống thông báo trên website" />
        <span className="text-[14px] text-[var(--ad-fg)]">Bật hệ thống thông báo trên website</span>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field label="Vị trí toast">
          <select
            value={draft.toast_position}
            onChange={(e) => up('toast_position', e.target.value as AnnouncementSettingsUpdate['toast_position'])}
            className={inputCls}
          >
            {TOAST_POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Delay toast đầu (giây)">
          <input type="number" min={0} max={120} value={sec(draft.toast_delay_ms)} onChange={(e) => up('toast_delay_ms', Number(e.target.value) * 1000)} className={inputCls} />
        </Field>
        <Field label="Thời lượng mỗi toast (giây)">
          <input type="number" min={1} max={60} value={sec(draft.toast_show_ms)} onChange={(e) => up('toast_show_ms', Number(e.target.value) * 1000)} className={inputCls} />
        </Field>
        <Field label="Nghỉ giữa các toast (giây)">
          <input type="number" min={0} max={120} value={sec(draft.toast_gap_ms)} onChange={(e) => up('toast_gap_ms', Number(e.target.value) * 1000)} className={inputCls} />
        </Field>
        <Field label="Delay modal (giây)">
          <input type="number" min={0} max={120} value={sec(draft.modal_delay_ms)} onChange={(e) => up('modal_delay_ms', Number(e.target.value) * 1000)} className={inputCls} />
        </Field>
      </div>

      <Field label="Trang ẩn thông báo (mỗi dòng 1 đường dẫn)">
        <textarea
          rows={3}
          value={(draft.hidden_paths || []).join('\n')}
          onChange={(e) => up('hidden_paths', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          className={`${inputCls} font-mono text-xs`}
        />
      </Field>

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <div className="flex items-center gap-3">
          <Switch checked={draft.show_on_desktop} onChange={(v) => up('show_on_desktop', v)} label="Hiện trên máy tính" />
          <span className="text-[14px] text-[var(--ad-fg)]">Hiện trên máy tính</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={draft.show_on_mobile} onChange={(v) => up('show_on_mobile', v)} label="Hiện trên điện thoại" />
          <span className="text-[14px] text-[var(--ad-fg)]">Hiện trên điện thoại</span>
        </div>
      </div>
    </SectionCard>
  )
}

/* ───────── shared UI ───────── */

const inputCls = fieldInputClass

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={fieldLabelClass}>{label}</label>
      {children}
    </div>
  )
}

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
  return (
    <Field label={label}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(['vi', 'en'] as const).map((lng) =>
          textarea ? (
            <textarea key={lng} rows={2} value={value[lng]} placeholder={lng.toUpperCase()} onChange={(e) => onChange({ ...value, [lng]: e.target.value })} className={inputCls} />
          ) : (
            <input key={lng} type="text" value={value[lng]} placeholder={lng.toUpperCase()} onChange={(e) => onChange({ ...value, [lng]: e.target.value })} className={inputCls} />
          )
        )}
      </div>
    </Field>
  )
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | null
  onChange: (v: string | null) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  const onFile = async (file: File) => {
    setUploading(true)
    setErr('')
    const r = await uploadMedia(file)
    setUploading(false)
    if (r.error) setErr(r.error)
    else if (r.url) onChange(r.url)
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--ad-fill)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-[var(--ad-fg-3)]" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onFile(f)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className={btn('secondary', 'sm')}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Đang tải…' : 'Tải ảnh lên'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(null)} className="text-left text-[12.5px] text-[#d70015] hover:underline">
              Xoá ảnh
            </button>
          )}
          {err && <span className="text-[12.5px] text-[#d70015]">{err}</span>}
        </div>
      </div>
    </Field>
  )
}
