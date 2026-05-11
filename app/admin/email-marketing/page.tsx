import { ComingSoon } from '../_components/coming-soon'

export default function EmailMarketingPage() {
  return (
    <ComingSoon
      title="Email Marketing"
      description="Gửi email hàng loạt cho danh sách khách hàng/leads. Cần kết nối SMTP/SendGrid/Resend."
      plannedFor="Sau khi có quyết định về service email (SendGrid/Resend/Mailgun)."
    />
  )
}
