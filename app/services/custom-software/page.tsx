'use client'

/**
 * Trang dịch vụ "Phần mềm theo yêu cầu" (Custom software development).
 * Bản dựng lại 18/10/2026 theo concept Apple của cả site, giữ giọng "công ty kỹ thuật" đã duyệt 3/10:
 * KHÔNG emoji, KHÔNG chữ gradient, KHÔNG hiệu ứng phát sáng; nhãn kỹ thuật dùng chữ đơn cách.
 * Thêm phần bằng chứng: mã nguồn thật, kiến trúc, đường đi của AI, đội ngũ (dữ liệu ở ./_data/proof.ts).
 *
 * Nội dung (song ngữ) nằm ở ./_data/content.ts và ./_data/proof.ts — sửa chữ ở đó, file này chỉ lo
 * bố cục. Mọi chuỗi hiển thị đi qua t(vi, en).
 */

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from '@/components/app-link'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  FileSearch,
  Gauge,
  GitBranch,
  KeyRound,
  LayoutGrid,
  LineChart,
  ListChecks,
  Lock,
  Maximize2,
  Minus,
  Plug,
  Plus,
  RotateCcw,
  ScrollText,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Eyebrow } from '@/components/ui/eyebrow'
import { ServiceReadMore } from '@/components/seo/service-answer'
import { Footer } from '@/components/layout/footer'
import { useLanguage } from '@/contexts/language-context'
import { useFooterContent } from '@/contexts/web-content-context'
import type { I18n } from '@/lib/cms/types'
import {
  AiPipelineDiagram,
  ArchitectureDiagram,
  ReleasePipelineDiagram,
  RequestFlowDiagram,
} from '@/components/illustrations/custom-software-illustrations'
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
  WORK,
  type ControlIcon,
  type OpsIcon,
  type ScopeIcon,
  type WorkItem,
} from './_data/content'
import { AI, ARCH, EVIDENCE, EXCERPTS, FLOW, STATS, STATS_NOTE, TEAM, type Excerpt, type Lang } from './_data/proof'

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
const AI_ICON: LucideIcon[] = [Cpu, Search, ListChecks, Lock, Gauge]
const SEVERITY_STYLE = {
  P1: 'bg-[#1e6dda] text-white',
  P2: 'bg-[#eaf2fd] text-[#1859b8]',
  P3: 'bg-[#f5f5f7] text-[#1d1d1f]',
} as const

const BTN_PRIMARY = 'inline-flex items-center gap-2 rounded-full bg-[#1e6dda] px-6 py-3 text-[15px] font-semibold text-white transition-transform active:scale-95'
const BTN_GHOST = 'inline-flex items-center rounded-full border border-[#1e6dda] bg-white px-6 py-3 text-[15px] font-semibold text-[#1859b8] transition-transform active:scale-95'

