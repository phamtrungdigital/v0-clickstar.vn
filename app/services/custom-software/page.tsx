'use client'

/**
 * Trang dịch vụ "Phần mềm theo yêu cầu" (Custom software development).
 * Anh Trung duyệt bản demo HTML 3/10/2026: phong cách công ty kỹ thuật, KHÔNG dấu hiệu AI
 * (không emoji, không chữ gradient, không hiệu ứng phát sáng), nhấn Bảo mật + Vận hành.
 *
 * Nội dung (song ngữ) nằm ở ./_data/content.ts — sửa chữ ở đó, file này chỉ lo bố cục.
 * Mọi chuỗi hiển thị đi qua t(vi, en).
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  FileSearch,
  GitBranch,
  KeyRound,
  LayoutGrid,
  LineChart,
  Lock,
  Minus,
  Plug,
  Plus,
  RotateCcw,
  ScrollText,
  Server,
  ShieldCheck,
  Smartphone,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { useLanguage } from '@/contexts/language-context'
import { useFooterContent } from '@/contexts/web-content-context'
import type { I18n } from '@/lib/cms/types'
import {
  FACTS,
  FAQ,
  FINAL_CTA,
  HERO,
  MODELS,
  OPERATIONS,
  OWNERSHIP,
  PROCESS,
  SCOPE,
  SECURITY,
  SERVICE_LABEL,
  SIGNALS,
  STACK,
  type ControlIcon,
  type OpsIcon,
  type ScopeIcon,
} from './_data/content'

const CONTACT_HREF = `/contact?service=${encodeURIComponent(SERVICE_LABEL)}`

/** Font code của trang (nạp ở layout.tsx). Viết nguyên chuỗi để Tailwind sinh class. */
const MONO = 'font-[family-name:var(--font-jetbrains),ui-monospace,monospace]'

const SCOPE_ICON: Record<ScopeIcon, LucideIcon> = {
  ops: LayoutGrid,
  crm: Users,
  chart: LineChart,
  mobile: Smartphone,
  plug: Plug,
  ai: FileSearch,
}
const CONTROL_ICON: Record<ControlIcon, LucideIcon> = {
  lock: Lock,
  key: KeyRound,
  log: ScrollText,
  code: Code2,
  server: Server,
  shield: ShieldCheck,
}
const OPS_ICON: Record<OpsIcon, LucideIcon> = {
  monitor: Activity,
  release: GitBranch,
  backup: RotateCcw,
  docs: BookOpen,
}
const SEVERITY_STYLE = {
  P1: 'bg-red-100 text-red-700',
  P2: 'bg-amber-100 text-amber-700',
  P3: 'bg-blue-50 text-[#1E5FCB]',
} as const

