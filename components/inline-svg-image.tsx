'use client'

import { useEffect, useState } from 'react'

/**
 * Hiển thị ảnh, NHƯNG nếu là SVG cục bộ (/images/*.svg) thì NHÚNG INLINE vào DOM
 * (render vector sống) thay vì <img src=svg>. Lý do: iOS Safari (và vài webview)
 * rasterize SVG trong <img> ở độ phân giải layout → mờ trên màn retina. Inline SVG
 * luôn nét vô hạn. Ảnh thường (raster / URL ngoài) vẫn dùng <img> như cũ.
 *
 * Bảo mật: chỉ inline SVG same-origin path nội bộ (bắt đầu '/'), KHÔNG inline SVG
 * upload/ngoài (tránh XSS từ nội dung không tin cậy).
 */
export function InlineSvgImage({
  src,
  alt,
  className,
  cmsField,
}: {
  src: string
  alt: string
  className?: string
  cmsField?: string
}) {
  const isLocalSvg = !!src && src.startsWith('/') && src.toLowerCase().endsWith('.svg')
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    if (!isLocalSvg) {
      setSvg(null)
      return
    }
    let alive = true
    fetch(src)
      .then((r) => (r.ok ? r.text() : null))
      .then((txt) => {
        if (alive && txt && txt.includes('<svg')) setSvg(txt)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [src, isLocalSvg])

  if (isLocalSvg && svg) {
    return (
      <div
        data-cms-field={cmsField}
        className={className}
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img data-cms-field={cmsField} src={src} alt={alt} className={className} />
}
