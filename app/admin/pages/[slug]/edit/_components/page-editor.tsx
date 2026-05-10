'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ExternalLink, Save, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
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
        setTimeout(() => setStatus('idle'), 2500)
      }
    })
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
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
            <p className="text-[11px] text-slate-500">/{page.slug === 'home' ? '' : page.slug}</p>
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

          <Link
            href={page.slug === 'home' ? '/' : `/${page.slug}`}
            target="_blank"
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
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

      {/* Sections */}
      {sections.map((section) => (
        <details
          key={section.id}
          open
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-slate-400 [details[open]_&]:rotate-180 transition-transform" />
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
  )
}
