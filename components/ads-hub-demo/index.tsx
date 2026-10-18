'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutGrid, Layers, PlugZap, Settings, Sparkles, Target, type LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { AdsHubScreenshotItem } from '@/lib/cms/types'
import { AiScreen, CampaignScreen, MetaScreen, OverviewScreen, StreamsScreen } from './screens'
import { C, useReducedMotion } from './ui'

type ScreenId = 'overview' | 'streams' | 'campaign' | 'ai' | 'meta'

const SCREENS: {
  id: ScreenId
  Icon: LucideIcon
  vi: string
  en: string
  /** vị trí của mục tương ứng trong nội dung CMS (tiêu đề + mô tả bên dưới thanh tab) */
  item: number
  fallback: { vi: [string, string]; en: [string, string] }
}[] = [
  {
    id: 'overview',
    Icon: LayoutGrid,
    vi: 'Tổng quan',
    en: 'Overview',
    item: 1,
    fallback: {
      vi: ['Dashboard tổng quan hiệu suất', 'Tổng chi tiêu, CPC, CPM, top chiến dịch hiệu quả trong một trang.'],
      en: ['Performance dashboard overview', 'Total spend, CPC, CPM and top campaigns on a single page.'],
    },
  },
  {
    id: 'streams',
    Icon: Layers,
    vi: 'Tuyến nội dung',
    en: 'Content streams',
    item: 0,
    fallback: {
      vi: ['Phân tích chi phí & leads theo tuyến nội dung', 'Tự động phân loại chiến dịch theo tuyến nội dung của doanh nghiệp.'],
      en: ['Cost & leads analysis by content stream', 'Campaigns are grouped into the content streams defined for your business.'],
    },
  },
  {
    id: 'campaign',
    Icon: Target,
    vi: 'Chi tiết chiến dịch',
    en: 'Campaign detail',
    item: 2,
    fallback: {
      vi: ['Phân tích chi tiết từng chiến dịch', 'Biểu đồ chi tiêu, clicks, CTR, CPM theo ngày và phân bổ leads.'],
      en: ['Detailed per-campaign analysis', 'Daily spend, clicks, CTR and CPM charts with lead distribution.'],
    },
  },
  {
    id: 'ai',
    Icon: Sparkles,
    vi: 'AI Insight',
    en: 'AI Insight',
    item: 3,
    fallback: {
      vi: ['Chat trực tiếp với data bằng AI', 'Đặt câu hỏi bằng ngôn ngữ thường, nhận bảng và biểu đồ số liệu.'],
      en: ['Chat directly with data via AI', 'Ask in plain language and get tables and charts back.'],
    },
  },
  {
    id: 'meta',
    Icon: PlugZap,
    vi: 'Meta API Setup',
    en: 'Meta API Setup',
    item: 4,
    fallback: {
      vi: ['Click Star setup pipeline Meta API', 'Click Star phụ trách kết nối, bạn chỉ cần ủy quyền tài khoản Meta Business.'],
      en: ['Click Star sets up the full Meta API pipeline', 'Click Star handles the connection, you only authorize your Meta Business account.'],
    },
  },
]

const AUTOPLAY_MS = 12000

