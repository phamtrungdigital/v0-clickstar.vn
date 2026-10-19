'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { login } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-11 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-wait text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

/** Biểu mẫu đăng nhập admin (tiếng Anh): kiểm tra ô trống ngay trên trình duyệt, hiện/ẩn mật khẩu, trạng thái đang gửi. */
export function LoginForm({ redirectTo, error }: { redirectTo: string; error: string }) {
  const [show, setShow] = useState(false)
  const [errs, setErrs] = useState<{ email?: string; password?: string }>({})

  return (
    <form
      action={login}
      noValidate
      onSubmit={(e) => {
        const f = new FormData(e.currentTarget)
        const next: { email?: string; password?: string } = {}
        if (!String(f.get('email') || '').trim()) next.email = 'Enter your email address.'
        if (!String(f.get('password') || '')) next.password = 'Enter your password.'
        setErrs(next)
        if (next.email || next.password) e.preventDefault()
      }}
      className="space-y-4"
    >
      <input type="hidden" name="redirect" value={redirectTo} />

      {error && (
        <div role="alert" className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
          <AlertCircle className="w-4 h-4 mt-px shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-[13px] font-medium text-slate-700 mb-1.5">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          <input
            id="email"
            type="email"
            name="email"
            autoFocus
            autoComplete="email"
            placeholder="name@clickstar.vn"
            aria-invalid={!!errs.email}
            onChange={() => errs.email && setErrs((p) => ({ ...p, email: undefined }))}
            className="w-full h-11 pl-10 pr-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 aria-[invalid=true]:border-red-400"
          />
        </div>
        {errs.email && <p className="mt-1 text-xs text-red-600">{errs.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-[13px] font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          <input
            id="password"
            type={show ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!errs.password}
            onChange={() => errs.password && setErrs((p) => ({ ...p, password: undefined }))}
            className="w-full h-11 pl-10 pr-11 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 aria-[invalid=true]:border-red-400"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
          >
            {show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        </div>
        {errs.password && <p className="mt-1 text-xs text-red-600">{errs.password}</p>}
      </div>

      <SubmitButton />
    </form>
  )
}
