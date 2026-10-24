'use client'

/**
 * Banner đồng ý cookie (kiểu thanh ngang chân trang, anh chốt 24/10/2026) + bảng "Cài đặt cookie".
 * - Chưa chọn (hoặc lựa chọn quá 6 tháng / đổi phiên bản chính sách): hiện thanh, chỉ chạy nhóm cần thiết.
 * - Nút gạt trong bảng tùy chỉnh mặc định TẮT (opt-in theo Nghị định 13: im lặng không phải là đồng ý).
 * - Lưu: ghi cookie cs_consent, phát sự kiện cs-consent để bộ nạp mã tuỳ chỉnh chạy GA4/CDP ngay, ghi sổ đồng ý.
 * - Rút lại nhóm đã đồng ý: xoá cookie GA4/CDP, lịch sử cá nhân hóa rồi tải lại trang (script đã chạy không gỡ được).
 * - Mở lại bất cứ lúc nào: liên kết "Cài đặt cookie" ở chân trang phát sự kiện cs-consent-open.
 * Hiện sau khi trang tải xong để không tranh với nội dung chính lúc mở trang.
 */
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from '@/components/app-link'
import { useLanguage } from '@/contexts/language-context'
import {
  CONSENT_EVENT,
  CONSENT_OPEN_EVENT,
  POLICY_VERSION,
  clearRevoked,
  readConsent,
  writeConsent,
  type ConsentState,
} from '@/lib/consent/shared'

type Action = 'accept_all' | 'reject_all' | 'custom'

function logConsent(state: ConsentState, action: Action | 'withdraw', lang: string, path: string) {
  const body = JSON.stringify({
    visitor_id: state.id,
    action,
    analytics: state.analytics,
    marketing: state.marketing,
    policy_version: POLICY_VERSION,
    lang,
    page_path: path,
  })
  try {
    if (navigator.sendBeacon?.('/api/consent', new Blob([body], { type: 'application/json' }))) return
  } catch {}
  fetch('/api/consent', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {})
}

