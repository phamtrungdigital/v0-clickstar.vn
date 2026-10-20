'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Check, Link2 } from 'lucide-react'
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
/* Nền đầu bài: hai quầng sáng trôi chậm và lưới chấm mờ dần xuống dưới */
.bp-orb{position:absolute;border-radius:9999px;filter:blur(70px);opacity:.5;animation:bp-orb 16s ease-in-out infinite alternate}
@keyframes bp-orb{from{transform:translate3d(-6%,-4%,0) scale(1)}to{transform:translate3d(8%,6%,0) scale(1.15)}}
.bp-dots{background-image:radial-gradient(rgba(100,116,139,.28) 1px,transparent 1.2px);background-size:22px 22px;-webkit-mask-image:linear-gradient(to bottom,#000,transparent 85%);mask-image:linear-gradient(to bottom,#000,transparent 85%);animation:bp-fade 1.6s ease both}
@keyframes bp-fade{from{opacity:0}to{opacity:1}}
/* Tiêu đề hiện từng chữ từ dưới lên */
.bp-wm{display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.14em;margin-bottom:-.14em}
.bp-w{display:inline-block;animation:bp-word .9s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(.15s + var(--i,0) * 70ms)}
@keyframes bp-word{from{transform:translateY(112%) rotate(3deg)}to{transform:none}}
/* Ảnh bìa: ánh sáng bao quanh lấy màu từ chính ảnh, ảnh trượt nhẹ theo cuộn (chỉ từ 640px; trên mobile giữ nguyên khung 16:9 để không cắt ảnh) */
.bp-ambient{position:absolute;inset:6% 4% -4%;z-index:-1;filter:blur(38px) saturate(1.5);opacity:.55;border-radius:32px;animation:bp-fade 1.8s .5s ease both}
.bp-par{position:absolute;inset:0}
@media (min-width:640px){.bp-par{top:-10px;bottom:-10px;transform:translate3d(0,calc(var(--py,0) * 1px),0);will-change:transform}}
/* Thân bài: gạch chân liên kết vẽ ra khi rê chuột, ảnh nhấc lên, bôi chọn màu thương hiệu */
.bp-prose a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;transition:background-size .35s cubic-bezier(.2,.7,.2,1)}
.bp-prose a:hover{background-size:100% 1.5px}
.bp-prose img{transition:transform .6s cubic-bezier(.2,.7,.2,1),box-shadow .6s}
.bp-prose img:hover{transform:translateY(-4px);box-shadow:0 28px 54px -30px rgba(15,23,42,.5)}
.bp-prose ::selection{background:rgba(54,135,252,.25)}
/* Khối chữ cách điệu: tóm tắt, hộp mục lục, tiêu đề đánh số, trích dẫn, danh sách, nhấn mạnh */
.bp-lead{position:relative;border-radius:22px;padding:24px 30px 26px;background:linear-gradient(135deg,rgba(54,135,252,.09),rgba(251,146,60,.06) 70%,transparent);border:1px solid rgba(54,135,252,.18)}
.bp-lead::before{content:"";position:absolute;left:0;top:20px;bottom:20px;width:4px;border-radius:0 4px 4px 0;background:linear-gradient(#3687FC,#fb923c)}
.bp-tocbox{position:relative;overflow:hidden}
.bp-tocbox::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,#3687FC,#fb923c)}
.bp-prose{counter-reset:bps}
.bp-prose h2{counter-increment:bps}
.bp-prose h2{position:relative;isolation:isolate;padding-top:1.7rem}
.bp-prose h2::before{content:counter(bps,decimal-leading-zero);position:absolute;z-index:-1;left:-.04em;top:-.75rem;font-size:4.6rem;line-height:1;font-weight:800;letter-spacing:-.04em;background:linear-gradient(135deg,#3687FC,#fb923c);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.26;pointer-events:none;user-select:none}
@media (max-width:640px){.bp-prose h2{padding-top:1.4rem}.bp-prose h2::before{font-size:3.6rem;top:-.6rem}}
.bp-prose blockquote{border:0;font-style:normal;border-radius:22px;padding:1.5rem 1.8rem 1.5rem 4rem;background:linear-gradient(135deg,rgba(54,135,252,.09),rgba(54,135,252,.02));margin:2rem 0}
.bp-prose blockquote::before{content:"“";position:absolute;left:1.2rem;top:.1rem;font-family:Georgia,serif;font-size:4.2rem;line-height:1;color:#3687FC;opacity:.55}
.bp-prose blockquote p::before,.bp-prose blockquote p::after{content:none}
.bp-prose blockquote p{margin:0}
.bp-prose ul{list-style:none;padding-left:0}
.bp-prose ul>li{position:relative;padding-left:1.8rem}
.bp-prose ul>li::marker{content:none}
.bp-prose ul>li::before{content:"";position:absolute;left:.25rem;top:.78em;width:.5rem;height:.5rem;border-radius:9999px;background:linear-gradient(135deg,#3687FC,#fb923c)}
.bp-prose ol{list-style:none;padding-left:0;counter-reset:bpo}
.bp-prose ol>li{counter-increment:bpo;position:relative;padding-left:2.7rem}
.bp-prose ol>li::marker{content:none}
.bp-prose ol>li::before{content:counter(bpo);position:absolute;left:0;top:.2em;display:flex;align-items:center;justify-content:center;width:1.85rem;height:1.85rem;border-radius:9999px;background:rgba(54,135,252,.12);color:#1859b8;font-size:.85rem;font-weight:600}
.bp-prose p strong,.bp-prose li strong{background:linear-gradient(transparent 62%,rgba(251,146,60,.24) 62%);padding:0 .08em}
/* Khối liên hệ: dấu cộng lấp lánh */
.bp-tw{position:absolute;color:rgba(255,255,255,.7);animation:bp-tw 3.2s ease-in-out infinite}
@keyframes bp-tw{0%,100%{opacity:.15;transform:scale(.7) rotate(0)}50%{opacity:1;transform:scale(1.1) rotate(90deg)}}
.bp-ring{transition:stroke-dashoffset .15s linear}
@media (prefers-reduced-motion:reduce){
.bp-orb,.bp-dots,.bp-w,.bp-ambient,.bp-tw{animation:none}
.bp-par{transform:none}
.bp-prose img:hover{transform:none}
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
      .querySelectorAll(':scope > h2, :scope > h3, :scope > p, :scope > blockquote, :scope > ul, :scope > ol, :scope > table, :scope > pre, :scope > p > img')
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

/** Cho ảnh bìa trượt nhẹ ngược chiều cuộn (hiệu ứng chiều sâu). Đặt vào trong khung có overflow-hidden. */
export function CoverParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const parent = el.parentElement
      if (!parent) return
      const r = parent.getBoundingClientRect()
      const mid = r.top + r.height / 2 - window.innerHeight / 2
      el.style.setProperty('--py', String(Math.max(-10, Math.min(10, -mid * 0.05))))
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
    <div ref={ref} className="bp-par">
      {children}
    </div>
  )
}

/** Nút tròn "về đầu bài" có vòng tiến độ đọc, hiện ra sau khi cuộn qua phần đầu. */
export function BackToTop() {
  const { t } = useLanguage()
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = document.getElementById('bp-article')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      setPct(total > 0 ? Math.min(Math.max((-rect.top + window.innerHeight * 0.1) / total, 0), 1) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  const C = 2 * Math.PI * 19
  const visible = pct > 0.06
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }
      aria-label={t('Về đầu bài', 'Back to top')}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-5 bottom-24 z-50 h-12 w-12 rounded-full bg-background shadow-[0_8px_24px_-8px_rgba(15,23,42,0.35)] border border-border flex items-center justify-center text-foreground hover:text-primary transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth="2.5" />
        <circle
          className="bp-ring text-[#3687FC]"
          cx="22"
          cy="22"
          r="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
        />
      </svg>
      <ArrowUp className="w-4 h-4" />
    </button>
  )
}
