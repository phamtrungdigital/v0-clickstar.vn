'use client'

// Nút "Tạo bản nháp đầy đủ": trình duyệt gọi lần lượt từng bước của /api/admin/ai/pipeline
// (tìm nguồn → dàn ý → viết → soát → sửa tối đa 2 vòng → dịch → SEO → ảnh bìa), hiện tiến độ,
// thời gian và chi phí từng bước. Lỗi bước nào thì "Chạy tiếp" từ đúng bước đó.
// Kết quả chỉ điền vào trình soạn (bài vẫn ở trạng thái Draft), người duyệt bấm Lưu.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Loader2,
  RotateCcw,
  Square,
  X,
  XCircle,
} from 'lucide-react'
import { runPipelineStep } from '@/lib/ai/pipeline/client'
import {
  POST_BUDGET_USD,
  WRITER_OPTIONS,
  referenceSection,
  type ArticleType,
  type CoverResult,
  type PipelineOutline,
  type PipelineStep,
  type ResearchResult,
  type ReviewResult,
  type SeoResult,
  type StepUsage,
  type TranslateResult,
  type WriterModel,
} from '@/lib/ai/pipeline/shared'
import type { PipelineFact, PipelineSource } from '@/lib/ai/pipeline/shared'
import { countExpertPlaceholders } from '@/lib/ai/content-rules'

type Draft = { content_vi: string; sources: PipelineSource[]; facts: PipelineFact[]; words: number; model: WriterModel }

type BlindCandidate = { model: WriterModel; draft: Draft; usage: StepUsage }
type Blind = { candidates: BlindCandidate[]; order: number[]; scores: Record<number, number>; revealed: boolean }

type RunState = {
  research?: ResearchResult
  outline?: PipelineOutline
  draft?: Draft
  reviews: ReviewResult[]
  revisions: number
  translate?: TranslateResult
  seo?: SeoResult
  cover?: CoverResult
  blind?: Blind
  /** Bài thử mù đã viết xong (giữ lại khi chạy lại → không trả tiền viết lại). */
  blindDone?: Partial<Record<WriterModel, BlindCandidate>>
  blindAttempts?: number
}

type LogRow = {
  key: string
  label: string
  state: 'running' | 'done' | 'error'
  note?: string
  usage?: StepUsage
}

export type FullDraftResult = {
  title: { vi: string; en: string }
  excerpt: { vi: string; en: string }
  content: { vi: string; en: string }
  slug: string
  tags: string[]
  seo_title: { vi: string; en: string }
  seo_description: { vi: string; en: string }
  cover_image: string | null
}

const MAX_REVISIONS = 2
const STEP_LABEL: Record<PipelineStep, string> = {
  research: 'Tìm nguồn',
  outline: 'Dàn ý',
  write: 'Viết bản tiếng Việt',
  review: 'Soát bài',
  revise: 'Sửa bài',
  translate: 'Dịch tiếng Anh',
  seo: 'Tiêu đề, mô tả SEO',
  cover: 'Ảnh bìa',
}
const HISTORY_KEY = 'ai-full-draft-history-v1'
const BLIND_KEY = 'ai-blind-test-history-v1'

function readStore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}
function pushStore<T>(key: string, item: T, max = 20) {
  try {
    localStorage.setItem(key, JSON.stringify([item, ...readStore<T>(key)].slice(0, max)))
  } catch {}
}

const usd = (n: number) => `$${n.toFixed(n < 0.1 ? 3 : 2)}`
const secs = (ms: number) => (ms >= 60000 ? `${Math.floor(ms / 60000)}p${Math.round((ms % 60000) / 1000)}s` : `${Math.round(ms / 1000)}s`)
const modelLabel = (m: string) => WRITER_OPTIONS.find((o) => o.value === m)?.label.replace(/ \(.*\)$/, '') ?? m