export function AdsHubInterfaceDemo({ items }: { items: AdsHubScreenshotItem[] }) {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const [active, setActive] = useState<ScreenId>('overview')
  const [auto, setAuto] = useState(true) // tắt hẳn khi khách tự thao tác
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)
  const [progress, setProgress] = useState(0)
  const root = useRef<HTMLDivElement | null>(null)
  const elapsed = useRef(0)

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const go = useCallback((id: ScreenId, manual: boolean) => {
    setActive(id)
    elapsed.current = 0
    setProgress(0)
    if (manual) setAuto(false)
  }, [])

  const running = auto && inView && !hover && !reduced
  useEffect(() => {
    if (!running) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsed.current += now - last
      last = now
      if (elapsed.current >= AUTOPLAY_MS) {
        elapsed.current = 0
        setActive((cur) => SCREENS[(SCREENS.findIndex((s) => s.id === cur) + 1) % SCREENS.length].id)
        setProgress(0)
      } else {
        setProgress(elapsed.current / AUTOPLAY_MS)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])

  const cur = SCREENS.find((s) => s.id === active)!
  const cms = items[cur.item]
  const title = cms ? t(cms.title.vi, cms.title.en) : t(cur.fallback.vi[0], cur.fallback.en[0])
  const caption = cms ? t(cms.caption.vi, cms.caption.en) : t(cur.fallback.vi[1], cur.fallback.en[1])

  const onKeyTabs = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = SCREENS.findIndex((s) => s.id === active)
    const n = SCREENS[(i + (e.key === 'ArrowRight' ? 1 : SCREENS.length - 1)) % SCREENS.length]
    go(n.id, true)
    root.current?.querySelector<HTMLButtonElement>(`[data-tab="${n.id}"]`)?.focus()
  }

  return (
    <div
      ref={root}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
    >
      {/* Thanh tab: 5 màn hình */}
      <div
        role="tablist"
        aria-label={t('Các màn hình của ADS hub', 'ADS hub screens')}
        onKeyDown={onKeyTabs}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
      >
        {SCREENS.map((s) => {
          const on = s.id === active
          return (
            <button
              key={s.id}
              data-tab={s.id}
              role="tab"
              type="button"
              id={`ahd-tab-${s.id}`}
              aria-selected={on}
              aria-controls="ahd-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => go(s.id, true)}
              className="relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors"
              style={on ? { background: '#1d1d1f', borderColor: '#1d1d1f', color: '#fff' } : { background: '#fff', borderColor: '#d2d2d7', color: '#1d1d1f' }}
            >
              <s.Icon className="h-4 w-4" aria-hidden="true" />
              {t(s.vi, s.en)}
              {on && auto && !reduced && (
                <span className="absolute bottom-0 left-0 h-[3px] rounded-full" style={{ width: `${progress * 100}%`, background: '#7db8ff' }} aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tiêu đề và mô tả của màn đang xem (lấy từ nội dung CMS, đổi theo ngôn ngữ) */}
      <div className="mx-auto mt-6 min-h-[104px] max-w-3xl text-center sm:min-h-[92px]" aria-live="off">
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1d1d1f] sm:text-2xl">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[#515154] sm:text-base">{caption}</p>
      </div>

      {/* Khung ứng dụng */}
      <div className="mt-4 overflow-hidden rounded-2xl border bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]" style={{ borderColor: '#d2d2d7' }}>
        <div className="flex items-center gap-3 border-b px-4 py-2.5" style={{ borderColor: C.line, background: '#f3f4f6' }}>
          <span className="flex gap-1.5" aria-hidden="true">
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span className="mx-auto truncate text-[12px] font-medium" style={{ color: C.muted }}>ADS hub · {t('Bản demo', 'Live demo')}</span>
          <span className="hidden rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline" style={{ background: C.blueBg, color: C.blueDeep }}>
            {t('Dữ liệu minh họa', 'Sample data')}
          </span>
        </div>

        <div className="flex h-[580px] sm:h-[640px]">
          <nav className="hidden w-[188px] shrink-0 flex-col justify-between py-4 md:flex" style={{ background: C.navy }} aria-label={t('Menu ADS hub', 'ADS hub menu')}>
            <div>
              <div className="mb-5 flex items-center gap-2 px-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: C.blue }} aria-hidden="true">
                  <span className="block h-3 w-3 rounded-sm border-2 border-white" />
                </span>
                <span className="text-[15px] font-semibold text-white">ADS <span style={{ color: '#4ade80' }}>hub</span></span>
              </div>
              <ul className="space-y-1 px-2.5">
                {SCREENS.map((s) => {
                  const on = s.id === active
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => go(s.id, true)}
                        aria-current={on ? 'page' : undefined}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] font-medium transition-colors"
                        style={on ? { background: C.blue, color: '#fff' } : { color: '#cbd5e1' }}
                      >
                        <s.Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{t(s.vi, s.en)}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="px-2.5">
              <div className="mb-3 flex items-center gap-2.5 px-3 py-2 text-[12.5px]" style={{ color: '#94a3b8' }}>
                <Settings className="h-4 w-4" aria-hidden="true" />
                Settings
              </div>
              <div className="flex items-center gap-2.5 border-t px-3 pt-3" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: C.violet }}>CS</span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate text-[12px] font-medium text-white">{t('Tài khoản demo', 'Demo account')}</span>
                  <span className="block text-[11px]" style={{ color: '#94a3b8' }}>Admin</span>
                </span>
              </div>
            </div>
          </nav>

          <div id="ahd-panel" role="tabpanel" aria-labelledby={`ahd-tab-${active}`} className="min-w-0 flex-1" style={{ background: '#fafbfd' }}>
            <div key={active} className="h-full animate-in fade-in duration-300">
              {active === 'overview' && <OverviewScreen />}
              {active === 'streams' && <StreamsScreen />}
              {active === 'campaign' && <CampaignScreen />}
              {active === 'ai' && <AiScreen />}
              {active === 'meta' && <MetaScreen />}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[13px] text-[#515154]">
        {t(
          'Thử ngay: đổi khoảng thời gian, bấm tiêu đề cột để sắp xếp, rê chuột vào biểu đồ, hoặc hỏi AI một câu mẫu.',
          'Try it: change the date range, click a column header to sort, hover a chart, or ask the AI a sample question.'
        )}
      </p>
    </div>
  )
}
