import Image from 'next/image'
import { FileText, LineChart, Target } from 'lucide-react'
import { LoginForm } from './login-form'

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
      <aside className="hidden lg:flex flex-col bg-zinc-950 text-white p-12">
        <div className="flex items-center gap-3">
          <Image src="/images/logo-clickstar.png" alt="Click Star" width={160} height={32} className="h-8 w-auto" priority />
          <span className="text-[10px] font-medium tracking-[0.08em] px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400">ADMIN</span>
        </div>

        <div className="my-auto max-w-md">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">Website management console</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
            Manage content, SEO and leads for clickstar.vn in one place.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-zinc-300">
            <li className="flex items-center gap-3">
              <FileText className="w-[18px] h-[18px] text-orange-400" /> Pages, posts, projects and team
            </li>
            <li className="flex items-center gap-3">
              <LineChart className="w-[18px] h-[18px] text-orange-400" /> SEO and AI search roadmap
            </li>
            <li className="flex items-center gap-3">
              <Target className="w-[18px] h-[18px] text-orange-400" /> Leads from forms and chatbot
            </li>
          </ul>
        </div>

        <p className="text-xs text-zinc-500">Internal area. Authorized users only.</p>
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
