'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Hiển thị ảnh, NHƯNG nếu là SVG cục bộ (/images/*.svg) thì NHÚNG INLINE vào DOM
 * (render vector sống) thay vì <img src=svg>. Lý do: iOS Safari (và vài webview)
 * rasterize SVG trong <img> ở độ phân giải layout → mờ trên màn retina. Inline SVG
 * luôn nét vô hạn. Ảnh thường (raster / URL ngoài) vẫn dùng <img> như cũ.
 *
 * Tốc độ trên điện thoại (PageSpeed):
 * - Chỉ nhúng khi phần tử đang hiển thị: cặp ảnh PC / mobile luôn có một bản bị ẩn bằng CSS, bản đó giữ nguyên <img>
 *   (không tải thêm, không thêm hàng trăm nút SVG vào DOM).
 * - Các hiệu ứng chạy trong SVG (đường chảy stroke-dashoffset) không chạy trên GPU, phải vẽ lại từng khung: tạm dừng
 *   đến khi trang tải xong và trình duyệt rảnh, để không tranh luồng chính lúc mở trang.
 *
 * Bảo mật: chỉ inline SVG same-origin path nội bộ (bắt đầu '/'), KHÔNG inline SVG
 * upload/ngoài (tránh XSS từ nội dung không tin cậy).
 */
export function InlineSvgImage({
  src,
  alt,
  className,
  cmsField,
  loading,
  fetchPriority,
}: {
  src: string
  alt: string
  className?: string
  cmsField?: string
  /** 'lazy' cho ảnh dưới màn hình đầu: không tải trước, chỉ tải khi cuộn gần tới. */
  loading?: 'lazy' | 'eager'
  /** 'high' cho ảnh là phần tử lớn nhất màn hình đầu (LCP). */
  fetchPriority?: 'high' | 'low' | 'auto'
}) {
  const isLocalSvg = !!src && src.startsWith('/') && src.toLowerCase().endsWith('.svg')
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [svg, setSvg] = useState<string | null>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (!isLocalSvg) {
      setSvg(null)
      return
    }
    // Bản đang bị ẩn (display:none ở kích thước màn hình này) thì không nhúng.
    const img = imgRef.current
    if (img && img.getClientRects().length === 0) return
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

  useEffect(() => {
    if (!svg || animate) return
    let idleId: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const start = () => {
      const ric = window.requestIdleCallback
      if (ric) idleId = ric(() => setAnimate(true), { timeout: 3000 })
      else timer = setTimeout(() => setAnimate(true), 1000)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timer) clearTimeout(timer)
    }
  }, [svg, animate])

  if (isLocalSvg && svg) {
    return (
      <div
        data-cms-field={cmsField}
        className={className}
        // Tạm dừng hiệu ứng trong SVG đến khi trang tải xong (quy tắc [data-anim='hold'] trong app/globals.css)
        data-anim={animate ? 'on' : 'hold'}
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      data-cms-field={cmsField}
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
    />
  )
}
