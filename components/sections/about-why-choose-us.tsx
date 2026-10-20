'use client'

import { useEffect, useRef, useState } from 'react'
import Link from '@/components/app-link'
import { ArrowRight, User } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AboutWhyChooseUsContent } from '@/lib/cms/types'

/**
 * "Tại sao chọn chúng tôi" (18/10/2026, phương án B do anh chọn): danh sách lý do bên trái, tự chuyển
 * mỗi ~4,6 giây (có thanh tiến trình), khung tối bên phải đổi hình minh hoạ theo lý do đang chọn.
 * Tiêu đề lý do lấy từ CMS (features); câu mô tả và hình minh hoạ theo thứ tự lý do nằm trong file này.
 * Hình chỉ là minh hoạ khái niệm, không chứa số liệu cam kết. Dừng khi rê chuột/bấm; không tự chuyển
 * khi người dùng giảm chuyển động. Thay thế lưới ảnh stock cũ (trường images trong CMS không còn dùng).
 */

const AUTO_MS = 4600

type L = { vi: string; en: string }
const DETAIL: L[] = [
  { vi: 'Từ thu hút đúng tệp, chuyển đổi thành doanh thu, đến giữ chân khách quay lại.', en: 'From attracting the right audience and converting to revenue, to keeping customers coming back.' },
  { vi: 'Bắt đầu bằng gói nhỏ, mở rộng khi doanh nghiệp cần.', en: 'Start with a small package and expand when your business needs it.' },
  { vi: 'Marketing, dữ liệu, kỹ thuật và AI làm việc trong cùng một đội.', en: 'Marketing, data, engineering and AI working as one team.' },
  { vi: 'Mỗi mục tiêu có con số, mỗi giai đoạn có báo cáo.', en: 'Every goal has a number, every stage has a report.' },
  { vi: 'Một đầu mối duy nhất, đồng hành lâu dài sau khi triển khai.', en: 'A single point of contact, with long-term support after launch.' },
]

const CSS = `
@keyframes cs-fill { from { width: 0 } to { width: 100% } }
@media (prefers-reduced-motion: reduce) { .cs-bar { animation: none !important; width: 0 !important } }
`

