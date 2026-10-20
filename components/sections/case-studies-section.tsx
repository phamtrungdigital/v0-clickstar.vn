'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link, { useLocalHref } from '@/components/app-link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { CaseStudiesContent, CaseStudyItem } from '@/lib/cms/types'

const AUTOPLAY_MS = 5000

/**
 * Dải dự án cuộn ngang bằng CSS (scroll-snap), không dùng thư viện trượt: 1 thẻ / 2 thẻ (từ 640px) / 3 thẻ (từ 1024px).
 * Nút trước/sau và chấm chuyển theo từng thẻ; tự chuyển 5 giây/lần, dừng khi rê chuột, chạm, tab ẩn hoặc
 * người dùng bật giảm chuyển động. Tới thẻ cuối thì quay về đầu.
 */
export function CaseStudiesSection({ content }: { content: CaseStudiesContent }) {
  const { t } = useLanguage()
  const trackRef = useRef<HTMLDivElement | null>(null)
  const pausedRef = useRef(false)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(Math.max(1, content.items.length))

  // Số vị trí dừng = số thẻ - số thẻ hiện cùng lúc + 1 (giống chấm của slider cũ)
  const measure = useCallback(() => {
    const el = trackRef.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
    const perView = Math.max(1, Math.round((el.clientWidth + 1) / step))
    setPages(Math.max(1, content.items.length - perView + 1))
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
    setPage(atEnd ? Math.max(0, content.items.length - perView) : Math.round(el.scrollLeft / step))
  }, [content.items.length])

  const goTo = useCallback((i: number) => {
    const el = trackRef.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({ left: card.offsetLeft - (el.firstElementChild as HTMLElement).offsetLeft, behavior: 'smooth' })
  }, [])

  const step = useCallback(
    (dir: 1 | -1) => {
      const next = page + dir
      goTo(next >= pages ? 0 : next < 0 ? pages - 1 : next)
    },
    [goTo, page, pages]
  )

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    let raf = 0
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), measure()))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [measure])

  useEffect(() => {
    if (pages <= 1) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return
      step(1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [pages, step])

  const pause = () => (pausedRef.current = true)
  const resume = () => (pausedRef.current = false)

  return (
    <section
      data-cms-section="case_studies"
      className="py-16 lg:py-24 bg-background overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <div
              data-cms-field="eyebrow"
              className="inline-flex items-center gap-2 bg-primary/10 text-[#144c97] font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-full mb-4"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              {t(content.eyebrow.vi, content.eyebrow.en)}
            </div>

            <h2
              data-cms-field="heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight text-balance"
            >
              {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
              <span className="text-[#1859b8]">
                {t(content.heading_highlight.vi, content.heading_highlight.en)}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              data-cms-field="view_all"
              href={content.view_all_href}
              className="hidden sm:inline-flex items-center gap-2 text-[#1859b8] font-semibold hover:gap-3 transition-all duration-200"
            >
              {t(content.view_all_label.vi, content.view_all_label.en)}
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => step(-1)}
                className="w-11 h-11 rounded-full border-2 border-border bg-background flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => step(1)}
                className="w-11 h-11 rounded-full border-2 border-border bg-background flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onFocus={pause}
          onBlur={resume}
          className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth scroll-px-4 px-4 pb-2 sm:scroll-px-6 lg:scroll-px-8 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {content.items.map((study, index) => (
            <div
              key={index}
              className="w-full shrink-0 snap-start sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
            >
              <CaseStudyCard
                study={study}
                title={t(study.title.vi, study.title.en)}
                category={t(study.category.vi, study.category.en)}
                itemIndex={index}
              />
            </div>
          ))}
        </div>

        {pages > 1 && (
          <div className="mt-10 flex items-center justify-center">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t(`Tới dự án ${i + 1}`, `Go to project ${i + 1}`)}
                aria-current={i === page ? 'true' : undefined}
                className="flex h-6 min-w-6 items-center justify-center px-1"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-200 ${i === page ? 'w-6 bg-primary' : 'w-2 bg-border'}`}
                />
              </button>
            ))}
          </div>
        )}

        <div className="sm:hidden mt-8 text-center">
          <Link
            href={content.view_all_href}
            className="inline-flex items-center gap-2 text-[#1859b8] font-semibold"
          >
            {t(content.view_all_label.vi, content.view_all_label.en)}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Thẻ (tag) trong CMS là chuỗi một ngôn ngữ; thẻ tiếng Việt cần bản EN khi site ở EN. Thẻ lạ giữ nguyên. */
const TAG_EN: Record<string, string> = { 'Marketing đa kênh': 'Multi-channel marketing' }

function CaseStudyCard({
  study,
  title,
  category,
  itemIndex,
}: {
  study: CaseStudyItem
  title: string
  category: string
  itemIndex: number
}) {
  const { language } = useLanguage()
  const localHref = useLocalHref()
  const tags = study.tags.map((tag) => (language === 'en' ? (TAG_EN[tag] ?? tag) : tag))
  const inner = study.mockup ? (
    <div
      data-cms-field="item"
      data-cms-item-index={itemIndex}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-[#2b2b2e] to-[#1d1d1f]"
    >
      <div className="absolute inset-x-4 top-4 bottom-[92px] overflow-hidden rounded-xl bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]">
        <Image
          quality={95}
          src={study.image}
          alt={title}
          fill
          className="object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#1d1d1f]/85 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-3">
        <p className="mb-1 text-sm text-[#d2d2d7]">{category}</p>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#7db8ff]">{title}</h3>
      </div>
    </div>
  ) : (
    <div
      data-cms-field="item"
      data-cms-item-index={itemIndex}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
    >
      <Image quality={95}
        src={study.image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white/70 text-sm mb-1">{category}</p>
        <h3 className="text-white text-lg font-bold group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
      </div>
      <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <ArrowRight className="w-5 h-5 text-[#1859b8]" />
      </div>
    </div>
  )

  if (!study.href) return <div className="group block">{inner}</div>
  const isExternal = /^https?:\/\//.test(study.href)
  if (isExternal)
    return (
      // CMS lưu địa chỉ tuyệt đối tới chính site (https://clickstar.vn/projects/x): bản /en phải mở bản /en của dự án
      <a href={localHref(study.href)} target="_blank" rel="noopener noreferrer" className="group block">
        {inner}
      </a>
    )
  return (
    <Link href={study.href} className="group block">
      {inner}
    </Link>
  )
}
