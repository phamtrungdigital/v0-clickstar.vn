import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Trang chi tiết bài viết và dự án (cả bản /en). Trang dựng theo kiểu truyền dần (có màn chờ loading.tsx) nên mã
// trạng thái 200 đã gửi đi trước khi notFound() chạy. Muốn bài hoặc dự án không có thật trả 404 thật thì phải
// biết trước khi dựng trang: kiểm một dòng trong DB ngay ở đây.
const DETAIL_ROUTE = /^\/(?:en\/)?(blog|projects)\/([^/]+)\/?$/

/** true: có và đang xuất bản; false: chắc chắn không có; null: không kiểm được (lỗi mạng, DB chậm) nên cứ cho qua. */
async function publishedSlugExists(kind: string, rawSlug: string): Promise<boolean | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!base || !key) return null
  let slug: string
  try {
    slug = decodeURIComponent(rawSlug)
  } catch {
    return false
  }
  const table = kind === 'blog' ? 'posts' : 'case_studies'
  const url = `${base}/rest/v1/${table}?select=id&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`
  try {
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(2500),
    })
    if (!res.ok) return null
    const rows: unknown = await res.json()
    return Array.isArray(rows) && rows.length > 0
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin-cls')) return await updateSession(request)

  const match = DETAIL_ROUTE.exec(pathname)
  if (match) {
    const exists = await publishedSlugExists(match[1], match[2])
    if (exists === false) {
      return NextResponse.rewrite(new URL('/trang-khong-ton-tai', request.url), { status: 404 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin-cls/:path*', '/blog/:slug', '/en/blog/:slug', '/projects/:slug', '/en/projects/:slug'],
}
