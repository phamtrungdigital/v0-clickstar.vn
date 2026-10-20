'use client'

import { useMemo, useState, useTransition } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, Code2, Loader2, Plus, RotateCcw, ScanSearch, ShieldAlert, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CodeState } from '@/lib/cms/code-admin'
import type { Snippet } from '@/lib/cms/code-snippets'
import { analyzeCode } from '@/lib/cms/code-parse'
import {
  PLACEMENTS,
  TEMPLATES,
  getTemplate,
  templatePartCode,
  validateTemplateId,
  type Placement,
  type TemplateDef,
  type TemplateId,
} from '@/lib/cms/code-templates'
import {
  addCustom,
  addFromTemplate,
  checkLive,
  deleteSnippet,
  restoreHistory,
  updateSnippet,
  type CodeResult,
  type SnippetPatch,
} from '../code-actions'

const BTN = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
const BTN_PLAIN = 'bg-[var(--ad-fill)] text-[var(--ad-fg)] hover:bg-[var(--ad-fill-2)]'
const BTN_PRIMARY = 'bg-[var(--ad-accent)] text-white hover:bg-[var(--ad-accent-d)]'
const INPUT =
  'w-full rounded-[10px] border border-[var(--ad-line-2)] bg-[var(--ad-surface)] px-3 py-2 text-[14px] text-[var(--ad-fg)]'
const CODE =
  'w-full rounded-xl bg-[#1d1d1f] p-3.5 font-mono text-xs leading-relaxed text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[var(--ad-accent)]'
const CHIP = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap'

type Live = { found: Record<string, boolean>; checkedAt: string } | null

