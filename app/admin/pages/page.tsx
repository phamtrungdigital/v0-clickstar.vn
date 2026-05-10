import Link from 'next/link'
import { Edit, ExternalLink, FileText, Globe } from 'lucide-react'
import { listPagesForAdmin } from '@/lib/cms/queries'

export const dynamic = 'force-dynamic'

export default async function AdminPagesList() {
  const pages = await listPagesForAdmin()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Quản lý trang</h1>
          <p className="text-xs text-slate-500">Chỉnh sửa nội dung từng trang trong CMS</p>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Chưa có trang nào trong CMS</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
                <th className="px-4 py-2.5">Trang</th>
                <th className="px-4 py-2.5">Slug</th>
                <th className="px-4 py-2.5">Sections</th>
                <th className="px-4 py-2.5">Trạng thái</th>
                <th className="px-4 py-2.5">Cập nhật</th>
                <th className="px-4 py-2.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {pages.map((page) => {
                const publicHref = page.slug === 'home' ? '/' : `/${page.slug}`
                return (
                  <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {page.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{page.slug}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                      {page.sections.length}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          page.is_published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(page.updated_at).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={publicHref}
                          target="_blank"
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                          title="Xem trang"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                        <Link
                          href={`/admin/pages/${page.slug}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
                        >
                          <Edit className="w-3 h-3" />
                          Sửa
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-[11px] text-slate-500 px-1">
        <Globe className="w-3 h-3 inline mr-1" />
        Phase 2A.1: 4 section types được edit (Hero, Services, About, CTA). Các section khác sẽ được migrate ở phase tiếp.
      </div>
    </div>
  )
}
