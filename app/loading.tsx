// Skeleton hiển thị NGAY khi điều hướng giữa các trang công khai (force-dynamic),
// thay vì màn trắng chờ server render → cảm giác chuyển tab nhanh hơn (PC + mobile).
// Admin có loading.tsx riêng nên không bị ảnh hưởng.
export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse" aria-hidden="true">
      {/* Nav placeholder */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-7 w-32 rounded bg-slate-200" />
        <div className="hidden md:flex items-center gap-6">
          <div className="h-4 w-16 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
        </div>
        <div className="h-9 w-28 rounded-full bg-slate-200" />
      </div>

      {/* Hero placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="h-6 w-40 rounded-full bg-slate-200" />
            <div className="h-12 w-full max-w-lg rounded-lg bg-slate-200" />
            <div className="h-12 w-3/4 max-w-md rounded-lg bg-slate-200" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full max-w-md rounded bg-slate-100" />
              <div className="h-4 w-5/6 max-w-sm rounded bg-slate-100" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-44 rounded-full bg-slate-200" />
              <div className="h-12 w-36 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-[4/3] w-full rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Cards row placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-slate-200" />
              <div className="h-5 w-2/3 rounded bg-slate-200" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-5/6 rounded bg-slate-100" />
                <div className="h-3 w-4/6 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
