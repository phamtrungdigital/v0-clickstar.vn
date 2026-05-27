'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles, PlayCircle, TrendingUp, Bot } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePageSection } from '@/lib/cms/page-data-context'

export function AdsHubHero() {
  const { t } = useLanguage()
  const section = usePageSection('page_hero')
  if (!section) return null
  const content = section.content

  return (
    <section
      data-cms-section="page_hero"
      className="relative overflow-hidden pt-10 lg:pt-14 pb-14 lg:pb-20 bg-gradient-to-br from-slate-50 via-white to-primary/5"
    >
      {/* Decorative background — gradient blobs + dotted pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-400/25 to-transparent rounded-full blur-3xl opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #0a0a0a 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
          {/* LEFT — Text */}
          <div>
            {/* Badge */}
            <span
              data-cms-field="badge"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/15 to-red-500/15 text-orange-600 font-semibold text-[11px] px-3 py-1.5 rounded-full uppercase tracking-widest mb-5 ring-1 ring-orange-500/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              {t(content.badge.vi, content.badge.en)}
            </span>

            {/* Heading — smaller, modern with gradient highlight */}
            <h1
              data-cms-field="heading"
              className="text-[26px] sm:text-3xl lg:text-[38px] xl:text-[44px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-5 text-balance"
            >
              {renderHeading(t(content.heading.vi, content.heading.en))}
            </h1>

            {/* Description — smaller */}
            <p
              data-cms-field="description"
              className="text-[15px] lg:text-base text-muted-foreground leading-relaxed mb-7 max-w-xl"
            >
              {t(content.description.vi, content.description.en)}
            </p>

            {/* CTAs row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Link
                data-cms-field="cta"
                href={content.cta_href}
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all"
              >
                {t(content.cta_label.vi, content.cta_label.en)}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-border text-foreground font-bold px-7 py-3.5 rounded-full hover:border-primary hover:text-primary hover:shadow-md transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                Xem tính năng
              </a>
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <Trust label="14 ngày dùng thử" />
              <Trust label="Không cần thẻ" />
              <Trust label="Setup 5 phút" />
              <Trust label="Hỗ trợ Claude + GPT" />
            </div>
          </div>

          {/* RIGHT — Browser mockup */}
          <div className="relative lg:scale-105">
            {/* Browser frame */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-primary/25 border border-border/60 overflow-hidden">
              {/* Browser top bar */}
              <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 border-b border-border/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded px-2 py-0.5 text-[10px] text-slate-400 ml-2 truncate font-mono">
                  ads-hub.clickstar.vn
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] rounded-full font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  LIVE
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-4 lg:p-5 bg-gradient-to-br from-white via-white to-slate-50/50">
                {/* KPI cards */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <KpiCard label="Chi tiêu" value="11.7" suffix="tr" trend="+12%" trendColor="text-emerald-600" />
                  <KpiCard label="Leads" value="47" suffix="" trend="+8" trendColor="text-emerald-600" />
                  <KpiCard label="CPL TB" value="249" suffix="k" trend="-15%" trendColor="text-emerald-600" />
                </div>

                {/* Chart mockup */}
                <div className="bg-white rounded-lg border border-border/60 p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-bold text-slate-700">Chi tiêu & Leads theo ngày</div>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Spend
                      </span>
                      <span className="text-[9px] text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Leads
                      </span>
                    </div>
                  </div>
                  <ChartMockup />
                </div>

                {/* Bottom row pills */}
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                    <Bot className="w-2.5 h-2.5" /> Claude 4.7
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                    <TrendingUp className="w-2.5 h-2.5" /> 47 active
                  </span>
                  <span className="text-slate-500">Sync mỗi 2h</span>
                </div>
              </div>
            </div>

            {/* Floating AI Insight card */}
            <div className="hidden sm:flex absolute -top-4 -right-4 lg:-right-6 bg-white rounded-xl shadow-xl p-3 pr-4 border border-primary/20 items-center gap-2.5 max-w-[220px] z-10 animate-in slide-in-from-top fade-in duration-700">
              <div className="w-9 h-9 bg-gradient-to-br from-primary via-purple-500 to-orange-500 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-foreground">AI Insight</div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  "Campaign #3 CPL cao bất thường"
                </div>
              </div>
            </div>

            {/* Floating alert card */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 lg:-left-6 bg-white rounded-xl shadow-xl p-3 border border-emerald-500/20 items-center gap-2.5 max-w-[200px] z-10 animate-in slide-in-from-bottom fade-in duration-700 delay-200">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-foreground">Sync thành công</div>
                <div className="text-[10px] text-muted-foreground">12 accounts · 2 phút trước</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Render heading with highlight gradient on "Facebook Ads" + "AI" keywords */
function renderHeading(text: string) {
  // Highlight "Facebook Ads" và "AI" với gradient
  const parts = text.split(/(Facebook Ads|AI|Facebook\s+Ads)/i)
  return parts.map((part, i) => {
    if (/^(Facebook Ads|AI)$/i.test(part)) {
      return (
        <span
          key={i}
          className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 bg-clip-text text-transparent"
        >
          {part}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function Trust({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
      <span className="font-medium">{label}</span>
    </div>
  )
}

function KpiCard({
  label,
  value,
  suffix,
  trend,
  trendColor,
}: {
  label: string
  value: string
  suffix: string
  trend: string
  trendColor: string
}) {
  return (
    <div className="bg-white rounded-lg border border-border/60 p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">
        {label}
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-extrabold text-foreground">{value}</span>
        <span className="text-[10px] text-slate-500">{suffix}</span>
      </div>
      <div className={`text-[9px] font-semibold ${trendColor}`}>{trend}</div>
    </div>
  )
}

function ChartMockup() {
  return (
    <svg viewBox="0 0 280 80" className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B7BFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1B7BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Spend area */}
      <path
        d="M0,60 L30,55 L60,40 L90,30 L120,35 L150,25 L180,20 L210,28 L240,22 L280,15 L280,80 L0,80 Z"
        fill="url(#spendGrad)"
      />
      {/* Spend line */}
      <path
        d="M0,60 L30,55 L60,40 L90,30 L120,35 L150,25 L180,20 L210,28 L240,22 L280,15"
        fill="none"
        stroke="#1B7BFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leads line orange */}
      <path
        d="M0,55 L30,50 L60,45 L90,40 L120,38 L150,30 L180,32 L210,25 L240,28 L280,20"
        fill="none"
        stroke="#FF6B35"
        strokeWidth="2"
        strokeDasharray="3 2"
        strokeLinecap="round"
      />
      {/* Dots */}
      {[
        [0, 60],
        [60, 40],
        [120, 35],
        [180, 20],
        [240, 22],
        [280, 15],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#1B7BFF" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  )
}
