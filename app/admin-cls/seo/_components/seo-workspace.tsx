'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Loader2,
  Search,
  X,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD, INPUT, Note, SeoPanel, TONE_BAR, TONE_TEXT } from './seo-panel'
import {
  KIND_LABEL,
  SCORE_OK,
  TITLE_MAX,
  DESC_MAX,
  analyze,
  findDuplicateTitles,
  scoreTone,
  type Level,
  type SeoDraft,
  type SeoItem,
  type SiteCheck,
} from '@/lib/seo/admin-seo'
import { saveGa4, saveSeoItem } from '../actions'

type Filter = 'all' | 'page' | 'service' | 'post' | 'project' | 'fix'
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'page', label: 'Trang' },
  { id: 'service', label: 'Dịch vụ' },
  { id: 'post', label: 'Bài viết' },
  { id: 'project', label: 'Dự án' },
  { id: 'fix', label: 'Chỉ hiện mục cần sửa' },
]

const norm = (v: string) => v.normalize('NFC').replace(/\s+/g, ' ').trim()
const normDraft = (d: SeoDraft): SeoDraft => ({
  vi: { title: norm(d.vi.title), desc: norm(d.vi.desc) },
  en: { title: norm(d.en.title), desc: norm(d.en.desc) },
  og: d.og.trim(),
})
const sameDraft = (a: SeoDraft, b: SeoDraft) => JSON.stringify(normDraft(a)) === JSON.stringify(normDraft(b))

