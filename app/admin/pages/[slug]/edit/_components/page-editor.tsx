'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
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
} from 'lucide-react'
import type { Page, Section } from '@/lib/cms/types'
import { savePage } from '../actions'
import { HeroForm } from './hero-form'
import { ServicesForm } from './services-form'
import { AboutForm } from './about-form'
import { CtaForm } from './cta-form'

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (banner đầu)',
  services: 'Dịch vụ',
  about: 'Giới thiệu',
  cta: 'Call-to-action (cuối)',
}

export function PageEditor({ page }: { page: Page }) {
  const [sections, setSections] = useState<Section[]>(page.sections)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)
  const formAreaRef = useRef<HTMLDivElement>(null)

  // Listen for postMessage from iframe (click → jump to field)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const data = e.data
      if (!data || data.type !== 'CMS_CLICK') return

      const target: string = data.target
      // target = 'hero.heading' or 'services.item.0'
      const sectionType = target.split('.')[0]

      // Open the matching <details>
      const detailsEl = document.querySelector<HTMLDetailsElement>(
        `details[data-section-type="${sectionType}"]`
      )
      if (detailsEl && !detailsEl.open) {
        detailsEl.open = true
      }

      // Wait next tick for DOM to render after open
      requestAnimationFrame(() => {
        const formEl = document.getElementById(`form-${target}`)
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          // If it's a <details> (e.g. service item), open it
          if (formEl.tagName === 'DETAILS') {
            ;(formEl as HTMLDetailsElement).open = true
          }
          // Visual flash highlight
          formEl.animate(
            [
              { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
              { backgroundColor: 'rgba(59, 130, 246, 0)' },
            ],
            { duration: 1200 }
          )
          // Focus first input
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

  const updateSection = (id: string, nextContent: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? ({ ...s, content: nextContent } as Section) : s))
    )
    setStatus('idle')
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await savePage(page.slug, sections)
      if (result.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('saved')
        // Reload iframe to show fresh content
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
              /{page.slug === 'home' ? '' : page.slug} — Click vào element trên preview để jump tới field
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
        {/* Left: Forms */}
        <div ref={formAreaRef} className="overflow-y-auto p-3 lg:p-4 space-y-3">
          {sections.map((section) => (
            <details
              key={section.id}
              open
              data-section-type={section.type}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 scroll-mt-32"
            >
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {SECTION_LABELS[section.type] || section.type}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">
                    {section.type}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    section.enabled
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {section.enabled ? 'Hiển thị' : 'Ẩn'}
                </span>
              </summary>

              <div className="p-4">
                {section.type === 'hero' && (
                  <HeroForm
                    content={section.content}
                    onChange={(c) => updateSection(section.id, c)}
                  />
                )}
                {section.type === 'services' && (
                  <ServicesForm
                    content={section.content}
                    onChange={(c) => updateSection(section.id, c)}
                  />
                )}
                {section.type === 'about' && (
                  <AboutForm
                    content={section.content}
                    onChange={(c) => updateSection(section.id, c)}
                  />
                )}
                {section.type === 'cta' && (
                  <CtaForm
                    content={section.content}
                    onChange={(c) => updateSection(section.id, c)}
                  />
                )}
              </div>
            </details>
          ))}

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
              <span className="text-[10px] text-slate-400">— click vào element để edit</span>
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
