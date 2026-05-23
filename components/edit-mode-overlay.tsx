'use client'

import { useEffect } from 'react'

/**
 * Injects a hover/click overlay onto the public page when loaded inside the
 * admin editor iframe (URL has `?edit=1` and we're embedded).
 *
 * 2 levels of interactivity:
 *  1. SECTION level: hover toàn section [data-cms-section] → outline xanh + label floating top-left + "✏️ Edit"
 *     Click vào section (background, không phải field cụ thể) → postMessage {target: section_type}
 *  2. FIELD level: hover [data-cms-field] → outline dashed nhỏ hơn
 *     Click → postMessage {target: section_type.field} hoặc {target: section_type.field.itemIndex}
 *
 * Parent (page-editor.tsx) listen postMessage → mở <details> section + scroll to form field.
 */

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  page_hero: 'Hero',
  services: 'Dịch vụ',
  about: 'Giới thiệu',
  stats: 'Số liệu',
  case_studies: 'Dự án',
  team: 'Đội ngũ',
  testimonials: 'Đánh giá',
  faq: 'FAQ',
  blog: 'Tin tức',
  cta: 'Call-to-action',
  pricing_tiers: 'Bảng giá',
  problems_grid: 'Vấn đề & Giải pháp',
  feature_grid: 'Tính năng',
  process_steps: 'Quy trình',
  about_story: 'About — Story',
  about_values: 'About — Giá trị',
  about_timeline: 'About — Timeline',
  about_why_choose_us: 'About — Why Choose',
}

export function EditModeOverlay() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('edit') !== '1') return
    if (window.self === window.top) return // not embedded

    const STYLE_ID = '__cms_edit_overlay__'
    if (document.getElementById(STYLE_ID)) return

    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      /* SECTION level — full outline khi hover toàn section, kèm label */
      [data-cms-section] {
        position: relative;
        outline: 2px solid transparent;
        outline-offset: -2px;
        transition: outline-color .15s, background-color .15s;
      }
      [data-cms-section]:hover {
        outline-color: rgba(59, 130, 246, 0.45);
        cursor: pointer;
      }
      [data-cms-section]:hover::before {
        content: attr(data-cms-label);
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 9999;
        background: rgb(37, 99, 235);
        color: white;
        font-size: 12px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: ui-sans-serif, system-ui, sans-serif;
        pointer-events: none;
        white-space: nowrap;
      }
      [data-cms-section]:hover::after {
        content: '✏️ Click để sửa';
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 6px;
        font-family: ui-sans-serif, system-ui, sans-serif;
        pointer-events: none;
        white-space: nowrap;
      }
      [data-cms-section][data-cms-active] {
        outline-color: rgb(37, 99, 235);
      }

      /* FIELD level — dashed nhỏ hơn, không conflict với section outline */
      [data-cms-field] {
        outline: 1px dashed transparent;
        outline-offset: 2px;
        transition: outline-color .12s, background-color .12s;
        cursor: pointer !important;
      }
      [data-cms-field]:hover {
        outline-color: rgba(59, 130, 246, 0.85);
        background-color: rgba(59, 130, 246, 0.06);
      }
      [data-cms-field][data-cms-active] {
        outline: 2px solid rgb(37, 99, 235);
        outline-offset: 2px;
      }

      a[data-cms-field], button[data-cms-field] {
        pointer-events: auto;
      }
    `
    document.head.appendChild(style)

    // Inject data-cms-label cho mỗi section element để CSS ::before đọc qua attr()
    document.querySelectorAll<HTMLElement>('[data-cms-section]').forEach((el) => {
      const type = el.getAttribute('data-cms-section') || ''
      const label = SECTION_LABELS[type] || type
      el.setAttribute('data-cms-label', label)
    })

    let lastActive: HTMLElement | null = null

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // 1. Field click trước — ưu tiên cao hơn section
      const fieldEl = target.closest<HTMLElement>('[data-cms-field]')
      if (fieldEl) {
        e.preventDefault()
        e.stopPropagation()

        const section = fieldEl
          .closest<HTMLElement>('[data-cms-section]')
          ?.getAttribute('data-cms-section')
        const field = fieldEl.getAttribute('data-cms-field')
        const itemIndex = fieldEl.getAttribute('data-cms-item-index')
        if (!section || !field) return

        if (lastActive) lastActive.removeAttribute('data-cms-active')
        fieldEl.setAttribute('data-cms-active', '')
        lastActive = fieldEl

        const targetKey =
          itemIndex !== null ? `${section}.${field}.${itemIndex}` : `${section}.${field}`
        window.parent.postMessage({ type: 'CMS_CLICK', target: targetKey }, window.location.origin)
        return
      }

      // 2. Section click (click vào background section, không trúng field)
      const sectionEl = target.closest<HTMLElement>('[data-cms-section]')
      if (sectionEl) {
        e.preventDefault()
        e.stopPropagation()

        const type = sectionEl.getAttribute('data-cms-section')
        if (!type) return

        if (lastActive) lastActive.removeAttribute('data-cms-active')
        sectionEl.setAttribute('data-cms-active', '')
        lastActive = sectionEl

        // Section-only target → handler chỉ mở <details>, không scroll to specific form field
        window.parent.postMessage({ type: 'CMS_CLICK', target: type }, window.location.origin)
      }
    }

    document.addEventListener('click', handleClick, true)

    // Block all other navigation in edit mode
    const blockNav = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a')
      if (a && !a.hasAttribute('data-cms-field') && !a.closest('[data-cms-field]')) {
        e.preventDefault()
      }
    }
    document.addEventListener('click', blockNav, true)

    // Tell parent we're ready
    window.parent.postMessage({ type: 'CMS_READY' }, window.location.origin)

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('click', blockNav, true)
      style.remove()
    }
  }, [])

  return null
}