export function AboutWhyChooseUsSection({ content }: { content: AboutWhyChooseUsContent }) {
  const { t } = useLanguage()
  const features = content.features ?? []
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((e) => setInView(e.some((x) => x.isIntersecting)), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const running = auto && inView && !paused && features.length > 1
  useEffect(() => {
    if (!running) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % features.length), AUTO_MS)
    return () => window.clearTimeout(id)
  }, [running, active, features.length])

  const pick = (i: number) => {
    setActive(i)
    setAuto(false)
  }

  return (
    <section ref={ref} data-cms-section="about_why_choose_us" className="py-20 lg:py-28 bg-white">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[760px]">
          <p
            data-cms-field="eyebrow"
            style={{ color: '#1859b8', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 0 }}
          >
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
          <h2 data-cms-field="heading" className="mt-3 text-[32px] sm:text-[44px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#1d1d1f] text-balance">
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-[#1859b8]">{t(content.heading_highlight.vi, content.heading_highlight.en)}</span>
          </h2>
          <p data-cms-field="description" className="mt-4 text-lg leading-relaxed text-[#515154]">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        <div
          className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div>
            <div role="tablist" aria-orientation="vertical" className="border-t border-[#d2d2d7]">
              {features.map((f, i) => {
                const on = i === active
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    data-cms-field="feature"
                    data-cms-item-index={i}
                    onClick={() => pick(i)}
                    className="relative block w-full border-b border-[#d2d2d7] px-1 py-5 text-left"
                  >
                    <span className={`block text-[20px] font-semibold leading-snug tracking-[-0.02em] transition-colors duration-300 ${on ? 'text-[#1d1d1f]' : 'text-[#6e6e73]'}`}>
                      {t(f.vi, f.en)}
                    </span>
                    <span
                      className={`block overflow-hidden text-[15px] leading-relaxed text-[#515154] transition-all duration-500 ${on ? 'mt-1.5 max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      {DETAIL[i] ? t(DETAIL[i].vi, DETAIL[i].en) : ''}
                    </span>
                    {on && (
                      <span
                        key={`${active}-${auto}`}
                        className="cs-bar absolute bottom-[-1px] left-0 h-[2px] bg-[#1e6dda]"
                        style={auto ? { animation: `cs-fill ${AUTO_MS}ms linear forwards`, animationPlayState: running ? 'running' : 'paused' } : { width: '100%' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            <Link
              data-cms-field="cta"
              href={content.cta_href}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1e6dda] px-7 py-3.5 text-[15px] font-semibold text-white transition-transform active:scale-95"
            >
              {t(content.cta_label.vi, content.cta_label.en)}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative min-h-[380px] overflow-hidden rounded-[24px] bg-[#1d1d1f] text-white lg:min-h-[460px]" aria-live="polite">
            {features.map((f, i) => (
              <Pane key={i} index={i} on={i === active} title={t(f.vi, f.en)} />
            ))}
            <p className="absolute bottom-4 right-6 z-10 text-[11.5px] text-[#a1a1a6]">{t('Hình minh hoạ', 'Illustration')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const TAG = 'inline-block rounded-full bg-white/12 px-3 py-1 text-[12.5px] text-white mr-1.5 mt-1.5'
const MINI = 'rounded-[14px] bg-white px-4 py-3 text-[14px] text-[#1d1d1f]'

function Pane({ index, on, title }: { index: number; on: boolean; title: string }) {
  const { t } = useLanguage()
  const cls = `absolute inset-0 flex flex-col justify-between p-7 sm:p-9 transition-all duration-500 ${on ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`
  const label = (txt: string) => <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7db8ff]">{txt}</p>
  const foot = (txt: string) => <p className="pr-28 text-[13.5px] leading-normal text-[#c7c7cc]">{txt}</p>

  switch (index) {
    case 0:
      return (
        <div className={cls} aria-hidden={!on}>
          {label(t('Hành trình khách hàng', 'Customer journey'))}
          <div className="space-y-2.5">
            <p className={MINI}><b>{t('Ẩn danh', 'Anonymous')}</b> · {t('xem trang Bảng giá 2 lần', 'viewed Pricing twice')}</p>
            <p className={MINI}><b>{t('Định danh', 'Identified')}</b> · {t('để lại số điện thoại', 'shared a phone number')}</p>
            <p className={MINI}><b>{t('Khách hàng', 'Customer')}</b> · {t('ký hợp đồng', 'signed the contract')}</p>
          </div>
          {foot(t('Một hồ sơ xuyên suốt từ quảng cáo đến hợp đồng', 'One profile from ad click to contract'))}
        </div>
      )
    case 1:
      return (
        <div className={cls} aria-hidden={!on}>
          {label(t('Linh hoạt', 'Flexible'))}
          <div>
            <p className="text-[84px] font-semibold leading-none tracking-[-0.05em]">{t('3 bước', '3 steps')}</p>
            <div className="mt-3">
              <span className={TAG}>{t('Gói nhỏ', 'Small package')}</span>
              <span className={TAG}>{t('Từng giai đoạn', 'Stage by stage')}</span>
              <span className={TAG}>{t('Mở rộng khi cần', 'Scale when needed')}</span>
            </div>
          </div>
          {foot(t('Bắt đầu nhỏ, đo kết quả, rồi mới mở rộng', 'Start small, measure, then expand'))}
        </div>
      )
    case 2:
      return (
        <div className={cls} aria-hidden={!on}>
          {label(t('Đội ngũ', 'The team'))}
          <div>
            <div className="flex">
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className="-mr-3 grid h-16 w-16 place-items-center rounded-full border-2 border-[#1d1d1f] bg-[#3a3a3d] text-[#a1a1a6]">
                  <User className="h-7 w-7" strokeWidth={1.6} />
                </span>
              ))}
            </div>
            <div className="mt-5">
              {[t('Marketing', 'Marketing'), t('Dữ liệu', 'Data'), t('Kỹ thuật', 'Engineering'), 'AI', t('Chăm sóc', 'Care')].map((x) => (
                <span key={x} className={TAG}>{x}</span>
              ))}
            </div>
          </div>
          {foot(t('Một đội, không chuyền việc giữa nhiều nhà thầu', 'One team, no handoffs between vendors'))}
        </div>
      )
    case 3:
      return (
        <div className={cls} aria-hidden={!on}>
          {label(t('Kết quả đo được', 'Measurable results'))}
          <div className="flex h-36 items-end gap-2.5">
            {[38, 52, 47, 68, 82, 100].map((h, k) => (
              <span
                key={k}
                className="flex-1 rounded-t-md bg-[#1e6dda] transition-[height] duration-1000"
                style={{ height: on ? `${h}%` : '0%', transitionDelay: `${k * 70}ms` }}
              />
            ))}
          </div>
          {foot(t('Mục tiêu rõ ràng, số đo thật, báo cáo định kỳ', 'Clear goals, real numbers, regular reports'))}
        </div>
      )
    case 4:
      return (
        <div className={cls} aria-hidden={!on}>
          {label(t('Đồng hành', 'Partnership'))}
          <div>
            <p className="text-[84px] font-semibold leading-none tracking-[-0.05em]">24/7</p>
            <p className={`${MINI} mt-5 max-w-[320px]`}><b>{t('Một đầu mối', 'One contact')}</b> · {t('cho toàn bộ hệ thống', 'for the whole system')}</p>
          </div>
          {foot(t('Đồng hành lâu dài sau khi triển khai', 'Long-term support after launch'))}
        </div>
      )
    default:
      return (
        <div className={cls} aria-hidden={!on}>
          {label(t('Vì sao chọn chúng tôi', 'Why choose us'))}
          <p className="text-[34px] font-semibold leading-normal tracking-[-0.03em]">{title}</p>
          <span />
        </div>
      )
  }
}
