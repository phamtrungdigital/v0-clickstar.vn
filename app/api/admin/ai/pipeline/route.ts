// Quy trình "Tạo bản nháp đầy đủ": mỗi request chạy ĐÚNG 1 bước, trình duyệt gọi lần lượt
// (tìm nguồn → dàn ý → viết → soát → sửa → dịch → SEO → ảnh bìa). Chỉ admin/editor.
import { z } from 'zod'
import { loadAiContext, missingKeyMessage } from '@/lib/ai/route-context'
import { errorMessage, sseResponse } from '@/lib/ai/sse'
import { usageOfError } from '@/lib/ai/claude'
import {
  stepOutline,
  stepResearch,
  stepReview,
  stepRevise,
  stepSeo,
  stepTranslate,
  stepWrite,
  type StepIo,
} from '@/lib/ai/pipeline/steps'
import { renderCovers } from '@/lib/ai/pipeline/cover'
import { WRITER_OPTIONS, type PipelineStep, type StepUsage } from '@/lib/ai/pipeline/shared'

export const runtime = 'nodejs'
export const maxDuration = 300
export const preferredRegion = 'sin1'
export const dynamic = 'force-dynamic'

const MAX_ARTICLE = 80_000

const articleType = z.enum(['phan_tich', 'evergreen'])
const writer = z.enum(WRITER_OPTIONS.map((o) => o.value) as [string, ...string[]])
const fact = z.object({ id: z.number().int(), text: z.string().max(2000), sourceIds: z.array(z.number().int()).max(20) })
const source = z.object({
  id: z.number().int(),
  // Chỉ http(s): nguồn sẽ thành link trong bài đăng công khai.
  url: z
    .string()
    .url()
    .max(2000)
    .refine((u) => /^https?:\/\//i.test(u), 'url phải là http(s)'),
  title: z.string().max(500).regex(/^[^\r\n]*$/, 'title một dòng'),
  quote: z.string().max(1000),
})
const research = z.object({
  facts: z.array(fact).max(40),
  sources: z.array(source).max(60),
  notes: z.string().max(3000),
  searches: z.number(),
  searchErrors: z.array(z.string()).max(20),
})
const outline = z.object({
  title_vi: z.string().max(300),
  angle: z.string().max(1000),
  sections: z
    .array(z.object({ heading: z.string().max(300), points: z.array(z.string().max(500)).max(8), factIds: z.array(z.number().int()).max(40) }))
    .max(10),
  expert_questions: z.array(z.string().max(500)).max(5),
})
const base = { topic: z.string().trim().min(3).max(300), keyword: z.string().trim().max(120).optional(), articleType }
const issue = z.object({
  code: z.string(),
  severity: z.enum(['error', 'warn']),
  label: z.string().max(200),
  samples: z.array(z.string().max(400)).max(10),
})
const review = z.object({
  codeIssues: z.array(issue).max(20),
  copied: z.array(z.string().max(400)).max(10),
  judge: z.object({
    verdict: z.enum(['dat', 'can_sua']),
    ai_voice_score: z.number(),
    summary: z.string().max(2000),
    issues: z
      .array(z.object({ type: z.string(), quote: z.string().max(1000), problem: z.string().max(1000), fix: z.string().max(1000) }))
      .max(20),
  }),
  needsRevise: z.boolean(),
})
const targetWords = z.number().int().min(600).max(3000)

const BODY = z.discriminatedUnion('step', [
  z.object({ step: z.literal('research'), input: z.object(base) }),
  z.object({ step: z.literal('outline'), input: z.object({ ...base, targetWords, research }) }),
  z.object({ step: z.literal('write'), input: z.object({ ...base, targetWords, model: writer, outline, research }) }),
  z.object({
    step: z.literal('review'),
    input: z.object({
      title_vi: z.string().max(300),
      content_vi: z.string().min(50).max(MAX_ARTICLE),
      facts: z.array(fact).max(40),
      sources: z.array(source).max(60),
    }),
  }),
  z.object({
    step: z.literal('revise'),
    input: z.object({
      model: writer,
      targetWords,
      title_vi: z.string().max(300),
      content_vi: z.string().min(50).max(MAX_ARTICLE),
      review,
      facts: z.array(fact).max(40),
      sources: z.array(source).max(60),
    }),
  }),
  z.object({
    step: z.literal('translate'),
    input: z.object({ title_vi: z.string().max(300), content_vi: z.string().min(50).max(MAX_ARTICLE) }),
  }),
  z.object({
    step: z.literal('seo'),
    input: z.object({
      keyword: z.string().trim().max(120).optional(),
      articleType,
      title_vi: z.string().max(300),
      title_en: z.string().max(300),
      content_vi: z.string().max(MAX_ARTICLE),
      content_en: z.string().max(MAX_ARTICLE),
    }),
  }),
  z.object({
    step: z.literal('cover'),
    input: z.object({
      title: z.string().trim().min(3).max(200),
      kicker: z.string().max(40),
      points: z.array(z.string().max(80)).max(3),
    }),
  }),
])

export async function POST(req: Request) {
  return sseResponse(
    async (send) => {
      // Kiểm quyền TRƯỚC khi đọc body: người lạ không được làm máy chủ parse dữ liệu lớn.
      const ctx = await loadAiContext()
      if (!ctx.ok) {
        send('error', { error: ctx.error })
        return
      }

      const parsed = BODY.safeParse(await req.json().catch(() => null))
      if (!parsed.success) {
        send('error', { error: `Dữ liệu bước không hợp lệ: ${parsed.error.issues[0]?.path.join('.') || 'body'}` })
        return
      }
      const body = parsed.data

      const startedAt = Date.now()
      let chars = 0
      let sinceTick = 0
      const io: StepIo = {
        apiKey: '',
        signal: req.signal,
        status: (message) => send('status', { message }),
        onText: (delta) => {
          chars += delta.length
          sinceTick += delta.length
          if (sinceTick >= 400) {
            send('progress', { chars })
            sinceTick = 0
          }
        },
      }

      // Bước ảnh bìa không gọi AI → không cần key.
      if (body.step === 'cover') {
        send('status', { message: 'Đang dựng ảnh bìa...' })
        const covers = await renderCovers(body.input)
        const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const variants: Array<{ key: string; label: string; url: string }> = []
        for (const c of covers) {
          const path = `cms/ai-cover/${stamp}-${c.key}.png`
          const { error } = await ctx.supabase.storage
            .from('media')
            .upload(path, c.png, { contentType: 'image/png', cacheControl: '31536000', upsert: false })
          if (error) throw new Error(`Tải ảnh bìa lên lỗi: ${error.message}`)
          variants.push({ key: c.key, label: c.label, url: ctx.supabase.storage.from('media').getPublicUrl(path).data.publicUrl })
        }
        send('done', { result: { variants }, usage: usageOf('cover', null, startedAt) })
        return
      }

      const apiKey = ctx.keyFor('anthropic')
      if (!apiKey) {
        send('error', { error: missingKeyMessage('anthropic') })
        return
      }
      io.apiKey = apiKey

      let out: { result: unknown; usage: Parameters<typeof usageOf>[1] }
      try {
        switch (body.step) {
          case 'research':
            out = await stepResearch(io, body.input)
            break
          case 'outline':
            out = await stepOutline(io, body.input)
            break
          case 'write':
            out = await stepWrite(io, { ...body.input, model: body.input.model as never })
            break
          case 'review':
            out = await stepReview(io, body.input)
            break
          case 'revise':
            out = await stepRevise(io, {
              ...body.input,
              model: body.input.model as never,
              review: body.input.review as never,
            })
            break
          case 'translate':
            out = await stepTranslate(io, body.input)
            break
          case 'seo':
            out = await stepSeo(io, body.input)
            break
        }
      } catch (err) {
        // Lỗi sau khi đã gọi AI vẫn báo chi phí đã tốn → trình duyệt cộng vào trần ngân sách.
        send('error', { error: errorMessage(err), usage: usageOf(body.step, usageOfError(err), startedAt) })
        return
      }
      send('done', { result: out.result, usage: usageOf(body.step, out.usage, startedAt) })
    },
    { heartbeatMs: 8000 }
  )
}

function usageOf(
  step: PipelineStep,
  u: { model: string; costUsd: number; inputTokens: number; outputTokens: number; webSearches: number } | null,
  startedAt: number
): StepUsage {
  return {
    step,
    model: u?.model ?? 'code',
    costUsd: u?.costUsd ?? 0,
    ms: Date.now() - startedAt,
    inputTokens: u?.inputTokens ?? 0,
    outputTokens: u?.outputTokens ?? 0,
    webSearches: u?.webSearches ?? 0,
  }
}
