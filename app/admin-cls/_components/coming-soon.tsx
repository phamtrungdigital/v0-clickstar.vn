import Link from 'next/link'
import { Hourglass } from 'lucide-react'
import { Card, Chip, PageHeader, btn } from '@/components/admin/ui'

/** Màn chưa có chức năng: nói rõ là sắp có, kèm điều kiện để làm tiếp. */
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
    <div className="mx-auto max-w-7xl">
      <PageHeader title={title} />
      <Card className="mx-auto max-w-2xl px-8 py-14 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--ad-fill)] text-[var(--ad-fg-3)]">
          <Hourglass className="h-6 w-6" />
        </div>
        <Chip tone="blue">Sắp ra mắt</Chip>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--ad-fg-2)]">{description}</p>
        {plannedFor ? <p className="mx-auto mt-2 max-w-md text-[13.5px] text-[var(--ad-fg-3)]">Dự kiến: {plannedFor}</p> : null}
        <Link href="/admin-cls" className={btn('secondary') + ' mt-6'}>
          Về Tổng quan
        </Link>
      </Card>
    </div>
  )
}