export default function CustomSoftwarePage() {
  const { t } = useLanguage()
  const tt = (s: I18n) => t(s.vi, s.en)
  const footer = useFooterContent()

  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <MainNav />

      <main>
        {/* ① HERO */}
        <section className="pt-16 lg:pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
              <div className="min-w-0">
                <Kicker>{tt(HERO.kicker)}</Kicker>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.1] tracking-[-0.02em] max-w-[15ch]">
                  {tt(HERO.title)}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-[#5B6576] leading-relaxed max-w-[60ch]">
                  {tt(HERO.lede)}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={CONTACT_HREF}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#0B1220] hover:bg-[#1B2536] text-white font-semibold px-5 py-3.5 transition-colors"
                  >
                    {t('Đặt lịch trao đổi', 'Book a call')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#quy-trinh"
                    className="inline-flex items-center rounded-[10px] border border-[#D5D9E0] hover:border-[#0B1220] bg-white font-semibold px-5 py-3.5 transition-colors"
                  >
                    {t('Xem quy trình làm việc', 'See how we work')}
                  </a>
                </div>
              </div>
              <CodeWindow />
            </div>

            <dl className="mt-14 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 border-y border-[#E6E8EC]">
              {FACTS.map((f, i) => (
                <div
                  key={i}
                  className={`py-5 pr-4 ${i % 2 === 1 ? 'pl-4 border-l border-[#E6E8EC]' : ''} ${
                    i >= 2 ? 'max-lg:border-t border-[#E6E8EC]' : ''
                  } ${i === 2 ? 'lg:pl-4 lg:border-l' : ''}`}
                >
                  <dt className="text-[22px] font-bold tracking-[-0.02em]">{tt(f.value)}</dt>
                  <dd className="text-sm text-[#5B6576]">{tt(f.label)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ② KHI NÀO NÊN LÀM */}
        <Section>
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-24 items-start">
            <div>
              <Kicker>{tt(SIGNALS.kicker)}</Kicker>
              <H2>{tt(SIGNALS.title)}</H2>
              <Lede>{tt(SIGNALS.lede)}</Lede>
            </div>
            <ol className="border-t border-[#E6E8EC]">
              {SIGNALS.items.map((s, i) => (
                <li key={i} className="grid grid-cols-[52px_1fr] gap-2 py-5 border-b border-[#E6E8EC]">
                  <span className={`${MONO} text-[13px] text-[#1E5FCB] pt-1`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">{tt(s.title)}</h3>
                    <p className="mt-1.5 text-[#5B6576]">{tt(s.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* ③ PHẠM VI */}
        <Section className="bg-[#F6F7F9]">
          <Kicker>{tt(SCOPE.kicker)}</Kicker>
          <H2>{tt(SCOPE.title)}</H2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E6E8EC]">
            {SCOPE.items.map((s, i) => {
              const Icon = SCOPE_ICON[s.icon]
              return (
                <div key={i} className="bg-white p-7 border-r border-b border-[#E6E8EC]">
                  <Icon className="w-6 h-6 text-[#1E5FCB]" strokeWidth={1.6} />
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">{tt(s.title)}</h3>
                  <p className="mt-2 text-[15px] text-[#5B6576] leading-relaxed">{tt(s.body)}</p>
                </div>
              )
            })}
          </div>
        </Section>

        {/* ④ BẢO MẬT — nền tối để nhấn */}
        <Section id="bao-mat" className="bg-[#0B1220] text-slate-200">
          <Kicker dark>{tt(SECURITY.kicker)}</Kicker>
          <H2 className="text-white">{tt(SECURITY.title)}</H2>
          <Lede className="text-slate-400">{tt(SECURITY.lede)}</Lede>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden">
            {SECURITY.controls.map((c, i) => {
              const Icon = CONTROL_ICON[c.icon]
              return (
                <div key={i} className="bg-[#0B1220] p-7">
                  <div className="flex items-center gap-3 text-white">
                    <Icon className="w-[22px] h-[22px] text-[#7DB4FF]" strokeWidth={1.6} />
                    <h3 className="text-[17px] font-semibold">{tt(c.title)}</h3>
                  </div>
                  <ul className="mt-4">
                    {c.items.map((it, j) => (
                      <li key={j} className="relative py-2 pl-6 text-[14.5px] text-slate-400 border-t border-dashed border-slate-800">
                        <span className="absolute left-0.5 top-[15px] w-2 h-2 rounded-[2px] border-[1.5px] border-emerald-400" aria-hidden />
                        {tt(it)}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {SECURITY.standards.map((s, i) => (
              <span key={i} className={`${MONO} text-[12.5px] text-slate-300 border border-slate-700 rounded-md px-2.5 py-1.5`}>
                {tt(s)}
              </span>
            ))}
          </div>
        </Section>

        {/* ⑤ VẬN HÀNH */}
        <Section id="van-hanh">
          <Kicker>{tt(OPERATIONS.kicker)}</Kicker>
          <H2>{tt(OPERATIONS.title)}</H2>
          <Lede>{tt(OPERATIONS.lede)}</Lede>

          <div className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="border-t border-[#E6E8EC]">
              {OPERATIONS.items.map((o, i) => {
                const Icon = OPS_ICON[o.icon]
                return (
                  <div key={i} className="grid grid-cols-[26px_1fr] gap-4 py-5 border-b border-[#E6E8EC]">
                    <Icon className="w-[22px] h-[22px] text-[#1E5FCB] mt-0.5" strokeWidth={1.6} />
                    <div>
                      <h3 className="text-[17px] font-semibold">{tt(o.title)}</h3>
                      <p className="mt-1 text-[15px] text-[#5B6576] leading-relaxed">{tt(o.body)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-5 min-w-0">
              <TableCard title={tt(OPERATIONS.incident.title)} sub={tt(OPERATIONS.incident.sub)}>
                <table className="w-full text-[14.5px] max-md:block">
                  <thead className="max-md:hidden">
                    <tr>
                      <Th>{t('Mức độ', 'Severity')}</Th>
                      <Th>{t('Ví dụ', 'Example')}</Th>
                      <Th>{t('Phản hồi', 'Response')}</Th>
                    </tr>
                  </thead>
                  <tbody className="max-md:block">
                    {OPERATIONS.incident.rows.map((r) => (
                      <tr key={r.level} className="max-md:block max-md:py-2 border-t border-[#E6E8EC]">
                        <Td label={t('Mức độ', 'Severity')}>
                          <span className={`${MONO} inline-block text-[11.5px] font-semibold px-2 py-0.5 rounded-[5px] ${SEVERITY_STYLE[r.level]}`}>
                            {r.level}
                          </span>
                        </Td>
                        <Td label={t('Ví dụ', 'Example')}>{tt(r.example)}</Td>
                        <Td label={t('Phản hồi', 'Response')} className={`${MONO} text-[13.5px] whitespace-nowrap`}>
                          {tt(r.response)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>

              <TableCard title={tt(OPERATIONS.report.title)}>
                <ul>
                  {OPERATIONS.report.items.map((it, i) => (
                    <li key={i} className="px-5 py-3 border-t border-[#E6E8EC] text-[14.5px]">
                      {tt(it)}
                    </li>
                  ))}
                </ul>
              </TableCard>
            </div>
          </div>
        </Section>

        {/* ⑥ QUY TRÌNH */}
        <Section id="quy-trinh" className="bg-[#F6F7F9] scroll-mt-16">
          <Kicker>{tt(PROCESS.kicker)}</Kicker>
          <H2>{tt(PROCESS.title)}</H2>
          <Lede>{tt(PROCESS.lede)}</Lede>

          <ol className="relative mt-12 grid gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0 lg:before:content-[''] lg:before:absolute lg:before:top-4 lg:before:left-0 lg:before:right-0 lg:before:h-px lg:before:bg-[#D5D9E0]">
            {PROCESS.phases.map((p, i) => (
              <li key={i} className="relative grid grid-cols-[44px_1fr] sm:block lg:pr-5">
                <span className={`${MONO} relative inline-grid place-items-center w-8 h-8 rounded-lg bg-[#0B1220] text-white text-[12.5px]`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="sm:mt-4">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">{tt(p.title)}</h3>
                  <p className="mt-1.5 text-sm text-[#5B6576] leading-relaxed">{tt(p.body)}</p>
                  <span className={`${MONO} block mt-2.5 text-xs text-emerald-700`}>{tt(p.gate)}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl border border-[#E6E8EC] bg-white overflow-hidden">
            <table className="w-full text-[14.5px] max-md:block">
              <thead className="max-md:hidden">
                <tr>
                  <Th>{tt(PROCESS.table.head.phase)}</Th>
                  <Th>{tt(PROCESS.table.head.receive)}</Th>
                  <Th>{tt(PROCESS.table.head.prepare)}</Th>
                  <Th>{tt(PROCESS.table.head.duration)}</Th>
                </tr>
              </thead>
              <tbody className="max-md:block">
                {PROCESS.table.rows.map((r, i) => (
                  <tr key={i} className="max-md:block max-md:py-2 border-t border-[#E6E8EC] first:border-t-0 md:first:border-t">
                    <Td className="font-semibold md:whitespace-nowrap">{tt(r.phase)}</Td>
                    <Td label={tt(PROCESS.table.head.receive)}>{tt(r.receive)}</Td>
                    <Td label={tt(PROCESS.table.head.prepare)}>{tt(r.prepare)}</Td>
                    <Td label={tt(PROCESS.table.head.duration)} className={`${MONO} text-[13.5px] md:whitespace-nowrap`}>
                      {tt(r.duration)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ⑦ QUYỀN SỞ HỮU + HÌNH THỨC HỢP TÁC */}
        <Section>
          <Kicker>{tt(OWNERSHIP.kicker)}</Kicker>
          <H2>{tt(OWNERSHIP.title)}</H2>
          <div className="mt-10 grid md:grid-cols-2 md:gap-x-12 border-t border-[#E6E8EC]">
            {OWNERSHIP.items.map((o, i) => (
              <div key={i} className="grid grid-cols-[22px_1fr] gap-3.5 py-[18px] border-b border-[#E6E8EC]">
                <Check className="w-5 h-5 text-emerald-700 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="font-semibold">{tt(o.title)}</p>
                  <p className="text-[14.5px] text-[#5B6576]">{tt(o.body)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <Kicker>{tt(MODELS.kicker)}</Kicker>
            <H2>{tt(MODELS.title)}</H2>
            {/* Máy tính: bảng so sánh 3 cột. Điện thoại: mỗi hình thức là 1 khối. */}
            <div className="mt-9 rounded-2xl border border-[#E6E8EC] overflow-hidden">
              <table className="w-full text-[14.5px] max-md:hidden">
                <thead>
                  <tr>
                    <th className="w-[14%]" />
                    {MODELS.columns.map((c, i) => (
                      <th key={i} className={`text-left align-top px-5 pt-5 pb-4 ${c.recommended ? 'bg-[#F3F7FF]' : ''}`}>
                        <span className="block text-[15px] font-bold">{tt(c.name)}</span>
                        <span className="block mt-1 text-[13px] font-normal text-[#5B6576]">{tt(c.fit)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.rows.map((row) => (
                    <tr key={row.key} className="border-t border-[#E6E8EC]">
                      <td className="px-5 py-3.5 align-top font-semibold text-[#1F2937]">{tt(row.label)}</td>
                      {MODELS.columns.map((c, i) => (
                        <td key={i} className={`px-5 py-3.5 align-top ${c.recommended ? 'bg-[#F3F7FF]' : ''}`}>
                          {tt(c[row.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="md:hidden divide-y divide-[#E6E8EC]">
                {MODELS.columns.map((c, i) => (
                  <div key={i} className={`p-5 ${c.recommended ? 'bg-[#F3F7FF]' : ''}`}>
                    <p className="font-bold">{tt(c.name)}</p>
                    <p className="text-[13px] text-[#5B6576]">{tt(c.fit)}</p>
                    <dl className="mt-3 space-y-2.5 text-[14.5px]">
                      {MODELS.rows.map((row) => (
                        <div key={row.key}>
                          <dt className={`${MONO} text-[11px] uppercase tracking-[0.04em] text-[#5B6576]`}>{tt(row.label)}</dt>
                          <dd>{tt(c[row.key])}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ⑧ CÔNG NGHỆ */}
        <Section className="bg-[#F6F7F9] border-t border-[#E6E8EC]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-24 items-start">
            <div>
              <Kicker>{tt(STACK.kicker)}</Kicker>
              <H2>{tt(STACK.title)}</H2>
              <Lede>{tt(STACK.lede)}</Lede>
            </div>
            <div className="rounded-2xl border border-[#E6E8EC] bg-white overflow-hidden">
              <table className="w-full text-[14.5px]">
                <tbody>
                  {STACK.rows.map((r, i) => (
                    <tr key={i} className="border-t border-[#E6E8EC] first:border-t-0">
                      <td className="px-5 py-3.5 w-[34%] font-semibold align-top">{tt(r.layer)}</td>
                      <td className={`${MONO} px-5 py-3.5 text-[13.5px] text-[#1F2937]`}>{r.tech}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* ⑨ FAQ */}
        <Section>
          <Kicker>{tt(FAQ.kicker)}</Kicker>
          <H2>{tt(FAQ.title)}</H2>
          <FaqList />
        </Section>

        {/* ⑩ CTA */}
        <section className="pb-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center rounded-[20px] border border-[#E6E8EC] bg-gradient-to-b from-white to-[#F6F7F9] p-7 sm:p-12">
              <div>
                <h2 className="text-[26px] sm:text-[34px] font-bold leading-tight tracking-[-0.02em]">{tt(FINAL_CTA.title)}</h2>
                <p className="mt-3 text-[#5B6576] max-w-[60ch]">{tt(FINAL_CTA.body)}</p>
                {(footer.contact_phone || footer.contact_email) && (
                  <p className={`${MONO} mt-5 text-[13.5px] text-[#5B6576]`}>
                    {[footer.contact_phone && `hotline ${footer.contact_phone}`, footer.contact_email].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href={CONTACT_HREF}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#0B1220] hover:bg-[#1B2536] text-white font-semibold px-5 py-3.5 transition-colors"
                >
                  {t('Đặt lịch trao đổi', 'Book a call')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={CONTACT_HREF}
                  className="inline-flex items-center rounded-[10px] border border-[#D5D9E0] hover:border-[#0B1220] bg-white font-semibold px-5 py-3.5 transition-colors"
                >
                  {t('Gửi yêu cầu', 'Send a brief')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* ───────────────────────── Khối dùng chung ───────────────────────── */

function Section({ id, className = '', children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-16 sm:py-24 lg:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`${MONO} mb-4 inline-flex items-center gap-2.5 text-[12.5px] uppercase tracking-[0.04em] ${
        dark ? 'text-[#7DB4FF]' : 'text-[#1E5FCB]'
      }`}
    >
      <span className="w-[18px] h-[1.5px] bg-current" aria-hidden />
      {children}
    </p>
  )
}

function H2({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-[28px] sm:text-[34px] lg:text-[42px] font-bold leading-[1.18] tracking-[-0.02em] max-w-[22ch] ${className}`}>
      {children}
    </h2>
  )
}

function Lede({ children, className = 'text-[#5B6576]' }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-4 text-base sm:text-lg leading-relaxed max-w-[60ch] ${className}`}>{children}</p>
}

function TableCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E6E8EC] bg-white overflow-hidden">
      <div className="px-5 pt-[18px] pb-2.5">
        <p className="font-bold">{title}</p>
        {sub && <p className="mt-0.5 text-[13.5px] text-[#5B6576]">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className={`${MONO} text-left text-xs font-medium uppercase tracking-[0.04em] text-[#5B6576] bg-[#F6F7F9] px-5 py-3 border-t border-[#E6E8EC]`}>
      {children}
    </th>
  )
}

/** Ô bảng; trên điện thoại bảng xếp dọc và `label` hiện thành nhãn nhỏ phía trên giá trị. */
function Td({ children, label, className = '' }: { children: React.ReactNode; label?: string; className?: string }) {
  return (
    <td
      data-l={label}
      className={`px-5 py-3.5 align-top max-md:block max-md:py-1 max-md:before:block max-md:before:content-[attr(data-l)] max-md:before:text-[11px] max-md:before:uppercase max-md:before:tracking-[0.04em] max-md:before:text-[#5B6576] max-md:before:font-normal ${className}`}
    >
      {children}
    </td>
  )
}

/* ───────────────────────── Khung code ở hero ───────────────────────── */

function CodeWindow() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'sql' | 'ts'>('sql')
  const k = 'text-blue-300'
  const s = 'text-green-300'
  const c = 'text-slate-500'
  const f = 'text-amber-200'
  const ty = 'text-pink-300'

  return (
    <figure
      className="min-w-0 rounded-[14px] bg-[#0B1220] text-slate-300 overflow-hidden shadow-[0_24px_48px_-16px_rgba(11,18,32,0.35)]"
      aria-label={t('Minh hoạ mã nguồn', 'Code sample')}
    >
      <div className="flex items-center gap-0.5 px-2 bg-[#0F172A] border-b border-slate-800 overflow-x-auto" role="tablist">
        <span className="flex gap-1.5 pl-1.5 pr-2.5" aria-hidden>
          <i className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <i className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <i className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        </span>
        {(['sql', 'ts'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`${MONO} whitespace-nowrap px-3.5 py-3 text-[12.5px] border-b-2 transition-colors ${
              tab === id ? 'text-slate-200 border-[#3687FC]' : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            {id === 'sql' ? 'policies.sql' : 'approve-order.ts'}
          </button>
        ))}
      </div>

      <pre className={`${MONO} m-0 px-4 sm:px-5 pt-5 pb-6 text-xs sm:text-[13px] leading-[1.75] overflow-x-auto`}>
        {tab === 'sql' ? (
          <code>
            <span className={c}>-- {t('Mỗi chi nhánh chỉ đọc được dữ liệu của chính mình', 'Each branch can only read its own data')}</span>
            {'\n'}
            <span className={k}>alter table</span> orders <span className={k}>enable row level security</span>;{'\n\n'}
            <span className={k}>create policy</span> <span className={s}>&quot;branch_isolation&quot;</span> <span className={k}>on</span> orders
            {'\n  '}
            <span className={k}>for select using</span> ({'\n    '}branch_id <span className={k}>=</span>{' '}
            <span className={f}>current_branch_id</span>(){'\n  '});{'\n\n'}
            <span className={c}>
              -- {t('Nhật ký chỉ được ghi thêm, không ai sửa hay xoá được', 'Audit log is append-only: no one can edit or delete')}
            </span>
            {'\n'}
            <span className={k}>revoke update, delete on</span> audit_log <span className={k}>from</span> <span className={k}>public</span>;
          </code>
        ) : (
          <code>
            <span className={k}>export async function</span> <span className={f}>approveOrder</span>(id: <span className={ty}>string</span>) {'{'}
            {'\n  '}
            <span className={c}>// {t('Kiểm tra quyền ở máy chủ, không tin giao diện', 'Authorise on the server, never trust the client')}</span>
            {'\n  '}
            <span className={k}>const</span> user <span className={k}>=</span> <span className={k}>await</span>{' '}
            <span className={f}>requireRole</span>(<span className={s}>&apos;manager&apos;</span>){'\n\n  '}
            <span className={k}>const</span> order <span className={k}>=</span> <span className={k}>await</span> db.order.
            <span className={f}>update</span>({'{'}
            {'\n    '}where: {'{'} id, branchId: user.branchId {'}'},{'\n    '}data: {'{'} status:{' '}
            <span className={s}>&apos;approved&apos;</span>, approvedBy: user.id {'}'},{'\n  '}
            {'})'}
            {'\n\n  '}
            <span className={k}>await</span> audit.<span className={f}>log</span>({'{'} actor: user.id, action:{' '}
            <span className={s}>&apos;order.approve&apos;</span>, target: id {'}'}){'\n  '}
            <span className={k}>return</span> order{'\n'}
            {'}'}
          </code>
        )}
      </pre>

      <figcaption className={`${MONO} flex justify-between gap-3 px-4 py-2.5 border-t border-slate-800 text-xs text-slate-500`}>
        <span>TypeScript · PostgreSQL</span>
        <span>
          <span className="text-green-400">●</span> {t('kiểm thử đạt', 'checks passed')}
        </span>
      </figcaption>
    </figure>
  )
}

/* ───────────────────────── FAQ ───────────────────────── */

function FaqList() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mt-10 max-w-[860px] border-t border-[#E6E8EC]">
      {FAQ.items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="border-b border-[#E6E8EC]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 py-5 text-left text-[17px] font-semibold"
            >
              <span>{t(item.q.vi, item.q.en)}</span>
              {isOpen ? (
                <Minus className="w-5 h-5 mt-0.5 shrink-0 text-[#5B6576]" strokeWidth={1.6} />
              ) : (
                <Plus className="w-5 h-5 mt-0.5 shrink-0 text-[#5B6576]" strokeWidth={1.6} />
              )}
            </button>
            {/* Luôn render câu trả lời (ẩn bằng CSS) để Google và bot AI đọc được cả câu đang đóng */}
            <p className={`pb-5 pr-0 sm:pr-10 text-[#5B6576] leading-relaxed ${isOpen ? '' : 'hidden'}`}>{t(item.a.vi, item.a.en)}</p>
          </div>
        )
      })}
    </div>
  )
}
