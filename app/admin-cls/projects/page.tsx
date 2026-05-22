import Link from 'next/link'
import { Plus, Briefcase } from 'lucide-react'
import { listCaseStudiesForAdmin } from '@/lib/cms/case-studies'
import { ProjectsTable } from './_components/projects-table'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsList() {
  const projects = await listCaseStudiesForAdmin()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Dự án</h1>
          <p className="text-xs text-slate-500">Quản lý case studies hiển thị tại /projects ({projects.length})</p>
        </div>
        <Link
          href="/admin-cls/projects/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm dự án
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 mb-3">Chưa có dự án nào</p>
          <Link
            href="/admin-cls/projects/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Tạo dự án đầu tiên
          </Link>
        </div>
      ) : (
        <ProjectsTable items={projects} />
      )}
    </div>
  )
}
