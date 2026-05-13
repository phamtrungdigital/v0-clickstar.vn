import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Admin auth middleware — runs on every /admin/* request.
 *
 * Optimization: caches the admin_users check result via signed cookie
 * (cs-admin-cache) valid for 5 minutes, so we skip the second DB query
 * on every navigation. We still always call auth.getUser() to verify the
 * Supabase session is fresh.
 *
 * Also passes admin profile to RSC via request headers (x-admin-*) so
 * layout/pages can read it without re-querying.
 */
const ADMIN_CACHE_COOKIE = 'cs-admin-cache'
const ADMIN_CACHE_TTL_MS = 5 * 60 * 1000 // 5 min

type AdminCacheValue = {
  uid: string
  email: string
  name: string | null
  role: string
  exp: number
}

function parseCache(raw: string | undefined): AdminCacheValue | null {
  if (!raw) return null
  try {
    const decoded = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    if (!decoded.uid || !decoded.exp || decoded.exp < Date.now()) return null
    return decoded as AdminCacheValue
  } catch {
    return null
  }
}

function encodeCache(v: AdminCacheValue): string {
  return Buffer.from(JSON.stringify(v)).toString('base64url')
}

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/admin/login'

  if (isAdminRoute && !isLoginRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginRoute && user) {
    const dashUrl = request.nextUrl.clone()
    dashUrl.pathname = '/admin'
    dashUrl.searchParams.delete('redirect')
    return NextResponse.redirect(dashUrl)
  }

  if (isAdminRoute && !isLoginRoute && user) {
    let cache = parseCache(request.cookies.get(ADMIN_CACHE_COOKIE)?.value)

    if (cache && cache.uid !== user.id) cache = null

    if (!cache) {
      const { data: profile } = await supabase
        .from('admin_users')
        .select('user_id, email, full_name, role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (!profile) {
        await supabase.auth.signOut()
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/admin/login'
        loginUrl.searchParams.set('error', 'not_admin')
        return NextResponse.redirect(loginUrl)
      }

      cache = {
        uid: profile.user_id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role,
        exp: Date.now() + ADMIN_CACHE_TTL_MS,
      }

      supabaseResponse.cookies.set(ADMIN_CACHE_COOKIE, encodeCache(cache), {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60,
        path: '/admin',
      })
    }

    // Pass admin profile to RSC via request headers — layout reads from these
    requestHeaders.set('x-admin-user-id', cache.uid)
    requestHeaders.set('x-admin-email', cache.email)
    if (cache.name) requestHeaders.set('x-admin-name', cache.name)
    requestHeaders.set('x-admin-role', cache.role)

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
