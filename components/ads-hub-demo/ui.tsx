'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/* Bảng màu của "ứng dụng" trong khung demo. Nền sáng, chữ đậm đủ tương phản (WCAG AA). */
export const C = {
  ink: '#111827',
  muted: '#4b5563',
  faint: '#6b7280',
  line: '#e5e7eb',
  soft: '#f6f8fb',
  blue: '#2563eb',
  blueDeep: '#1d4ed8',
  blueBg: '#e8efff',
  green: '#16a34a',
  greenText: '#15803d',
  greenBg: '#dcfce7',
  amberText: '#92400e',
  amberBg: '#fef3c7',
  redText: '#b91c1c',
  redBg: '#fee2e2',
  violet: '#7c3aed',
  orange: '#f97316',
  navy: '#0b1220',
}

export function useWidth<E extends HTMLElement>() {
  const ref = useRef<E | null>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setW(Math.floor(el.getBoundingClientRect().width))
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    setR(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  }, [])
  return r
}

/* --------------------------------- Khối cơ bản --------------------------------- */

export function Card({ title, right, children, className = '' }: { title?: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-xl border bg-white p-4 ${className}`} style={{ borderColor: C.line }}>
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</h4>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg p-0.5" style={{ background: C.soft, border: `1px solid ${C.line}` }}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            className="whitespace-nowrap rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors"
            style={on ? { background: '#fff', color: C.blueDeep, boxShadow: '0 1px 2px rgba(0,0,0,.12)' } : { color: C.muted }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function Pill({ tone, children }: { tone: 'green' | 'amber' | 'red' | 'blue' | 'gray'; children: ReactNode }) {
  const m = {
    green: [C.greenBg, C.greenText],
    amber: [C.amberBg, C.amberText],
    red: [C.redBg, C.redText],
    blue: [C.blueBg, C.blueDeep],
    gray: ['#eef0f3', C.muted],
  }[tone]
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: m[0], color: m[1] }}>
      {children}
    </span>
  )
}

export function Delta({ v, goodWhenDown = false, lang }: { v: number; goodWhenDown?: boolean; lang: 'vi' | 'en' }) {
  const up = v >= 0
  const good = goodWhenDown ? !up : up
  const s = Math.abs(v).toFixed(1)
  return (
    <span className="font-semibold" style={{ color: good ? C.greenText : C.redText }}>
      {up ? '↑' : '↓'} {lang === 'vi' ? s.replace('.', ',') : s}%
    </span>
  )
}

export function Kpi({
  label,
  value,
  delta,
  sub,
  icon,
}: {
  label: string
  value: ReactNode
  delta?: ReactNode
  sub?: string
  icon?: ReactNode
}) {
  return (
    <div className="min-w-0 rounded-xl border bg-white p-3" style={{ borderColor: C.line }}>
      <div className="flex items-center gap-1.5 text-[11.5px]" style={{ color: C.muted }}>
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-1 text-[20px] font-semibold leading-tight tabular-nums" style={{ color: C.ink }}>{value}</div>
      {(delta || sub) && (
        <div className="mt-0.5 text-[11px]" style={{ color: C.muted }}>
          {delta} {sub}
        </div>
      )}
    </div>
  )
}

export function Spark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 26 - ((v - min) / Math.max(1, max - min)) * 22] as const)
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="h-7 w-full" aria-hidden="true">
      <path d={`${d} L100 28 L0 28 Z`} fill={color} fillOpacity="0.1" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}

/* -------------------------------- Biểu đồ đường -------------------------------- */

export type LineSeries = {
  key: string
  name: string
  color: string
  values: number[]
  axis?: 'l' | 'r'
  fmt: (v: number) => string
  area?: boolean
}

function niceMax(v: number) {
  if (v <= 0) return 1
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / p
  const n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 4 ? 4 : f <= 5 ? 5 : f <= 8 ? 8 : 10
  return n * p
}

function smooth(pts: [number, number][], lo: number, hi: number) {
  if (pts.length < 2) return ''
  const cl = (y: number) => Math.min(hi, Math.max(lo, y))
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = cl(p1[1] + (p2[1] - p0[1]) / 6)
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = cl(p2[1] - (p3[1] - p1[1]) / 6)
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

export function LineChart({
  labels,
  series,
  height = 210,
  mode,
  fmtL,
  fmtR,
  animate = true,
  gid,
}: {
  labels: string[]
  series: LineSeries[]
  height?: number
  mode: 'dual' | 'norm'
  fmtL?: (v: number) => string
  fmtR?: (v: number) => string
  animate?: boolean
  gid: string
}) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const [drawn, setDrawn] = useState(!animate)
  useEffect(() => {
    if (!animate) return
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [animate])

  const n = labels.length
  const dual = mode === 'dual'
  const padL = dual ? 46 : 8
  const padR = dual ? 40 : 8
  const padT = 8
  const padB = 22
  const iw = Math.max(10, w - padL - padR)
  const ih = height - padT - padB
  const xAt = (i: number) => padL + (n <= 1 ? 0 : (i / (n - 1)) * iw)

  const maxOf = (axis: 'l' | 'r') => niceMax(Math.max(1, ...series.filter((s) => (s.axis ?? 'l') === axis).flatMap((s) => s.values)))
  const maxL = maxOf('l')
  const maxR = maxOf('r')
  const hasL = series.some((s) => (s.axis ?? 'l') === 'l')
  const hasR = series.some((s) => s.axis === 'r')
  const scale = (s: LineSeries) => (dual ? ((s.axis ?? 'l') === 'l' ? maxL : maxR) : Math.max(1, ...s.values) * 1.08)
  const yAt = (v: number, max: number) => padT + ih * (1 - v / max)

  const step = Math.max(1, Math.ceil(n / 6))
  const tipLeft = hover === null ? 0 : Math.min(Math.max(xAt(hover), 70), Math.max(70, w - 70))

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {w > 0 && (
        <svg
          width={w}
          height={height}
          role="img"
          aria-label={series.map((s) => s.name).join(', ')}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            const i = Math.round(((e.clientX - r.left - padL) / iw) * (n - 1))
            setHover(Math.min(n - 1, Math.max(0, i)))
          }}
          onPointerLeave={() => setHover(null)}
          style={{ touchAction: 'pan-y' }}
        >
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`${gid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity="0.22" />
                <stop offset="1" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[0, 1, 2, 3, 4].map((g) => {
            const y = padT + (ih / 4) * g
            return (
              <g key={g}>
                <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#eceff3" />
                {dual && hasL && (
                  <text x={padL - 6} y={y + 3.5} fontSize="10.5" fill={C.faint} textAnchor="end">{(fmtL ?? String)(maxL * (1 - g / 4))}</text>
                )}
                {dual && hasR && (
                  <text x={w - padR + 6} y={y + 3.5} fontSize="10.5" fill={C.faint}>{(fmtR ?? String)(maxR * (1 - g / 4))}</text>
                )}
              </g>
            )
          })}
          {labels.map((l, i) =>
            i === n - 1 || (i % step === 0 && n - 1 - i >= step * 0.7) ? (
              <text key={i} x={xAt(i)} y={height - 6} fontSize="10.5" fill={C.faint} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}>
                {l}
              </text>
            ) : null
          )}
          {series.map((s) => {
            const mx = scale(s)
            const pts = s.values.map((v, i) => [xAt(i), yAt(v, mx)] as [number, number])
            const d = smooth(pts, padT, padT + ih)
            return (
              <g key={s.key}>
                {s.area && <path d={`${d} L${xAt(n - 1)} ${padT + ih} L${xAt(0)} ${padT + ih} Z`} fill={`url(#${gid}-${s.key})`} opacity={drawn ? 1 : 0} style={{ transition: 'opacity .9s ease .3s' }} />}
                <path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{ strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, transition: 'stroke-dashoffset 1.1s ease' }}
                />
              </g>
            )
          })}
          {hover !== null && (
            <g>
              <line x1={xAt(hover)} x2={xAt(hover)} y1={padT} y2={padT + ih} stroke="#9ca3af" strokeDasharray="3 3" />
              {series.map((s) => (
                <circle key={s.key} cx={xAt(hover)} cy={yAt(s.values[hover], scale(s))} r="4" fill="#fff" stroke={s.color} strokeWidth="2" />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg border bg-white px-2.5 py-2 text-[11.5px] shadow-lg"
          style={{ left: tipLeft, borderColor: C.line, color: C.ink }}
        >
          <div className="mb-1 font-semibold">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span style={{ color: C.muted }}>{s.name}</span>
              <span className="ml-auto pl-3 font-semibold tabular-nums">{s.fmt(s.values[hover])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Legend({
  items,
  on,
  toggle,
}: {
  items: { key: string; name: string; color: string }[]
  on: Set<string>
  toggle: (k: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {items.map((s) => {
        const active = on.has(s.key)
        return (
          <button
            key={s.key}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(s.key)}
            className="inline-flex items-center gap-1.5 text-[12px]"
            style={{ color: active ? C.ink : C.faint }}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: active ? s.color : '#d1d5db' }} />
            <span style={{ textDecoration: active ? 'none' : 'line-through' }}>{s.name}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ----------------------------------- Donut ----------------------------------- */

export function Donut({
  parts,
  centerBig,
  centerSmall,
  size = 132,
}: {
  parts: { label: string; value: number; color: string }[]
  centerBig: string
  centerSmall: string
  size?: number
}) {
  const [hov, setHov] = useState<number | null>(null)
  const total = parts.reduce((a, p) => a + p.value, 0) || 1
  const r = 50
  const circ = 2 * Math.PI * r
  let acc = 0
  const arcs = parts.map((p, i) => {
    const len = (p.value / total) * circ
    const off = -acc
    acc += len
    return { ...p, len, off, i }
  })
  const h = hov === null ? null : parts[hov]
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={parts.map((p) => `${p.label} ${p.value}`).join(', ')}>
        <g transform="rotate(-90 60 60)">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#eef1f5" strokeWidth="16" />
          {arcs.map((a) => (
            <circle
              key={a.i}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={hov === a.i ? 19 : 16}
              strokeDasharray={`${Math.max(0, a.len - 1.5)} ${circ}`}
              strokeDashoffset={a.off}
              onPointerEnter={() => setHov(a.i)}
              onPointerLeave={() => setHov(null)}
              style={{ transition: 'stroke-width .15s' }}
            />
          ))}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-[19px] font-semibold leading-none tabular-nums" style={{ color: C.ink }}>{h ? h.value : centerBig}</div>
        <div className="mt-1 max-w-[70px] text-[10.5px] leading-tight" style={{ color: C.muted }}>{h ? h.label : centerSmall}</div>
      </div>
    </div>
  )
}

/* -------------------------------- Bảng dữ liệu -------------------------------- */

export function Table({ children, min = 520 }: { children: ReactNode; min?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12.5px]" style={{ minWidth: min }}>
        {children}
      </table>
    </div>
  )
}

export const th = 'whitespace-nowrap px-2 py-2 text-left text-[11.5px] font-medium'
export const td = 'whitespace-nowrap px-2 py-2.5'