export function SeoWorkspace({
  items: initialItems,
  checks,
  siteUrl,
  role,
}: {
  items: SeoItem[]
  checks: SiteCheck[]
  siteUrl: string
  role: string
}) {
  const [items, setItems] = useState(initialItems)
  useEffect(() => setItems(initialItems), [initialItems])

  const [tab, setTab] = useState<'list' | 'site'>('list')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [lowFirst, setLowFirst] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)

  const host = useMemo(() => {
    try {
      return new URL(siteUrl).hostname
    } catch {
      return 'clickstar.vn'
    }
  }, [siteUrl])

  const dupMap = useMemo(() => findDuplicateTitles(items), [items])
  const rows = useMemo(
    () => items.map((it) => ({ it, a: analyze(it, it.saved, dupMap.get(it.key)) })),
    [items, dupMap]
  )

  const scored = rows.filter((r) => r.it.published)
  const avg = scored.length ? Math.round(scored.reduce((n, r) => n + r.a.score, 0) / scored.length) : 0
  const needFix = scored.filter((r) => r.a.score < SCORE_OK).length
  const okCount = scored.length - needFix
  const siteOk = checks.filter((c) => c.level === 'ok').length

  const visible = useMemo(() => {
    const q = norm(query).toLowerCase()
    const list = rows.filter(({ it, a }) => {
      if (filter === 'fix') {
        if (!it.published || a.score >= SCORE_OK) return false
      } else if (filter !== 'all' && it.kind !== filter) return false
      if (q && !`${it.label} ${it.path}`.toLowerCase().includes(q)) return false
      return true
    })
    // Mục chưa đăng không có điểm thật nên luôn xếp cuối khi sắp theo điểm.
    return lowFirst
      ? [...list].sort((x, y) => Number(y.it.published) - Number(x.it.published) || x.a.score - y.a.score)
      : list
  }, [rows, filter, query, lowFirst])

  const open = openKey ? rows.find((r) => r.it.key === openKey) : null

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">SEO</h1>
        <p className="text-xs text-slate-500">
          Tiêu đề, mô tả và ảnh chia sẻ của mọi trang, bài viết, dự án. Bấm một dòng để sửa và xem trước trên Google.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <Stat label="Điểm SEO trung bình" value={String(avg)} suffix="/ 100" tone={scoreTone(avg)} />
        <Stat label="Mục cần sửa" value={String(needFix)} suffix={`/ ${scored.length}`} tone={needFix ? 'warn' : 'ok'} />
        <Stat label="Mục đạt" value={String(okCount)} suffix={`/ ${scored.length}`} tone="ok" />
        <Stat label="Kiểm tra toàn site" value={String(siteOk)} suffix={`/ ${checks.length} đạt`} tone={siteOk === checks.length ? 'ok' : 'warn'} />
      </div>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {(
          [
            ['list', 'Trang và bài viết'],
            ['site', 'Kiểm tra toàn site'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'px-3 py-2 text-sm font-medium -mb-px border-b-2',
              tab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            )}
          >
            {label}
            {id === 'site' && siteOk < checks.length && (
              <span className="ml-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] px-1.5 py-0.5">
                {checks.length - siteOk}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'list' ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full border',
                    filter === f.id
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên hoặc đường dẫn"
                className={cn(INPUT, 'pl-8 w-56 !py-1 text-xs')}
              />
            </div>
            <button
              type="button"
              onClick={() => setLowFirst((v) => !v)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-md border',
                lowFirst
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
              )}
            >
              Điểm thấp trước
            </button>
          </div>

          <div className={cn(CARD, 'overflow-x-auto')}>
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Trang, bài viết, dự án</th>
                  <th className="px-3 py-2.5 w-20">Tiêu đề</th>
                  <th className="px-3 py-2.5 w-20">Mô tả</th>
                  <th className="px-3 py-2.5 w-24">Ảnh chia sẻ</th>
                  <th className="px-3 py-2.5 w-28">Điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {visible.map(({ it, a }) => (
                  <tr
                    key={it.key}
                    onClick={() => setOpenKey(it.key)}
                    className={cn(
                      'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30',
                      openKey === it.key && 'bg-primary/5',
                      !it.published && 'opacity-60'
                    )}
                  >
                    <td className="px-4 py-2.5 max-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenKey(it.key)
                        }}
                        className="block w-full text-left"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-900 dark:text-white truncate">{it.label}</span>
                          <span className="shrink-0 text-[10px] rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5">
                            {KIND_LABEL[it.kind]}
                          </span>
                          {!it.published && (
                            <span className="shrink-0 text-[10px] rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-1.5 py-0.5">
                              Nháp
                            </span>
                          )}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-500 truncate">{it.path}</span>
                      </button>
                    </td>
                    <td className={cn('px-3 py-2.5 tabular-nums', TONE_TEXT[a.title.level])} title={a.title.fromFallback ? 'Đang lấy từ tên mục vì chưa nhập tiêu đề SEO' : undefined}>
                      {a.title.len}
                      {a.title.fromFallback && <span className="text-slate-400">*</span>}
                    </td>
                    <td className={cn('px-3 py-2.5 tabular-nums', TONE_TEXT[a.desc.level])} title={a.desc.fromFallback && a.desc.len ? it.descFallbackNote : undefined}>
                      {a.desc.len}
                      {a.desc.fromFallback && a.desc.len > 0 && <span className="text-slate-400">*</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      {a.hasOg ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> Có
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Chưa
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {it.published ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div className={cn('h-full', TONE_BAR[scoreTone(a.score)])} style={{ width: `${a.score}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-slate-600 dark:text-slate-300 w-7 text-right">{a.score}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Chưa đăng</span>
                      )}
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                      Không có mục nào khớp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500">
            Số trong cột Tiêu đề và Mô tả là số ký tự Google nhận được (tiêu đề đã gồm “| Click Star”). Dấu * nghĩa là mục chưa
            nhập riêng nên hệ thống đang lấy từ tên hoặc tóm tắt. Mức tốt: tiêu đề 30 đến {TITLE_MAX}, mô tả 110 đến {DESC_MAX}.
          </p>
        </>
      ) : (
        <SiteChecks checks={checks} siteUrl={siteUrl} role={role} />
      )}

      {open && (
        <SeoDrawer
          key={open.it.key}
          item={open.it}
          duplicateWith={dupMap.get(open.it.key) ?? []}
          host={host}
          role={role}
          onClose={() => setOpenKey(null)}
          onSaved={(draft) =>
            setItems((prev) => prev.map((x) => (x.key === open.it.key ? { ...x, saved: draft } : x)))
          }
        />
      )}
    </div>
  )
}

function Stat({ label, value, suffix, tone }: { label: string; value: string; suffix: string; tone: Level }) {
  return (
    <div className={cn(CARD, 'px-3.5 py-3')}>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className={cn('text-2xl font-semibold tabular-nums', TONE_TEXT[tone])}>{value}</span>
        <span className="text-xs text-slate-500">{suffix}</span>
      </div>
    </div>
  )
}

/* ---------------------------------- Ngăn sửa ---------------------------------- */

function SeoDrawer({
  item,
  duplicateWith,
  host,
  role,
  onClose,
  onSaved,
}: {
  item: SeoItem
  duplicateWith: string[]
  host: string
  role: string
  onClose: () => void
  onSaved: (draft: SeoDraft) => void
}) {
  const [draft, setDraft] = useState<SeoDraft>(item.saved)
  const [lang, setLang] = useState<'vi' | 'en'>('vi')
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const canEdit = item.editable && (role === 'admin' || role === 'editor')
  const dirty = !sameDraft(draft, item.saved)

  const requestClose = () => {
    if (dirty && !window.confirm('Có thay đổi chưa lưu. Đóng và bỏ các thay đổi này?')) return
    onClose()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const save = () => {
    setMsg(null)
    const next = normDraft(draft)
    startTransition(async () => {
      const res = await saveSeoItem({
        kind: item.kind as 'page' | 'service' | 'post',
        id: item.id,
        vi: next.vi,
        en: item.kind === 'post' ? next.en : undefined,
        og: next.og,
      })
      if ('error' in res) {
        setMsg({ ok: false, text: res.error })
        return
      }
      setDraft(next)
      onSaved(next)
      setMsg({ ok: true, text: 'Đã lưu. Trang công khai cập nhật trong ít phút.' })
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Sửa SEO: ${item.label}`}>
      <div className="absolute inset-0 bg-slate-900/40" onClick={requestClose} />
      <div className="relative w-full sm:w-[540px] h-full bg-white dark:bg-slate-900 shadow-xl flex flex-col">
        <div className="flex items-start gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-slate-500">
              {KIND_LABEL[item.kind]}
              {!item.published && ' · chưa đăng'}
            </div>
            <div className="text-base font-semibold text-slate-900 dark:text-white truncate">{item.label}</div>
            <a
              href={item.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-primary"
            >
              {item.path} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button type="button" onClick={requestClose} aria-label="Đóng" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {!item.editable && (
            <Note>
              Dự án chưa có ô SEO riêng. Tiêu đề tự rút từ tên dự án (còn khoảng 46 ký tự) và mô tả lấy từ phần tóm tắt. Muốn
              đổi, sửa tên hoặc tóm tắt trong{' '}
              <Link href={item.editHref} className="underline text-primary">
                trang sửa dự án
              </Link>
              .
            </Note>
          )}
          {item.editable && !canEdit && <Note>Tài khoản này chỉ có quyền xem, không sửa được.</Note>}

          {item.kind === 'post' && (
            <div className="flex gap-1.5">
              {(['vi', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    'text-xs px-3 py-1 rounded-full border',
                    lang === l
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                  )}
                >
                  {l === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}
                </button>
              ))}
            </div>
          )}
          <SeoPanel
            item={item}
            draft={draft}
            onChange={(update) => {
              setMsg(null)
              setDraft(update)
            }}
            lang={lang}
            canEdit={canEdit}
            pending={pending}
            host={host}
            duplicateWith={duplicateWith}
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-700">
          <Link
            href={item.editHref}
            onClick={(e) => {
              if (dirty && !window.confirm('Có thay đổi chưa lưu. Rời trang và bỏ các thay đổi này?')) e.preventDefault()
            }}
            className="text-xs text-slate-500 hover:text-primary underline mr-auto"
          >
            Mở trình sửa đầy đủ
          </Link>
          {msg && (
            <span className={cn('text-xs max-w-[180px]', msg.ok ? TONE_TEXT.ok : TONE_TEXT.bad)}>{msg.text}</span>
          )}
          <button
            type="button"
            onClick={requestClose}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {canEdit ? 'Hủy' : 'Đóng'}
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={save}
              disabled={!dirty || pending}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Kiểm tra toàn site ------------------------------ */

function CheckIcon({ level }: { level: SiteCheck['level'] }) {
  if (level === 'ok') return <CheckCircle2 className={cn('w-[18px] h-[18px] shrink-0', TONE_TEXT.ok)} />
  if (level === 'warn') return <AlertTriangle className={cn('w-[18px] h-[18px] shrink-0', TONE_TEXT.warn)} />
  if (level === 'bad') return <XCircle className={cn('w-[18px] h-[18px] shrink-0', TONE_TEXT.bad)} />
  return <HelpCircle className="w-[18px] h-[18px] shrink-0 text-slate-400" />
}

function SiteChecks({ checks, siteUrl, role }: { checks: SiteCheck[]; siteUrl: string; role: string }) {
  return (
    <div className={cn(CARD, 'px-4 py-1.5')}>
      {checks.map((c) => (
        <div key={c.id} className="flex gap-3 py-3 border-t first:border-t-0 border-slate-100 dark:border-slate-700">
          <CheckIcon level={c.level} />
          <div className="min-w-0 flex-1">
            <div className="text-sm text-slate-900 dark:text-white">{c.title}</div>
            {c.detail && <div className="text-xs text-slate-500 mt-0.5">{c.detail}</div>}
            {c.lines && (
              <ul className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
                {c.lines.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            )}
            {c.id === 'ga4' && <Ga4Form check={c} role={role} />}
            {c.id === 'gsc' && <GscHelp siteUrl={siteUrl} verified={c.level === 'ok'} />}
            {c.id === 'defaults' && c.level !== 'ok' && (
              <Link href="/admin-cls/settings" className="inline-block mt-1 text-xs text-primary underline">
                Mở Cài đặt
              </Link>
            )}
            {c.id === 'hotline' && c.level !== 'ok' && (
              <Link href="/admin-cls/settings" className="inline-block mt-1 text-xs text-primary underline">
                Mở Cài đặt
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function Ga4Form({ check, role }: { check: SiteCheck; role: string }) {
  const [value, setValue] = useState(check.ga4Managed ? (check.ga4Id ?? '') : '')
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (role !== 'admin') {
    return check.level === 'ok' ? null : (
      <p className="text-xs text-slate-500 mt-1">Cần tài khoản Admin để gắn mã.</p>
    )
  }
  if (check.level === 'ok' && !check.ga4Managed) {
    return <p className="text-xs text-slate-500 mt-1">Mã này được gắn ở Cài đặt, mục mã tùy chỉnh.</p>
  }

  const run = (id: string) => {
    setMsg(null)
    startTransition(async () => {
      const res = await saveGa4(id)
      if ('error' in res) setMsg({ ok: false, text: res.error })
      else setMsg({ ok: true, text: id ? 'Đã gắn mã. Trang công khai áp dụng trong vài phút.' : 'Đã gỡ mã.' })
    })
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="G-XXXXXXXXXX"
          maxLength={20}
          className={cn(INPUT, 'w-44 !py-1 font-mono text-xs')}
        />
        <button
          type="button"
          disabled={pending || !value.trim()}
          onClick={() => run(value)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {pending && <Loader2 className="w-3 h-3 animate-spin" />}
          {check.ga4Managed ? 'Cập nhật mã' : 'Gắn mã'}
        </button>
        {check.ga4Managed && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setValue('')
              run('')
            }}
            className="px-3 py-1 text-xs rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Gỡ mã
          </button>
        )}
      </div>
      <p className="text-[11px] text-slate-500 mt-1">
        Lấy mã tại analytics.google.com, mục Quản trị, Luồng dữ liệu. Mã bắt đầu bằng G-.
      </p>
      {msg && <p className={cn('text-xs mt-1', msg.ok ? TONE_TEXT.ok : TONE_TEXT.bad)}>{msg.text}</p>}
    </div>
  )
}

function GscHelp({ siteUrl, verified }: { siteUrl: string; verified: boolean }) {
  const [copied, setCopied] = useState(false)
  const sitemapUrl = `${siteUrl.replace(/\/$/, '')}/sitemap.xml`
  const host = (() => {
    try {
      return new URL(siteUrl).hostname.replace(/^www\./, '')
    } catch {
      return 'clickstar.vn'
    }
  })()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sitemapUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* trình duyệt chặn: người dùng tự chọn và sao chép */
    }
  }

  const sitemapStep = (
    <>
      Vào mục Sơ đồ trang web (Sitemaps), gửi địa chỉ
      <button
        type="button"
        onClick={copy}
        className="ml-1 inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
      >
        {sitemapUrl} {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </button>
    </>
  )
  const consoleLink = (
    <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-primary underline">
      Google Search Console
    </a>
  )

  if (verified) {
    return (
      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
        Mở {consoleLink}, chọn thuộc tính <span className="font-mono">{host}</span>. {sitemapStep}
      </p>
    )
  }

  return (
    <ol className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300 list-decimal pl-4">
      <li>
        Mở {consoleLink}, chọn Thêm thuộc tính, loại “Tên miền”, nhập <span className="font-mono">{host}</span>.
      </li>
      <li>
        Google đưa một bản ghi TXT. Thêm bản ghi đó vào DNS của tên miền (nơi đang quản lý tên miền), rồi bấm Xác minh. Cách này
        không cần sửa website, và chắc hơn việc dán thẻ vào Cài đặt vì mã chèn nằm trong phần thân trang.
      </li>
      <li>{sitemapStep}</li>
    </ol>
  )
}
