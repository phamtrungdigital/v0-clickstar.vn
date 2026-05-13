import Link from 'next/link'
import { Construction, ArrowLeft } from 'lucide-react'

export function ComingSoon({
  title,
  description,
  plannedFor,
}: {
  title: string
  description: string
  plannedFor?: string
}) {
  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-4">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 text-amber-500 mb-2">
        <Construction className="w-7 h-7" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {plannedFor && (
        <p className="text-xs text-slate-500">📋 Dự kiến: {plannedFor}</p>
      )}
      <Link
        href="/admin-cls"
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <ArrowLeft className="w-3 h-3" />
        Quay lại Dashboard
      </Link>
    </div>
  )
}
