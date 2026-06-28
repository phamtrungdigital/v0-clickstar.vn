'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
  Eye,
  ImageIcon,
} from 'lucide-react'
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
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Thông báo / Popup
          </h1>
          <p className="text-[11px] text-slate-500">
            Tin social-proof hiện cho khách (ký hợp đồng, logo mới, đối tác…). Giao diện popup công khai sẽ làm ở Phần 2.
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm thông báo
        </button>
      </div>

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
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
        {list.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-400">
            Chưa có thông báo nào. Bấm “Thêm thông báo”.
          </div>
        )}
        {list.map((a) => {
          const meta = typeMeta(a.type)
          return (
            <div key={a.id} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {a.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    {meta.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                    {a.display_mode === 'toast' ? 'Toast' : 'Modal'}
                  </span>
                  {(a.starts_at || a.ends_at) && (
                    <span className="text-[10px] text-amber-600">⏱ có lịch</span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-white truncate mt-0.5">
                  {a.title.vi || a.title.en || '(chưa có tiêu đề)'}
                </div>
                {a.body.vi && <div className="text-[11px] text-slate-500 truncate">{a.body.vi}</div>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onToggle(a)}
                  disabled={busyId === a.id}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                    a.enabled
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                  title={a.enabled ? 'Đang bật — bấm để tắt' : 'Đang tắt — bấm để bật'}
                >
                  {a.enabled ? 'Bật' : 'Tắt'}
                </button>
                <button
                  onClick={() => startEdit(a)}
                  className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded"
                  aria-label="Sửa"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(a)}
                  disabled={busyId === a.id}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                  aria-label="Xoá"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

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
    <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-primary/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {id ? 'Sửa thông báo' : 'Thông báo mới'}
        </h2>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
          <X className="w-4 h-4" />
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

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={draft.enabled} onChange={(e) => up('enabled', e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700 dark:text-slate-300">Bật hiển thị tin này</span>
      </label>

      {/* Preview nội dung (giao diện cuối ở Phần 2) */}
      <ContentPreview draft={draft} />

      {error && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700">
          Huỷ
        </button>
        <button
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isPending ? 'Đang lưu…' : id ? 'Cập nhật' : 'Tạo'}
        </button>
      </div>
    </div>
  )
}

function ContentPreview({ draft }: { draft: AnnouncementInput }) {
  const meta = typeMeta(draft.type)
  return (
    <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-400 mb-2">
        <Eye className="w-3 h-3" /> Xem thử nội dung (giao diện popup cuối làm ở Phần 2)
      </div>
      <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 max-w-sm">
        {draft.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.image_url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
        ) : (
          <span className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-semibold">
            {meta.label.slice(0, 2)}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {draft.title.vi || '(tiêu đề)'}
          </div>
          <div className="text-xs text-slate-500 line-clamp-2">{draft.body.vi}</div>
          {draft.link_url && draft.link_label.vi && (
            <span className="inline-block mt-1 text-[11px] text-primary font-medium">{draft.link_label.vi} →</span>
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
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  const up = <K extends keyof AnnouncementSettingsUpdate>(k: K, v: AnnouncementSettingsUpdate[K]) =>
    setDraft((d) => ({ ...d, [k]: v }))

  const save = () => {
    startTransition(async () => {
      const r = await saveAnnouncementSettings(draft)
      if (r?.error) setStatus('error')
      else {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2500)
        onSaved()
      }
    })
  }

  const sec = (ms: number) => Math.round(ms / 1000)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cấu hình hiển thị chung</h2>
        <div className="flex items-center gap-2">
          {status === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu
            </span>
          )}
          {status === 'error' && <span className="text-xs text-red-600">Lỗi</span>}
          <button
            onClick={save}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu cấu hình'}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={draft.enabled} onChange={(e) => up('enabled', e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700 dark:text-slate-300">Bật hệ thống thông báo trên website</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={draft.show_on_desktop} onChange={(e) => up('show_on_desktop', e.target.checked)} className="w-4 h-4" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Hiện trên Desktop</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={draft.show_on_mobile} onChange={(e) => up('show_on_mobile', e.target.checked)} className="w-4 h-4" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Hiện trên Mobile</span>
        </label>
      </div>
    </div>
  )
}

/* ───────── shared UI ───────── */

const inputCls =
  'w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
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
        <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-400" />
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
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-medium rounded disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Đang tải…' : 'Tải ảnh lên'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(null)} className="text-[11px] text-red-500 hover:underline text-left">
              Xoá ảnh
            </button>
          )}
          {err && <span className="text-[11px] text-red-500">{err}</span>}
        </div>
      </div>
    </Field>
  )
}
