'use client'

// Popup "Hồ sơ năng lực Click Star" hiện khi khách vào TRANG CHỦ.
// - Hiện 1 lần/phiên (sessionStorage), khi khách ĐÃ CUỘN QUA 50% chiều dài trang (anh Trung chốt
//   18/10/2026, thay cho bản hiện sau 1,5 giây). Thêm ?popup=1 để bỏ qua "đã xem" khi test, vẫn
//   phải cuộn tới 50%.
// - Song ngữ theo ngôn ngữ site (useLanguage). Số liệu + 8 nhóm năng lực lấy từ hồ sơ
//   năng lực chính thức của Click Star (không phải số minh hoạ).
// - Dùng Radix Dialog cho focus-trap/Esc/bấm nền để đóng. Không chứa tên khách hàng
//   hay dữ liệu nội bộ.
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { stripLocale } from '@/lib/i18n/locale'
import Link from '@/components/app-link'
import * as Dialog from '@radix-ui/react-dialog'
import {
  X,
  Megaphone,
  Search,
  MonitorSmartphone,
  LayoutDashboard,
  Users,
  Workflow,
  Sparkles,
  Code2,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const SEEN_KEY = 'cs_capability_popup_seen_v1'
/** Tỉ lệ cuộn (0 đến 1) của trang thì popup hiện */
const SCROLL_TRIGGER = 0.5

type Cap = { icon: React.ComponentType<{ className?: string }>; vi: string; en: string; descVi: string; descEn: string }

const CAPABILITIES: Cap[] = [
  { icon: Megaphone, vi: 'Performance Ads', en: 'Performance Ads', descVi: 'Google · Meta · TikTok', descEn: 'Google · Meta · TikTok' },
  { icon: Search, vi: 'SEO & Nội dung', en: 'SEO & Content', descVi: 'Lên top bền vững', descEn: 'Sustainable rankings' },
  { icon: MonitorSmartphone, vi: 'Website & Landing', en: 'Website & Landing', descVi: 'Chuẩn thương hiệu, tốc độ cao', descEn: 'On-brand, fast' },
  { icon: LayoutDashboard, vi: 'Dashboard dữ liệu', en: 'Data dashboard', descVi: 'Số liệu thời gian thực', descEn: 'Real-time metrics' },
  { icon: Users, vi: 'CRM & CDP', en: 'CRM & CDP', descVi: 'Gom dữ liệu khách về một mối', descEn: 'One customer dataset' },
  { icon: Workflow, vi: 'Marketing Automation', en: 'Marketing Automation', descVi: 'Chăm sóc & nuôi dưỡng tự động', descEn: 'Automated nurturing' },
  { icon: Sparkles, vi: 'Tích hợp AI', en: 'AI integration', descVi: 'Đúng việc, có người kiểm duyệt', descEn: 'Right job, human in the loop' },
  { icon: Code2, vi: 'Phần mềm theo yêu cầu', en: 'Custom software', descVi: 'Giải pháp riêng cho vận hành', descEn: 'Built for your operations' },
]

const STATS: { value: string; vi: string; en: string }[] = [
  { value: '100+', vi: 'doanh nghiệp đã đồng hành', en: 'businesses served' },
  { value: '90%+', vi: 'khách hàng hài lòng', en: 'client satisfaction' },
  { value: '5+', vi: 'năm kinh nghiệm đội ngũ', en: 'years of team experience' },
]

export function CapabilityPopup() {
  const pathname = usePathname()
  const { language, t } = useLanguage()
  const [open, setOpen] = useState(false)
  // Chỉ dựng Dialog sau khi mount ở client: tránh Radix gắn aria-hidden lên trang
  // ngay lúc hydrate (gây cảnh báo hydration mismatch trên trang chủ tĩnh).
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Trang chủ ở cả hai ngôn ngữ ('/' và '/en')
  const isHome = stripLocale(pathname || '') === '/'

  useEffect(() => {
    if (!isHome || !mounted) return
    let force = false
    try {
      force = new URLSearchParams(window.location.search).get('popup') === '1'
    } catch {}
    if (!force) {
      try {
        if (sessionStorage.getItem(SEEN_KEY) === '1') return
      } catch {}
    }
    let done = false
    let raf = 0
    const progress = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      return max <= 0 ? 0 : window.scrollY / max
    }
    const check = () => {
      raf = 0
      if (done || progress() < SCROLL_TRIGGER) return
      done = true
      window.removeEventListener('scroll', onScroll)
      setOpen(true)
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {}
    }
    // gộp các lượt cuộn vào một khung hình để không tính toán dày
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(check)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    check() // trang mở sẵn ở vị trí đã cuộn (nút Back, tải lại)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [isHome, mounted])

  if (!isHome || !mounted) return null

  const pick = (vi: string, en: string) => (language === 'vi' ? vi : en)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[#272729]/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[70] flex w-[calc(100vw-24px)] max-w-[880px] max-h-[90dvh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 md:flex-row"
        >
          <Dialog.Close
            className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#515154] shadow-md backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={t('Đóng', 'Close')}
          >
            <X className="h-5 w-5" />
          </Dialog.Close>

          {/* Cột trái: panel xanh thương hiệu */}
          <div className="relative shrink-0 overflow-hidden bg-[#1e6dda] px-6 py-7 text-white md:w-[44%] md:px-8 md:py-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-6 h-56 w-56 rounded-full border-[28px] border-white/10"
            />
            <div className="relative">
              <div className="text-lg font-extrabold tracking-tight">
                click<span className="text-white/70">star.</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1859b8] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                {t('Hồ sơ năng lực', 'Capability profile')}
              </span>
              <Dialog.Title className="mt-4 text-2xl font-extrabold leading-[1.15] tracking-tight md:text-[28px]">
                {t('Đối tác tăng trưởng số cho doanh nghiệp Việt.', 'A digital growth partner for Vietnamese businesses.')}
              </Dialog.Title>
              <p className="mt-3 text-sm leading-relaxed text-white">
                {t(
                  'Marketing, dữ liệu, công nghệ và AI trong cùng một hệ thống.',
                  'Marketing, data, technology and AI in one system.',
                )}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
                {STATS.map((s) => (
                  <div key={s.value}>
                    <div className="text-xl font-extrabold leading-none md:text-2xl">{s.value}</div>
                    <div className="mt-1.5 text-[11px] leading-snug text-white">{pick(s.vi, s.en)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: năng lực + CTA */}
          <div className="relative flex min-h-0 flex-1 flex-col bg-white px-6 py-7 md:px-8 md:py-9">
            <div className="pr-10">
              <h3 className="text-base font-bold text-slate-900">{t('Năng lực cốt lõi', 'Core capabilities')}</h3>
              <p className="mt-1 text-[13px] text-[#515154]">
                {t('Tám nhóm năng lực, triển khai riêng lẻ hoặc trọn gói.', 'Eight capabilities, delivered alone or together.')}
              </p>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {CAPABILITIES.map((c) => {
                  const Icon = c.icon
                  return (
                    <li
                      key={c.vi}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 transition-colors hover:border-primary/40 hover:bg-[#eaf2fd]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf2fd] text-[#1859b8]">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold leading-tight text-slate-900">{pick(c.vi, c.en)}</span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-[#515154]">{pick(c.descVi, c.descEn)}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/ho-so-nang-luc-clickstar.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <FileText className="h-4 w-4" />
                {t('Xem hồ sơ năng lực', 'View the profile')}
              </Link>
              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {t('Khám phá dịch vụ', 'Explore services')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
