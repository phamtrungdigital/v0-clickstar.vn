// Gọi 1 bước của /api/admin/ai/pipeline từ trình duyệt và đọc luồng SSE.
import type { PipelineStep, StepUsage } from './shared'

export type StepEvent =
  | { type: 'status'; message: string }
  | { type: 'progress'; chars: number }
  | { type: 'pulse'; elapsedSec: number }

export async function runPipelineStep<T>(
  step: PipelineStep,
  input: unknown,
  opts: { signal?: AbortSignal; onEvent?: (e: StepEvent) => void } = {}
): Promise<{ result: T; usage: StepUsage }> {
  const res = await fetch('/api/admin/ai/pipeline', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ step, input }),
    signal: opts.signal,
  })
  if (!res.ok || !res.body) throw new Error(`Máy chủ trả lỗi ${res.status}`)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const chunks = buf.split('\n\n')
    buf = chunks.pop() ?? ''
    for (const chunk of chunks) {
      const line = chunk.split('\n').find((l) => l.startsWith('data: '))
      if (!line) continue
      let data: Record<string, unknown>
      try {
        data = JSON.parse(line.slice(6))
      } catch {
        continue
      }
      if (data.type === 'done') return { result: data.result as T, usage: data.usage as StepUsage }
      if (data.type === 'error') {
        const err = new Error(String(data.error || 'Bước bị lỗi')) as Error & { usage?: StepUsage }
        if (data.usage) err.usage = data.usage as StepUsage
        throw err
      }
      if (data.type === 'status' || data.type === 'progress' || data.type === 'pulse') {
        opts.onEvent?.(data as unknown as StepEvent)
      }
    }
  }
  throw new Error('Kết nối bị ngắt trước khi bước chạy xong. Bấm "Chạy tiếp" để chạy lại bước này.')
}