export default function CustomSoftwarePage() {
  const { t } = useLanguage()
  const tt = (s: I18n) => t(s.vi, s.en)
  const footer = useFooterContent()

  return (
    <div className="theme-apple min-h-screen bg-white text-[#1d1d1f]">
      <MainNav />

      <main className="[counter-reset:eyebrow]">
        {/* ① HERO */}
        <section className="pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.02fr] gap-10 lg:gap-14 items-center">
              <div className="min-w-0">
                <Kicker numbered={false}>{tt(HERO.kicker)}</Kicker>
                <h1 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-semibold leading-[1.2] tracking-[-0.03em] text-[#1d1d1f] text-balance">
                  {tt(HERO.title)}
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-[#515154] leading-relaxed max-w-[34ch]">{tt(HERO.lede)}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={CONTACT_HREF} className={BTN_PRIMARY}>
                    {t('Đặt lịch trao đổi', 'Book a call')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="#ma-nguon" className={BTN_GHOST}>
                    {t('Xem mã nguồn thật', 'See real code')}
                  </a>
                </div>
              </div>
              <HeroCode />
            </div>

            <dl className="mt-14 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 border-y border-[#d2d2d7]">
              {FACTS.map((f, i) => (
                <div
                  key={i}
                  className={`py-6 pr-4 ${i % 2 === 1 ? 'pl-4 border-l border-[#d2d2d7]' : ''} ${
                    i >= 2 ? 'max-lg:border-t border-[#d2d2d7]' : ''
                  } ${i === 2 ? 'lg:pl-4 lg:border-l' : ''}`}
                >
                  <dt className="text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{tt(f.value)}</dt>
                  <dd className="mt-0.5 text-sm text-[#515154]">{tt(f.label)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ② MÃ NGUỒN THẬT — khối tối */}
        <Section id="ma-nguon" tone="dark" className="scroll-mt-16">
          <Kicker dark>{tt(EVIDENCE.kicker)}</Kicker>
          <H2 dark>{tt(EVIDENCE.title)}</H2>
          <Lede dark>{tt(EVIDENCE.lede)}</Lede>
          <EvidenceTabs />

          <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/15 border border-white/15 rounded-[14px] overflow-hidden">
            {STATS.map((s) => (
              <div key={s.value + s.label.vi} className="bg-[#1d1d1f] p-5 sm:p-6">
                <dt className="text-[34px] font-semibold tracking-[-0.02em] text-white tabular-nums">{s.value}</dt>
                <dd className="mt-1 text-sm leading-normal text-[#d2d2d7]">{tt(s.label)}</dd>
              </div>
            ))}
          </dl>
          <p className={`${MONO} mt-3 text-[12px] text-[#a1a1a6]`}>{tt(STATS_NOTE)}</p>

          <div className="mt-16">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-white">{tt(FLOW.title)}</h3>
            <p className="mt-3 max-w-[64ch] text-base sm:text-lg text-[#d2d2d7] leading-relaxed">{tt(FLOW.lede)}</p>
            <Sheet minWidth={860} hint={t('Vuốt ngang để xem đủ sơ đồ', 'Swipe sideways to see the full diagram')}>
              <RequestFlowDiagram t={t} />
            </Sheet>
          </div>
        </Section>

        {/* ③ KIẾN TRÚC */}
        <Section id="kien-truc" className="scroll-mt-16">
          <Kicker>{tt(ARCH.kicker)}</Kicker>
          <H2>{tt(ARCH.title)}</H2>
          <Lede>{tt(ARCH.lede)}</Lede>
          <Sheet minWidth={860} hint={t('Vuốt ngang để xem đủ sơ đồ', 'Swipe sideways to see the full diagram')}>
            <ArchitectureDiagram t={t} />
          </Sheet>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {ARCH.principles.map((p, i) => (
              <div key={i} className="rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                <span className={`${MONO} text-[13px] text-[#1859b8]`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em]">{tt(p.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{tt(p.body)}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16 items-start">
            <div>
              <Kicker>{tt(STACK.kicker)}</Kicker>
              <h3 className="text-2xl sm:text-3xl font-semibold leading-[1.22] tracking-[-0.02em]">{tt(STACK.title)}</h3>
              <p className="mt-3 text-base text-[#515154] leading-relaxed max-w-[48ch]">{tt(STACK.lede)}</p>
            </div>
            <div className="rounded-[18px] border border-[#d2d2d7] bg-white overflow-hidden">
              <table className="w-full text-[14.5px]">
                <tbody>
                  {STACK.rows.map((r, i) => (
                    <tr key={i} className="border-t border-[#e0e0e0] first:border-t-0">
                      <td className="px-5 py-3.5 w-[36%] font-semibold align-top">{tt(r.layer)}</td>
                      <td className={`${MONO} px-5 py-3.5 text-[13.5px] text-[#1d1d1f]`}>{r.tech}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* ④ KHI NÀO NÊN LÀM */}
        <Section tone="soft">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-24 items-start">
            <div>
              <Kicker>{tt(SIGNALS.kicker)}</Kicker>
              <H2>{tt(SIGNALS.title)}</H2>
              <Lede>{tt(SIGNALS.lede)}</Lede>
            </div>
            <ol className="border-t border-[#d2d2d7]">
              {SIGNALS.items.map((s, i) => (
                <li key={i} className="grid grid-cols-[52px_1fr] gap-2 py-5 border-b border-[#d2d2d7]">
                  <span className={`${MONO} text-[13px] text-[#1859b8] pt-1`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">{tt(s.title)}</h3>
                    <p className="mt-1.5 text-[#515154]">{tt(s.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* ⑤ PHẠM VI */}
        <Section>
          <Kicker>{tt(SCOPE.kicker)}</Kicker>
          <H2>{tt(SCOPE.title)}</H2>
          <div className="mt-12 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCOPE.items.map((s, i) => {
              const Icon = SCOPE_ICON[s.icon]
              return (
                <div key={i} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.7} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">{tt(s.title)}</h3>
                  <p className="mt-2 text-[15px] text-[#515154] leading-relaxed">{tt(s.body)}</p>
                </div>
              )
            })}
          </div>
        </Section>

        {/* ⑥ AI — khối tối */}
        <Section id="ai" tone="dark" className="scroll-mt-16">
          <Kicker dark>{tt(AI.kicker)}</Kicker>
          <H2 dark>{tt(AI.title)}</H2>
          <Lede dark>{tt(AI.lede)}</Lede>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {AI.providers.map((p) => (
              <span key={p} className={`${MONO} rounded-md border border-white/30 px-3 py-1.5 text-[12.5px] text-white`}>
                {p}
              </span>
            ))}
          </div>

          <Sheet minWidth={860} hint={t('Vuốt ngang để xem đủ sơ đồ', 'Swipe sideways to see the full diagram')}>
            <AiPipelineDiagram t={t} />
          </Sheet>

          <div className="mt-8 grid auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI.items.map((it, i) => {
              const Icon = AI_ICON[i]
              return (
                <div key={i} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug text-white">{tt(it.title)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#d2d2d7]">{tt(it.body)}</p>
                </div>
              )
            })}
            <div className="flex h-full flex-col rounded-[18px] border border-[#1e6dda] bg-[#1d1d1f] p-6">
              <p className={`${MONO} text-[12.5px] uppercase tracking-[0.04em] text-[#7db8ff]`}>{tt(AI.live.title)}</p>
              <ul className="mt-4 space-y-3.5">
                {AI.live.items.map((it, i) => (
                  <li key={i} className="grid grid-cols-[20px_1fr] gap-2.5 text-[15px] leading-normal text-white">
                    <Check className="w-[18px] h-[18px] mt-0.5 text-[#7db8ff]" strokeWidth={2} />
                    {tt(it)}
                  </li>
                ))}
              </ul>
              <Link href="/services/speech-insight-ai" className="mt-auto pt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#7db8ff]">
                {tt(AI.live.link)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Section>

        {/* ⑦ DỰ ÁN ĐÃ LÀM — ẩn tên khách, ảnh dựng lại từ dữ liệu mẫu */}
        <Section id="du-an" tone="soft" className="scroll-mt-16">
          <Kicker>{tt(WORK.kicker)}</Kicker>
          <H2>{tt(WORK.title)}</H2>
          <Lede>{tt(WORK.lede)}</Lede>
          <WorkShowcase />
        </Section>

        {/* ⑧ ĐỘI NGŨ */}
        <Section id="doi-ngu" className="scroll-mt-16">
          <Kicker>{tt(TEAM.kicker)}</Kicker>
          <H2>{tt(TEAM.title)}</H2>
          <Lede>{tt(TEAM.lede)}</Lede>

          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 border-y border-[#d2d2d7]">
            {TEAM.stats.map((s, i) => (
              <div key={s.value} className={`py-6 sm:px-6 ${i === 0 ? 'sm:pl-0' : 'sm:border-l border-[#d2d2d7]'} ${i > 0 ? 'max-sm:border-t border-[#d2d2d7]' : ''}`}>
                <dt className="text-[40px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#1d1d1f]">{s.value}</dt>
                <dd className="mt-2 text-[15px] leading-normal text-[#515154] max-w-[32ch]">{tt(s.label)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.roles.map((r, i) => (
              <div key={i} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                <span className={`${MONO} text-[13px] text-[#1859b8]`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em]">{tt(r.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{tt(r.body)}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h3 className="text-2xl sm:text-3xl font-semibold leading-[1.22] tracking-[-0.02em]">{tt(TEAM.practices.title)}</h3>
            <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 md:gap-x-12 border-t border-[#d2d2d7]">
              {TEAM.practices.items.map((it, i) => (
                <li key={i} className="grid grid-cols-[24px_1fr] gap-3 py-4 border-b border-[#d2d2d7] text-[15px] leading-normal">
                  <Check className="w-5 h-5 mt-0.5 text-[#1859b8]" strokeWidth={2} />
                  {tt(it)}
                </li>
              ))}
            </ul>
            <Sheet minWidth={860} hint={t('Vuốt ngang để xem đủ sơ đồ', 'Swipe sideways to see the full diagram')}>
              <ReleasePipelineDiagram t={t} />
            </Sheet>
          </div>
        </Section>

        {/* ⑨ BẢO MẬT — khối tối */}
        <Section id="bao-mat" tone="dark" className="scroll-mt-16">
          <Kicker dark>{tt(SECURITY.kicker)}</Kicker>
          <H2 dark>{tt(SECURITY.title)}</H2>
          <Lede dark>{tt(SECURITY.lede)}</Lede>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/15 border border-white/15 rounded-[18px] overflow-hidden">
            {SECURITY.controls.map((c, i) => {
              const Icon = CONTROL_ICON[c.icon]
              return (
                <div key={i} className="bg-[#1d1d1f] p-7">
                  <div className="flex items-center gap-3 text-white">
                    <Icon className="w-[22px] h-[22px] text-[#7db8ff]" strokeWidth={1.7} />
                    <h3 className="text-[17px] font-semibold">{tt(c.title)}</h3>
                  </div>
                  <ul className="mt-4">
                    {c.items.map((it, j) => (
                      <li key={j} className="relative py-2.5 pl-6 text-[15px] leading-normal text-[#d2d2d7] border-t border-dashed border-white/20">
                        <span className="absolute left-0.5 top-[17px] w-2 h-2 rounded-[2px] border-[1.5px] border-[#7db8ff]" aria-hidden />
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
              <span key={i} className={`${MONO} text-[12.5px] text-white border border-white/30 rounded-md px-2.5 py-1.5`}>
                {tt(s)}
              </span>
            ))}
          </div>
        </Section>

        {/* ⑩ VẬN HÀNH */}
        <Section id="van-hanh">
          <Kicker>{tt(OPERATIONS.kicker)}</Kicker>
          <H2>{tt(OPERATIONS.title)}</H2>
          <Lede>{tt(OPERATIONS.lede)}</Lede>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="border-t border-[#d2d2d7]">
              {OPERATIONS.items.map((o, i) => {
                const Icon = OPS_ICON[o.icon]
                return (
                  <div key={i} className="grid grid-cols-[26px_1fr] gap-4 py-5 border-b border-[#d2d2d7]">
                    <Icon className="w-[22px] h-[22px] text-[#1859b8] mt-0.5" strokeWidth={1.7} />
                    <div>
                      <h3 className="text-[17px] font-semibold">{tt(o.title)}</h3>
                      <p className="mt-1 text-[15px] text-[#515154] leading-relaxed">{tt(o.body)}</p>
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
                      <tr key={r.level} className="max-md:block max-md:py-2 border-t border-[#e0e0e0]">
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
                    <li key={i} className="px-5 py-3 border-t border-[#e0e0e0] text-[14.5px]">
                      {tt(it)}
                    </li>
                  ))}
                </ul>
              </TableCard>
            </div>
          </div>
        </Section>

        {/* ⑪ QUY TRÌNH */}
        <Section id="quy-trinh" tone="soft" className="scroll-mt-16">
          <Kicker>{tt(PROCESS.kicker)}</Kicker>
          <H2>{tt(PROCESS.title)}</H2>
          <Lede>{tt(PROCESS.lede)}</Lede>

          <ol className="relative mt-12 grid gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0 lg:before:content-[''] lg:before:absolute lg:before:top-4 lg:before:left-0 lg:before:right-0 lg:before:h-px lg:before:bg-[#86868b]">
            {PROCESS.phases.map((p, i) => (
              <li key={i} className="relative grid grid-cols-[44px_1fr] sm:block lg:pr-5">
                <span className={`${MONO} relative inline-grid place-items-center w-8 h-8 rounded-lg bg-[#1d1d1f] text-white text-[12.5px]`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="sm:mt-4">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">{tt(p.title)}</h3>
                  <p className="mt-1.5 text-sm text-[#515154] leading-relaxed">{tt(p.body)}</p>
                  <span className={`${MONO} block mt-2.5 text-xs text-[#1859b8]`}>{tt(p.gate)}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-[18px] border border-[#d2d2d7] bg-white overflow-hidden">
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
                  <tr key={i} className="max-md:block max-md:py-2 border-t border-[#e0e0e0] first:border-t-0 md:first:border-t">
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

        {/* ⑫ QUYỀN SỞ HỮU + HÌNH THỨC HỢP TÁC */}
        <Section>
          <Kicker>{tt(OWNERSHIP.kicker)}</Kicker>
          <H2>{tt(OWNERSHIP.title)}</H2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 md:gap-x-12 border-t border-[#d2d2d7]">
            {OWNERSHIP.items.map((o, i) => (
              <div key={i} className="grid grid-cols-[22px_1fr] gap-3.5 py-[18px] border-b border-[#d2d2d7]">
                <Check className="w-5 h-5 text-[#1859b8] mt-0.5" strokeWidth={2} />
                <div>
                  <p className="font-semibold">{tt(o.title)}</p>
                  <p className="text-[14.5px] text-[#515154]">{tt(o.body)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <Kicker>{tt(MODELS.kicker)}</Kicker>
            <H2>{tt(MODELS.title)}</H2>
            {/* Máy tính: bảng so sánh 3 cột. Điện thoại: mỗi hình thức là 1 khối. */}
            <div className="mt-9 rounded-[18px] border border-[#d2d2d7] overflow-hidden">
              <table className="w-full text-[14.5px] max-md:hidden">
                <thead>
                  <tr>
                    <th className="w-[14%]" />
                    {MODELS.columns.map((c, i) => (
                      <th key={i} className={`text-left align-top px-5 pt-5 pb-4 ${c.recommended ? 'bg-[#eaf2fd]' : ''}`}>
                        <span className="block text-[15px] font-semibold">{tt(c.name)}</span>
                        <span className="block mt-1 text-[13px] font-normal text-[#515154]">{tt(c.fit)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.rows.map((row) => (
                    <tr key={row.key} className="border-t border-[#e0e0e0]">
                      <td className="px-5 py-3.5 align-top font-semibold text-[#1d1d1f]">{tt(row.label)}</td>
                      {MODELS.columns.map((c, i) => (
                        <td key={i} className={`px-5 py-3.5 align-top ${c.recommended ? 'bg-[#eaf2fd]' : ''}`}>
                          {tt(c[row.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="md:hidden divide-y divide-[#e0e0e0]">
                {MODELS.columns.map((c, i) => (
                  <div key={i} className={`p-5 ${c.recommended ? 'bg-[#eaf2fd]' : ''}`}>
                    <p className="font-semibold">{tt(c.name)}</p>
                    <p className="text-[13px] text-[#515154]">{tt(c.fit)}</p>
                    <dl className="mt-3 space-y-2.5 text-[14.5px]">
                      {MODELS.rows.map((row) => (
                        <div key={row.key}>
                          <dt className={`${MONO} text-[11px] uppercase tracking-[0.04em] text-[#515154]`}>{tt(row.label)}</dt>
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

        {/* ⑬ FAQ */}
        <Section tone="soft">
          <Kicker>{tt(FAQ.kicker)}</Kicker>
          <H2>{tt(FAQ.title)}</H2>
          <FaqList />
        </Section>

        <ServiceReadMore slug="custom-software" />

        {/* ⑭ CTA */}
        <section className="ap-tile ap-dark">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display max-w-[820px]">{tt(FINAL_CTA.title)}</h2>
              <p className="ap-lead max-w-[680px]">{tt(FINAL_CTA.body)}</p>
              <div className="ap-cta-row mt-2">
                <Link href={CONTACT_HREF} className="ap-btn ap-btn-primary">
                  {t('Đặt lịch trao đổi', 'Book a call')}
                </Link>
                <Link href={CONTACT_HREF} className="ap-btn ap-btn-ghost">
                  {t('Gửi yêu cầu', 'Send a brief')}
                </Link>
              </div>
              {(footer.contact_phone || footer.contact_email) && (
                <p className={`${MONO} mt-2 text-[13.5px] text-[#d2d2d7]`}>
                  {[footer.contact_phone && `hotline ${footer.contact_phone}`, footer.contact_email].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* ───────────────────────── Khối dùng chung ───────────────────────── */

type Tone = 'white' | 'soft' | 'dark'

function Section({ id, tone = 'white', className = '', children }: { id?: string; tone?: Tone; className?: string; children: React.ReactNode }) {
  const bg = tone === 'dark' ? 'bg-[#272729] text-white' : tone === 'soft' ? 'bg-[#f5f5f7]' : 'bg-white'
  return (
    <section id={id} className={`py-16 sm:py-24 lg:py-28 ${bg} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

function Kicker({ children, dark = false, numbered = true }: { children: React.ReactNode; dark?: boolean; numbered?: boolean }) {
  return (
    <Eyebrow dark={dark} numbered={numbered} className="mb-4">
      {children}
    </Eyebrow>
  )
}

function H2({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2 className={`text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.22] tracking-[-0.025em] max-w-[22ch] text-balance ${dark ? 'text-white' : 'text-[#1d1d1f]'}`}>
      {children}
    </h2>
  )
}

function Lede({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`mt-4 text-base sm:text-lg leading-relaxed max-w-[62ch] ${dark ? 'text-[#d2d2d7]' : 'text-[#515154]'}`}>{children}</p>
}

/** Tờ bản vẽ: nền trắng, viền mảnh; trên màn hình hẹp cuộn ngang để chữ trong hình đủ lớn. */
function Sheet({ children, minWidth, hint, className = 'mt-8' }: { children: React.ReactNode; minWidth: number; hint: string; className?: string }) {
  return (
    <div className={`${className} min-w-0`}>
      <div className="rounded-[14px] border border-[#d2d2d7] bg-white overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <div style={{ minWidth }}>{children}</div>
      </div>
      {/* Màu theo chữ của khối chứa (khối nền tối là chữ trắng): một màu xám cố định không đủ tương phản trên cả nền sáng lẫn nền tối */}
      <p className="mt-2 text-xs text-current opacity-70 sm:hidden">{hint}</p>
    </div>
  )
}

function TableCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[#d2d2d7] bg-white overflow-hidden">
      <div className="px-5 pt-[18px] pb-2.5">
        <p className="font-semibold">{title}</p>
        {sub && <p className="mt-0.5 text-[13.5px] text-[#515154]">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className={`${MONO} text-left text-xs font-medium uppercase tracking-[0.04em] text-[#515154] bg-[#f5f5f7] px-5 py-3 border-t border-[#e0e0e0]`}>
      {children}
    </th>
  )
}

/** Ô bảng; trên điện thoại bảng xếp dọc và `label` hiện thành nhãn nhỏ phía trên giá trị. */
function Td({ children, label, className = '' }: { children: React.ReactNode; label?: string; className?: string }) {
  return (
    <td
      data-l={label}
      className={`px-5 py-3.5 align-top max-md:block max-md:py-1 max-md:before:block max-md:before:content-[attr(data-l)] max-md:before:text-[11px] max-md:before:uppercase max-md:before:tracking-[0.04em] max-md:before:text-[#515154] max-md:before:font-normal ${className}`}
    >
      {children}
    </td>
  )
}

/* ───────────────────────── Khung mã nguồn ───────────────────────── */

const SQL_KW =
  'create|or|replace|function|returns|language|security|definer|set|search_path|as|select|into|from|where|if|then|end|raise|exception|using|errcode|begin|for|in|loop|continue|policy|on|to|with|check|all|exists|is|not|and|null|stable|alter|table|enable|row|level|revoke|insert|update|delete|public|authenticated|integer|jsonb|uuid|text|boolean|plpgsql|sql'
const TS_KW = 'export|function|const|let|var|if|else|return|null|string|async|await|new|type|import|from|true|false|undefined'

/** Tô màu cú pháp gọn, đủ cho SQL và TypeScript; màu theo bảng 1 xanh + xám của site. */
function highlightLine(line: string, lang: Lang): React.ReactNode[] {
  const comment = lang === 'sql' ? '--[^\\n]*' : '//[^\\n]*'
  const kw = lang === 'sql' ? SQL_KW : TS_KW
  const re = new RegExp(`(${comment})|("[^"\\n]*"|'[^'\\n]*')|\\b(${kw})\\b|\\b([A-Za-z_][A-Za-z0-9_]*)(?=\\()`, lang === 'sql' ? 'gi' : 'g')
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index))
    if (m[1]) out.push(<span key={k++} className="text-[#a1a1a6]">{m[1]}</span>)
    else if (m[2]) out.push(<span key={k++} className="text-[#f5f5f7]">{m[2]}</span>)
    else if (m[3]) out.push(<span key={k++} className="text-[#7db8ff]">{m[3]}</span>)
    else out.push(<span key={k++} className="font-medium text-white">{m[4]}</span>)
    last = m.index + m[0].length
    if (m[0].length === 0) re.lastIndex++
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

function CodeBlock({ code, lang }: { code: string; lang: Lang }) {
  const lines = code.split('\n')
  return (
    <pre className={`${MONO} m-0 overflow-x-auto px-0 py-4 text-[12.5px] sm:text-[13px] leading-[1.75] text-[#d2d2d7]`}>
      <code className="block min-w-max">
        {lines.map((ln, i) => (
          <div key={i} className="flex">
            <span className="w-11 shrink-0 select-none pr-4 text-right text-[#86868b]" aria-hidden>
              {i + 1}
            </span>
            <span className="whitespace-pre pr-6">{ln ? highlightLine(ln, lang) : ' '}</span>
          </div>
        ))}
      </code>
    </pre>
  )
}

function WindowBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto border-b border-white/15 bg-[#1d1d1f] px-2" role="tablist">
      <span className="flex gap-1.5 pl-1.5 pr-2.5" aria-hidden>
        <i className="h-2.5 w-2.5 rounded-full bg-[#515154]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#515154]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#515154]" />
      </span>
      {children}
    </div>
  )
}

/** Khung code ở đầu trang: 2 đoạn mã thật ngắn nhất */
function HeroCode() {
  const { t } = useLanguage()
  const ids = ['rls', 'token']
  const list = EXCERPTS.filter((e) => ids.includes(e.id))
  const [tab, setTab] = useState(0)
  const ex = list[tab]
  return (
    <figure className="min-w-0 overflow-hidden rounded-[14px] bg-[#1d1d1f] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0]" aria-label={t('Mã nguồn thật', 'Real source code')}>
      <WindowBar>
        {list.map((e, i) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`${MONO} whitespace-nowrap border-b-2 px-3.5 py-3 text-[12.5px] transition-colors ${
              tab === i ? 'border-[#7db8ff] text-white' : 'border-transparent text-[#a1a1a6] hover:text-white'
            }`}
          >
            {e.file.split('/').pop()}
          </button>
        ))}
      </WindowBar>
      <div className="max-h-[420px] overflow-y-auto">
        <CodeBlock code={t(ex.code.vi, ex.code.en)} lang={ex.lang} />
      </div>
      <figcaption className={`${MONO} flex justify-between gap-3 border-t border-white/15 px-4 py-2.5 text-xs text-[#a1a1a6]`}>
        <span>{t(ex.repo.vi, ex.repo.en)}</span>
        <span>{t('trích, rút gọn', 'excerpt, trimmed')}</span>
      </figcaption>
    </figure>
  )
}

/** Bốn đoạn mã thật, mỗi đoạn kèm lý do nó tồn tại */
function EvidenceTabs() {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)
  const ex: Excerpt = EXCERPTS[active]
  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8 items-start">
      <div role="tablist" aria-label={t(EVIDENCE.title.vi, EVIDENCE.title.en)} className="flex lg:flex-col gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 lg:pb-0">
        {EXCERPTS.map((e, i) => {
          const on = i === active
          return (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-[12px] border px-4 py-3 text-left transition-colors lg:w-full ${
                on ? 'border-[#7db8ff] bg-[#1d1d1f]' : 'border-white/20 hover:border-white/50'
              }`}
            >
              <span className={`${MONO} block text-[12.5px] ${on ? 'text-[#7db8ff]' : 'text-[#a1a1a6]'}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={`${MONO} mt-0.5 block whitespace-nowrap text-[13px] ${on ? 'text-white' : 'text-[#d2d2d7]'}`}>{e.file.split('/').pop()}</span>
              <span className="mt-1 hidden text-[13px] leading-snug text-[#a1a1a6] lg:block">{t(e.repo.vi, e.repo.en)}</span>
            </button>
          )
        })}
      </div>

      <div className="min-w-0">
        <figure className="overflow-hidden rounded-[14px] bg-[#1d1d1f] border border-white/15">
          <div className="flex items-center justify-between gap-3 border-b border-white/15 px-4 py-2.5">
            <span className={`${MONO} min-w-0 truncate text-[12.5px] text-white`}>{ex.file}</span>
            <span className={`${MONO} shrink-0 text-xs text-[#a1a1a6]`}>{t(EVIDENCE.from.vi, EVIDENCE.from.en)}: {t(ex.repo.vi, ex.repo.en)}</span>
          </div>
          <CodeBlock code={t(ex.code.vi, ex.code.en)} lang={ex.lang} />
        </figure>
        <div className="mt-4 grid grid-cols-[22px_1fr] gap-3 rounded-[14px] border border-[#1e6dda] bg-[#1d1d1f] p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-[#7db8ff]" strokeWidth={1.8} />
          <div>
            <p className={`${MONO} text-[12px] uppercase tracking-[0.04em] text-[#7db8ff]`}>{t(EVIDENCE.proves.vi, EVIDENCE.proves.en)}</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white">{t(ex.proves.vi, ex.proves.en)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Dự án đã làm ───────────────────────── */

/**
 * Máy tính: danh sách dự án bên trái, chi tiết bên phải. Điện thoại: danh sách thành dải cuộn ngang.
 * Mọi khối chi tiết đều render (khối không chọn ẩn bằng class `hidden`) để Google và bot đọc đủ.
 * Ảnh lớn mở bằng <dialog> gốc (top layer) nên không bị khung cha có transform/overflow cắt.
 */
function WorkShowcase() {
  const { t } = useLanguage()
  const tt = (s: I18n) => t(s.vi, s.en)
  const [active, setActive] = useState(0)
  const [shot, setShot] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const item = WORK.items[active]

  const select = (i: number) => {
    setActive(i)
    setShot(0)
  }
  const openZoom = (k: number) => {
    setZoom(k)
    dialogRef.current?.showModal()
  }
  const step = (d: number) => setZoom((z) => (z === null ? z : (z + d + item.shots.length) % item.shots.length))
  const zoomed = zoom === null ? null : item.shots[zoom]

  return (
    <div className="mt-12 grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
      <div
        role="tablist"
        aria-label={tt(WORK.title)}
        className="flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 lg:pb-0 lg:border-t border-[#e0e0e0] snap-x lg:sticky lg:top-24"
      >
        {WORK.items.map((it, i) => {
          const on = i === active
          return (
            <button
              key={it.id}
              id={`tab-${it.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${it.id}`}
              onClick={() => select(i)}
              className={`snap-start shrink-0 text-left transition-colors max-lg:rounded-lg max-lg:border max-lg:px-3.5 max-lg:py-2.5 lg:grid lg:grid-cols-[34px_1fr] lg:py-4 lg:pl-4 lg:border-b lg:border-l-2 ${
                on
                  ? 'max-lg:border-[#272729] max-lg:bg-[#272729] max-lg:text-white lg:border-l-[#272729] lg:bg-[#f5f5f7]'
                  : 'max-lg:border-[#e0e0e0] max-lg:hover:border-[#272729] lg:border-l-transparent lg:hover:bg-[#f5f5f7]'
              } lg:border-b-[#e0e0e0]`}
            >
              <span className={`${MONO} text-[12.5px] ${on ? 'max-lg:text-slate-300 lg:text-[#1859b8]' : 'text-[#515154]'} max-lg:mr-2`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="max-lg:whitespace-nowrap">
                <span className="text-[15px] font-semibold leading-snug">{tt(it.title)}</span>
                <span className="hidden lg:block mt-0.5 text-[13px] text-[#515154]">{tt(it.sector)}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="min-w-0">
        {WORK.items.map((it, i) => (
          <div
            key={it.id}
            id={`panel-${it.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${it.id}`}
            className={i === active ? 'block' : 'hidden'}
          >
            <ShotFrame item={it} shot={i === active ? shot : 0} onZoom={openZoom} />

            {it.frame === 'desktop' && it.shots.length > 1 && (
              <div className="mt-3 flex gap-2">
                {it.shots.map((s, k) => (
                  <button
                    key={s.src}
                    type="button"
                    aria-pressed={k === shot}
                    aria-label={tt(s.alt)}
                    onClick={() => setShot(k)}
                    className={`relative w-24 aspect-[16/10] rounded-md overflow-hidden border transition-opacity ${
                      k === shot ? 'border-[#272729]' : 'border-[#e0e0e0] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={s.src} alt="" fill sizes="96px" className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            <p className={`${MONO} mt-7 text-[12.5px] uppercase tracking-[0.04em] text-[#515154]`}>{tt(it.sector)}</p>
            <h3 className="mt-1.5 text-[22px] sm:text-2xl font-bold tracking-[-0.01em]">{tt(it.title)}</h3>

            <div className="mt-5 grid sm:grid-cols-2 gap-5 sm:gap-10">
              <div>
                <p className="text-sm font-semibold">{tt(WORK.labels.problem)}</p>
                <p className="mt-1.5 text-[15px] text-[#515154] leading-relaxed">{tt(it.problem)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">{tt(WORK.labels.built)}</p>
                <p className="mt-1.5 text-[15px] text-[#515154] leading-relaxed">{tt(it.built)}</p>
              </div>
            </div>

            <ul className="mt-6 grid sm:grid-cols-3 gap-x-6 border-t border-[#e0e0e0]">
              {it.points.map((p, k) => (
                <li key={k} className="grid grid-cols-[20px_1fr] gap-2.5 py-3.5 text-[14.5px] max-sm:border-b border-[#e0e0e0]">
                  <Check className="w-[18px] h-[18px] mt-0.5 text-[#1859b8]" strokeWidth={2} />
                  {tt(p)}
                </li>
              ))}
            </ul>
            <p className={`${MONO} mt-3 text-[12.5px] text-[#515154]`}>{it.stack}</p>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setZoom(null)}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
        className="m-auto p-0 bg-transparent max-w-[96vw] max-h-[96vh] overflow-visible backdrop:bg-[#272729]/92"
      >
        {zoomed && (
          <div>
            <Image
              src={zoomed.src}
              alt={tt(zoomed.alt)}
              width={zoomed.width}
              height={zoomed.height}
              sizes="96vw"
              quality={90}
              className="block w-auto h-auto max-w-[96vw] max-h-[84vh] rounded-lg"
            />
            <div className="mt-3 flex items-center justify-between gap-3 text-white">
              <p className="text-sm text-[#d2d2d7] min-w-0 truncate">
                {tt(item.title)} · {tt(zoomed.alt)}
              </p>
              <div className="flex gap-2 shrink-0">
                {item.shots.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label={tt(WORK.labels.prev)} className="p-2 rounded-md border border-slate-600 hover:border-white">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label={tt(WORK.labels.next)} className="p-2 rounded-md border border-slate-600 hover:border-white">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-600 hover:border-white text-sm"
                >
                  <X className="w-4 h-4" />
                  {tt(WORK.labels.close)}
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}

/** Khung ảnh: máy tính = cửa sổ trình duyệt tối giản; điện thoại = các máy đặt cạnh nhau trên nền xám. */
function ShotFrame({ item, shot, onZoom }: { item: WorkItem; shot: number; onZoom: (k: number) => void }) {
  const { t } = useLanguage()
  const zoomLabel = t(WORK.labels.zoom.vi, WORK.labels.zoom.en)

  if (item.frame === 'phone') {
    return (
      <div className="aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center gap-5 sm:gap-12 p-5 sm:p-8 rounded-xl border border-[#e0e0e0] bg-[#f5f5f7] overflow-hidden">
        {item.shots.map((s, k) => (
          <button
            key={s.src}
            type="button"
            onClick={() => onZoom(k)}
            aria-label={`${zoomLabel}: ${t(s.alt.vi, s.alt.en)}`}
            className="h-full cursor-zoom-in"
          >
            <Image
              src={s.src}
              alt={t(s.alt.vi, s.alt.en)}
              width={s.width}
              height={s.height}
              sizes="(min-width: 1024px) 240px, 40vw"
              quality={90}
              className="h-full w-auto drop-shadow-[0_6px_14px_rgba(11,18,32,0.08)]"
            />
          </button>
        ))}
      </div>
    )
  }

  const s = item.shots[shot]
  return (
    <figure className="rounded-xl border border-[#e0e0e0] bg-white overflow-hidden shadow-[0_24px_48px_-28px_rgba(11,18,32,0.35)]">
      <div className="flex items-center gap-1.5 px-3.5 h-8 bg-[#f5f5f7] border-b border-[#e0e0e0]" aria-hidden>
        <i className="w-2.5 h-2.5 rounded-full bg-[#d2d2d7]" />
        <i className="w-2.5 h-2.5 rounded-full bg-[#d2d2d7]" />
        <i className="w-2.5 h-2.5 rounded-full bg-[#d2d2d7]" />
      </div>
      <button
        type="button"
        onClick={() => onZoom(shot)}
        aria-label={`${zoomLabel}: ${t(s.alt.vi, s.alt.en)}`}
        className="group relative block w-full aspect-[16/10] cursor-zoom-in"
      >
        <Image
          src={s.src}
          alt={t(s.alt.vi, s.alt.en)}
          fill
          sizes="(min-width: 1280px) 860px, (min-width: 1024px) 64vw, 100vw"
          quality={90}
          className="object-cover object-top"
        />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-[#272729]/85 text-white text-xs font-medium px-2.5 py-1.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
          {zoomLabel}
        </span>
      </button>
    </figure>
  )
}

/* ───────────────────────── FAQ ───────────────────────── */

function FaqList() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mt-10 max-w-[860px] border-t border-[#e0e0e0]">
      {FAQ.items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="border-b border-[#e0e0e0]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 py-5 text-left text-[17px] font-semibold"
            >
              <span>{t(item.q.vi, item.q.en)}</span>
              {isOpen ? (
                <Minus className="w-5 h-5 mt-0.5 shrink-0 text-[#515154]" strokeWidth={1.6} />
              ) : (
                <Plus className="w-5 h-5 mt-0.5 shrink-0 text-[#515154]" strokeWidth={1.6} />
              )}
            </button>
            {/* Luôn render câu trả lời (ẩn bằng CSS) để Google và bot AI đọc được cả câu đang đóng */}
            <p className={`pb-5 pr-0 sm:pr-10 text-[#515154] leading-relaxed ${isOpen ? '' : 'hidden'}`}>{t(item.a.vi, item.a.en)}</p>
          </div>
        )
      })}
    </div>
  )
}
