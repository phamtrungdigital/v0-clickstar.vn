/**
 * Dữ liệu các khu trong "Thế giới Click Star" (trang /kham-pha). Thuần dữ liệu, không import three:
 * trang chủ đề (server) dùng để dựng danh sách chữ, cảnh 3D dùng để dựng khu.
 * Lời mô tả chỉ nói điều dịch vụ đang làm được, không có số liệu (số liệu chưa xác nhận đã gỡ khỏi website 21/10/2026).
 */

export type ZoneId = 'ads' | 'crm' | 'speech' | 'dashboard' | 'website'

type I18n = { vi: string; en: string }

export type Zone = {
  id: ZoneId
  name: I18n
  /** Một câu mô tả hiện ở khung thông tin. */
  desc: I18n
  /** Việc khách làm được (2 ý ngắn). */
  points: [I18n, I18n]
  /** Câu trả lời cho "Anh chị đang muốn tìm gì?" */
  intent: I18n
  href: string
  /** Giá trị ô "Dịch vụ quan tâm" của form liên hệ (khớp SERVICES trong app/contact/_components/contact-form.tsx). */
  contactService: string
  color: string
}

export const ZONES: Zone[] = [
  {
    id: 'ads',
    name: { vi: 'ADS hub', en: 'ADS hub' },
    desc: {
      vi: 'Gom số liệu quảng cáo về một nơi để biết chiến dịch nào đang mang khách về.',
      en: 'Brings ad data into one place so you can see which campaigns bring customers in.',
    },
    points: [
      { vi: 'Xem chi phí và kết quả quảng cáo cùng lúc', en: 'See ad spend and results together' },
      { vi: 'Phát hiện chiến dịch cần chỉnh sớm hơn', en: 'Spot campaigns that need attention sooner' },
    ],
    intent: { vi: 'Thêm khách hàng mới', en: 'Get more customers' },
    href: '/ads-hub',
    contactService: 'Digital Marketing',
    color: '#ffb020',
  },
  {
    id: 'crm',
    name: { vi: 'CRM & CDP', en: 'CRM & CDP' },
    desc: {
      vi: 'Gom khách từ website, form và tin nhắn về một hồ sơ, theo dõi hành trình để chăm sóc đúng lúc.',
      en: 'Merges visitors from your website, forms and chats into one profile and follows their journey so you can follow up at the right time.',
    },
    points: [
      { vi: 'Mỗi khách một hồ sơ, không trùng lặp', en: 'One profile per customer, no duplicates' },
      { vi: 'Biết khách đã xem gì trước khi để lại thông tin', en: 'See what a customer viewed before leaving details' },
    ],
    intent: { vi: 'Quản lý và chăm sóc khách hàng', en: 'Manage and nurture customers' },
    href: '/services/crm-cdp',
    contactService: 'CRM & CDP',
    color: '#4c9aff',
  },
  {
    id: 'speech',
    name: { vi: 'Phân tích cuộc gọi AI', en: 'AI Call Analytics' },
    desc: {
      vi: 'Ghi âm, gỡ băng và chấm chất lượng cuộc gọi tư vấn để biết khách đang quan tâm điều gì.',
      en: 'Records, transcribes and scores consultation calls so you know what customers care about.',
    },
    points: [
      { vi: 'Nghe lại bằng chữ thay vì nghe từng cuộc', en: 'Read calls as text instead of listening to each one' },
      { vi: 'Chấm cuộc gọi theo tiêu chí của doanh nghiệp', en: 'Score calls against your own criteria' },
    ],
    intent: { vi: 'Hiểu các cuộc gọi tư vấn', en: 'Understand consultation calls' },
    href: '/services/speech-insight-ai',
    contactService: 'Phân tích cuộc gọi AI',
    color: '#8b7bff',
  },
  {
    id: 'dashboard',
    name: { vi: 'Dashboard dữ liệu', en: 'Data Dashboards' },
    desc: {
      vi: 'Biến số liệu rải rác ở nhiều nơi thành màn hình theo dõi dễ đọc cho người ra quyết định.',
      en: 'Turns scattered numbers into an easy-to-read screen for decision makers.',
    },
    points: [
      { vi: 'Một màn hình cho số liệu quan trọng', en: 'One screen for the numbers that matter' },
      { vi: 'Cập nhật tự động từ nguồn dữ liệu có sẵn', en: 'Updates automatically from your existing data sources' },
    ],
    intent: { vi: 'Nhìn số liệu rõ ràng', en: 'See my numbers clearly' },
    href: '/services/dashboard',
    contactService: 'Dashboard dữ liệu',
    color: '#35d6a4',
  },
  {
    id: 'website',
    name: { vi: 'Thiết kế Website', en: 'Website Design' },
    desc: {
      vi: 'Website chuẩn SEO, tải nhanh, giúp khách tìm thấy doanh nghiệp và dễ để lại thông tin liên hệ.',
      en: 'SEO-ready, fast websites that help customers find you and leave their contact details easily.',
    },
    points: [
      { vi: 'Giao diện rõ ràng trên điện thoại và máy tính', en: 'Clear on both phone and desktop' },
      { vi: 'Nội dung dễ cập nhật, không cần nhờ lập trình viên', en: 'Content you can update without a developer' },
    ],
    intent: { vi: 'Làm website', en: 'Build a website' },
    href: '/services/website',
    contactService: 'Thiết kế Website',
    color: '#2fd0ff',
  },
]

export const zoneById = (id: ZoneId) => ZONES.find((z) => z.id === id)!

/** Gửi một sự kiện cho CDP nếu CDP đang chạy (chỉ chạy khi khách đã đồng ý Đo lường truy cập, xem components/site-code.tsx). */
export function trackExplore(name: string, props: Record<string, unknown>) {
  try {
    ;(window as unknown as { cdp?: { track?: (n: string, p: Record<string, unknown>) => void } }).cdp?.track?.(name, props)
  } catch {
    /* CDP chưa có: bỏ qua */
  }
}
