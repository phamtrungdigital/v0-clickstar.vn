'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ExternalLink,
  Loader2,
  ChevronDown,
  RefreshCw,
  PanelRightClose,
  PanelRightOpen,
  GripVertical,
  Eye,
  EyeOff,
  ArrowLeft,
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
import { EditLangProvider, LangSwitcher } from '@/lib/cms/edit-lang-context'
import { SaveStatus, btn } from '@/components/admin/ui'
import { savePage } from '../actions'
import { HeroForm } from './hero-form'
import { PageHeroForm } from './page-hero-form'
import { ServicesForm } from './services-form'
import { AboutForm } from './about-form'
import { CtaForm } from './cta-form'
import { StatsForm } from './stats-form'
import { CaseStudiesForm } from './case-studies-form'
import { TeamForm } from './team-form'
import { TestimonialsForm } from './testimonials-form'
import { FaqForm } from './faq-form'
import { BlogForm } from './blog-form'
import { PricingTiersForm } from './pricing-tiers-form'
import { ProblemsGridForm } from './problems-grid-form'
import { FeatureGridForm } from './feature-grid-form'
import { ProcessStepsForm } from './process-steps-form'
import { AboutStoryForm } from './about-story-form'
import { AboutValuesForm } from './about-values-form'
import { AboutTimelineForm } from './about-timeline-form'
import { AboutWhyChooseUsForm } from './about-why-choose-us-form'
import { PricingTabsNavForm } from './pricing-tabs-nav-form'
import { PricingSetupAddonsForm } from './pricing-setup-addons-form'
import { PricingGroupedTiersForm } from './pricing-grouped-tiers-form'
import { AdsHubScreenshotsForm } from './ads-hub-screenshots-form'
import { ClientLogosForm } from './client-logos-form'
import { LogoMarqueeForm } from './logo-marquee-form'
import { CodeTerminalForm } from './code-terminal-form'
import { SeoForm, type SeoFields } from './seo-form'

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (banner đầu)',
  page_hero: 'Hero của page',
  services: 'Dịch vụ',
  about: 'Giới thiệu',
  stats: 'Chỉ số (counter)',
  case_studies: 'Dự án tiêu biểu',
  team: 'Đội ngũ',
  testimonials: 'Đánh giá khách hàng',
  faq: 'FAQ',
  blog: 'Tin tức / Blog',
  cta: 'Call-to-action (cuối)',
  pricing_tiers: 'Bảng giá (3 gói)',
  problems_grid: 'Vấn đề & Giải pháp',
  feature_grid: 'Tính năng / Dịch vụ (cards)',
  process_steps: 'Quy trình (các bước)',
  about_story: 'About — Story (image + paragraphs)',
  about_values: 'About — Giá trị cốt lõi',
  about_timeline: 'About — Hành trình (timeline)',
  about_why_choose_us: 'About — Tại sao chọn (gallery)',
  client_logos: 'Dải logo',
  logo_marquee: 'Dải logo tự trôi (marquee)',
  code_terminal: 'Cửa sổ code (terminal)',
}

function renderForm(section: Section, onChange: (c: any) => void) {
  switch (section.type) {
    case 'hero':
      return <HeroForm content={section.content} onChange={onChange} />
    case 'page_hero':
      return <PageHeroForm content={section.content} onChange={onChange} />
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
    case 'pricing_tiers':
      return <PricingTiersForm content={section.content} onChange={onChange} />
    case 'problems_grid':
      return <ProblemsGridForm content={section.content} onChange={onChange} />
    case 'feature_grid':
      return <FeatureGridForm content={section.content} onChange={onChange} />
    case 'process_steps':
      return <ProcessStepsForm content={section.content} onChange={onChange} />
    case 'about_story':
      return <AboutStoryForm content={section.content} onChange={onChange} />
    case 'about_values':
      return <AboutValuesForm content={section.content} onChange={onChange} />
    case 'about_timeline':
      return <AboutTimelineForm content={section.content} onChange={onChange} />
    case 'about_why_choose_us':
      return <AboutWhyChooseUsForm content={section.content} onChange={onChange} />
    case 'pricing_tabs_nav':
      return <PricingTabsNavForm content={section.content} onChange={onChange} />
    case 'pricing_setup_addons':
      return <PricingSetupAddonsForm content={section.content} onChange={onChange} />
    case 'pricing_grouped_tiers':
      return <PricingGroupedTiersForm content={section.content} onChange={onChange} />
    case 'ads_hub_screenshots':
      return <AdsHubScreenshotsForm content={section.content} onChange={onChange} />
    case 'client_logos':
      return <ClientLogosForm content={section.content} onChange={onChange} />
    case 'logo_marquee':
      return <LogoMarqueeForm content={section.content} onChange={onChange} />
    case 'code_terminal':
      return <CodeTerminalForm content={section.content} onChange={onChange} />
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
      className="group scroll-mt-32 rounded-2xl border border-[var(--ad-line)] bg-[var(--ad-surface)] shadow-[var(--ad-shadow)]"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-3 group-open:border-b group-open:border-[var(--ad-line)]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.preventDefault()}
            className="-ml-1 cursor-grab rounded-md p-1 text-[var(--ad-fg-3)] hover:text-[var(--ad-fg)] active:cursor-grabbing"
            title="Kéo để sắp xếp"
            aria-label="Kéo để sắp xếp"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <ChevronDown className="h-4 w-4 flex-shrink-0 text-[var(--ad-fg-3)] transition-transform group-open:rotate-180" />
          <span className="truncate text-[14.5px] font-semibold text-[var(--ad-fg)]">
            {SECTION_LABELS[section.type] || section.type}
            {/* Một trang có thể có NHIỀU dải logo (vd "Công nghệ tích hợp" và
                "Công nghệ lõi AI") — kèm nhãn để phân biệt, không thì trùng tên hệt nhau. */}
            {(section.type === 'client_logos' ||
              section.type === 'logo_marquee' ||
              section.type === 'code_terminal') &&
              section.content?.eyebrow?.vi && (
              <span className="font-normal text-[var(--ad-fg-3)]">
                {' '}
                — {section.content.eyebrow.vi}
              </span>
            )}
          </span>

        </div>

        {/* Toggle enabled */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleEnabled()
          }}
          className={`flex flex-none items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
            section.enabled
              ? 'bg-[rgba(52,199,89,.14)] text-[#248a3d] hover:bg-[rgba(52,199,89,.22)]'
              : 'bg-[var(--ad-fill)] text-[var(--ad-fg-3)] hover:bg-[var(--ad-fill-2)]'
          }`}
          title={section.enabled ? 'Bấm để ẩn khối này khỏi website' : 'Bấm để hiện khối này trên website'}
        >
          {section.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {section.enabled ? 'Hiển thị' : 'Ẩn'}
        </button>
      </summary>

      <div className="p-5">{renderForm(section, onContentChange)}</div>
    </details>
  )
}

