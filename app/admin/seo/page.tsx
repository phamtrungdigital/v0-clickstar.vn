import Link from 'next/link'
import { Search, Edit, CheckCircle2, AlertCircle } from 'lucide-react'
import { listPagesForAdmin } from '@/lib/cms/queries'

export const dynamic = 'force-dynamic'

export default async function AdminSEOPage() {
  const pages = await listPagesForAdmin()

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">SEO</h1>
        <p className="text-xs text-slate-500">
          Quản lý meta title, description, OG image của từng trang.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
              <th className="px-4 py-2.5">Trang</th>
              <th className="px-4 py-2.5">Meta Title</th>
              <th className="px-4 py-2.5">Meta Description</th>
              <th className="px-4 py-2.5">OG Image</th>
              <th className="px-4 py-2.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {pages.map((p) => {
              const hasTitle = !!p.seo_title?.vi
              const hasDesc = !!p.seo_description?.vi
              const hasOg = !!p.og_image
              return (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">{p.title}</div>
                    <div className="text-[10px] font-mono text-slate-500">/{p.slug === 'home' ? '' : p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <SeoStatus ok={hasTitle} text={p.seo_title?.vi} />
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <SeoStatus ok={hasDesc} text={p.seo_description?.vi} />
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {hasOg ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Có
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        <AlertCircle className="w-3 h-3" />
                        Chưa
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/pages/${p.slug}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
                    >
                      <Edit className="w-3 h-3" />
                      Edit SEO
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500">
        <Search className="w-3 h-3 inline mr-1" />
        SEO mỗi trang được set trong{' '}
        <span className="font-mono text-[10px]">/admin/pages/[slug]/edit</span> → mục SEO ở cuối form.
      </p>
    </div>
  )
}

function SeoStatus({ ok, text }: { ok: boolean; text?: string | null }) {
  if (!ok) {
    return (
      <span className="inline-flex items-center gap-1 text-amber-600">
        <AlertCircle className="w-3 h-3" />
        Chưa set
      </span>
    )
  }
  return <span className="text-slate-600 dark:text-slate-300 truncate block max-w-[200px]" title={text || undefined}>{text}</span>
}
