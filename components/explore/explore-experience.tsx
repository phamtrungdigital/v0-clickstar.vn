'use client'

/**
 * Sân khấu của trang /kham-pha: câu hỏi mở đầu "Anh chị đang muốn tìm gì?", nút điểm chạm, khung thông tin từng khu,
 * điều khiển, và nạp cảnh 3D (components/explore/explore-scene.tsx) SAU khi trang đã tải xong để không tranh băng thông
 * với nội dung chính. Cảnh 3D là lớp trải nghiệm thêm: chữ, liên kết và danh sách sản phẩm nằm ở HTML thật của trang.
 *
 * Dự phòng: không có WebGL thì hiện lời nhắn và nút tới danh sách; "giảm chuyển động" (hệ điều hành hoặc nút ở góc) thì
 * camera nhảy thẳng và các khu đứng yên. Khung hình tạm dừng khi sân khấu ra khỏi màn hình.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, ArrowRight, Compass, X } from 'lucide-react'
import Link from '@/components/app-link'
import { useLanguage } from '@/contexts/language-context'
import { ZONES, trackExplore, zoneById, type ZoneId } from './zones'

const ExploreScene = dynamic(() => import('./explore-scene'), { ssr: false })

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function ExploreExperience() {
  const { t, language } = useLanguage()
  const [intro, setIntro] = useState(true)
  const [focus, setFocus] = useState<ZoneId | null>(null)
  const [load3d, setLoad3d] = useState(false)
  const [ready, setReady] = useState(false)
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [osReduced, setOsReduced] = useState(false)
  const [motionOff, setMotionOff] = useState(false)
  const [active, setActive] = useState(true)

  const stage = useRef<HTMLDivElement>(null)
  const hotspotRefs = useRef<Partial<Record<ZoneId, HTMLElement | null>>>({})
  const dragRef = useRef(0)
  const dragging = useRef(false)
  const reduced = osReduced || motionOff

  // Khả năng của máy + ưu tiên giảm chuyển động của hệ điều hành.
  useEffect(() => {
    setWebgl(hasWebGL())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setOsReduced(mq.matches)
    const on = () => setOsReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Nạp cảnh 3D khi sân khấu sắp tới gần màn hình (phần kể chuyện nằm phía trên nên không cần nạp sớm).
  useEffect(() => {
    const el = stage.current
    if (!webgl || !el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad3d(true)
          io.disconnect()
        }
      },
      { rootMargin: '900px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [webgl])

  // Tạm dừng vẽ khi sân khấu ra khỏi màn hình.
  useEffect(() => {
    const el = stage.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const open = useCallback((id: ZoneId, source: 'intent' | 'scene' | 'hotspot' | 'nav') => {
    setIntro(false)
    setLoad3d(true)
    setFocus(id)
    trackExplore(source === 'intent' ? 'explore_intent' : 'explore_zone_open', { zone: id, source })
  }, [])

  const overview = useCallback(() => {
    setIntro(false)
    setFocus(null)
  }, [])

  useEffect(() => {
    if (!focus) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFocus(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focus])

  const step = (dir: 1 | -1) => {
    if (!focus) return
    const i = ZONES.findIndex((z) => z.id === focus)
    open(ZONES[(i + dir + ZONES.length) % ZONES.length].id, 'nav')
  }

  const zone = focus ? zoneById(focus) : null
  const L = (x: { vi: string; en: string }) => (language === 'vi' ? x.vi : x.en)
  const chip =
    'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 h-11 text-[14.5px] font-medium text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white'

  return (
    <section
      ref={stage}
      aria-label={t('Thế giới Click Star', 'The Click Star world')}
      className="relative isolate h-[calc(100svh-64px)] min-h-[620px] max-h-[920px] w-full overflow-hidden text-white"
      style={{ background: 'radial-gradient(120% 90% at 50% 42%, #14377a 0%, #0a1a3d 48%, #050d22 100%)' }}
    >
      <h2 className="sr-only">{t('Khám phá các khu sản phẩm bằng 3D', 'Explore the product areas in 3D')}</h2>

      {/* Lớp 3D (kéo ngang để xoay; cuộn dọc vẫn cuộn trang) */}
      {load3d && webgl ? (
        <div
          className="absolute inset-0"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={(e) => {
            if (e.button === 0) dragging.current = true
          }}
          onPointerMove={(e) => {
            if (dragging.current && !focus) dragRef.current -= e.movementX * 0.006
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerLeave={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <ExploreScene
            focus={focus}
            reduced={reduced}
            active={active}
            hotspotRefs={hotspotRefs}
            dragRef={dragRef}
            onSelect={(id) => open(id, 'scene')}
            onReady={() => setReady(true)}
          />
        </div>
      ) : null}

      {/* Tranh tạm trong lúc nạp cảnh 3D: đảo phát sáng bằng CSS */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="h-[46vmin] w-[46vmin] rounded-full opacity-70" style={{ background: 'radial-gradient(closest-side, rgba(76,154,255,.55), rgba(76,154,255,0))' }} />
      </div>

      {/* Nút điểm chạm: phần tử HTML thật, cảnh 3D ghi vị trí vào transform mỗi khung hình */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {ZONES.map((z, i) => (
          <button
            key={z.id}
            ref={(el) => {
              hotspotRefs.current[z.id] = el
            }}
            type="button"
            onClick={() => open(z.id, 'hotspot')}
            aria-label={L(z.name)}
            aria-pressed={focus === z.id}
            className={`pointer-events-auto absolute left-0 top-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full border bg-[#0a1a3d]/80 py-1 pl-1 pr-3.5 text-[13px] font-semibold backdrop-blur transition-[opacity,background-color,border-color] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              ready && !intro ? (focus && focus !== z.id ? 'opacity-35 hover:opacity-100' : 'opacity-100') : 'pointer-events-none opacity-0'
            } ${focus === z.id ? 'border-white bg-white/20' : 'border-white/25 hover:border-white/70'}`}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full text-[12px] font-bold text-[#06122b]" style={{ background: z.color }}>
              {i + 1}
            </span>
            {L(z.name)}
          </button>
        ))}
      </div>

      {/* Câu hỏi mở đầu */}
      {intro ? (
        <div className="absolute inset-0 grid place-items-center bg-[#050d22]/55 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[640px] text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-[#cfe3ff]">
              <Compass className="h-4 w-4" aria-hidden="true" />
              {t('Thế giới Click Star', 'The Click Star world')}
            </p>
            <h2 className="mt-4 text-balance text-[30px] font-extrabold leading-tight sm:text-[40px]">{t('Anh chị đang muốn tìm gì?', 'What are you looking for?')}</h2>
            <p className="mx-auto mt-2 max-w-[460px] text-[15px] text-[#b8cdf0]">
              {t('Chọn một điều, Click Star đưa anh chị tới đúng khu trong thế giới công nghệ của mình.', 'Pick one and we will take you to the matching area of the Click Star technology world.')}
            </p>

            {webgl === false ? (
              <div className="mt-6">
                <p className="text-[14.5px] text-[#ffd9a0]">
                  {t('Thiết bị này chưa bật đồ họa 3D, nên chưa dựng được thế giới. Anh chị xem danh sách sản phẩm bên dưới.', '3D graphics are not available on this device. See the product list below.')}
                </p>
                <a href="#san-pham" className={`${chip} mt-4`}>
                  {t('Xem danh sách sản phẩm', 'See the product list')}
                </a>
              </div>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  {ZONES.map((z) => (
                    <button key={z.id} type="button" className={chip} onClick={() => open(z.id, 'intent')}>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: z.color }} />
                      {L(z.intent)}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoad3d(true)
                    overview()
                  }}
                  className="mt-5 text-[14px] font-medium text-[#9cc4ff] underline underline-offset-4 hover:text-white"
                >
                  {t('Cứ dạo quanh trước', 'Just look around first')}
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Điều khiển */}
      {!intro ? (
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-6 sm:top-6">
          <span className="hidden rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-[#cfe3ff] sm:inline-flex">{t('Thế giới Click Star', 'The Click Star world')}</span>
          {focus ? (
            <button type="button" onClick={() => setFocus(null)} className={`${chip} h-9 text-[13px]`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('Toàn cảnh', 'Overview')}
            </button>
          ) : (
            <button type="button" onClick={() => setIntro(true)} className={`${chip} h-9 text-[13px]`}>
              {t('Chọn lại điều cần tìm', 'Pick what you need again')}
            </button>
          )}
        </div>
      ) : null}

      {!intro && !focus && ready ? (
        <p className="pointer-events-none absolute bottom-5 left-1/2 w-max max-w-[92%] -translate-x-1/2 rounded-full bg-black/30 px-4 py-2 text-center text-[13px] text-[#cfe3ff] backdrop-blur">
          {t('Kéo ngang để xoay · Bấm vào một khu để xem', 'Drag sideways to rotate · Tap an area to explore')}
        </p>
      ) : null}

      {!intro && webgl ? (
        <button
          type="button"
          onClick={() => setMotionOff((v) => !v)}
          aria-pressed={reduced}
          className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12.5px] text-[#cfe3ff] backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
          style={focus ? { display: 'none' } : undefined}
        >
          {reduced ? t('Bật chuyển động', 'Turn motion on') : t('Giảm chuyển động', 'Reduce motion')}
        </button>
      ) : null}

      {/* Khung thông tin một khu */}
      {zone ? (
        <div
          role="region"
          aria-live="polite"
          aria-label={L(zone.name)}
          className="absolute inset-x-3 bottom-[140px] max-h-[52%] overflow-y-auto rounded-[22px] border border-white/15 bg-[#0a1a3d]/90 p-5 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-6 sm:max-h-[calc(100%-48px)] sm:w-[360px]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full text-[14px] font-bold text-[#06122b]" style={{ background: zone.color }}>
                {ZONES.findIndex((z) => z.id === zone.id) + 1}
              </span>
              <h2 className="text-[20px] font-bold leading-tight">{L(zone.name)}</h2>
            </div>
            <button type="button" aria-label={t('Đóng', 'Close')} onClick={() => setFocus(null)} className="grid h-8 w-8 flex-none place-items-center rounded-full text-[#cfe3ff] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-[#dbe7ff]">{L(zone.desc)}</p>
          <ul className="mt-3 hidden gap-2 text-[14px] text-[#b8cdf0] sm:grid">
            {zone.points.map((p) => (
              <li key={p.vi} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full" style={{ background: zone.color }} />
                {L(p)}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href={`/contact?service=${encodeURIComponent(zone.contactService)}`}
              className="inline-flex h-11 items-center rounded-full bg-[#1e6dda] px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[#3b86f0] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t('Nhận tư vấn', 'Get a consultation')}
            </Link>
            <Link
              href={zone.href}
              className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t('Xem chi tiết', 'Learn more')}
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[13px] text-[#9cc4ff]">
            <button type="button" onClick={() => step(-1)} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('Khu trước', 'Previous')}
            </button>
            <button type="button" onClick={() => step(1)} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {t('Khu tiếp', 'Next')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
