import { login } from './actions'

export const metadata = {
  title: 'Đăng nhập Admin — ClickStar',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const params = await searchParams
  const errorRaw = params.error || ''
  const error =
    errorRaw === 'not_admin'
      ? 'Tài khoản này chưa được cấp quyền admin.'
      : errorRaw
  const redirectTo = params.redirect || '/admin-cls'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-3">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">ClickStar Admin</h1>
          <p className="text-xs text-slate-500 mt-1">Đăng nhập để quản trị</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
            {error}
          </div>
        )}

        <form action={login} className="space-y-3">
          <input type="hidden" name="redirect" value={redirectTo} />
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="email@clickstar.vn"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white text-sm font-medium py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-5">
          Chỉ tài khoản đã được cấp quyền admin mới đăng nhập được.
        </p>
      </div>
    </div>
  )
}
