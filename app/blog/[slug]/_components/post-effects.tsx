'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

/** Toàn bộ chuyển động của trang bài viết. Mọi hiệu ứng tắt khi người dùng bật chế độ giảm chuyển động. */
const CSS = `
.bp-up{animation:bp-up .85s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0s)}
@keyframes bp-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.bp-cover{animation:bp-cover 1.2s cubic-bezier(.2,.7,.2,1) .3s both}
@keyframes bp-cover{from{opacity:0;clip-path:inset(10% 5% 0 5% round 32px);transform:translateY(24px)}to{opacity:1;clip-path:inset(0 0 0 0 round 24px);transform:none}}
.bp-zoom{animation:bp-zoom 2s cubic-bezier(.2,.7,.2,1) .3s both}
@keyframes bp-zoom{from{transform:scale(1.08)}to{transform:scale(1)}}
.bp-toc-item{animation:bp-up .6s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(.45s + var(--i,0) * 45ms)}
.bp-pre{opacity:0;transform:translateY(16px)}
.bp-in{opacity:1;transform:none;transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}
.bp-prose h2::after{content:"";display:block;width:48px;height:3px;border-radius:2px;margin-top:10px;background:linear-gradient(90deg,#3687FC,#fb923c);transition:transform .9s .2s cubic-bezier(.2,.7,.2,1);transform-origin:left}
.bp-prose h2.bp-pre::after{transform:scaleX(.15)}
.bp-prose blockquote{position:relative}
.bp-glow{position:relative;overflow:hidden;isolation:isolate}
.bp-glow::before{content:"";position:absolute;inset:-40%;z-index:-1;background:radial-gradient(40% 40% at 30% 40%,rgba(54,135,252,.35),transparent 70%),radial-gradient(35% 35% at 75% 60%,rgba(251,146,60,.22),transparent 70%);animation:bp-drift 14s ease-in-out infinite alternate}
@keyframes bp-drift{from{transform:translate3d(-4%,-3%,0) rotate(0deg)}to{transform:translate3d(4%,3%,0) rotate(8deg)}}
.bp-star{animation:bp-spin 24s linear infinite}
@keyframes bp-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){
.bp-up,.bp-cover,.bp-zoom,.bp-toc-item,.bp-glow::before,.bp-star{animation:none}
.bp-pre{opacity:1;transform:none}
.bp-prose h2.bp-pre::after{transform:none}
}
`

export function PostStyles() {
  return <style>{CSS}</style>
}

/** Thanh tiến độ đọc ở mép trên màn hình: dài ra theo mức cuộn của bài. */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = document.getElementById('bp-article')
      if (!el || !ref.current) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.1, 0), Math.max(total, 1))
      ref.current.style.transform = `scaleX(${total > 0 ? done / total : 0})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none" aria-hidden="true">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-to-r from-[#3687FC] to-[#fb923c]"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  )
}

/**
 * Bọc phần nội dung bài: tiêu đề, trích dẫn, danh sách, bảng, khối mã và ảnh hiện dần khi cuộn tới.
 * Chỉ ẩn trước những khối còn nằm dưới màn hình lúc tải; không có JavaScript thì nội dung vẫn hiện đầy đủ.
 */
export function BodyReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Khối đã nằm trên hoặc trong màn hình thì hiện; khối còn ở dưới thì ẩn chờ. Kiểm theo vị trí cuộn (không phải
    // IntersectionObserver) để khối bị bỏ qua khi nhảy tới mục lục hay cuộn rất nhanh vẫn hiện khi quay lại xem.
    let pending: HTMLElement[] = []
    root
      .querySelectorAll(':scope > h2, :scope > h3, :scope > blockquote, :scope > ul, :scope > ol, :scope > table, :scope > pre, :scope > p > img')
      .forEach((el) => {
        const target = (el.tagName === 'IMG' ? el.parentElement : el) as HTMLElement
        if (target.getBoundingClientRect().top > window.innerHeight * 0.95) {
          target.classList.add('bp-pre')
          pending.push(target)
        }
      })
    let raf = 0
    const check = () => {
      raf = 0
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          el.classList.add('bp-in')
          return false
        }
        return true
      })
      if (pending.length === 0) window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** Nút sao chép liên kết bài: biểu tượng chuyển thành dấu tích trong giây lát. */
export function CopyLinkButton({ url }: { url: string }) {
  const { t } = useLanguage()
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          setDone(true)
          window.setTimeout(() => setDone(false), 1800)
        } catch {
          window.prompt(t('Sao chép liên kết:', 'Copy link:'), url)
        }
      }}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
    >
      {done ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
      {done ? t('Đã sao chép', 'Copied') : t('Sao chép liên kết', 'Copy link')}
    </button>
  )
}
