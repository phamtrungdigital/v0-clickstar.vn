'use client'

import { useEffect } from 'react'

/**
 * Injects a hover/click overlay onto the public page when loaded inside the
 * admin editor iframe (URL has `?edit=1` and we're embedded). Each editable
 * element is marked with `data-cms-section="<type>"` and `data-cms-field="<name>"`.
 *
 * On click of an editable element, posts a message to the parent window so the
 * editor can scroll to + focus the matching form field.
 */
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
      [data-cms-field] {
        outline: 1px dashed rgba(59, 130, 246, 0); /* invisible until hover */
        outline-offset: 4px;
        transition: outline-color .12s, background-color .12s;
        cursor: pointer !important;
      }
      [data-cms-field]:hover {
        outline-color: rgba(59, 130, 246, 0.7);
        background-color: rgba(59, 130, 246, 0.04);
      }
      [data-cms-field][data-cms-active] {
        outline: 2px solid rgb(37, 99, 235);
        outline-offset: 4px;
      }
      a[data-cms-field], button[data-cms-field] {
        pointer-events: auto;
      }
    `
    document.head.appendChild(style)

    let lastActive: HTMLElement | null = null

    const handleClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cms-field]')
      if (!el) return
      e.preventDefault()
      e.stopPropagation()

      const section = el
        .closest<HTMLElement>('[data-cms-section]')
        ?.getAttribute('data-cms-section')
      const field = el.getAttribute('data-cms-field')
      const itemIndex = el.getAttribute('data-cms-item-index')
      if (!section || !field) return

      // Visual feedback
      if (lastActive) lastActive.removeAttribute('data-cms-active')
      el.setAttribute('data-cms-active', '')
      lastActive = el

      const target = itemIndex !== null ? `${section}.${field}.${itemIndex}` : `${section}.${field}`

      window.parent.postMessage({ type: 'CMS_CLICK', target }, window.location.origin)
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
