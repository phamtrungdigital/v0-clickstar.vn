import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  ADMIN_CACHE_COOKIE,
  ADMIN_CACHE_TTL_MS,
  ADMIN_TOKEN_HEADER,
  signAdminToken,
  verifyAdminToken,
  type AdminCacheValue,
} from '@/lib/admin-cls/admin-token'

/**
 * Admin auth middleware — runs on every /admin-cls/* request.
 *
 * Optimization: caches the admin_users check result in an HMAC-signed cookie
 * (cs-admin-cache, see lib/admin-cls/admin-token.ts) valid for 5 minutes, so
 * we skip the second DB query on every navigation. Bad/missing signature →
 * DB lookup + re-issue. Session freshness is verified LOCALLY via
 * auth.getClaims() (asymmetric ES256 JWT, WebCrypto) — no Auth-server
 * round-trip per request; getClaims still refreshes/rotates the cookie
 * when the token has expired.
 *
 * Passes the same signed token to RSC via the x-admin-token request header;
 * getAdminProfile() re-verifies it (never trusts plain x-admin-* headers).
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
  maxAge: 60 * 60,
  path: '/admin-cls',
} as const

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  // Client không được tự gửi header x-admin-* (giả hồ sơ admin) — xoá trước khi
  // tạo NextResponse.next() vì danh sách header được chốt lúc khởi tạo.
  for (const key of [...requestHeaders.keys()]) {
    if (key.toLowerCase().startsWith('x-admin-')) requestHeaders.delete(key)
  }

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getClaims() thay getUser(): JWT bất đối xứng (ES256) verify CỤC BỘ qua WebCrypto +
  // JWKS cache → KHÔNG round-trip Auth server mỗi request /admin-cls/*. Vẫn refresh &
  // rotate cookie khi token hết hạn (getClaims -> getSession). Admin check + RLS giữ nguyên.
  const { data: claimsData } = await supabase.auth.getClaims()
  const user = claimsData?.claims ? { id: claimsData.claims.sub } : null

  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin-cls')
  const isLoginRoute = pathname === '/admin-cls/login'

  if (isAdminRoute && !isLoginRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin-cls/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginRoute && user) {
    const dashUrl = request.nextUrl.clone()
    dashUrl.pathname = '/admin-cls'
    dashUrl.searchParams.delete('redirect')
    return NextResponse.redirect(dashUrl)
  }

  if (isAdminRoute && !isLoginRoute && user) {
    // Cookie chỉ được tin khi đúng chữ ký, còn hạn và đúng người đang đăng nhập.
    const rawCache = request.cookies.get(ADMIN_CACHE_COOKIE)?.value
    const cached = verifyAdminToken(rawCache)
    let token = cached && cached.uid === user.id ? rawCache! : null

    if (!token) {
      const { data: profile } = await supabase
        .from('admin_users')
        .select('user_id, email, full_name, role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (!profile) {
        await supabase.auth.signOut()
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/admin-cls/login'
        loginUrl.searchParams.set('error', 'not_admin')
        return NextResponse.redirect(loginUrl)
      }

      const fresh: AdminCacheValue = {
        uid: profile.user_id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role,
        exp: Date.now() + ADMIN_CACHE_TTL_MS,
      }
      token = signAdminToken(fresh)

      if (token) {
        supabaseResponse.cookies.set(ADMIN_CACHE_COOKIE, token, COOKIE_OPTIONS)
      } else if (rawCache) {
        // Chưa có ADMIN_CACHE_SECRET: không phát cookie mới, xoá cookie cũ/giả.
        supabaseResponse.cookies.set(ADMIN_CACHE_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 })
      }
    }

    // Pass the signed token to RSC — getAdminProfile() verifies it again.
    // Token is base64url (ASCII) so Vietnamese full_name is safe in headers.
    // No token (secret missing) → getAdminProfile falls back to the RPC.
    if (token) requestHeaders.set(ADMIN_TOKEN_HEADER, token)

    const finalResponse = NextResponse.next({
      request: { headers: requestHeaders },
    })
    supabaseResponse.cookies.getAll().forEach((c) => {
      finalResponse.cookies.set(c)
    })
    return finalResponse
  }

  return supabaseResponse
}
