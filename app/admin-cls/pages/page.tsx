import Link from 'next/link'
import { Pencil, ExternalLink, FileText } from 'lucide-react'
import { listPagesForAdmin } from '@/lib/cms/queries'
import { Card, Chip, EmptyState, PageHeader, btn } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function AdminPagesList() {
  const pages = await listPagesForAdmin()

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Quản lý trang"
        description="Chỉnh nội dung từng trang của website. Bấm Sửa để chỉnh từng khối nội dung, kéo thả để đổi thứ tự."
      />

      {pages.length === 0 ? (
        <Card>
          <EmptyState icon={<FileText className="h-5 w-5" />} title="Chưa có trang nào trong CMS" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[var(--ad-line)] text-left">
                  <th className="px-5 py-3">Trang</th>
                  <th className="px-3 py-3">Đường dẫn</th>
                  <th className="px-3 py-3">Số khối</th>
                  <th className="px-3 py-3">Trạng thái</th>
                  <th className="px-3 py-3">Cập nhật</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => {
                  const publicHref = page.slug === 'home' ? '/' : `/${page.slug}`
                  return (
                    <tr key={page.id} className="border-t border-[var(--ad-line)] first:border-t-0">
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin-cls/pages/${page.slug.replace(/\//g, '__')}/edit`}
                          className="flex items-center gap-2.5 text-[14.5px] font-medium text-[var(--ad-fg)] hover:text-[var(--ad-accent)]"
                        >
                          <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[var(--ad-fill)] text-[var(--ad-fg-3)]">
                            <FileText className="h-4 w-4" />
                          </span>
                          {page.title}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-[var(--ad-fg-3)]">/{page.slug === 'home' ? '' : page.slug}</td>
                      <td className="px-3 py-3 text-[13px] tabular-nums text-[var(--ad-fg-2)]">{page.sections.length}</td>
                      <td className="px-3 py-3">
                        <Chip tone={page.is_published ? 'ok' : 'neutral'}>{page.is_published ? 'Đã đăng' : 'Bản nháp'}</Chip>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[var(--ad-fg-3)]">
                        {new Date(page.updated_at).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={publicHref}
                            target="_blank"
                            className="grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] hover:bg-[var(--ad-fill)] hover:text-[var(--ad-fg)]"
                            title="Xem trang trên website"
                            aria-label="Xem trang trên website"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <Link href={`/admin-cls/pages/${page.slug.replace(/\//g, '__')}/edit`} className={btn('secondary', 'sm')}>
                            <Pencil className="h-3.5 w-3.5" />
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
        </Card>
      )}
    </div>
  )
}