export function PageEditor({ page }: { page: Page }) {
  return (
    <EditLangProvider initial="vi">
      <PageEditorInner page={page} />
    </EditLangProvider>
  )
}

function PageEditorInner({ page }: { page: Page }) {
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
        } else if (detailsEl) {
          // Section-only target (user clicked section background, not specific field)
          // → scroll section <details> into view + flash highlight
          detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          detailsEl.animate(
            [
              { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
              { backgroundColor: 'rgba(59, 130, 246, 0)' },
            ],
            { duration: 1200 }
          )
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
    <div className="-m-4 flex h-[calc(100dvh-52px)] flex-col bg-[var(--ad-bg)] lg:-m-6">
      {/* Header */}
      <div className="ad-glass flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--ad-line)] px-4 py-2.5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/admin-cls/pages"
            aria-label="Quay lại danh sách trang"
            title="Quay lại danh sách trang"
            className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--ad-fill)] text-[var(--ad-fg-2)] hover:bg-[var(--ad-fill-2)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-semibold tracking-[-0.02em] text-[var(--ad-fg)]">{page.title}</h1>
            <p className="truncate text-[12.5px] text-[var(--ad-fg-3)]">
              /{page.slug === 'home' ? '' : page.slug} · Kéo thả để đổi thứ tự các khối
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LangSwitcher />

          <SaveStatus status={status} errorMsg={errorMsg} />

          <button
            onClick={() => setShowPreview((v) => !v)}
            className="hidden h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-2)] hover:bg-[var(--ad-fill)] lg:grid"
            title={showPreview ? 'Ẩn bản xem trước' : 'Hiện bản xem trước'}
            aria-label={showPreview ? 'Ẩn bản xem trước' : 'Hiện bản xem trước'}
          >
            {showPreview ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>

          <button
            onClick={reloadPreview}
            className="hidden h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-2)] hover:bg-[var(--ad-fill)] lg:grid"
            title="Tải lại bản xem trước"
            aria-label="Tải lại bản xem trước"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <Link href={page.slug === 'home' ? '/' : `/${page.slug}`} target="_blank" className={btn('ghost')}>
            <ExternalLink className="h-3.5 w-3.5" />
            Xem trang
          </Link>

          <button onClick={handleSave} disabled={isPending} className={btn('primary')}>
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {isPending ? 'Đang lưu' : 'Lưu thay đổi'}
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
        <div className="space-y-3 overflow-y-auto p-4 lg:p-5">
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
            <div className="rounded-xl bg-[rgba(255,59,48,.10)] px-4 py-2.5 text-[13.5px] text-[#d70015]">
              Không lưu được: {errorMsg}
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div className="hidden flex-col border-l border-[var(--ad-line)] bg-[var(--ad-fill-soft)] lg:flex">
            <div className="flex flex-shrink-0 items-center gap-2 border-b border-[var(--ad-line)] px-4 py-2">
              <span className="text-[13px] font-medium text-[var(--ad-fg-2)]">Bản xem trực tiếp</span>
              <span className="text-[12.5px] text-[var(--ad-fg-3)]">Lưu để cập nhật</span>
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
