// Kiểu dữ liệu + hàm thuần dùng chung giữa API pipeline (server) và bảng điều khiển
// "Tạo bản nháp đầy đủ" (client). Không import gì phía server.
import type { ContentIssue } from '../content-rules'

export type PipelineStep = 'research' | 'outline' | 'write' | 'review' | 'revise' | 'translate' | 'seo' | 'cover'

/** Model mặc định từng bước (theo bản phân tích đã duyệt). Bước viết/sửa chọn được để thử mù. */
export const PIPELINE_MODELS = {
  research: 'claude-sonnet-5-5',
  outline: 'claude-opus-5-5',
  write: 'claude-opus-5-5',
  review: 'claude-sonnet-5-5',
  translate: 'claude-sonnet-5-5',
  seo: 'claude-haiku-5-5',
} as const

export const WRITER_OPTIONS = [
  { value: 'claude-opus-5-5', label: 'Claude Opus 5.5 (mặc định)' },
  { value: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (rẻ hơn một nửa)' },
  { value: 'claude-fable-5-1', label: 'Claude Fable 5.1 (đắt gấp 2,5 lần)' },
] as const
export type WriterModel = (typeof WRITER_OPTIONS)[number]['value']

export function isWriterModel(v: unknown): v is WriterModel {
  return WRITER_OPTIONS.some((o) => o.value === v)
}

/** Trần chi phí 1 bài (USD) — chạm trần thì dừng, không chạy tiếp bước sau. */
export const POST_BUDGET_USD = 3

export type ArticleType = 'phan_tich' | 'evergreen'

export type PipelineSource = { id: number; url: string; title: string; quote: string }
export type PipelineFact = { id: number; text: string; sourceIds: number[] }

export type ResearchResult = {
  facts: PipelineFact[]
  sources: PipelineSource[]
  notes: string
  searches: number
  searchErrors: string[]
}

export type OutlineSection = { heading: string; points: string[]; factIds: number[] }
export type PipelineOutline = {
  title_vi: string
  angle: string
  sections: OutlineSection[]
  expert_questions: string[]
}

export type JudgeIssue = {
  type: 'sai_su_that' | 'giong_ai' | 'tu_khen' | 'cau_truc' | 'khac'
  quote: string
  problem: string
  fix: string
}
export type JudgeResult = {
  verdict: 'dat' | 'can_sua'
  ai_voice_score: number
  summary: string
  issues: JudgeIssue[]
}
export type ReviewResult = {
  codeIssues: ContentIssue[]
  copied: string[]
  judge: JudgeResult
  needsRevise: boolean
}

export type TranslateResult = {
  title_en: string
  content_en: string
  mismatches: string[]
}

export type SeoResult = {
  excerpt_vi: string
  excerpt_en: string
  seo_title_vi: string
  seo_title_en: string
  seo_description_vi: string
  seo_description_en: string
  slug: string
  tags: string[]
  cover_kicker_vi: string
  cover_points_vi: string[]
}

export type CoverResult = { variants: Array<{ key: 'title' | 'checklist'; label: string; url: string }> }

export type StepUsage = {
  step: PipelineStep
  model: string
  costUsd: number
  ms: number
  inputTokens: number
  outputTokens: number
  webSearches: number
}

// ── Nguồn tham khảo ──

const REF_RE = /( ?)\[(\d{1,3})\](?!\()/g
// Mục nguồn do model tự viết: chỉ bỏ khi là mục CUỐI bài (không còn "## " nào phía sau),
// tránh xoá nhầm nửa sau bài nếu giữa bài có mục tên "Nguồn...".
const REF_HEADING_RE =
  /\n#{2,3}\s*(Nguồn tham khảo|Tài liệu tham khảo|Nguồn|References|Sources)\s*\n(?![\s\S]*\n##\s)[\s\S]*$/i

/** Bỏ mục "Nguồn tham khảo" do model tự viết (code sẽ dựng lại từ danh sách nguồn thật). */
export function stripReferenceSection(markdown: string): string {
  return markdown.replace(REF_HEADING_RE, '').trimEnd()
}

/** Áp `fn` lên phần chữ thường, bỏ qua khối code ``` ``` và code `inline`. */
function mapOutsideCode(markdown: string, fn: (text: string) => string): string {
  return markdown
    .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('')
}

/**
 * Đánh số lại trích dẫn theo thứ tự xuất hiện, bỏ ref trỏ tới nguồn không tồn tại,
 * chỉ giữ nguồn được trích. Trả bài đã đánh số lại + danh sách nguồn mới (id 1..n).
 * Không đụng vào code (vd `items[1]`).
 */
export function renumberRefs(
  markdown: string,
  sources: PipelineSource[]
): { markdown: string; sources: PipelineSource[]; dropped: number } {
  const byId = new Map(sources.map((s) => [s.id, s]))
  const order = new Map<number, number>()
  let dropped = 0
  const body = mapOutsideCode(stripReferenceSection(markdown), (text) =>
    text.replace(REF_RE, (_m, space: string, raw: string) => {
      const oldId = Number(raw)
      if (!byId.has(oldId)) {
        dropped++
        return ''
      }
      if (!order.has(oldId)) order.set(oldId, order.size + 1)
      return `${space}[${order.get(oldId)}]`
    })
  )
  const next: PipelineSource[] = []
  for (const [oldId, newId] of order) next.push({ ...byId.get(oldId)!, id: newId })
  next.sort((a, b) => a.id - b.id)
  return { markdown: body, sources: next, dropped }
}

/** Sau khi đánh số lại nguồn: đổi số nguồn trong từng sự kiện theo URL (nguồn bị bỏ thì bỏ). */
export function remapFacts(
  facts: PipelineFact[],
  oldSources: PipelineSource[],
  newSources: PipelineSource[]
): PipelineFact[] {
  const urlOfOld = new Map(oldSources.map((s) => [s.id, s.url]))
  const newIdOfUrl = new Map(newSources.map((s) => [s.url, s.id]))
  return facts.map((f) => ({
    ...f,
    sourceIds: f.sourceIds
      .map((id) => newIdOfUrl.get(urlOfOld.get(id) ?? ''))
      .filter((x): x is number => typeof x === 'number'),
  }))
}

/** Mục nguồn cuối bài, dựng từ danh sách nguồn thật (không để model tự viết URL). */
export function referenceSection(sources: PipelineSource[], lang: 'vi' | 'en'): string {
  if (!sources.length) return ''
  const heading = lang === 'vi' ? '## Nguồn tham khảo' : '## References'
  const items = sources
    .filter((s) => /^https?:\/\//i.test(s.url))
    // Tiêu đề: gộp mọi khoảng trắng/xuống dòng + bỏ ngoặc vuông → không chèn được Markdown.
    .map(
      (s) =>
        `${s.id}. [${s.title.replace(/[[\]\s]+/g, ' ').trim() || s.url}](<${s.url.replace(/[<>\s\\]/g, encodeURIComponent)}>)`
    )
  return `\n\n${heading}\n\n${items.join('\n')}`
}

/**
 * Câu chép gần nguyên văn từ trích dẫn nguồn: tìm chuỗi ≥ n từ liên tiếp trùng với
 * câu trích (so sánh chữ thường, bỏ dấu câu). Trả các đoạn bị trùng.
 */
export function findCopiedPhrases(markdown: string, quotes: string[], n = 12): string[] {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean)
  const grams = new Set<string>()
  for (const q of quotes) {
    const w = norm(q)
    for (let i = 0; i + n <= w.length; i++) grams.add(w.slice(i, i + n).join(' '))
  }
  if (!grams.size) return []
  const words = norm(markdown)
  const hits: string[] = []
  for (let i = 0; i + n <= words.length && hits.length < 5; i++) {
    const g = words.slice(i, i + n).join(' ')
    if (grams.has(g)) {
      hits.push(g)
      i += n - 1
    }
  }
  return hits
}

/** Đối chiếu bản Việt và Anh: số, ref [n], link, ô chuyên gia phải khớp. */
export function compareTranslations(vi: string, en: string): string[] {
  const out: string[] = []
  const nums = (s: string) =>
    (s.match(/\d+(?:[.,]\d+)*/g) ?? [])
      .map((x) => x.replace(/[.,]/g, ''))
      .filter((x) => x.length >= 2)
      .sort()
  const refs = (s: string) => (s.match(/\[\d{1,3}\](?!\()/g) ?? []).sort()
  const links = (s: string) => (s.match(/\]\((https?:[^)\s]+)\)/g) ?? []).sort()
  const experts = (s: string) => (s.match(/\[\[\s*(?:CHUYÊN GIA|EXPERT)/giu) ?? []).length

  const diff = (a: string[], b: string[]) => {
    const rest = [...b]
    const missing: string[] = []
    for (const x of a) {
      const i = rest.indexOf(x)
      if (i === -1) missing.push(x)
      else rest.splice(i, 1)
    }
    return { missing, extra: rest }
  }
  const n = diff(nums(vi), nums(en))
  if (n.missing.length) out.push(`Bản Anh thiếu số: ${[...new Set(n.missing)].slice(0, 8).join(', ')}`)
  if (n.extra.length) out.push(`Bản Anh có số không có trong bản Việt: ${[...new Set(n.extra)].slice(0, 8).join(', ')}`)
  const r = diff(refs(vi), refs(en))
  if (r.missing.length || r.extra.length) out.push('Trích nguồn [n] giữa 2 bản không khớp')
  const l = diff(links(vi), links(en))
  if (l.missing.length || l.extra.length) out.push('Link giữa 2 bản không khớp')
  if (experts(vi) !== experts(en)) out.push('Số ô [[CHUYÊN GIA]] giữa 2 bản không khớp')
  return out
}

export function slugifyVi(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70)
    .replace(/-$/, '')
}
