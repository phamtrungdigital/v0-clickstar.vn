import { notFound } from 'next/navigation'

/**
 * Mọi địa chỉ /en/... không có trang tương ứng đi qua đây để trả 404 được dựng THEO TỪNG YÊU CẦU. Trang 404 dựng sẵn
 * lúc build không biết khách gõ địa chỉ nào nên luôn ra tiếng Việt (lang="vi"), trong khi trình duyệt thấy /en và
 * chuyển sang tiếng Anh: HTML lệch với client, React báo lỗi hydration (#418) ở mọi /en/<địa chỉ lạ>.
 */
export const dynamic = 'force-dynamic'

export default function EnUnknownPage() {
  notFound()
}
