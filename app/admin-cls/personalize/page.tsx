import Link from 'next/link'
import { Plus, Target } from 'lucide-react'
import { listCampaignsForAdmin } from '@/lib/personalize/campaigns'
import { Card, EmptyState, PageHeader, btn } from '@/components/admin/ui'
import { CampaignsTable } from './_components/campaigns-table'

export const dynamic = 'force-dynamic'

export default async function AdminPersonalizePage() {
  const campaigns = await listCampaignsForAdmin()

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Cá nhân hóa"
        description={`Banner gợi ý hiện cho khách dựa trên các trang họ đã xem, hiện có ${campaigns.length} chiến dịch.`}
        actions={
          <Link href="/admin-cls/personalize/new" className={btn('primary')}>
            <Plus className="h-4 w-4" />
            Thêm chiến dịch
          </Link>
        }
      />

      {campaigns.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target className="h-5 w-5" />}
            title="Chưa có chiến dịch nào"
            description="Chiến dịch đầu tiên sẽ hiện ở đây sau khi anh tạo."
            action={
              <Link href="/admin-cls/personalize/new" className={btn('primary')}>
                <Plus className="h-4 w-4" />
                Tạo chiến dịch đầu tiên
              </Link>
            }
          />
        </Card>
      ) : (
        <CampaignsTable items={campaigns} />
      )}

      <p className="mt-3 px-1 text-[13px] text-[var(--ad-fg-3)]">
        Khách sẽ thấy chiến dịch có độ ưu tiên cao nhất trong số các chiến dịch khớp điều kiện. Sau khi lưu, hãy mở website để thử trực tiếp.
      </p>
    </div>
  )
}
