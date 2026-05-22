'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import type { CaseStudy, CaseStudyMetric, CaseStudyStatus } from '@/lib/cms/case-studies-types'
import { slugify } from '@/lib/cms/case-studies-types'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { createProject, updateProject, type ProjectFormData } from '../actions'

const STATUS_OPTIONS: { value: CaseStudyStatus; label: string }[] = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'published', label: 'Đã đăng' },
  { value: 'archived', label: 'Lưu trữ' },
]

export function ProjectEditor({
  project,
  mode,
}: {
  project: CaseStudy | null
  mode: 'new' | 'edit'
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [draft, setDraft] = useState<ProjectFormData>(() => ({
    slug: project?.slug ?? '',
    title_vi: project?.title_vi ?? '',
    title_en: project?.title_en ?? '',
    client_name: project?.client_name ?? '',
    industry_vi: project?.industry_vi ?? '',
    industry_en: project?.industry_en ?? '',
    summary_vi: project?.summary_vi ?? '',
    summary_en: project?.summary_en ?? '',
    cover_image: project?.cover_image ?? '',
    body_vi: project?.body_vi ?? '',
    body_en: project?.body_en ?? '',
    metrics: project?.metrics ?? [],
    tags: project?.tags ?? [],
    project_url: project?.project_url ?? '',
    status: project?.status ?? 'draft',
    sort_order: project?.sort_order ?? 0,
  }))

  const update = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
    setDraft((p) => ({ ...p, [key]: value }))
    setStatus('dirty')
  }

  const handleTitleChange = (v: string) => {
    update('title_vi', v)
    if (mode === 'new' && !draft.slug) setDraft((p) => ({ ...p, slug: slugify(v) }))
  }

  const handleSave = (publishAfter?: boolean) => {
    const payload = publishAfter ? { ...draft, status: 'published' as CaseStudyStatus } : draft
    if (publishAfter) setDraft(payload)

    startTransition(async () => {
      const result =
        mode === 'new'
          ? await createProject(payload)
          : await updateProject(project!.id, payload)

      if ('error' in result && result.error) {
        setStatus('error')
        setErrorMsg(result.error)
        return
      }
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
      if (mode === 'new' && 'id' in result && result.id) {
        router.push(`/admin-cls/projects/${result.id}/edit`)
      }
    })
  }

  const tagsString = draft.tags.join(', ')
  const handleTagsChange = (v: string) => {
    update(
      'tags',
      v
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    )
  }

  return (
    <div className="space-y-3 max-w-4xl">
      {/* Sticky toolbar */}
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin-cls/projects"
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              {mode === 'new' ? 'Dự án mới' : draft.title_vi || '(không tên)'}
            </h1>
            <p className="text-[11px] text-slate-500">
              {mode === 'edit' && project ? `/projects/${draft.slug}` : 'Điền thông tin và lưu'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'edit' && project && draft.status === 'published' && (
            <Link
              href={`/projects/${draft.slug}`}
              target="_blank"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Xem public <ExternalLink className="w-3 h-3" />
            </Link>
          )}
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
          {mode === 'new' && (
            <button
              onClick={() => handleSave(true)}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              Lưu & Đăng
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Status + Sort */}
      <Section title="Trạng thái">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label>Trạng thái</Label>
            <select
              value={draft.status}
              onChange={(e) => update('status', e.target.value as CaseStudyStatus)}
              className={inputCls}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
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
          <div>
            <Label>Slug URL (/projects/...)</Label>
            <input
              type="text"
              value={draft.slug}
              onChange={(e) => update('slug', slugify(e.target.value))}
              className={inputCls + ' font-mono text-xs'}
              placeholder="tu-dong-tao-tu-ten"
            />
          </div>
        </div>
      </Section>

      {/* Basic info */}
      <Section title="Thông tin cơ bản">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <Label required>Tên dự án (VI)</Label>
            <input
              type="text"
              value={draft.title_vi}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputCls}
              placeholder="VD: Tăng 250% doanh thu E-commerce"
            />
          </div>
          <div>
            <Label>Tên dự án (EN)</Label>
            <input
              type="text"
              value={draft.title_en ?? ''}
              onChange={(e) => update('title_en', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Khách hàng</Label>
            <input
              type="text"
              value={draft.client_name ?? ''}
              onChange={(e) => update('client_name', e.target.value)}
              className={inputCls}
              placeholder="VD: Fashion Store"
            />
          </div>
          <div>
            <Label>URL khách hàng (optional)</Label>
            <input
              type="url"
              value={draft.project_url ?? ''}
              onChange={(e) => update('project_url', e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Ngành (VI)</Label>
            <input
              type="text"
              value={draft.industry_vi ?? ''}
              onChange={(e) => update('industry_vi', e.target.value)}
              className={inputCls}
              placeholder="VD: E-commerce, Giáo dục, Y tế"
            />
          </div>
          <div>
            <Label>Ngành (EN)</Label>
            <input
              type="text"
              value={draft.industry_en ?? ''}
              onChange={(e) => update('industry_en', e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="lg:col-span-2">
            <Label>Tags (ngăn cách bằng dấu phẩy)</Label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => handleTagsChange(e.target.value)}
              className={inputCls}
              placeholder="digital-marketing, ai, crm"
            />
          </div>
        </div>
      </Section>

      {/* Summary + Cover */}
      <Section title="Hiển thị trên card grid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <ImagePicker
              label="Ảnh cover"
              value={draft.cover_image ?? ''}
              onChange={(v) => update('cover_image', v)}
              hint="JPG/PNG 800×600 hoặc tương đương"
            />
          </div>
          <div className="space-y-3">
            <div>
              <Label>Tóm tắt ngắn (VI) — 1-2 câu</Label>
              <textarea
                value={draft.summary_vi ?? ''}
                onChange={(e) => update('summary_vi', e.target.value)}
                rows={3}
                className={inputCls}
                placeholder="Mô tả ngắn xuất hiện trên card grid"
              />
            </div>
            <div>
              <Label>Tóm tắt ngắn (EN)</Label>
              <textarea
                value={draft.summary_en ?? ''}
                onChange={(e) => update('summary_en', e.target.value)}
                rows={3}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Metrics */}
      <Section title="KPI / Số liệu nổi bật (hiển thị trên card)">
        <MetricsEditor
          metrics={draft.metrics}
          onChange={(m) => update('metrics', m)}
        />
      </Section>

      {/* Body Markdown */}
      <Section title="Nội dung chi tiết (Markdown)">
        <div className="space-y-3">
          <div>
            <Label>Nội dung VI</Label>
            <textarea
              value={draft.body_vi ?? ''}
              onChange={(e) => update('body_vi', e.target.value)}
              rows={12}
              className={inputCls + ' font-mono text-xs'}
              placeholder="## Bối cảnh dự án..."
            />
          </div>
          <div>
            <Label>Nội dung EN</Label>
            <textarea
              value={draft.body_en ?? ''}
              onChange={(e) => update('body_en', e.target.value)}
              rows={8}
              className={inputCls + ' font-mono text-xs'}
            />
          </div>
        </div>
      </Section>
    </div>
  )
}

function MetricsEditor({
  metrics,
  onChange,
}: {
  metrics: CaseStudyMetric[]
  onChange: (m: CaseStudyMetric[]) => void
}) {
  const add = () =>
    onChange([...metrics, { label_vi: '', label_en: '', value: '' }])
  const remove = (idx: number) => onChange(metrics.filter((_, i) => i !== idx))
  const upd = (idx: number, key: keyof CaseStudyMetric, v: string) =>
    onChange(metrics.map((m, i) => (i === idx ? { ...m, [key]: v } : m)))

  return (
    <div className="space-y-2">
      {metrics.length === 0 && (
        <p className="text-xs text-slate-500 italic">Chưa có metric. Click "Thêm" để bắt đầu.</p>
      )}
      {metrics.map((m, idx) => (
        <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_36px] gap-2">
          <input
            type="text"
            placeholder="Label VI (VD: ROAS)"
            value={m.label_vi}
            onChange={(e) => upd(idx, 'label_vi', e.target.value)}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Label EN"
            value={m.label_en ?? ''}
            onChange={(e) => upd(idx, 'label_en', e.target.value)}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="VD: 4.2x"
            value={m.value}
            onChange={(e) => upd(idx, 'value', e.target.value)}
            className={inputCls + ' font-bold'}
          />
          <button
            onClick={() => remove(idx)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-dashed border-primary/40 rounded hover:bg-primary/5"
      >
        <Plus className="w-3.5 h-3.5" />
        Thêm metric
      </button>
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
