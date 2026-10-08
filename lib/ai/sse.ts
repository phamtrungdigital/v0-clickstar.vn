// Khung SSE dùng chung cho các API AI chạy lâu. Server-only.
// - Gửi sự kiện dạng `data: {"type": ..., ...}\n\n` (client đọc theo `type`).
// - Nhịp `pulse` định kỳ: model 5.x suy nghĩ trước khi ra chữ, có thể im lặng vài chục
//   giây → giữ kết nối sống để trình duyệt/proxy không cắt.
// - Lỗi ném ra trong `run` → sự kiện `error`; luôn đóng stream đúng 1 lần.

export type SseSend = (type: string, payload?: Record<string, unknown>) => void

export function errorMessage(err: unknown, fallback = 'Có lỗi xảy ra'): string {
  if (err instanceof Error && err.message) return err.message
  if (typeof err === 'string' && err) return err
  return fallback
}

export function sseResponse(
  run: (send: SseSend) => Promise<void>,
  opts: { heartbeatMs?: number } = {}
): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false
      const send: SseSend = (type, payload = {}) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, ...payload })}\n\n`))
        } catch {
          closed = true
        }
      }
      const startedAt = Date.now()
      const heartbeat =
        opts.heartbeatMs && opts.heartbeatMs > 0
          ? setInterval(
              () => send('pulse', { elapsedSec: Math.round((Date.now() - startedAt) / 1000) }),
              opts.heartbeatMs
            )
          : null
      try {
        await run(send)
      } catch (err) {
        send('error', { error: errorMessage(err) })
      } finally {
        if (heartbeat) clearInterval(heartbeat)
        closed = true
        try {
          controller.close()
        } catch {}
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