function shuffle(n: number) {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** `onApply` trả false khi người dùng huỷ (vd bài đang đăng) → giữ modal mở. */
export function AiFullDraft({ onApply }: { onApply: (r: FullDraftResult) => boolean }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Form
  const [topic, setTopic] = useState('')
  const [keyword, setKeyword] = useState('')
  const [articleType, setArticleType] = useState<ArticleType>('evergreen')
  const [targetWords, setTargetWords] = useState(1500)
  const [writer, setWriter] = useState<WriterModel>('claude-opus-5-5')
  const [blindTest, setBlindTest] = useState(false)

  // Run
  const stateRef = useRef<RunState>({ reviews: [], revisions: 0 })
  const [, setTick] = useState(0)
  const rerender = () => setTick((t) => t + 1)
  const [log, setLog] = useState<LogRow[]>([])
  // Bản sao nhật ký trong ref: vòng chạy async đọc được ngay (state chỉ cập nhật khi render).
  const logRef = useRef<LogRow[]>([])
  const updateLog = (fn: (l: LogRow[]) => LogRow[]) => {
    logRef.current = fn(logRef.current)
    setLog(logRef.current)
  }
  // Chi phí các lần chạy lỗi đã bị thay dòng nhật ký khi "Chạy tiếp" — vẫn phải tính vào trần.
  const carriedUsdRef = useRef(0)
  const [carriedUsd, setCarriedUsd] = useState(0)
  const spentUsd = () => carriedUsdRef.current + logRef.current.reduce((a, x) => a + (x.usage?.costUsd ?? 0), 0)
  const [phase, setPhase] = useState<'form' | 'running' | 'paused' | 'blind' | 'done'>('form')
  const [error, setError] = useState<string | null>(null)
  const [live, setLive] = useState<string>('')
  const [coverPick, setCoverPick] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const startedRef = useRef<number>(0)
  // Rời trang soạn bài giữa chừng → huỷ bước đang chạy, vòng lặp dừng (không chạy ngầm tốn tiền).
  useEffect(() => () => abortRef.current?.abort(), [])

  const s = stateRef.current
  const totalCost = carriedUsd + log.reduce((sum, r) => sum + (r.usage?.costUsd ?? 0), 0)
  const budget = blindTest ? POST_BUDGET_USD * 2 : POST_BUDGET_USD

  const reset = () => {
    abortRef.current?.abort()
    stateRef.current = { reviews: [], revisions: 0 }
    updateLog(() => [])
    startedRef.current = 0
    carriedUsdRef.current = 0
    setCarriedUsd(0)
    setError(null)
    setLive('')
    setCoverPick(null)
    setPhase('form')
  }

  const base = () => ({ topic: topic.trim(), keyword: keyword.trim() || undefined, articleType })

  /** Chạy 1 bước, ghi nhật ký. */
  async function step<T>(name: PipelineStep, input: unknown, key: string, label = STEP_LABEL[name]) {
    const prev = logRef.current.find((r) => r.key === key)
    if (prev?.usage?.costUsd) {
      carriedUsdRef.current += prev.usage.costUsd
      setCarriedUsd(carriedUsdRef.current)
    }
    updateLog((l) => [...l.filter((r) => r.key !== key), { key, label, state: 'running' }])
    setLive('')
    const ac = abortRef.current!
    try {
      const out = await runPipelineStep<T>(name, input, {
        signal: ac.signal,
        onEvent: (e) => {
          if (e.type === 'status') setLive(e.message)
          else if (e.type === 'progress') setLive(`Đã viết ${e.chars.toLocaleString('vi-VN')} ký tự…`)
          else if (e.type === 'pulse') setLive((v) => (v.startsWith('Đang') || v.startsWith('Đã viết') ? v : `Đang chạy (${e.elapsedSec}s)…`))
        },
      })
      updateLog((l) => l.map((r) => (r.key === key ? { ...r, state: 'done', usage: out.usage } : r)))
      return out
    } catch (e) {
      const msg = ac.signal.aborted ? 'Đã dừng' : e instanceof Error ? e.message : 'Lỗi'
      // Bước lỗi sau khi đã gọi AI vẫn tốn tiền → ghi chi phí để trần ngân sách tính đúng.
      const usage = (e as { usage?: StepUsage } | null)?.usage
      updateLog((l) => l.map((r) => (r.key === key ? { ...r, state: 'error', note: msg, usage } : r)))
      throw e
    }
  }

  function draftInputs() {
    const st = stateRef.current
    return { facts: st.draft!.facts, sources: st.draft!.sources }
  }

  /** Xác định và chạy các bước còn thiếu cho tới khi xong / lỗi / chờ chấm thử mù. */
  async function runFrom() {
    setError(null)
    setPhase('running')
    abortRef.current = new AbortController()
    if (!startedRef.current) startedRef.current = Date.now()
    try {
      while (true) {
        const st = stateRef.current
        if (spentUsd() > budget) throw new Error(`Đã chạm trần chi phí ${usd(budget)} cho bài này, dừng để tránh tốn thêm.`)

        if (!st.research) {
          st.research = (await step<ResearchResult>('research', base(), 'research')).result
        } else if (!st.outline) {
          st.outline = (await step<PipelineOutline>('outline', { ...base(), targetWords, research: st.research }, 'outline')).result
        } else if (!st.draft) {
          const writeInput = (model: WriterModel) => ({ ...base(), targetWords, model, outline: st.outline, research: st.research })
          if (blindTest) {
            const models = WRITER_OPTIONS.map((o) => o.value)
            const done = (st.blindDone ??= {})
            // Chỉ viết bài còn thiếu (lần chạy lại không trả tiền viết lại bài đã xong).
            await Promise.allSettled(
              models.map(async (m, i) => {
                if (done[m]) return
                const r = await step<Omit<Draft, 'model'>>('write', writeInput(m), `write-${i}`, `Viết thử mù (bài ${i + 1}/3)`)
                done[m] = { model: m, draft: { ...r.result, model: m }, usage: r.usage }
              })
            )
            if (abortRef.current?.signal.aborted) throw new Error('Đã dừng')
            const candidates = models.map((m) => done[m]).filter((c): c is BlindCandidate => !!c)
            st.blindAttempts = (st.blindAttempts ?? 0) + 1
            // Lần đầu thiếu bài → cho "Chạy tiếp" viết nốt; từ lần 2, đủ 2 bài là chấm được
            // (1 model lỗi mãi không làm kẹt cả quy trình, cũng không đốt tiền thử lại vô hạn).
            if (candidates.length < models.length && (st.blindAttempts < 2 || candidates.length < 2)) {
              throw new Error(
                candidates.length >= 2
                  ? `Thử mù mới xong ${candidates.length}/${models.length} bài. Bấm "Chạy tiếp" để thử viết nốt (lần sau thiếu vẫn chấm với ${candidates.length} bài).`
                  : `Thử mù mới xong ${candidates.length}/${models.length} bài, cần ít nhất 2. Bấm "Chạy tiếp" để thử lại.`
              )
            }
            st.blind = { candidates, order: shuffle(candidates.length), scores: {}, revealed: false }
            rerender()
            setPhase('blind')
            return
          }
          const out = await step<Omit<Draft, 'model'>>('write', writeInput(writer), 'write')
          st.draft = { ...out.result, model: writer }
        } else if (st.reviews.length === st.revisions) {
          const n = st.reviews.length + 1
          const out = await step<ReviewResult>(
            'review',
            { title_vi: st.outline!.title_vi, content_vi: st.draft.content_vi, ...draftInputs() },
            `review-${n}`,
            `Soát bài (lần ${n})`
          )
          st.reviews.push(out.result)
        } else if (st.reviews[st.reviews.length - 1].needsRevise && st.revisions < MAX_REVISIONS) {
          const n = st.revisions + 1
          const out = await step<Omit<Draft, 'model'>>(
            'revise',
            {
              model: st.draft.model,
              targetWords,
              title_vi: st.outline!.title_vi,
              content_vi: st.draft.content_vi,
              review: st.reviews[st.reviews.length - 1],
              ...draftInputs(),
            },
            `revise-${n}`,
            `Sửa bài (vòng ${n})`
          )
          st.draft = { ...out.result, model: st.draft.model }
          st.revisions = n
        } else if (!st.translate) {
          st.translate = (await step<TranslateResult>('translate', { title_vi: st.outline!.title_vi, content_vi: st.draft.content_vi }, 'translate')).result
        } else if (!st.seo) {
          st.seo = (
            await step<SeoResult>(
              'seo',
              {
                keyword: keyword.trim() || undefined,
                articleType,
                title_vi: st.outline!.title_vi,
                title_en: st.translate.title_en,
                content_vi: st.draft.content_vi,
                content_en: st.translate.content_en,
              },
              'seo'
            )
          ).result
        } else if (!st.cover) {
          st.cover = (
            await step<CoverResult>(
              'cover',
              { title: st.outline!.title_vi, kicker: st.seo.cover_kicker_vi, points: st.seo.cover_points_vi },
              'cover'
            )
          ).result
          setCoverPick(st.cover.variants[0]?.url ?? null)
        } else {
          setPhase('done')
          setLive('')
          pushStore(HISTORY_KEY, {
            at: new Date().toISOString(),
            topic: topic.trim(),
            writer: st.draft?.model,
            blind: !!st.blind,
            revisions: st.revisions,
            words: st.draft?.words,
            totalUsd: Number(spentUsd().toFixed(4)),
            totalMs: Date.now() - startedRef.current,
            steps: logRef.current.map((x) => ({ label: x.label, ms: x.usage?.ms, usd: x.usage?.costUsd, model: x.usage?.model })),
          })
          return
        }
        rerender()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi')
      setPhase('paused')
      setLive('')
    }
  }

  const start = () => {
    if (topic.trim().length < 3) {
      setError('Nhập chủ đề (ít nhất 3 ký tự)')
      return
    }
    stateRef.current = { reviews: [], revisions: 0 }
    startedRef.current = 0
    updateLog(() => [])
    carriedUsdRef.current = 0
    setCarriedUsd(0)
    void runFrom()
  }

  const stop = () => abortRef.current?.abort()

  const chooseBlind = (idx: number) => {
    const st = stateRef.current
    const b = st.blind!
    const c = b.candidates[idx]
    pushStore(BLIND_KEY, {
      at: new Date().toISOString(),
      topic: topic.trim(),
      results: b.order.map((ci, pos) => ({
        label: String.fromCharCode(65 + pos),
        model: b.candidates[ci].model,
        score: b.scores[ci] ?? null,
        words: b.candidates[ci].draft.words,
        usd: b.candidates[ci].usage.costUsd,
        ms: b.candidates[ci].usage.ms,
      })),
      chosen: c.model,
    })
    st.draft = c.draft
    void runFrom()
  }

  const apply = () => {
    const st = stateRef.current
    if (!st.draft || !st.outline || !st.translate || !st.seo) return
    const applied = onApply({
      title: { vi: st.outline.title_vi, en: st.translate.title_en },
      excerpt: { vi: st.seo.excerpt_vi, en: st.seo.excerpt_en },
      content: {
        vi: st.draft.content_vi + referenceSection(st.draft.sources, 'vi'),
        en: st.translate.content_en + referenceSection(st.draft.sources, 'en'),
      },
      slug: st.seo.slug,
      tags: st.seo.tags,
      seo_title: { vi: st.seo.seo_title_vi, en: st.seo.seo_title_en },
      seo_description: { vi: st.seo.seo_description_vi, en: st.seo.seo_description_en },
      cover_image: coverPick,
    })
    if (applied) setOpen(false)
  }

  const running = phase === 'running'
  const lastReview = s.reviews[s.reviews.length - 1]
  const expertLeft = s.draft ? countExpertPlaceholders(s.draft.content_vi) : 0

  const modal = (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Tạo bản nháp đầy đủ
            </h2>
            <p className="text-[11px] text-slate-500">
              AI tìm nguồn, viết, tự soát, dịch, làm SEO và ảnh bìa. Bài chỉ điền vào trình soạn ở trạng thái Draft, người duyệt kiểm rồi mới đăng.
            </p>
          </div>
          <button
            onClick={() => {
              if (running && !confirm('Quy trình đang chạy. Đóng sẽ dừng bước hiện tại, phần đã xong vẫn giữ. Đóng?')) return
              stop()
              setOpen(false)
            }}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {phase === 'form' && (
            <div className="space-y-3">
              <Field label="Chủ đề bài viết *">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={2}
                  placeholder="VD: Cách chọn CRM cho doanh nghiệp 20-100 nhân viên"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Từ khoá SEO chính (không bắt buộc)">
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="VD: phần mềm CRM"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  />
                </Field>
                <Field label="Loại bài">
                  <select
                    value={articleType}
                    onChange={(e) => setArticleType(e.target.value as ArticleType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    <option value="evergreen">Kiến thức dùng lâu dài (hướng dẫn, checklist)</option>
                    <option value="phan_tich">Phân tích (thay đổi của nền tảng, xu hướng)</option>
                  </select>
                </Field>
                <Field label="Độ dài">
                  <select
                    value={targetWords}
                    onChange={(e) => setTargetWords(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
                  >
                    <option value={1200}>Khoảng 1.200 từ</option>
                    <option value={1500}>Khoảng 1.500 từ</option>
                    <option value={2000}>Khoảng 2.000 từ</option>
                  </select>
                </Field>
                <Field label="Model viết bài">
                  <select
                    value={writer}
                    onChange={(e) => setWriter(e.target.value as WriterModel)}
                    disabled={blindTest}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50"
                  >
                    {WRITER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={blindTest} onChange={(e) => setBlindTest(e.target.checked)} className="mt-0.5" />
                <span>
                  <strong>Thử mù 3 model</strong>: cùng nguồn và dàn ý, 3 model viết 3 bài, anh chấm điểm khi chưa biết bài nào của model nào, rồi chọn 1 bài để chạy tiếp. Tốn thêm khoảng $1-2.
                </span>
              </label>
              <p className="text-[11px] text-slate-500">
                Trần chi phí mỗi bài: {usd(budget)}. Thời gian dự kiến 4-8 phút. Giữ tab này mở trong lúc chạy.
              </p>
              <HistoryTables />
            </div>
          )}

          {phase !== 'form' && (
            <>
              {/* Nhật ký các bước */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-700">
                {log.map((r) => (
                  <div key={r.key} className="flex items-start gap-2 px-3 py-2 text-xs">
                    {r.state === 'running' ? (
                      <Loader2 className="w-3.5 h-3.5 mt-0.5 animate-spin text-primary shrink-0" />
                    ) : r.state === 'done' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 mt-0.5 text-red-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 dark:text-slate-100">{r.label}</div>
                      {r.state === 'running' && live && <div className="text-slate-500">{live}</div>}
                      {r.note && <div className="text-red-600 break-words">{r.note}</div>}
                    </div>
                    {r.usage && (
                      <div className="text-right text-slate-500 shrink-0 tabular-nums">
                        <div>
                          {secs(r.usage.ms)} · {usd(r.usage.costUsd)}
                        </div>
                        <div className="text-[10px]">
                          {r.usage.model}
                          {r.usage.webSearches ? ` · ${r.usage.webSearches} lượt tìm` : ''}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-between px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-b-lg">
                  <span className="text-slate-600 dark:text-slate-300">
                    Tổng: <strong>{usd(totalCost)}</strong>
                    {startedRef.current ? ` · ${secs(Date.now() - startedRef.current)}` : ''}
                  </span>
                  <span className="flex gap-2">
                    {running && (
                      <button onClick={stop} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 hover:bg-white">
                        <Square className="w-3 h-3" /> Dừng
                      </button>
                    )}
                    {phase === 'paused' && (
                      <button
                        onClick={() => void runFrom()}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary text-white hover:bg-primary/90"
                      >
                        <RotateCcw className="w-3 h-3" /> Chạy tiếp
                      </button>
                    )}
                    {!running && (
                      <button onClick={reset} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 hover:bg-white">
                        Làm bài khác
                      </button>
                    )}
                  </span>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nguồn */}
              {s.research && (
                <details className="border border-slate-200 dark:border-slate-700 rounded-lg" open={phase === 'done'}>
                  <summary className="px-3 py-2 text-xs font-semibold cursor-pointer">
                    Nguồn ({(s.draft?.sources ?? s.research.sources).length}) · {s.research.facts.length} sự kiện có trích dẫn
                    {s.research.searchErrors.length ? ` · ${s.research.searchErrors.length} lượt tìm lỗi` : ''}
                  </summary>
                  <ol className="px-3 pb-3 space-y-1.5 text-xs list-decimal list-inside">
                    {(s.draft?.sources ?? s.research.sources).map((src) => (
                      <li key={src.id} className="break-words">
                        <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {src.title}
                          <ExternalLink className="inline w-3 h-3 ml-1" />
                        </a>
                        {src.quote && <div className="text-slate-500 ml-4">“{src.quote.slice(0, 160)}”</div>}
                      </li>
                    ))}
                  </ol>
                </details>
              )}

              {/* Thử mù */}
              {phase === 'blind' && s.blind && <BlindPanel blind={s.blind} onChange={rerender} onChoose={chooseBlind} />}

              {/* Kết quả soát */}
              {lastReview && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2 text-xs">
                  <div className="font-semibold">
                    Kết quả soát lần cuối: {lastReview.needsRevise ? (s.revisions >= MAX_REVISIONS ? 'còn lỗi sau 2 vòng sửa, người duyệt cần sửa tay' : 'cần sửa') : 'đạt'}
                    {' · '}độ "giống AI": {lastReview.judge.ai_voice_score}/10
                  </div>
                  {lastReview.judge.summary && <p className="text-slate-600 dark:text-slate-300">{lastReview.judge.summary}</p>}
                  {(lastReview.codeIssues.length > 0 || lastReview.judge.issues.length > 0 || lastReview.copied.length > 0) && (
                    <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                      {lastReview.codeIssues.map((i) => (
                        <li key={i.code} className={i.severity === 'error' ? 'text-red-700' : ''}>
                          {i.label}: {i.samples.slice(0, 2).join(' | ')}
                        </li>
                      ))}
                      {lastReview.copied.map((c, k) => (
                        <li key={`c${k}`} className="text-red-700">Chép gần nguyên văn nguồn: “{c}”</li>
                      ))}
                      {lastReview.judge.issues.slice(0, 6).map((i, k) => (
                        <li key={`j${k}`}>
                          [{i.type}] “{i.quote.slice(0, 120)}”: {i.problem}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Hoàn tất */}
              {phase === 'done' && s.outline && s.translate && s.seo && s.draft && (
                <div className="space-y-3">
                  <div className="border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-xs space-y-1">
                    <div className="font-semibold text-emerald-800 dark:text-emerald-300">{s.outline.title_vi}</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      {s.draft.words.toLocaleString('vi-VN')} từ · viết bởi {modelLabel(s.draft.model)} · {s.revisions} vòng sửa
                    </div>
                    {expertLeft > 0 && (
                      <div className="text-amber-700">
                        Còn {expertLeft} ô [[CHUYÊN GIA: ...]] cần người duyệt điền. Bài chưa đăng được cho tới khi điền xong.
                      </div>
                    )}
                    {s.translate.mismatches.map((m) => (
                      <div key={m} className="text-amber-700">Đối chiếu bản Anh: {m}</div>
                    ))}
                  </div>

                  {s.cover && s.cover.variants.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold mb-1.5">Chọn ảnh bìa</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {s.cover.variants.map((v) => (
                          <button
                            key={v.url}
                            type="button"
                            onClick={() => setCoverPick(v.url)}
                            className={`rounded-lg overflow-hidden border-2 text-left ${coverPick === v.url ? 'border-primary' : 'border-transparent'}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={v.url} alt={v.label} className="w-full aspect-[1200/630] object-cover" />
                            <div className="px-2 py-1 text-[11px] flex items-center gap-1">
                              {coverPick === v.url ? <CheckCircle2 className="w-3 h-3 text-primary" /> : <Circle className="w-3 h-3" />}
                              {v.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <details className="border border-slate-200 dark:border-slate-700 rounded-lg">
                    <summary className="px-3 py-2 text-xs font-semibold cursor-pointer">Xem trước bản tiếng Việt</summary>
                    <div className="px-4 pb-4 prose prose-sm prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown>{s.draft.content_vi + referenceSection(s.draft.sources, 'vi')}</ReactMarkdown>
                    </div>
                  </details>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-700">
          {phase === 'form' && (
            <button
              onClick={start}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90"
            >
              <FileText className="w-4 h-4" />
              Bắt đầu
            </button>
          )}
          {phase === 'done' && (
            <button
              onClick={apply}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90"
            >
              <CheckCircle2 className="w-4 h-4" />
              Đưa vào bài (Draft)
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border border-primary/40 text-primary hover:bg-primary/5"
        title="AI tìm nguồn, viết, soát, dịch, SEO và ảnh bìa"
      >
        <FileText className="w-3.5 h-3.5" />
        Tạo bản nháp đầy đủ
      </button>
      {open && mounted && createPortal(modal, document.body)}
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      {children}
    </div>
  )
}

function BlindPanel({ blind, onChange, onChoose }: { blind: Blind; onChange: () => void; onChoose: (idx: number) => void }) {
  const [tab, setTab] = useState(0)
  const ci = blind.order[tab]
  const c = blind.candidates[ci]
  const allScored = blind.order.every((i) => blind.scores[i])
  return (
    <div className="border-2 border-primary/30 rounded-lg p-3 space-y-3">
      <div className="text-xs">
        <strong>Thử mù:</strong> đọc {blind.candidates.length} bài, chấm 1-5 điểm từng bài (5 = đăng được gần như ngay). Sau khi chấm đủ mới hiện model.
      </div>
      <div className="flex gap-1">
        {blind.order.map((idx, pos) => (
          <button
            key={idx}
            onClick={() => setTab(pos)}
            className={`px-3 py-1 text-xs rounded ${tab === pos ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700'}`}
          >
            Bài {String.fromCharCode(65 + pos)}
            {blind.scores[idx] ? ` · ${blind.scores[idx]}đ` : ''}
          </button>
        ))}
      </div>
      <div className="max-h-[45vh] overflow-y-auto border border-slate-200 dark:border-slate-700 rounded p-3 prose prose-sm prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{c.draft.content_vi}</ReactMarkdown>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span>Điểm bài {String.fromCharCode(65 + tab)}:</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => {
              blind.scores[ci] = n
              onChange()
            }}
            className={`w-7 h-7 rounded border ${blind.scores[ci] === n ? 'bg-primary text-white border-primary' : 'border-slate-300'}`}
          >
            {n}
          </button>
        ))}
        <span className="text-slate-500">{c.draft.words.toLocaleString('vi-VN')} từ</span>
      </div>
      {allScored && !blind.revealed && (
        <button
          onClick={() => {
            blind.revealed = true
            onChange()
          }}
          className="px-3 py-1.5 text-xs rounded bg-slate-800 text-white"
        >
          Chấm xong, hiện model
        </button>
      )}
      {blind.revealed && (
        <div className="space-y-1.5">
          {blind.order.map((idx, pos) => {
            const cand = blind.candidates[idx]
            return (
              <div key={idx} className="flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5">
                <span>
                  Bài {String.fromCharCode(65 + pos)}: <strong>{modelLabel(cand.model)}</strong> · {blind.scores[idx]}đ · {usd(cand.usage.costUsd)} ·{' '}
                  {secs(cand.usage.ms)}
                </span>
                <button onClick={() => onChoose(idx)} className="px-2 py-1 rounded bg-primary text-white">
                  Dùng bài này, chạy tiếp
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type HistoryRow = { at: string; topic: string; writer?: string; totalUsd: number; totalMs: number; words?: number; revisions: number }
type BlindRow = { at: string; topic: string; chosen: string; results: Array<{ label: string; model: string; score: number | null }> }

function HistoryTables() {
  const [runs, setRuns] = useState<HistoryRow[]>([])
  const [blinds, setBlinds] = useState<BlindRow[]>([])
  useEffect(() => {
    setRuns(readStore<HistoryRow>(HISTORY_KEY))
    setBlinds(readStore<BlindRow>(BLIND_KEY))
  }, [])
  if (!runs.length && !blinds.length) return null
  return (
    <details className="border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
      <summary className="px-3 py-2 font-semibold cursor-pointer">Lịch sử đo trên trình duyệt này ({runs.length} lần chạy, {blinds.length} lần thử mù)</summary>
      <div className="px-3 pb-3 space-y-2 overflow-x-auto">
        {runs.length > 0 && (
          <table className="w-full min-w-[520px]">
            <thead className="text-slate-500 text-left">
              <tr>
                <th className="py-1 pr-2">Ngày</th>
                <th className="py-1 pr-2">Chủ đề</th>
                <th className="py-1 pr-2">Model viết</th>
                <th className="py-1 pr-2">Số từ</th>
                <th className="py-1 pr-2">Thời gian</th>
                <th className="py-1">Chi phí</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.at} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="py-1 pr-2 whitespace-nowrap">{new Date(r.at).toLocaleDateString('vi-VN')}</td>
                  <td className="py-1 pr-2">{r.topic}</td>
                  <td className="py-1 pr-2 whitespace-nowrap">{r.writer ? modelLabel(r.writer) : ''}</td>
                  <td className="py-1 pr-2">{r.words ?? ''}</td>
                  <td className="py-1 pr-2 whitespace-nowrap">{secs(r.totalMs)}</td>
                  <td className="py-1">{usd(r.totalUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {blinds.map((b) => (
          <div key={b.at} className="border-t border-slate-100 dark:border-slate-700 pt-1">
            {new Date(b.at).toLocaleDateString('vi-VN')} · {b.topic}:{' '}
            {b.results.map((r) => `${modelLabel(r.model)} ${r.score ?? '-'}đ`).join(', ')} · chọn {modelLabel(b.chosen)}
          </div>
        ))}
      </div>
    </details>
  )
}
