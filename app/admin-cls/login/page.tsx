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
    <div lang="en" className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-white">
      <aside className="relative hidden lg:flex flex-col overflow-hidden bg-[#08090b] text-white px-12 xl:px-16 2xl:px-24 py-10 xl:py-12">
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/images/logo-clickstar.png" alt="Click Star" width={160} height={32} className="h-7 xl:h-8 w-auto" priority />
          <span className="text-[10px] xl:text-[11px] font-medium tracking-[0.1em] px-1.5 py-0.5 rounded-md border border-orange-400/35 text-orange-400">ADMIN</span>
        </div>

        <div className="relative flex-1 flex items-center justify-center py-6">
          <LoginArt className="pointer-events-none w-[clamp(260px,26vw,440px)] h-auto" />
        </div>

        <div className="relative z-10 max-w-[520px] 2xl:max-w-[600px]">
          <p className="mb-4 text-[11px] xl:text-xs font-medium tracking-[0.16em] text-orange-400">AI-POWERED DIGITAL GROWTH</p>
          <h1 className="text-[34px] xl:text-[42px] 2xl:text-5xl font-medium leading-[1.1] tracking-[-0.025em]">
            Where data, marketing and <span className="text-[#6aa9ff]">AI</span> work as one.
          </h1>
          <p className="mt-5 max-w-[460px] 2xl:max-w-[520px] text-[15px] xl:text-base 2xl:text-lg leading-relaxed text-zinc-400">
            The control center for clickstar.vn: content, SEO, leads and the AI products we build for business.
          </p>
          <ul className="mt-8 xl:mt-10 flex flex-wrap items-center gap-y-1.5 border-t border-zinc-800 pt-5 xl:pt-6 text-[13px] xl:text-sm text-zinc-300">
            {['Speech Insight AI', 'ADS hub', 'Click Star AI', 'CRM and automation'].map((name, i) => (
              <li key={name} className="flex items-center">
                {i > 0 && <span className="mx-3 xl:mx-4 h-[3px] w-[3px] rounded-full bg-zinc-600" aria-hidden="true" />}
                {name}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="relative flex flex-col bg-white px-6">
        <div className="flex items-center justify-between pt-6 lg:pt-8 lg:px-6 xl:px-12">
          <span className="lg:hidden flex items-center gap-3">
            <span className="rounded-md bg-zinc-950 px-3 py-2">
              <Image src="/images/logo-clickstar.png" alt="Click Star" width={140} height={28} className="h-6 w-auto" priority />
            </span>
            <span className="text-[10px] font-medium tracking-[0.08em] px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700">ADMIN</span>
          </span>
          <a href="/" className="ml-auto text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Back to website <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-[400px] xl:max-w-[440px]">
            <h2 className="text-[26px] xl:text-[32px] font-semibold tracking-tight text-slate-900">Sign in</h2>
            <p className="mt-2 mb-8 xl:mb-10 text-[15px] xl:text-base text-slate-500">Use your administrator account to continue.</p>

            <LoginForm redirectTo={redirectTo} error={error} />

            <p className="mt-7 text-xs xl:text-[13px] leading-relaxed text-slate-400">
              Only accounts with admin access can sign in. If you forgot your password, contact a site administrator to reset it.
            </p>
          </div>
        </div>

        <p className="pb-6 lg:pb-8 text-center text-xs text-slate-400">© 2026 Click Star. All rights reserved.</p>
      </main>
    </div>
  )
}
