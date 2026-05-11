'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  PanelRightClose,
  PanelRightOpen,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Page, Section } from '@/lib/cms/types'
import { savePage } from '../actions'
import { HeroForm } from './hero-form'
import { ServicesForm } from './services-form'
import { AboutForm } from './about-form'
import { CtaForm } from './cta-form'
import { StatsForm } from './stats-form'
import { CaseStudiesForm } from './case-studies-form'
import { TeamForm } from './team-form'
import { TestimonialsForm } from './testimonials-form'
import { FaqForm } from './faq-form'
import { BlogForm } from './blog-form'
import { SeoForm, type SeoFields } from './seo-form'

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (banner đầu)',
  services: 'Dịch vụ',
  about: 'Giới thiệu',
  stats: 'Chỉ số (counter)',
  case_studies: 'Dự án tiêu biểu',
  team: 'Đội ngũ',
  testimonials: 'Đánh giá khách hàng',
  faq: 'FAQ',
  blog: 'Tin tức / Blog',
  cta: 'Call-to-action (cuối)',
}

function renderForm(section: Section, onChange: (c: any) => void) {
  switch (section.type) {
    case 'hero':
      return <HeroForm content={section.content} onChange={onChange} />
    case 'services':
      return <ServicesForm content={section.content} onChange={onChange} />
    case 'about':
      return <AboutForm content={section.content} onChange={onChange} />
    case 'stats':
      return <StatsForm content={section.content} onChange={onChange} />
    case 'case_studies':
      return <CaseStudiesForm content={section.content} onChange={onChange} />
    case 'team':
      return <TeamForm content={section.content} onChange={onChange} />
    case 'testimonials':
      return <TestimonialsForm content={section.content} onChange={onChange} />
    case 'faq':
      return <FaqForm content={section.content} onChange={onChange} />
    case 'blog':
      return <BlogForm content={section.content} onChange={onChange} />
    case 'cta':
      return <CtaForm content={section.content} onChange={onChange} />
  }
}

function parseI18nOrEmpty(value: unknown): { vi: string; en: string } {
  if (value && typeof value === 'object' && 'vi' in value && 'en' in value) {
    return { vi: (value as any).vi ?? '', en: (value as any).en ?? '' }
  }
  if (typeof value === 'string') return { vi: value, en: '' }
  return { vi: '', en: '' }
}

function SortableSection({
  section,
  onContentChange,
  onToggleEnabled,
}: {
  section: Section
  onContentChange: (next: any) => void
  onToggleEnabled: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <details
      ref={setNodeRef}
      style={style}
      data-section-type={section.type}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 scroll-mt-32 group"
    >
      <summary className="flex items-center justify-between px-3 py-2.5 cursor-pointer select-none border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.preventDefault()}
            className="p-1 -ml-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Kéo để sắp xếp"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {SECTION_LABELS[section.type] || section.type}
          </span>
          <span className="text-[10px] uppercase font-mono text-slate-400 flex-shrink-0">
            {section.type}
          </span>
        </div>

        {/* Toggle enabled */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleEnabled()
          }}
          className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
            section.enabled
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          title={section.enabled ? 'Click để ẩn section' : 'Click để hiện section'}
        >
          {section.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {section.enabled ? 'Hiển thị' : 'Ẩn'}
        </button>
      </summary>

      <div className="p-4">{renderForm(section, onContentChange)}</div>
    </details>
  )
}

export function PageEditor({ page }: { page: Page }) {
  const [sections, setSections] = useState<Section[]>(page.sections)
  const [seo, setSeo] = useState<SeoFields>({
    seo_title: parseI18nOrEmpty(page.seo_title),
    seo_description: parseI18nOrEmpty(page.seo_description),
    og_image: page.og_image,
  })
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const data = e.data
      if (!data || data.type !== 'CMS_CLICK') return
      const target: string = data.target
      const sectionType = target.split('.')[0]
      const detailsEl = document.querySelector<HTMLDetailsElement>(
        `details[data-section-type="${sectionType}"]`
      )
      if (detailsEl && !detailsEl.open) detailsEl.open = true
      requestAnimationFrame(() => {
        const formEl = document.getElementById(`form-${target}`)
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          if (formEl.tagName === 'DETAILS') (formEl as HTMLDetailsElement).open = true
          formEl.animate(
            [
              { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
              { backgroundColor: 'rgba(59, 130, 246, 0)' },
            ],
            { duration: 1200 }
          )
          setTimeout(() => {
            formEl
              .querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
              ?.focus()
          }, 350)
        }
      })
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const updateSectionContent = (id: string, nextContent: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? ({ ...s, content: nextContent } as Section) : s))
    )
    setStatus('dirty')
  }

  const toggleSectionEnabled = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? ({ ...s, enabled: !s.enabled } as Section) : s))
    )
    setStatus('dirty')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      setStatus('dirty')
    }
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await savePage(page.slug, sections, seo)
      if (result.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('saved')
        setIframeKey((k) => k + 1)
        setTimeout(() => setStatus('idle'), 2500)
      }
    })
  }

  const reloadPreview = () => setIframeKey((k) => k + 1)

  const previewSrc = page.slug === 'home' ? '/?edit=1' : `/${page.slug}?edit=1`

  return (
    <div className="-m-3 lg:-m-4 flex flex-col h-[calc(100vh-44px)] bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
          >
            ← Pages
          </Link>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              {page.title}
            </h1>
            <p className="text-[11px] text-slate-500">
              /{page.slug === 'home' ? '' : page.slug} — Kéo thả để sắp xếp · click element trên preview để jump
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
          {status === 'dirty' && (
            <span className="text-xs text-amber-600">● Chưa lưu</span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs text-red-600" title={errorMsg}>
              <AlertCircle className="w-3.5 h-3.5" />
              Lỗi
            </span>
          )}

          <button
            onClick={() => setShowPreview((v) => !v)}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title={showPreview ? 'Ẩn preview' : 'Hiện preview'}
          >
            {showPreview ? (
              <PanelRightClose className="w-3.5 h-3.5" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={reloadPreview}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title="Reload preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <Link
            href={page.slug === 'home' ? '/' : `/${page.slug}`}
            target="_blank"
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Xem trang
          </Link>

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

      {/* Body */}
      <div
        className={`flex-1 grid overflow-hidden ${
          showPreview ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]' : 'grid-cols-1'
        }`}
      >
        {/* Left: Forms with drag-drop */}
        <div className="overflow-y-auto p-3 lg:p-4 space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  onContentChange={(c) => updateSectionContent(section.id, c)}
                  onToggleEnabled={() => toggleSectionEnabled(section.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <SeoForm
            value={seo}
            onChange={(v) => {
              setSeo(v)
              setStatus('dirty')
            }}
          />

          {status === 'error' && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              Không lưu được: {errorMsg}
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div className="hidden lg:flex flex-col border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="flex-shrink-0 px-3 py-1.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Live Preview
              </span>
              <span className="text-[10px] text-slate-400">— click để jump · lưu để cập nhật</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                key={iframeKey}
                src={previewSrc}
                className="w-full h-full border-0 bg-white"
                title="Live preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
