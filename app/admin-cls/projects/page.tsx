import Link from 'next/link'
import { Plus, Briefcase } from 'lucide-react'
import { listCaseStudiesForAdmin } from '@/lib/cms/case-studies'
import { Card, EmptyState, PageHeader, btn } from '@/components/admin/ui'
import { ProjectsTable } from './_components/projects-table'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsList() {
  const projects = await listCaseStudiesForAdmin()

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Dự án"
        description={`Các dự án tiêu biểu hiển thị ở trang /projects, hiện có ${projects.length} dự án.`}
        actions={
          <Link href="/admin-cls/projects/new" className={btn('primary')}>
            <Plus className="h-4 w-4" />
            Thêm dự án
          </Link>
        }
      />

      {projects.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="Chưa có dự án nào"
            description="Dự án đầu tiên sẽ hiện ở đây sau khi anh tạo."
            action={
              <Link href="/admin-cls/projects/new" className={btn('primary')}>
                <Plus className="h-4 w-4" />
                Tạo dự án đầu tiên
              </Link>
            }
          />
        </Card>
      ) : (
        <ProjectsTable items={projects} />
      )}
    </div>
  )
}
