import Image from 'next/image'
import { LoginForm } from './login-form'
import { LoginArt } from './login-art'

export const metadata = {
  title: 'Sign in | Click Star Admin',
}

/** Chỉ hiện các thông báo cố định: không in lại chuỗi tùy ý từ đường dẫn (tránh giả mạo thông báo qua URL). */
const MESSAGES: Record<string, string> = {
  invalid: 'Incorrect email or password.',
  not_admin: "This account doesn't have admin access.",
  rate_limited: 'Too many attempts. Please wait a few minutes and try again.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const params = await searchParams
  const error = params.error ? MESSAGES[params.error] || 'Sign-in failed. Please try again.' : ''
  // Chỉ cho quay lại trong khu quản trị (không chuyển hướng ra ngoài site).
  const wanted = params.redirect || ''
  const redirectTo = wanted.startsWith('/admin-cls') && !wanted.startsWith('//') ? wanted : '/admin-cls'

  return (
    <div lang="en" className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] bg-white">
      <aside className="relative hidden lg:flex flex-col overflow-hidden bg-[#08090b] text-white px-12 py-10">
        <LoginArt className="pointer-events-none absolute -right-10 top-20 h-[320px] w-[320px] xl:h-[360px] xl:w-[360px]" />

        <div className="relative z-10 flex items-center gap-3">
          <Image src="/images/logo-clickstar.png" alt="Click Star" width={160} height={32} className="h-7 w-auto" priority />
          <span className="text-[10px] font-medium tracking-[0.1em] px-1.5 py-0.5 rounded-md border border-orange-400/35 text-orange-400">ADMIN</span>
        </div>

        <div className="relative z-10 mt-auto max-w-[500px]">
          <p className="mb-4 text-[11px] font-medium tracking-[0.16em] text-orange-400">AI-POWERED DIGITAL GROWTH</p>
          <h1 className="max-w-[400px] text-[34px] font-medium leading-[1.12] tracking-[-0.022em]">
            Where data, marketing and <span className="text-[#6aa9ff]">AI</span> work as one.
          </h1>
          <p className="mt-4 max-w-[400px] text-[15px] leading-relaxed text-zinc-400">
            The control center for clickstar.vn: content, SEO, leads and the AI products we build for business.
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-y-1.5 border-t border-zinc-800 pt-5 text-[12.5px] text-zinc-300">
            {['Speech Insight AI', 'ADS hub', 'Click Star AI', 'CRM and automation'].map((name, i) => (
              <li key={name} className="flex items-center">
                {i > 0 && <span className="mx-2.5 h-[3px] w-[3px] rounded-full bg-zinc-600" aria-hidden="true" />}
                {name}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 mt-6 text-xs text-zinc-500">Authorized users only</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <span className="rounded-md bg-zinc-950 px-3 py-2">
              <Image src="/images/logo-clickstar.png" alt="Click Star" width={140} height={28} className="h-6 w-auto" priority />
            </span>
            <span className="text-[10px] font-medium tracking-[0.08em] px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700">ADMIN</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h2>
          <p className="mt-1.5 mb-7 text-sm text-slate-500">Use your administrator account to continue.</p>

          <LoginForm redirectTo={redirectTo} error={error} />

          <p className="mt-6 text-xs leading-relaxed text-slate-400">
            Only accounts with admin access can sign in. If you forgot your password, contact a site administrator to reset it.
          </p>
        </div>
      </main>
    </div>
  )
}
