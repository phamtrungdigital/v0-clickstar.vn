'use client'

/**
 * Phần kể chuyện của trang /kham-pha (đợt 1: chương 1-3). Một khối cao nhiều màn hình, bên trong có sân khấu dính (sticky):
 * khách cuộn xuống thì tiến độ p chạy 0 → 1 và cảnh 3D (story-scene.tsx) diễn theo, chữ từng chương hiện theo p.
 * Cuộn ngược thì câu chuyện chạy ngược. Có nút "Bỏ qua câu chuyện" nhảy tới phần thế giới 5 khu bên dưới.
 *
 * Dự phòng: không có WebGL thì hiện ba đoạn chữ của câu chuyện thay cho cảnh 3D; "giảm chuyển động" của hệ điều hành làm
 * nhân vật đứng yên các động tác nhỏ (cảnh vẫn chạy theo cuộn vì do khách điều khiển). Khung hình tạm dừng khi khối ra khỏi màn hình.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { CHAPTERS, chapterAt, clamp01, cutFade, endFade, type Chapter } from './story-timeline'
import type { AnchorId } from './story-scene'

const StoryScene = dynamic(() => import('./story-scene'), { ssr: false })

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const NAV_H = 56

export function StoryExperience() {
  const { t, language } = useLanguage()
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [load3d, setLoad3d] = useState(false)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [chapter, setChapter] = useState<Chapter>(1)

  const outer = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const shownRef = useRef(0)
  const anchorRefs = useRef<Partial<Record<AnchorId, HTMLElement | null>>>({})
  const cutEl = useRef<HTMLDivElement>(null)
  const endEl = useRef<HTMLDivElement>(null)
  const barEl = useRef<HTMLDivElement>(null)
  const cueEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setWebgl(hasWebGL())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Nạp cảnh 3D sau khi trang tải xong và trình duyệt rảnh.
  useEffect(() => {
    if (!webgl) return
    let idle: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const start = () => {
      if (window.requestIdleCallback) idle = window.requestIdleCallback(() => setLoad3d(true), { timeout: 1200 })
      else timer = setTimeout(() => setLoad3d(true), 150)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      if (idle !== undefined) window.cancelIdleCallback?.(idle)
      if (timer) clearTimeout(timer)
    }
  }, [webgl])

  // Tiến độ cuộn: 0 khi sân khấu vừa dính vào đầu trang, 1 khi sắp hết khối.
  useEffect(() => {
    const el = outer.current
    if (!el || !webgl) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const total = r.height - (window.innerHeight - NAV_H)
      progressRef.current = total > 0 ? clamp01((NAV_H - r.top) / total) : 0
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
  }, [webgl])

  // Tạm dừng vẽ khi khối ra khỏi màn hình.
  useEffect(() => {
    const el = outer.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '200px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Màn che, thanh tiến độ và chương hiện tại bám theo tiến độ ĐANG HIỂN THỊ của cảnh (không qua state mỗi khung hình).
  useEffect(() => {
    if (!webgl || !active) return
    let raf = 0
    let last: Chapter = 1
    const loop = () => {
      const p = shownRef.current
      if (cutEl.current) cutEl.current.style.opacity = cutFade(p).toFixed(3)
      if (endEl.current) endEl.current.style.opacity = endFade(p).toFixed(3)
      if (barEl.current) barEl.current.style.width = `${(p * 100).toFixed(2)}%`
      if (cueEl.current) cueEl.current.style.opacity = p < 0.02 ? '1' : '0'
      const c = chapterAt(p)
      if (c !== last) {
        last = c
        setChapter(c)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [webgl, active])

  const skip = useCallback(() => {
    document.getElementById('the-gioi')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [reduced])

  const L = (x: { vi: string; en: string }) => (language === 'vi' ? x.vi : x.en)

  const pill = 'pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold opacity-0 backdrop-blur'
  const problem = `${pill} border border-[#ff5a52]/60 bg-[#2a0f14]/80 text-[#ffd7d4]`

  // Không có WebGL: ba đoạn chữ thay cho cảnh 3D.
  if (webgl === false) {
    return (
      <section aria-label={t('Câu chuyện của Click Star', 'The Click Star story')} className="bg-[#050d22] px-4 py-14 text-white sm:px-6 lg:px-8">
        <h1 className="sr-only">{t('Thế giới Click Star: câu chuyện và các khu sản phẩm', 'The Click Star world: the story and the product areas')}</h1>
        <div className="mx-auto grid max-w-4xl gap-8">
          {CHAPTERS.map((c) => (
            <div key={c.n}>
              <p className="text-[13px] font-semibold text-[#9cc4ff]">{L(c.label)}</p>
              <h2 className="mt-1 text-[26px] font-extrabold leading-tight">{L(c.title)}</h2>
              <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[#b8cdf0]">{L(c.body)}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div ref={outer} className="relative h-[560svh] bg-[#050d22]" aria-label={t('Câu chuyện của Click Star', 'The Click Star story')} role="region">
      <h1 className="sr-only">{t('Thế giới Click Star: câu chuyện và các khu sản phẩm', 'The Click Star world: the story and the product areas')}</h1>
      <div className="sticky overflow-hidden text-white" style={{ top: NAV_H, height: `calc(100svh - ${NAV_H}px)`, background: 'radial-gradient(120% 90% at 50% 40%, #1a2440 0%, #0c1329 60%, #050a18 100%)' }}>
        {load3d ? (
          <StoryScene progressRef={progressRef} shownRef={shownRef} anchorRefs={anchorRefs} active={active} reduced={reduced} onReady={() => setReady(true)} />
        ) : null}

        {/* Nhãn gắn theo vị trí 3D */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div ref={(el) => void (anchorRefs.current.leak = el)} className={problem}>
            {t('Khách đến từ đâu?', 'Where do customers come from?')}
          </div>
          <div ref={(el) => void (anchorRefs.current.scatter = el)} className={problem}>
            {t('Số liệu mỗi nơi một nẻo', 'Numbers scattered everywhere')}
          </div>
          <div ref={(el) => void (anchorRefs.current.calls = el)} className={problem}>
            {t('Cuộc gọi xong là hết', 'Calls end and are forgotten')}
          </div>
          <div ref={(el) => void (anchorRefs.current.sign = el)} className={`${pill} border border-white/40 bg-[#0b1f4a]/80 text-[15px] tracking-wide text-white`}>
            CLICK STAR
          </div>
        </div>

        {/* Tranh tạm lúc nạp cảnh */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[14px] text-[#9cc4ff]">{t('Đang dựng câu chuyện…', 'Setting the scene…')}</p>
        </div>

        {/* Màn che khi cắt cảnh và khi chuyển sang phần thế giới */}
        <div ref={cutEl} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#050a18] opacity-0" />
        <div ref={endEl} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#0a1a3d] opacity-0" />

        {/* Chữ từng chương */}
        {/* Điện thoại: chữ ở trên cho khỏi trùng các nút nổi của website ở góc dưới; máy tính: chữ ở dưới, chừa chỗ cho các nút nổi bên trái */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#050a18]/90 via-[#050a18]/55 to-transparent px-4 pb-16 pt-14 sm:inset-x-0 sm:bottom-0 sm:top-auto sm:bg-gradient-to-t sm:px-8 sm:pb-9 sm:pl-24 sm:pt-24">
          <div className="relative mx-auto max-w-[1180px]">
            <div className="relative min-h-[150px] max-w-[560px] sm:min-h-[132px]">
              {CHAPTERS.map((c) => (
                <div key={c.n} aria-hidden={chapter !== c.n} className={`absolute inset-x-0 top-0 transition-all duration-500 ${chapter === c.n ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                  <p className="text-[13px] font-semibold text-[#9cc4ff]">{L(c.label)}</p>
                  <h2 className="mt-1 text-balance text-[24px] font-extrabold leading-tight sm:text-[32px]">{L(c.title)}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#c9d9f5] sm:text-[15.5px]">{L(c.body)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={cueEl} aria-hidden="true" className="pointer-events-none absolute bottom-3 left-1/2 flex w-max -translate-x-1/2 flex-col items-center gap-0.5 whitespace-nowrap text-[12.5px] text-[#9cc4ff] opacity-100 transition-opacity duration-500">
          {t('Cuộn xuống để theo dõi câu chuyện', 'Scroll down to follow the story')}
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>

        <button
          type="button"
          onClick={skip}
          className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12.5px] text-[#cfe3ff] backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
        >
          {t('Bỏ qua câu chuyện', 'Skip the story')}
        </button>

        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10" aria-hidden="true">
          <div ref={barEl} className="h-full w-0 bg-[#4c9aff]" />
        </div>
      </div>
    </div>
  )
}
