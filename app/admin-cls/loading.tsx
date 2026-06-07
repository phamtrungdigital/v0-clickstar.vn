// Skeleton hiển thị TỨC THÌ khi chuyển tab trong /admin-cls (Next.js loading.tsx),
// thay vì màn trắng/đứng hình chờ Server Component await data (các trang admin đều
// force-dynamic). Render bên trong <main> của AdminShell (sidebar + header persist ở
// layout) nên chỉ cần skeleton vùng nội dung. Đa số trang admin là bảng/danh sách.
export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Tiêu đề trang + nút hành động */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-md bg-slate-200" />
          <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
        </div>
        <div className="h-9 w-28 rounded-md bg-slate-200" />
      </div>

      {/* Thanh tìm kiếm / lọc */}
      <div className="flex gap-2">
        <div className="h-10 w-full max-w-sm rounded-md bg-slate-100" />
        <div className="h-10 w-24 rounded-md bg-slate-100" />
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="h-11 border-b border-slate-200 bg-slate-100" />
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex h-14 items-center gap-4 px-4">
              <div className="h-9 w-9 flex-shrink-0 rounded-full bg-slate-200" />
              <div className="h-4 w-full max-w-[220px] rounded bg-slate-100" />
              <div className="hidden h-4 w-24 rounded bg-slate-100 sm:block" />
              <div className="hidden h-4 w-20 rounded bg-slate-100 md:block" />
              <div className="ml-auto h-7 w-16 rounded-md bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
