'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import type { CodeTerminalContent } from '@/lib/cms/types'

/**
 * Khối cửa sổ terminal RIÊNG BIỆT — gõ từng dòng rồi lặp lại (anh Trung chốt
 * 3/8/2026: tách khỏi dải logo, dòng lệnh "chuyên nghiệp và khó 1 chút").
 *
 * Tô màu theo ký tự đầu (quy ước ghi ở CodeTerminalContent trong types.ts).
 * Parse thành React node — KHÔNG dangerouslySetInnerHTML dù admin quản nội dung.
 * Không có dòng nào → return null.
 */

const KEYFRAMES = `
@keyframes ct-fade { from { opacity: 0; transform: translateY(2px) } to { opacity: 1; transform: none } }
@keyframes ct-blink { 50% { opacity: 0 } }
`

export function CodeTerminal({ content }: { content: CodeTerminalContent }) {
  const { t } = useLanguage()
  const lines = (content.lines ?? []).filter((l) => (l.vi ?? '') !== '' || (l.en ?? '') !== '')
  if (lines.length === 0) return null

  return (
    <section data-cms-section="code_terminal" className="py-10 lg:py-14 bg-background">
      <style>{KEYFRAMES}</style>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.eyebrow?.vi && (
          <p
            data-cms-field="eyebrow"
            className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2"
          >
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </p>
        )}
        {content.sub?.vi && (
          <p data-cms-field="sub" className="text-center text-sm text-muted-foreground/80 mb-6">
            {t(content.sub.vi, content.sub.en)}
          </p>
        )}

        <Window lines={lines} tab={content.tab} />
      </div>
    </section>
  )
}

function Window({ lines, tab }: { lines: CodeTerminalContent['lines']; tab?: CodeTerminalContent['tab'] }) {
  const { t } = useLanguage()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    // Gõ hết thì nghỉ 3.2s rồi gõ lại từ đầu; dòng đầu chờ ngắn cho đỡ trống
    const delay = shown >= lines.length ? 3200 : shown === 0 ? 400 : 560
    const timer = setTimeout(() => {
      setShown((n) => (n >= lines.length ? 0 : n + 1))
    }, delay)
    return () => clearTimeout(timer)
  }, [shown, lines.length])

  // min-h giữ đúng chỗ đủ số dòng — không giật layout khi gõ lại từ đầu
  const minH = `${3.5 + lines.length * 1.75}rem`

  return (
    <div className="rounded-xl bg-slate-900 dark:bg-slate-950 shadow-xl ring-1 ring-slate-800 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/60">
        <span className="flex gap-1.5" aria-hidden>
          <i className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <i className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <i className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </span>
        {tab?.vi && (
          <span className="ml-2 font-mono text-[11px] text-slate-400 truncate">
            {t(tab.vi, tab.en)}
          </span>
        )}
      </div>
      <div
        className="px-4 sm:px-5 py-4 font-mono text-xs sm:text-[13px] leading-7 overflow-x-auto"
        style={{ minHeight: minH }}
      >
        {lines.slice(0, shown).map((line, idx) => (
          <TermLine key={idx} text={t(line.vi, line.en)} />
        ))}
        <span
          className="inline-block w-1.5 h-3.5 bg-green-400 align-middle"
          style={{ animation: 'ct-blink 1s steps(1) infinite' }}
          aria-hidden
        />
      </div>
    </div>
  )
}

function TermLine({ text }: { text: string }) {
  const fade = { animation: 'ct-fade 0.3s both' }

  if (text.startsWith('✦')) {
    return (
      <div style={fade} className="text-green-400 whitespace-pre">
        {text}
      </div>
    )
  }
  if (text.startsWith('✓')) {
    // Tag [tên-agent] đầu dòng được tô tím cho nổi — nhìn ra ngay đội agent
    const m = text.slice(1).match(/^(\s*)\[([^\]]+)\](.*)$/)
    if (m) {
      return (
        <div style={fade} className="whitespace-pre">
          <span className="text-green-400">✓</span>
          {m[1]}
          <span className="text-violet-300">[{m[2]}]</span>
          <span className="text-slate-200">{m[3]}</span>
        </div>
      )
    }
    return (
      <div style={fade} className="whitespace-pre">
        <span className="text-green-400">✓</span>
        <span className="text-slate-200">{text.slice(1)}</span>
      </div>
    )
  }
  if (text.startsWith('$')) {
    return (
      <div style={fade} className="whitespace-pre">
        <span className="text-slate-500">$</span>
        <span className="text-sky-300">{text.slice(1)}</span>
      </div>
    )
  }
  if (text.startsWith('→')) {
    const hasCheck = text.endsWith('✓')
    const body = hasCheck ? text.slice(1, -1) : text.slice(1)
    return (
      <div style={fade} className="whitespace-pre">
        <span className="text-slate-500">→</span>
        <span className="text-slate-200">{body}</span>
        {hasCheck && <span className="text-green-400">✓</span>}
      </div>
    )
  }
  // Dòng output thường (thụt đầu dòng hoặc không có ký hiệu)
  return (
    <div style={fade} className="text-slate-400 whitespace-pre">
      {text}
    </div>
  )
}