export function ConsentManager() {
  const pathname = usePathname() || '/'
  const { t, language } = useLanguage()
  const [bar, setBar] = useState(false)
  const [panel, setPanel] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const saveRef = useRef<HTMLButtonElement | null>(null)
  const isAdmin = pathname.startsWith('/admin-cls')

  useEffect(() => {
    if (isAdmin) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const show = () => {
      if (!readConsent()) timer = setTimeout(() => setBar(true), 400)
    }
    if (document.readyState === 'complete') show()
    else window.addEventListener('load', show, { once: true })
    const open = () => {
      const c = readConsent()
      setAnalytics(!!c?.analytics)
      setMarketing(!!c?.marketing)
      setPanel(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, open)
    return () => {
      window.removeEventListener('load', show)
      window.removeEventListener(CONSENT_OPEN_EVENT, open)
      if (timer) clearTimeout(timer)
    }
  }, [isAdmin])

  useEffect(() => {
    if (!panel) return
    saveRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanel(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel])

  if (isAdmin) return null

  const save = (a: boolean, m: boolean, action: Action) => {
    const prev = readConsent()
    const next = writeConsent(a, m)
    const revoked = (prev?.analytics && !a) || (prev?.marketing && !m)
    clearRevoked(next)
    logConsent(next, revoked ? 'withdraw' : action, language, pathname)
    setBar(false)
    setPanel(false)
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: next }))
    // GA4/CDP đã chạy thì không gỡ được khỏi trang đang mở: tải lại để áp lựa chọn mới.
    if (revoked) setTimeout(() => location.reload(), 150)
  }

  const btn =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 h-11 text-[14px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6dda] focus-visible:ring-offset-2'
  const ghost = `${btn} border border-[#d2d2d7] bg-white text-[#1d1d1f] hover:border-[#1e6dda]`
  const primary = `${btn} bg-[#1e6dda] text-white hover:bg-[#1859b8]`

  return (
    <>
      {bar && !panel && (
        <div
          role="region"
          aria-label={t('Thông báo cookie', 'Cookie notice')}
          className="fixed inset-x-0 bottom-0 z-[80] border-t border-[#d2d2d7] bg-white/95 backdrop-blur-md shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.35)] pb-[env(safe-area-inset-bottom)]"
        >
          <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[#1d1d1f]">{t('Click Star dùng cookie', 'Click Star uses cookies')}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#515154]">
                {t(
                  'Cookie cần thiết giúp website hoạt động. Khi anh chị đồng ý, Click Star dùng thêm cookie đo lường truy cập và cá nhân hóa nội dung. Có thể đổi lựa chọn bất cứ lúc nào ở "Cài đặt cookie" cuối trang. ',
                  'Essential cookies keep the website working. With your consent, Click Star also uses analytics and personalization cookies. You can change your choice anytime under "Cookie settings" in the footer. '
                )}
                <Link href="/cookie-policy" className="font-medium text-[#1859b8] underline underline-offset-2">
                  {t('Chính sách cookie', 'Cookie policy')}
                </Link>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-none">
              <button type="button" className={ghost} onClick={() => save(false, false, 'reject_all')}>
                {t('Từ chối', 'Reject')}
              </button>
              <button
                type="button"
                className={ghost}
                onClick={() => {
                  setAnalytics(false)
                  setMarketing(false)
                  setPanel(true)
                }}
              >
                {t('Tùy chỉnh', 'Customize')}
              </button>
              <button type="button" className={`${primary} col-span-2`} onClick={() => save(true, true, 'accept_all')}>
                {t('Đồng ý tất cả', 'Accept all')}
              </button>
            </div>
          </div>
        </div>
      )}

      {panel && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/45 p-4"
          onClick={(e) => e.target === e.currentTarget && setPanel(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cs-consent-title"
            className="max-h-full w-full max-w-[560px] overflow-y-auto rounded-[22px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="cs-consent-title" className="text-[20px] font-semibold text-[#1d1d1f]">
                {t('Cài đặt cookie', 'Cookie settings')}
              </h2>
              <button
                type="button"
                aria-label={t('Đóng', 'Close')}
                onClick={() => setPanel(false)}
                className="grid h-9 w-9 flex-none place-items-center rounded-full text-[20px] text-[#515154] hover:bg-[#f5f5f7]"
              >
                ×
              </button>
            </div>
            <p className="mt-1 text-[13.5px] text-[#515154]">
              {t(
                'Chọn những nhóm anh chị cho phép. Lựa chọn được lưu 6 tháng và có thể đổi lại bất cứ lúc nào.',
                'Choose the groups you allow. Your choice is kept for 6 months and can be changed anytime.'
              )}
            </p>

            <div className="mt-4 grid gap-3">
              <Group
                title={t('Cần thiết', 'Essential')}
                desc={t(
                  'Ghi nhớ ngôn ngữ và lựa chọn cookie, gửi form liên hệ, khung chat, thống kê gộp không cookie. Không dùng để theo dõi.',
                  'Remembers language and cookie choice, sends the contact form, runs the chat, cookieless aggregate stats. Not used for tracking.'
                )}
                detail="cs-lang · cs_consent"
                fixed={t('Luôn bật', 'Always on')}
              />
              <Group
                id="cs-consent-analytics"
                title={t('Đo lường truy cập', 'Analytics')}
                desc={t(
                  'Đếm lượt xem, nguồn truy cập và trang được đọc để cải thiện website.',
                  'Counts visits, traffic sources and pages read to improve the website.'
                )}
                detail="Google Analytics 4 (_ga) · CDP Click Star (cdp_aid)"
                checked={analytics}
                onChange={setAnalytics}
              />
              <Group
                id="cs-consent-marketing"
                title={t('Cá nhân hóa và quảng cáo', 'Personalization and advertising')}
                desc={t(
                  'Gợi ý dịch vụ theo các trang anh chị đã xem; cho phép Google hiển thị quảng cáo Click Star phù hợp.',
                  'Suggests services based on the pages you viewed; lets Google show relevant Click Star ads.'
                )}
                detail="cs_personalize_v1 · Google Signals"
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <button type="button" className={ghost} onClick={() => save(false, false, 'reject_all')}>
                {t('Từ chối tất cả', 'Reject all')}
              </button>
              <button type="button" ref={saveRef} className={ghost} onClick={() => save(analytics, marketing, 'custom')}>
                {t('Lưu lựa chọn', 'Save choices')}
              </button>
              <button type="button" className={`${primary} col-span-2`} onClick={() => save(true, true, 'accept_all')}>
                {t('Đồng ý tất cả', 'Accept all')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Group({
  id,
  title,
  desc,
  detail,
  fixed,
  checked,
  onChange,
}: {
  id?: string
  title: string
  desc: string
  detail: string
  fixed?: string
  checked?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-2xl border border-[#e0e0e0] p-4">
      <label htmlFor={id} className="text-[15px] font-semibold text-[#1d1d1f]">
        {title}
      </label>
      {fixed ? (
        <span className="self-start rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[12px] font-semibold text-[#515154]">{fixed}</span>
      ) : (
        <span className="relative inline-block h-[26px] w-[44px] self-start">
          <input
            id={id}
            type="checkbox"
            role="switch"
            checked={!!checked}
            onChange={(e) => onChange?.(e.target.checked)}
            className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
          />
          <span className="absolute inset-0 rounded-full bg-[#d2d2d7] transition-colors peer-checked:bg-[#1e6dda] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1e6dda] peer-focus-visible:ring-offset-2" />
          <span className="absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-[18px]" />
        </span>
      )}
      <p className="text-[13px] leading-relaxed text-[#515154]">{desc}</p>
      <p className="col-span-2 font-mono text-[11.5px] text-[#6e6e73]">{detail}</p>
    </div>
  )
}