export function CodeSnippetsManager({
  initial,
  canEdit,
  legacyHead,
}: {
  initial: CodeState
  canEdit: boolean
  legacyHead: string | null
}) {
  const [state, setState] = useState<CodeState>(initial)
  const [cur, setCur] = useState<Placement>('head')
  const [openId, setOpenId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [live, setLive] = useState<Live>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState<string | null>(null)

  const run = (fn: () => Promise<CodeResult>, okText: string, after?: (r: Extract<CodeResult, { ok: true }>) => void) => {
    setMsg(null)
    start(async () => {
      try {
        const r = await fn()
        if (r.ok) {
          setState({ snippets: r.snippets, history: r.history })
          setLive(null)
          setMsg({ ok: true, text: okText })
          after?.(r)
        } else {
          setMsg({ ok: false, text: r.error })
        }
      } catch {
        setMsg({ ok: false, text: 'Không lưu được, hãy thử lại sau.' })
      }
    })
  }

  const verify = () => {
    setMsg(null)
    start(async () => {
      const r = await checkLive()
      if (r.ok) {
        setLive({ found: r.found, checkedAt: r.checkedAt })
        const missing = Object.values(r.found).filter((v) => !v).length
        setMsg({
          ok: missing === 0,
          text:
            missing === 0
              ? 'Mọi mã đang bật đều đã thấy trên website.'
              : `${missing} mã đang bật chưa thấy trên website. Website làm mới tối đa sau 1 giờ kể từ lúc lưu; nếu quá lâu hãy kiểm tra lại mã.`,
        })
      } else setMsg({ ok: false, text: r.error })
    })
  }

  if (!canEdit) {
    return (
      <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
        <span>Mục Mã tuỳ chỉnh chỉ dành cho tài khoản admin. Mã chạy trực tiếp trên trình duyệt của mọi khách nên biên tập viên không xem hay sửa được.</span>
      </div>
    )
  }

  const zone = PLACEMENTS.find((p) => p.id === cur) as (typeof PLACEMENTS)[number]
  const list = state.snippets.filter((s) => s.placement === cur)
  const countOn = (p: Placement) => state.snippets.filter((s) => s.placement === p && s.enabled).length

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="max-w-xl text-[11px] leading-relaxed text-slate-500">
          Thêm mã của bên thứ ba (Google Analytics, Tag Manager, Pixel, chat…) vào đầu trang, đầu thân trang hoặc cuối trang. Mã chạy trên toàn bộ
          website, tối đa 1 giờ sau khi lưu. Chỉ dán mã từ nguồn anh tin tưởng vì mã chạy trực tiếp trên trình duyệt của khách.
        </p>
        <button type="button" disabled={pending} onClick={verify} className={cn(BTN, BTN_PLAIN)}>
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanSearch className="h-3.5 w-3.5" />}
          Kiểm tra trên website
        </button>
      </div>

      {msg && (
        <div
          role="status"
          className={cn(
            'flex items-start gap-2 rounded-md border px-3 py-2 text-xs',
            msg.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200'
          )}
        >
          {msg.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none" /> : <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />}
          <span>{msg.text}</span>
        </div>
      )}

      {legacyHead?.trim() && (
        <details className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <summary className="cursor-pointer font-medium">Ô Header cũ đang có mã (vẫn chạy trong head)</summary>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Mã này do mục SEO ghi (khối Google Analytics 4) hoặc dán từ trước. Sửa Google Analytics 4 ở Admin → SEO → Kiểm tra toàn site.
          </p>
          <pre className="mt-1.5 max-h-40 overflow-auto rounded bg-slate-900 p-2 font-mono text-[11px] text-slate-100">{legacyHead}</pre>
        </details>
      )}

      <div className="grid gap-4 md:grid-cols-[210px_minmax(0,1fr)]">
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Vị trí trên trang</p>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="border-b border-slate-200 px-3 py-2 text-center text-[11px] text-slate-500 dark:border-slate-700">Thanh địa chỉ, tên trang</div>
            {PLACEMENTS.map((p, i) => (
              <div key={p.id}>
                <button
                  type="button"
                  aria-pressed={cur === p.id}
                  onClick={() => {
                    setCur(p.id)
                    setOpenId(null)
                    setAdding(false)
                  }}
                  className={cn(
                    'relative block w-full border-b border-dashed border-slate-200 px-3 py-2 text-left dark:border-slate-700',
                    cur === p.id && 'bg-primary/10 border-l-[3px] border-l-primary'
                  )}
                >
                  <b className="block text-[12.5px] text-slate-900 dark:text-white">{p.title}</b>
                  <small className="text-[11px] text-slate-500">{p.short}</small>
                  <span
                    title="Số mã đang bật"
                    className={cn(
                      'absolute right-2 top-2 rounded-full border px-2 text-[11px] font-bold',
                      cur === p.id ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-800'
                    )}
                  >
                    {countOn(p.id)}
                  </span>
                </button>
                {i === 1 && (
                  <div className="border-b border-dashed border-slate-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(148,163,184,.12)_8px,rgba(148,163,184,.12)_9px)] px-3 py-4 text-center text-[11px] text-slate-500 dark:border-slate-700">
                    Nội dung trang web
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{zone.title}</h3>
              <p className="text-[11px] text-slate-500">{zone.hint}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => setAdding((v) => !v)}
              className={cn(BTN, BTN_PRIMARY)}
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm mã
            </button>
          </div>

          {adding && (
            <AddPanel
              placement={cur}
              pending={pending}
              onTemplate={(id, value) =>
                run(() => addFromTemplate(id, value), 'Đã thêm mã. Mã bắt đầu chạy trên website tối đa sau 1 giờ.', () => setAdding(false))
              }
              onCustom={(name, code) =>
                run(
                  () => addCustom(cur, name, code),
                  'Đã thêm mã, đang TẮT. Bật công tắc khi anh muốn mã chạy trên website.',
                  (r) => {
                    setAdding(false)
                    const added = r.snippets.filter((s) => s.placement === cur && s.name === name.trim().replace(/\s+/g, ' ')).at(-1)
                    if (added) setOpenId(added.id)
                  }
                )
              }
              onClose={() => setAdding(false)}
            />
          )}

          {list.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-xs text-slate-500 dark:border-slate-600">
              Chưa có mã nào ở vị trí này. Bấm "Thêm mã" để thêm từ mẫu có sẵn hoặc dán code.
            </div>
          ) : (
            <ul className="space-y-2">
              {list.map((s) => (
                <SnippetItem
                  key={s.id}
                  s={s}
                  open={openId === s.id}
                  pending={pending}
                  live={live}
                  confirmDelete={confirm === `del:${s.id}`}
                  onToggleOpen={() => setOpenId(openId === s.id ? null : s.id)}
                  onSwitch={() => run(() => updateSnippet(s.id, { enabled: !s.enabled }), s.enabled ? 'Đã tắt mã.' : 'Đã bật mã. Mã chạy trên website tối đa sau 1 giờ.')}
                  onSave={(patch) => run(() => updateSnippet(s.id, patch), 'Đã lưu mã.')}
                  onAskDelete={() => setConfirm(`del:${s.id}`)}
                  onCancelDelete={() => setConfirm(null)}
                  onDelete={() => {
                    setConfirm(null)
                    run(() => deleteSnippet(s.id), 'Đã xoá mã.', () => setOpenId(null))
                  }}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <details className="rounded-lg border border-slate-200 dark:border-slate-700">
        <summary className="flex cursor-pointer items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span>Lịch sử thay đổi ({state.history.length} bản gần nhất)</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </summary>
        {state.history.length === 0 ? (
          <p className="px-3 pb-3 text-xs text-slate-500">Chưa có thay đổi nào. Mỗi lần thêm, sửa, bật tắt hay xoá mã, em lưu lại một bản ở đây.</p>
        ) : (
          <ul className="divide-y divide-slate-100 px-3 pb-2 dark:divide-slate-700/60">
            {state.history.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center gap-2 py-2 text-xs">
                <span className={cn(CHIP, 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>{h.atLabel}</span>
                <span className="min-w-0 flex-1 text-slate-700 dark:text-slate-200">
                  {h.note ?? 'Thay đổi'} <span className="text-slate-400">({h.count} mã)</span>
                </span>
                {confirm === `hist:${h.id}` ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[11px] text-amber-700 dark:text-amber-300">Danh sách hiện tại sẽ bị thay bằng bản này.</span>
                    <button
                      type="button"
                      disabled={pending}
                      className={cn(BTN, BTN_PRIMARY)}
                      onClick={() => {
                        setConfirm(null)
                        run(() => restoreHistory(h.id), 'Đã khôi phục. Bản trước khi khôi phục vẫn lưu ở lịch sử.')
                      }}
                    >
                      Khôi phục
                    </button>
                    <button type="button" className={cn(BTN, BTN_PLAIN)} onClick={() => setConfirm(null)}>
                      Huỷ
                    </button>
                  </span>
                ) : (
                  <button type="button" disabled={pending} className={cn(BTN, BTN_PLAIN)} onClick={() => setConfirm(`hist:${h.id}`)}>
                    <RotateCcw className="h-3 w-3" />
                    Khôi phục bản này
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </details>
    </div>
  )
}

/* ------------------------------ Một mã trong danh sách ------------------------------ */

function SnippetItem({
  s,
  open,
  pending,
  live,
  confirmDelete,
  onToggleOpen,
  onSwitch,
  onSave,
  onAskDelete,
  onCancelDelete,
  onDelete,
}: {
  s: Snippet
  open: boolean
  pending: boolean
  live: Live
  confirmDelete: boolean
  onToggleOpen: () => void
  onSwitch: () => void
  onSave: (patch: SnippetPatch) => void
  onAskDelete: () => void
  onCancelDelete: () => void
  onDelete: () => void
}) {
  const template = getTemplate(s.kind)
  const [name, setName] = useState(s.name)
  const [code, setCode] = useState(s.code)
  const [tid, setTid] = useState(s.config.id ?? '')

  const status = !s.enabled ? (
    <span className={cn(CHIP, 'border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800')}>Đang tắt</span>
  ) : live ? (
    live.found[s.id] ? (
      <span className={cn(CHIP, 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300')} title={`Kiểm tra lúc ${live.checkedAt}`}>
        Đang chạy, đã thấy trên website
      </span>
    ) : (
      <span className={cn(CHIP, 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300')} title={`Kiểm tra lúc ${live.checkedAt}`}>
        Chưa thấy trên website
      </span>
    )
  ) : (
    <span className={cn(CHIP, 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300')}>Đã bật</span>
  )

  return (
    <li className={cn('rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800', !s.enabled && 'opacity-80')}>
      <div className="flex flex-wrap items-center gap-2.5 px-3 py-2.5">
        <button
          type="button"
          role="switch"
          aria-checked={s.enabled}
          aria-label={`${s.enabled ? 'Tắt' : 'Bật'} ${s.name}`}
          disabled={pending}
          onClick={onSwitch}
          className={cn(
            'relative h-5 w-9 flex-none rounded-full transition-colors disabled:opacity-50',
            s.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
          )}
        >
          <span className={cn('absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', s.enabled && 'left-[18px]')} />
        </button>
        <div className="min-w-[150px] flex-1">
          <b className="block text-[13px] text-slate-900 dark:text-white">{s.name}</b>
          <small className="text-[11px] text-slate-500">
            {template ? `Mẫu ${template.name}${s.config.id ? ` · ${s.config.id}` : ''}` : 'Mã tuỳ chỉnh'} · lưu {s.updatedLabel}
          </small>
        </div>
        {status}
        <button type="button" className={cn(BTN, BTN_PLAIN)} onClick={onToggleOpen}>
          {open ? 'Đóng' : 'Sửa'}
        </button>
        {confirmDelete ? (
          <span className="flex items-center gap-1.5">
            <button type="button" disabled={pending} className={cn(BTN, 'bg-[#d70015] text-white hover:bg-[#b80012]')} onClick={onDelete}>
              Xoá hẳn
            </button>
            <button type="button" className={cn(BTN, BTN_PLAIN)} onClick={onCancelDelete}>
              Huỷ
            </button>
          </span>
        ) : (
          <button type="button" disabled={pending} className={cn(BTN, BTN_PLAIN)} onClick={onAskDelete} aria-label={`Xoá ${s.name}`}>
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>

      {open && (
        <div className="space-y-2.5 border-t border-slate-100 px-3 py-3 dark:border-slate-700">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500">Tên mã</label>
            <input className={INPUT} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} />
          </div>

          {template ? (
            <TemplateEditor template={template} s={s} tid={tid} onTid={setTid} />
          ) : (
            <>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">Mã</label>
                <textarea
                  className={cn(CODE, 'min-h-[150px] resize-y')}
                  spellCheck={false}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <Analysis placement={s.placement} code={code} />
            </>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              className={cn(BTN, BTN_PRIMARY)}
              onClick={() => {
                const patch: SnippetPatch = { name }
                if (template) patch.templateId = tid
                else patch.code = code
                onSave(patch)
              }}
            >
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Lưu
            </button>
            {template && (
              <button
                type="button"
                disabled={pending}
                className={cn(BTN, BTN_PLAIN)}
                title="Tách khỏi mẫu để tự sửa code. Sau đó không sửa bằng ID được nữa."
                onClick={() => onSave({ convertToCustom: true })}
              >
                <Code2 className="h-3 w-3" />
                Chuyển sang sửa code tay
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function TemplateEditor({ template, s, tid, onTid }: { template: TemplateDef; s: Snippet; tid: string; onTid: (v: string) => void }) {
  const err = validateTemplateId(template, tid)
  const preview = err ? s.code : templatePartCode(template, s.config.part ?? template.parts[0].key, tid) ?? s.code
  return (
    <>
      <div>
        <label className="mb-1 block text-[11px] font-semibold text-slate-500">{template.label}</label>
        <input className={INPUT} value={tid} onChange={(e) => onTid(e.target.value)} placeholder={template.placeholder} spellCheck={false} />
        <p className={cn('mt-1 text-[11px]', err ? 'text-red-600' : 'text-slate-500')}>{err ?? template.hint}</p>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-semibold text-slate-500">Mã được tạo (tự sinh từ ID, không sửa tay)</p>
        <pre className={cn(CODE, 'max-h-48 overflow-auto whitespace-pre')}>{preview}</pre>
      </div>
    </>
  )
}

/** Báo trước khi lưu: tên miền mã tải về, thẻ chưa đóng, thẻ không đặt được trong head. */
function Analysis({ placement, code }: { placement: Placement; code: string }) {
  const a = useMemo(() => analyzeCode(code), [code])
  if (!code.trim()) return null
  return (
    <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
      <p>
        {a.domains.length ? (
          <>
            Mã tải hoặc gọi tới: <b>{a.domains.join(', ')}</b>
          </>
        ) : (
          'Mã không tải script từ nơi khác.'
        )}{' '}
        <span className="text-slate-400">({a.chars.toLocaleString('en-US')} ký tự)</span>
      </p>
      {a.unbalanced.length > 0 && (
        <p className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3 w-3 flex-none" />
          Thẻ mở chưa đóng hoặc đóng thừa: {a.unbalanced.map((t) => `<${t}>`).join(', ')}. Dễ làm vỡ giao diện, hãy kiểm tra lại đoạn mã.
        </p>
      )}
      {placement === 'head' && a.notForHead.length > 0 && (
        <p className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3 w-3 flex-none" />
          Thẻ {a.notForHead.map((t) => `<${t}>`).join(', ')} không đặt được trong head nên sẽ bị bỏ qua. Hãy chuyển phần đó sang "Đầu thân trang".
        </p>
      )}
      {placement === 'head' && a.hasEventHandlers && (
        <p className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3 w-3 flex-none" />
          Thuộc tính sự kiện (onload, onclick…) ở vị trí head sẽ bị bỏ để đảm bảo an toàn.
        </p>
      )}
    </div>
  )
}

/* ------------------------------ Thêm mã ------------------------------ */

function AddPanel({
  placement,
  pending,
  onTemplate,
  onCustom,
  onClose,
}: {
  placement: Placement
  pending: boolean
  onTemplate: (id: TemplateId, value: string) => void
  onCustom: (name: string, code: string) => void
  onClose: () => void
}) {
  const [pick, setPick] = useState<TemplateId | 'custom' | null>(null)
  const [value, setValue] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const t = pick && pick !== 'custom' ? getTemplate(pick) : undefined
  const err = t ? validateTemplateId(t, value) : null
  const preview = t ? t.parts.map((p) => p.code(err ? t.placeholder : value.trim())).join('\n\n') : ''

  return (
    <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Chọn cách thêm</p>
      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {TEMPLATES.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={pick === x.id}
            onClick={() => {
              setPick(x.id)
              setValue('')
            }}
            className={cn(
              'rounded-md border bg-white px-2.5 py-2 text-left dark:bg-slate-800',
              pick === x.id ? 'border-primary' : 'border-slate-200 hover:border-primary dark:border-slate-600'
            )}
          >
            <b className="block text-xs text-slate-900 dark:text-white">{x.name}</b>
            <small className="text-[11px] text-slate-500">{x.sub}</small>
          </button>
        ))}
        <button
          type="button"
          aria-pressed={pick === 'custom'}
          onClick={() => setPick('custom')}
          className={cn(
            'rounded-md border bg-white px-2.5 py-2 text-left dark:bg-slate-800',
            pick === 'custom' ? 'border-primary' : 'border-slate-200 hover:border-primary dark:border-slate-600'
          )}
        >
          <b className="block text-xs text-slate-900 dark:text-white">Mã tuỳ chỉnh</b>
          <small className="text-[11px] text-slate-500">Dán đoạn code bất kỳ</small>
        </button>
      </div>

      {t && (
        <div className="mt-3 space-y-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500">{t.label}</label>
            <input className={INPUT} value={value} onChange={(e) => setValue(e.target.value)} placeholder={t.placeholder} spellCheck={false} autoFocus />
            <p className={cn('mt-1 text-[11px]', value && err ? 'text-red-600' : 'text-slate-500')}>{value && err ? err : t.hint}</p>
          </div>
          {t.parts.length > 1 && (
            <p className="text-[11px] text-slate-500">
              Sẽ thêm {t.parts.length} phần: {t.parts.map((p) => PLACEMENTS.find((z) => z.id === p.placement)?.title).join(' và ')}.
            </p>
          )}
          <p className="text-[11px] font-semibold text-slate-500">Mã sẽ được thêm (xem trước)</p>
          <pre className={cn(CODE, 'max-h-44 overflow-auto whitespace-pre')}>{preview}</pre>
          <div className="flex gap-2">
            <button type="button" disabled={pending || !!err} className={cn(BTN, BTN_PRIMARY)} onClick={() => onTemplate(t.id, value.trim())}>
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Thêm vào trang
            </button>
            <button type="button" className={cn(BTN, BTN_PLAIN)} onClick={onClose}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {pick === 'custom' && (
        <div className="mt-3 space-y-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500">
              Tên mã (để dễ nhận biết), vị trí: {PLACEMENTS.find((p) => p.id === placement)?.title}
            </label>
            <input className={INPUT} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Chat Zalo" autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500">Mã</label>
            <textarea className={cn(CODE, 'min-h-[120px] resize-y')} spellCheck={false} value={code} onChange={(e) => setCode(e.target.value)} placeholder="<script>…</script>" />
          </div>
          <Analysis placement={placement} code={code} />
          <p className="text-[11px] text-slate-500">Mã mới thêm ở trạng thái TẮT. Kiểm tra lại rồi bật công tắc khi anh muốn mã chạy trên website.</p>
          <div className="flex gap-2">
            <button type="button" disabled={pending || !name.trim()} className={cn(BTN, BTN_PRIMARY)} onClick={() => onCustom(name, code)}>
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Thêm (đang tắt)
            </button>
            <button type="button" className={cn(BTN, BTN_PLAIN)} onClick={onClose}>
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
