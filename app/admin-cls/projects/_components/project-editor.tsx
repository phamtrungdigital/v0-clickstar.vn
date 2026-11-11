'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Plus, Trash2, ExternalLink } from 'lucide-react'
import type { CaseStudy, CaseStudyMetric, CaseStudyStatus, CaseStudyVerification } from '@/lib/cms/case-studies-types'
import { PROJECT_SERVICES, VERIFICATION_OPTIONS, slugify } from '@/lib/cms/case-studies-types'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { EditorBar, SaveStatus, SectionCard, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
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
    delivered_from: project?.delivered_from?.slice(0, 7) ?? '',
    delivered_to: project?.delivered_to?.slice(0, 7) ?? '',
    services: project?.services ?? [],
    verifier_name: project?.verifier_name ?? '',
    verifier_title: project?.verifier_title ?? '',
    verifier_url: project?.verifier_url ?? '',
    testimonial_vi: project?.testimonial_vi ?? '',
    testimonial_en: project?.testimonial_en ?? '',
    client_credit_url: project?.client_credit_url ?? '',
    verification: project?.verification ?? 'unverified',
    verified_on: project?.verified_on ?? '',
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
    <div>
      <EditorBar
        backHref="/admin-cls/projects"
        title={mode === 'new' ? 'Dự án mới' : draft.title_vi || '(không tên)'}
        subtitle={mode === 'edit' && project ? `/projects/${draft.slug}` : 'Điền thông tin rồi bấm Lưu'}
      >
        {mode === 'edit' && project && draft.status === 'published' && (
          <Link href={`/projects/${draft.slug}`} target="_blank" className={btn('ghost')}>
            Xem trên website <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
        <SaveStatus status={status} errorMsg={errorMsg} />
        {mode === 'new' && (
          <button onClick={() => handleSave(true)} disabled={isPending} className={btn('secondary')}>
            Lưu và đăng
          </button>
        )}
        <button onClick={() => handleSave(false)} disabled={isPending} className={btn('primary')}>
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isPending ? 'Đang lưu' : 'Lưu'}
        </button>
      </EditorBar>

      <div className="mx-auto max-w-4xl space-y-4">
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
            <Label>Website khách hàng</Label>
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

      {/* Kiểm chứng (GEO) */}
      <Section title="Kiểm chứng dự án (cho Google và trợ lý AI)">
        <p className="text-[13px] leading-snug text-[var(--ad-fg-3)]">
          Trợ lý AI chỉ tin dự án khi đối chiếu được: website khách, thời gian, người xác nhận. Dữ liệu ở đây đọc được công khai,
          nên <strong>chỉ nhập tên người xác nhận và lời nhận xét sau khi khách đồng ý</strong>. Lời nhận xét và người xác nhận
          chỉ hiện trên website khi chọn &quot;Khách đã xác nhận nội dung&quot;.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div>
            <Label>Mức kiểm chứng</Label>
            <select
              value={draft.verification}
              onChange={(e) => update('verification', e.target.value as CaseStudyVerification)}
              className={inputCls}
            >
              {VERIFICATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Bắt đầu (tháng)</Label>
            <input type="month" value={draft.delivered_from ?? ''} onChange={(e) => update('delivered_from', e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Kết thúc (trống = đang làm)</Label>
            <input type="month" value={draft.delivered_to ?? ''} onChange={(e) => update('delivered_to', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <Label>Dịch vụ Click Star đã làm</Label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_SERVICES.map((sv) => {
              const on = draft.services.includes(sv.key)
              return (
                <button
                  key={sv.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update('services', on ? draft.services.filter((k) => k !== sv.key) : [...draft.services, sv.key])}
                  className={
                    'rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ' +
                    (on ? 'bg-[var(--ad-accent)] text-white' : 'bg-[var(--ad-fill)] text-[var(--ad-fg-2)] hover:bg-[var(--ad-fill-2)]')
                  }
                >
                  {sv.vi}
                </button>
              )
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div>
            <Label>Người xác nhận (họ tên)</Label>
            <input type="text" value={draft.verifier_name ?? ''} onChange={(e) => update('verifier_name', e.target.value)} className={inputCls} placeholder="VD: Nguyễn Văn A" />
          </div>
          <div>
            <Label>Chức danh</Label>
            <input type="text" value={draft.verifier_title ?? ''} onChange={(e) => update('verifier_title', e.target.value)} className={inputCls} placeholder="VD: Giám đốc" />
          </div>
          <div>
            <Label>LinkedIn / trang cá nhân</Label>
            <input type="url" value={draft.verifier_url ?? ''} onChange={(e) => update('verifier_url', e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <Label>Lời nhận xét của khách (VI)</Label>
              <textarea value={draft.testimonial_vi ?? ''} onChange={(e) => update('testimonial_vi', e.target.value)} rows={3} className={inputCls} />
            </div>
            <div>
              <Label>Lời nhận xét của khách (EN)</Label>
              <textarea value={draft.testimonial_en ?? ''} onChange={(e) => update('testimonial_en', e.target.value)} rows={3} className={inputCls} />
            </div>
          </div>
          <div>
            <Label>Ngày khách xác nhận</Label>
            <input type="date" value={draft.verified_on ?? ''} onChange={(e) => update('verified_on', e.target.value)} className={inputCls} />
          </div>
          <div className="lg:col-span-2">
            <Label>Trang khách có dòng &quot;Thiết kế bởi Click Star&quot;</Label>
            <input type="url" value={draft.client_credit_url ?? ''} onChange={(e) => update('client_credit_url', e.target.value)} className={inputCls} placeholder="https://..." />
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
        <p className="text-[13px] text-[var(--ad-fg-3)]">Chưa có số liệu nào. Bấm "Thêm số liệu" để bắt đầu.</p>
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
            type="button"
            aria-label="Xoá số liệu"
            title="Xoá số liệu"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--ad-fg-3)] hover:bg-[rgba(255,59,48,.10)] hover:text-[#d70015]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className={btn('ghost')}>
        <Plus className="h-4 w-4" />
        Thêm số liệu
      </button>
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
