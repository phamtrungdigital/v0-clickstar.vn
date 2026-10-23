// Ảnh tải lên (trang quản trị) được phục vụ qua địa chỉ của chính website: /media/cms/xxx.jpg.
// Địa chỉ nhà cung cấp lưu trữ không xuất hiện trong HTML, sitemap hay JSON-LD (xem lib/media-url.ts).
// Tên tệp có sẵn dấu thời gian + chuỗi ngẫu nhiên nên không bao giờ ghi đè: cache một năm là an toàn.

export const runtime = 'nodejs'

const UPSTREAM = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
const SEGMENT = /^[A-Za-z0-9._~-]{1,200}$/

const NOT_FOUND = () =>
  new Response('Not found', {
    status: 404,
    headers: { 'cache-control': 'public, max-age=60, s-maxage=60', 'content-type': 'text/plain; charset=utf-8' },
  })

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  if (!UPSTREAM || !Array.isArray(path) || path.length === 0 || path.length > 4) return NOT_FOUND()
  for (const seg of path) if (!SEGMENT.test(seg) || seg === '.' || seg === '..') return NOT_FOUND()

  let up: Response
  try {
    up = await fetch(`${UPSTREAM}/storage/v1/object/public/media/${path.join('/')}`, { cache: 'no-store' })
  } catch {
    return new Response('Bad gateway', { status: 502, headers: { 'cache-control': 'no-store' } })
  }
  if (!up.ok || !up.body) return NOT_FOUND()

  const type = up.headers.get('content-type') || 'application/octet-stream'
  const headers = new Headers({
    'content-type': /^text\/html|^application\/(xhtml|xml)/i.test(type) ? 'application/octet-stream' : type,
    'cache-control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    'x-content-type-options': 'nosniff',
  })
  const len = up.headers.get('content-length')
  if (len) headers.set('content-length', len)
  return new Response(up.body, { status: 200, headers })
}
