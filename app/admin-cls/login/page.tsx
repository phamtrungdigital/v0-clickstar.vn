import Image from 'next/image'
import { getSiteSettings } from '@/lib/cms/settings'
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

/** Logo cho nền sáng lấy từ Cài đặt (giống thanh trên của khu quản trị); lỗi hoặc chưa đặt thì dùng ảnh mặc định trên nền tối. */
async function loadLogoUrl(): Promise<string | null> {
  try {
    const settings = await getSiteSettings()
    return settings?.logo_url || null
  } catch {
    return null
  }
}

function Logo({ url, className }: { url: string | null; className: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="Click Star" className={className} />
  }
  return (
    <span className="rounded-lg bg-[#1d1d1f] px-3 py-2">
      <Image src="/images/logo-clickstar.png" alt="Click Star" width={140} height={28} className="h-5 w-auto" priority />
    </span>
  )
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
  const logoUrl = await loadLogoUrl()

  return (
    <div lang="en" className="grid h-dvh min-h-[600px] bg-[var(--ad-surface)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col overflow-hidden bg-[var(--ad-bg)] px-12 py-8 lg:flex xl:px-16 2xl:px-20">
        <div className="relative z-10 flex items-center gap-3">
          <Logo url={logoUrl} className="h-7 w-auto" />
          <span className="rounded-full bg-[var(--ad-accent-soft)] px-2.5 py-0.5 text-[11px] font-medium tracking-[0.08em] text-[var(--ad-accent)]">ADMIN</span>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
          <LoginArt className="pointer-events-none aspect-square h-[min(100%,340px)] w-auto" />
        </div>

        <div className="relative z-10 max-w-[480px]">
          <p className="mb-3 text-[12px] font-medium tracking-[0.14em] text-[var(--ad-accent)]">AI-POWERED DIGITAL GROWTH</p>
          <h1 className="text-balance text-[30px] font-semibold leading-[1.18] tracking-[-0.025em] text-[var(--ad-fg)] xl:text-[38px]">
            Where data, marketing and <span className="text-[var(--ad-accent)]">AI</span> work as one.
          </h1>
          <p className="mt-3 max-w-[440px] text-sm leading-relaxed text-[var(--ad-fg-2)] xl:text-[15px]">
            The control center for clickstar.vn: content, SEO, leads and the AI products we build for business.
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-y-1.5 border-t border-[var(--ad-line-2)] pt-4 text-[13px] text-[var(--ad-fg-2)]">
            {['Speech Insight AI', 'ADS hub', 'Click Star AI', 'CRM and automation'].map((name, i) => (
              <li key={name} className="flex items-center">
                {i > 0 && <span className="mx-3 h-[3px] w-[3px] rounded-full bg-[var(--ad-fg-3)]" aria-hidden="true" />}
                {name}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="relative flex flex-col bg-[var(--ad-surface)] px-6">
        <div className="flex items-center justify-between pt-6 lg:px-6 lg:pt-7 xl:px-10">
          <span className="flex items-center gap-3 lg:hidden">
            <Logo url={logoUrl} className="h-6 w-auto" />
            <span className="hidden rounded-full bg-[var(--ad-accent-soft)] px-2.5 py-0.5 text-[11px] font-medium tracking-[0.08em] text-[var(--ad-accent)] min-[420px]:inline">ADMIN</span>
          </span>
          <a href="/" className="ml-auto whitespace-nowrap text-sm text-[var(--ad-fg-3)] transition-colors hover:text-[var(--ad-fg)]">
            Back to website <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div className="w-full max-w-[400px]">
            <h2 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ad-fg)] xl:text-[32px]">Sign in</h2>
            <p className="mb-7 mt-1.5 text-sm text-[var(--ad-fg-3)] xl:text-[15px]">Use your administrator account to continue.</p>

            <LoginForm redirectTo={redirectTo} error={error} />

            <p className="mt-5 text-[12.5px] leading-relaxed text-[var(--ad-fg-3)]">
              Only accounts with admin access can sign in. If you forgot your password, contact a site administrator to reset it.
            </p>
          </div>
        </div>

        <p className="pb-5 text-center text-xs text-[var(--ad-fg-3)] lg:pb-6">© 2026 Click Star. All rights reserved.</p>
      </main>
    </div>
  )
}
