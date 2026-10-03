import type { I18n } from '@/lib/cms/types'

/**
 * Nội dung trang "Phần mềm theo yêu cầu" — song ngữ, dùng chung cho page.tsx
 * (giao diện) và layout.tsx (JSON-LD FAQPage).
 *
 * LUẬT KHI SỬA:
 * 1. Văn phong không mang dấu hiệu AI (anh Trung chốt 3/10/2026): không emoji,
 *    không dấu gạch dài "—", không cụm sáo rỗng ("giải pháp toàn diện", "đồng hành",
 *    "tối ưu", "nâng tầm"). Nêu cụ thể: tiêu chuẩn, cơ chế kỹ thuật, con số.
 * 2. Các CAM KẾT có số (thời gian giai đoạn, phản hồi sự cố P1/P2/P3, sao lưu,
 *    xác thực hai lớp, vị trí máy chủ, bảo hành) là lời hứa với khách — đổi thì
 *    hỏi anh Trung, không tự đặt.
 * 3. Không nêu tên khách hàng thật.
 */

export type Line = I18n
export type Titled = { title: I18n; body: I18n }

export const SERVICE_SLUG = 'services/custom-software'

/** Nhãn dịch vụ ở /contact — phải khớp option trong contact-form.tsx */
export const SERVICE_LABEL = 'Phần mềm theo yêu cầu'

export const HERO = {
  kicker: { vi: 'Phát triển phần mềm theo yêu cầu', en: 'Custom software development' },
  title: {
    vi: 'Phần mềm riêng cho doanh nghiệp, an toàn từ bản thiết kế đến ngày vận hành.',
    en: 'Software built for your business, secure from the first design to day-to-day operation.',
  },
  lede: {
    vi: 'Click Star khảo sát quy trình thực tế, thiết kế, lập trình và vận hành hệ thống theo đúng nghiệp vụ của doanh nghiệp. Mọi thay đổi đều chạy trên môi trường thử để bạn kiểm tra trước. Mã nguồn và dữ liệu thuộc về doanh nghiệp.',
    en: 'We study how your business actually runs, then design, build and operate a system around it. Every change goes to a staging environment for your review first. You own the source code and the data.',
  },
}

export const FACTS: { value: I18n; label: I18n }[] = [
  {
    value: { vi: '100%', en: '100%' },
    label: { vi: 'mã nguồn và dữ liệu bàn giao cho doanh nghiệp', en: 'of source code and data handed over to you' },
  },
  {
    value: { vi: '3', en: '3' },
    label: { vi: 'môi trường tách biệt: phát triển, thử nghiệm, vận hành', en: 'separate environments: development, staging, production' },
  },
  {
    value: { vi: '2 tuần', en: '2 weeks' },
    label: { vi: 'mỗi chặng có bản chạy thật để duyệt', en: 'per sprint, each ending with working software' },
  },
  {
    value: { vi: 'Hằng ngày', en: 'Daily' },
    label: { vi: 'sao lưu dữ liệu, có kiểm tra khôi phục', en: 'backups, with tested restores' },
  },
]

export const SIGNALS = {
  kicker: { vi: 'Khi nào cần phần mềm riêng', en: 'When custom software makes sense' },
  title: {
    vi: 'Công cụ có sẵn đã không theo kịp cách doanh nghiệp vận hành',
    en: 'Off-the-shelf tools no longer fit the way you operate',
  },
  lede: {
    vi: 'Buổi trao đổi đầu tiên có thể kết luận doanh nghiệp chưa cần làm phần mềm riêng. Chúng tôi sẽ nói thẳng nếu một công cụ có sẵn đã đủ.',
    en: "The first conversation may well conclude that you don't need custom software yet. If an existing tool is enough, we will say so.",
  },
  items: [
    {
      title: { vi: 'Dữ liệu nằm rải rác ở Excel và nhóm chat', en: 'Data is scattered across spreadsheets and chat groups' },
      body: { vi: 'Báo cáo phải tổng hợp tay, số liệu giữa các bộ phận không khớp nhau.', en: 'Reports are compiled by hand and figures differ between teams.' },
    },
    {
      title: { vi: 'Phần mềm đang dùng không có nghiệp vụ đặc thù', en: 'Your current software lacks your specific workflows' },
      body: {
        vi: 'Đội ngũ phải làm vòng ngoài hệ thống, hoặc trả phí cho nhiều tính năng không dùng đến.',
        en: 'Teams work around the system, or pay for features nobody uses.',
      },
    },
    {
      title: { vi: 'Các hệ thống không kết nối với nhau', en: "Systems don't talk to each other" },
      body: {
        vi: 'CRM, kế toán, kho, website mỗi nơi một dữ liệu, nhân viên phải nhập lại nhiều lần.',
        en: 'CRM, accounting, inventory and the website each hold their own data, so staff re-enter it.',
      },
    },
    {
      title: { vi: 'Yêu cầu bảo mật và kiểm soát truy cập cao hơn', en: 'You need tighter security and access control' },
      body: {
        vi: 'Cần phân quyền chi tiết theo vai trò, chi nhánh và lưu vết đầy đủ ai đã xem, sửa dữ liệu nào.',
        en: 'You need fine-grained roles per branch and a full record of who viewed or changed what.',
      },
    },
  ] satisfies Titled[],
}

export type ScopeIcon = 'ops' | 'crm' | 'chart' | 'mobile' | 'plug' | 'ai'
export const SCOPE = {
  kicker: { vi: 'Phạm vi', en: 'What we build' },
  title: { vi: 'Các loại hệ thống chúng tôi thiết kế và vận hành', en: 'The systems we design and operate' },
  items: [
    {
      icon: 'ops',
      title: { vi: 'Hệ thống quản lý nội bộ', en: 'Internal operations systems' },
      body: {
        vi: 'Quy trình duyệt nhiều cấp, đơn hàng, kho, nhân sự, giao việc theo đúng cơ cấu tổ chức.',
        en: 'Multi-level approvals, orders, inventory, HR and task flows that match your org structure.',
      },
    },
    {
      icon: 'crm',
      title: { vi: 'CRM và cổng khách hàng', en: 'CRM and client portals' },
      body: {
        vi: 'Quản lý khách hàng theo phễu bán hàng riêng; cổng để khách hàng, đại lý tự tra cứu và đặt hàng.',
        en: 'Customer management built on your own sales pipeline, plus portals where clients and resellers serve themselves.',
      },
    },
    {
      icon: 'chart',
      title: { vi: 'Báo cáo và dashboard', en: 'Reporting and dashboards' },
      body: {
        vi: 'Hợp nhất dữ liệu nhiều nguồn, báo cáo tự cập nhật, mỗi cấp quản lý xem đúng phần của mình.',
        en: 'Data from many sources in one place, with reports that refresh themselves and show each manager only their scope.',
      },
    },
    {
      icon: 'mobile',
      title: { vi: 'Ứng dụng web cho điện thoại', en: 'Mobile-ready web apps' },
      body: {
        vi: 'Dùng ổn định trên máy tính và điện thoại, cài lên màn hình chính như ứng dụng.',
        en: 'Works on desktop and phone, and installs to the home screen like an app.',
      },
    },
    {
      icon: 'plug',
      title: { vi: 'Tích hợp hệ thống', en: 'System integration' },
      body: {
        vi: 'Kết nối qua API với phần mềm sẵn có, đồng bộ dữ liệu tự động, bỏ bước nhập tay.',
        en: 'API connections to the tools you already use, with automatic sync instead of manual entry.',
      },
    },
    {
      icon: 'ai',
      title: { vi: 'Ứng dụng AI vào nghiệp vụ', en: 'Applied AI in workflows' },
      body: {
        vi: 'Đọc và trích xuất tài liệu, phân tích cuộc gọi, trợ lý tra cứu nội bộ. Dữ liệu không dùng để huấn luyện mô hình.',
        en: 'Document extraction, call analysis and internal search assistants. Your data is not used to train models.',
      },
    },
  ] satisfies (Titled & { icon: ScopeIcon })[],
}

/**
 * Dự án đã làm (anh Trung chốt 4/10/2026: hệ thống làm cho khách, ẨN TÊN; ảnh + mô tả).
 * Ảnh chụp từ bản chạy thử/bản thiết kế với dữ liệu mẫu, đã che tên khách, cơ sở, nhân sự,
 * tên miền và logo trước khi chụp. Mỗi ý trong `points` đã đối chiếu có trong mã nguồn thật,
 * thêm ý mới thì kiểm tra trước, không viết tính năng hệ thống chưa có.
 */
export type WorkShot = { src: string; width: number; height: number; alt: I18n }
export type WorkItem = {
  id: string
  sector: I18n
  title: I18n
  problem: I18n
  built: I18n
  points: I18n[]
  stack: string
  /** desktop: 1 ảnh màn hình máy tính · phone: các ảnh điện thoại xếp cạnh nhau */
  frame: 'desktop' | 'phone'
  shots: WorkShot[]
}

const IMG = '/images/custom-software'
const DESKTOP = { width: 2400, height: 1500 }

export const WORK = {
  kicker: { vi: 'Dự án đã thực hiện', en: 'Selected work' },
  title: { vi: 'Một số hệ thống chúng tôi đã xây dựng', en: 'Some of the systems we have built' },
  lede: {
    vi: 'Tên khách hàng được ẩn để bảo mật. Ảnh chụp từ bản chạy thử với dữ liệu mẫu, không chứa dữ liệu thật của khách hàng.',
    en: 'Client names are withheld for confidentiality. Screenshots come from test builds with sample data and contain no real client data.',
  },
  labels: {
    problem: { vi: 'Vấn đề', en: 'Problem' },
    built: { vi: 'Đã xây dựng', en: 'What we built' },
    zoom: { vi: 'Xem ảnh lớn', en: 'View full size' },
    close: { vi: 'Đóng', en: 'Close' },
    prev: { vi: 'Ảnh trước', en: 'Previous image' },
    next: { vi: 'Ảnh sau', en: 'Next image' },
  },
  items: [
    {
      id: 'ads-command-center',
      sector: { vi: 'Giáo dục · nhiều cơ sở', en: 'Education · multi-campus' },
      title: { vi: 'Trung tâm điều hành quảng cáo', en: 'Ad performance command center' },
      problem: {
        vi: 'Ngân sách quảng cáo chia cho nhiều cơ sở, mỗi nơi tự báo cáo bằng bảng tính. Ban điều hành thường chỉ biết một cơ sở đang kém khi đã hết tháng.',
        en: 'Ad budgets were split across many campuses, each reporting in its own spreadsheet. Management often learned a campus was underperforming only at month end.',
      },
      built: {
        vi: 'Hệ thống lấy số liệu quảng cáo theo lịch, ghép với lead và nhập học, so sánh hiệu quả giữa các cơ sở và đưa các việc cần quyết định lên đầu.',
        en: 'The system pulls ad data on a schedule, joins it with leads and enrolments, compares campuses side by side and puts the decisions that need attention first.',
      },
      points: [
        { vi: 'Đồng bộ chi phí Meta Ads tự động, không nhập tay', en: 'Automatic Meta Ads cost sync, no manual entry' },
        { vi: 'Bộ luật phát hiện bất thường, tạo việc kèm người phụ trách', en: 'Rule-based alerts that open an issue with a named owner' },
        { vi: 'Phân quyền kiểm soát ở tầng cơ sở dữ liệu, có bộ kiểm thử riêng', en: 'Access control enforced in the database, with its own test suite' },
      ],
      stack: 'Next.js · PostgreSQL · Meta Marketing API',
      frame: 'desktop',
      shots: [
        { src: `${IMG}/ads-command-center.webp`, ...DESKTOP, alt: { vi: 'Màn hình tổng quan hiệu quả quảng cáo theo cơ sở', en: 'Ad performance overview by campus' } },
      ],
    },
    {
      id: 'customer-data-platform',
      sector: { vi: 'Giáo dục', en: 'Education' },
      title: { vi: 'Nền tảng dữ liệu khách hàng (CDP)', en: 'Customer data platform (CDP)' },
      problem: {
        vi: 'Thông tin của một người nằm rải ở form website, CRM, chatbot và danh sách sự kiện. Cùng một người có thể nhận nhiều tin nhắn trùng nhau.',
        en: "One person's details were spread across web forms, the CRM, the chatbot and event lists, so the same person could receive duplicate messages.",
      },
      built: {
        vi: 'Gộp về một hồ sơ cho mỗi người, phân nhóm theo hành vi, gửi Email, Web Push, Zalo ZNS và chạy chuỗi chăm sóc tự động có chấm điểm lead.',
        en: 'One profile per person, behavioural segments, Email, Web Push and Zalo ZNS sending, and automated journeys with lead scoring.',
      },
      points: [
        { vi: 'Nhận diện và gộp hồ sơ trùng', en: 'Identity resolution across sources' },
        { vi: 'Danh sách chặn gửi và trang hủy đăng ký', en: 'Suppression lists and unsubscribe pages' },
        { vi: 'Nhật ký thao tác, phân quyền theo vai trò', en: 'Audit log and role-based permissions' },
      ],
      stack: 'Next.js · PostgreSQL · Web Push · Zalo ZNS',
      frame: 'desktop',
      shots: [
        { src: `${IMG}/customer-data-platform.webp`, ...DESKTOP, alt: { vi: 'Trang chủ nền tảng dữ liệu khách hàng', en: 'Customer data platform home screen' } },
      ],
    },
    {
      id: 'team-workspace',
      sector: { vi: 'Doanh nghiệp · khối marketing', en: 'Corporate · marketing team' },
      title: { vi: 'Quản lý công việc và hiệu suất', en: 'Work and performance management' },
      problem: {
        vi: 'Việc được giao qua nhóm chat nên hạn chót dễ trôi, trưởng nhóm phải tự tổng hợp báo cáo mỗi tuần.',
        en: 'Tasks were assigned in chat groups, deadlines slipped, and team leads compiled weekly reports by hand.',
      },
      built: {
        vi: 'Bảng việc, dự án, lịch họp và báo cáo trên cùng một hệ thống. Mỗi người thấy việc của mình, trưởng nhóm thấy toàn đội.',
        en: 'Tasks, projects, meetings and reports in one system. Each person sees their own work and leads see the whole team.',
      },
      points: [
        { vi: 'Ba vai trò Admin, Leader, Nhân viên với quyền khác nhau', en: 'Three roles (admin, lead, member) with distinct permissions' },
        { vi: 'Quyền xem việc kiểm soát ở tầng cơ sở dữ liệu', en: 'Task visibility enforced at the database layer' },
        { vi: 'Việc định kỳ tự tạo theo lịch', en: 'Recurring tasks created on schedule' },
      ],
      stack: 'Next.js · PostgreSQL · Realtime',
      frame: 'desktop',
      shots: [
        { src: `${IMG}/team-workspace.webp`, ...DESKTOP, alt: { vi: 'Bảng điều khiển công việc của đội', en: 'Team work dashboard' } },
      ],
    },
    {
      id: 'consent-management',
      sector: { vi: 'Giáo dục · website tuyển sinh', en: 'Education · admissions website' },
      title: { vi: 'Quản trị đồng ý cookie và dữ liệu cá nhân', en: 'Cookie consent and personal data management' },
      problem: {
        vi: 'Website gắn nhiều mã đo lường và quảng cáo, cần xin đồng ý trước khi thu thập và giữ được bằng chứng khi cơ quan quản lý yêu cầu.',
        en: 'The website ran several analytics and ad tags. It had to ask for consent before collecting data and keep proof for regulators.',
      },
      built: {
        vi: 'Hộp xin đồng ý theo từng mục đích, chỉ bật mã đo lường sau khi người dùng đồng ý, kèm trang quản trị theo dõi tỷ lệ đồng ý theo ngày và thiết bị.',
        en: 'A purpose-based consent banner that enables tags only after the visitor agrees, plus an admin view of consent rates by day and device.',
      },
      points: [
        { vi: 'Sổ bằng chứng nối chuỗi hash, phát hiện bản ghi bị sửa hoặc xóa', en: 'Hash-chained evidence log that detects edited or deleted records' },
        { vi: 'Tự dọn dữ liệu theo thời hạn lưu trữ', en: 'Automatic clean-up by retention period' },
        { vi: 'Che địa chỉ IP và thông tin trình duyệt khi hiển thị', en: 'IP addresses and browser details masked in the admin view' },
      ],
      stack: 'Next.js · PostgreSQL · Google Consent Mode',
      frame: 'desktop',
      shots: [
        { src: `${IMG}/consent-overview.webp`, ...DESKTOP, alt: { vi: 'Tổng quan tỷ lệ đồng ý cookie', en: 'Cookie consent overview' } },
        { src: `${IMG}/consent-setup.webp`, ...DESKTOP, alt: { vi: 'Trang cấu hình hộp xin đồng ý', en: 'Consent banner configuration' } },
      ],
    },
    {
      id: 'ai-chat-assistant',
      sector: { vi: 'Giáo dục · tư vấn tuyển sinh', en: 'Education · admissions' },
      title: { vi: 'Trợ lý tư vấn AI trên website', en: 'AI assistant on the website' },
      problem: {
        vi: 'Phụ huynh hỏi ngoài giờ hành chính, nhiều câu hỏi lặp lại, lead đến từ khung chat không được ghi nhận đầy đủ.',
        en: 'Parents asked questions after hours, many of them repeated, and leads from chat were not captured properly.',
      },
      built: {
        vi: 'Chatbot trả lời theo kho kiến thức đã duyệt của từng cơ sở, nút liên hệ đổi theo nội dung trang, lead chuyển thẳng về CRM.',
        en: 'A chatbot that answers from an approved knowledge base for each campus, contact buttons that adapt to the page, and leads sent straight to the CRM.',
      },
      points: [
        { vi: 'Ghi lại câu hỏi chưa có câu trả lời để bổ sung kiến thức', en: 'Unanswered questions logged as knowledge gaps' },
        { vi: 'Nhân viên nhận lại hội thoại khi khách cần tư vấn trực tiếp', en: 'Staff can take over a conversation for live support' },
        { vi: 'Báo cáo tỷ lệ chat thành lead theo nguồn', en: 'Chat-to-lead conversion reported by source' },
      ],
      stack: 'Next.js · PostgreSQL · Claude API · CRM API',
      frame: 'desktop',
      shots: [
        { src: `${IMG}/ai-chat-assistant.webp`, ...DESKTOP, alt: { vi: 'Bảng theo dõi hiệu quả chatbot', en: 'Chatbot performance dashboard' } },
      ],
    },
    {
      id: 'event-checkin',
      sector: { vi: 'Giáo dục · sự kiện', en: 'Education · events' },
      title: { vi: 'Đăng ký và check-in sự kiện bằng mã QR', en: 'Event registration and QR check-in' },
      problem: {
        vi: 'Sự kiện đông phụ huynh, đối chiếu danh sách giấy ở quầy chậm và không biết chính xác bao nhiêu người đã đến.',
        en: 'Busy events relied on paper lists at the desk, which was slow and gave no accurate attendance count.',
      },
      built: {
        vi: 'Trang đăng ký gửi vé QR qua email, màn hình quét cho nhân viên tại quầy, số lượt check-in cập nhật ngay khi quét.',
        en: 'A registration page that emails a QR ticket, a scanner screen for desk staff, and a check-in count that updates on every scan.',
      },
      points: [
        { vi: 'Xin đồng ý xử lý dữ liệu cá nhân ngay trên form đăng ký', en: 'Personal data consent captured on the registration form' },
        { vi: 'Quét bằng camera điện thoại, không cần máy quét riêng', en: 'Scans with a phone camera, no dedicated scanner needed' },
        { vi: 'Tra cứu thủ công khi khách không mang mã', en: 'Manual lookup when a guest has no code' },
      ],
      stack: 'Next.js · PostgreSQL · Email',
      frame: 'phone',
      shots: [
        { src: `${IMG}/event-registration.webp`, width: 760, height: 1748, alt: { vi: 'Form đăng ký nhận vé trên điện thoại', en: 'Ticket registration form on a phone' } },
        { src: `${IMG}/event-checkin.webp`, width: 760, height: 1486, alt: { vi: 'Màn hình quét mã QR tại quầy', en: 'QR scanning screen at the desk' } },
      ],
    },
  ] satisfies WorkItem[],
}

export type ControlIcon = 'lock' | 'key' | 'log' | 'code' | 'server' | 'shield'
export const SECURITY = {
  kicker: { vi: 'Bảo mật', en: 'Security' },
  title: { vi: 'Bảo mật được thiết kế từ đầu, không vá về sau', en: 'Security designed in from the start, not patched on later' },
  lede: {
    vi: 'Các biện pháp dưới đây là mặc định trong mọi dự án, không phải gói nâng cấp. Phạm vi cụ thể được ghi vào tài liệu bàn giao để đội kỹ thuật của doanh nghiệp kiểm tra lại.',
    en: 'These controls are the default on every project, not an upgrade. The exact scope is written into the handover documents so your own team can verify it.',
  },
  controls: [
    {
      icon: 'lock',
      title: { vi: 'Bảo vệ dữ liệu', en: 'Data protection' },
      items: [
        { vi: 'Mã hoá khi truyền (TLS) và khi lưu trữ', en: 'Encryption in transit (TLS) and at rest' },
        { vi: 'Tách dữ liệu theo tổ chức, chi nhánh ngay ở tầng cơ sở dữ liệu', en: 'Tenant and branch isolation enforced in the database' },
        { vi: 'Che thông tin nhạy cảm khi hiển thị và xuất file', en: 'Sensitive fields masked on screen and in exports' },
      ],
    },
    {
      icon: 'key',
      title: { vi: 'Kiểm soát truy cập', en: 'Access control' },
      items: [
        { vi: 'Phân quyền theo vai trò, kiểm tra ở máy chủ', en: 'Role-based permissions, checked on the server' },
        { vi: 'Xác thực hai lớp cho tài khoản quản trị', en: 'Two-factor authentication for admin accounts' },
        { vi: 'Giới hạn đăng nhập sai, tự hết hạn phiên làm việc', en: 'Login rate limiting and session expiry' },
      ],
    },
    {
      icon: 'log',
      title: { vi: 'Truy vết', en: 'Audit trail' },
      items: [
        { vi: 'Ghi nhận ai làm gì, lúc nào, trên dữ liệu nào', en: 'Who did what, when, to which record' },
        { vi: 'Nhật ký chỉ ghi thêm, không sửa hay xoá được', en: 'Append-only logs that cannot be edited or deleted' },
        { vi: 'Xuất nhật ký khi cần đối soát hoặc kiểm toán', en: 'Exportable for reconciliation or audits' },
      ],
    },
    {
      icon: 'code',
      title: { vi: 'Mã nguồn an toàn', en: 'Secure code' },
      items: [
        { vi: 'Mọi thay đổi được người thứ hai xem xét trước khi gộp', en: 'Every change reviewed by a second engineer before merge' },
        { vi: 'Kiểm thử theo OWASP Top 10 trước khi bàn giao', en: 'Tested against the OWASP Top 10 before handover' },
        { vi: 'Khoá bí mật không bao giờ nằm trong mã nguồn', en: 'Secrets never stored in the codebase' },
      ],
    },
    {
      icon: 'server',
      title: { vi: 'Hạ tầng', en: 'Infrastructure' },
      items: [
        { vi: 'Môi trường thử nghiệm tách hẳn khỏi hệ thống đang chạy', en: 'Staging fully separated from production' },
        { vi: 'Sao lưu tự động, khôi phục về thời điểm bất kỳ', en: 'Automated backups with point-in-time recovery' },
        { vi: 'Máy chủ đặt tại Singapore hoặc Việt Nam theo yêu cầu', en: 'Hosting in Singapore or Vietnam as required' },
      ],
    },
    {
      icon: 'shield',
      title: { vi: 'Tuân thủ', en: 'Compliance' },
      items: [
        {
          vi: 'Thiết kế theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân',
          en: "Designed around Vietnam's Decree 13/2023 on personal data protection",
        },
        { vi: 'Ký cam kết bảo mật (NDA) trước khi trao đổi chi tiết', en: 'NDA signed before detailed discussions' },
        { vi: 'Hỗ trợ hồ sơ đánh giá tác động xử lý dữ liệu', en: 'Support with data processing impact assessments' },
      ],
    },
  ] satisfies { icon: ControlIcon; title: I18n; items: I18n[] }[],
  standards: [
    { vi: 'OWASP Top 10', en: 'OWASP Top 10' },
    { vi: 'Row Level Security', en: 'Row Level Security' },
    { vi: 'TLS 1.2+', en: 'TLS 1.2+' },
    { vi: 'RBAC', en: 'RBAC' },
    { vi: 'Nghị định 13/2023/NĐ-CP', en: 'Decree 13/2023/ND-CP' },
  ],
}

export type OpsIcon = 'monitor' | 'release' | 'backup' | 'docs'
export const OPERATIONS = {
  kicker: { vi: 'Vận hành', en: 'Operations' },
  title: { vi: 'Hệ thống phải chạy ổn định sau ngày bàn giao', en: 'The system has to keep running after handover' },
  lede: {
    vi: 'Phần lớn chi phí của một phần mềm nằm ở giai đoạn vận hành. Chúng tôi chuẩn bị cho giai đoạn này ngay từ khi thiết kế.',
    en: "Most of a system's lifetime cost sits in operation. We plan for it from the design stage.",
  },
  items: [
    {
      icon: 'monitor',
      title: { vi: 'Giám sát và cảnh báo', en: 'Monitoring and alerts' },
      body: {
        vi: 'Theo dõi thời gian hoạt động, lỗi và tốc độ phản hồi. Có bất thường là đội kỹ thuật nhận cảnh báo trước khi người dùng phải báo.',
        en: 'Uptime, errors and response times are tracked, so engineers are alerted before users have to report a problem.',
      },
    },
    {
      icon: 'release',
      title: { vi: 'Phát hành an toàn', en: 'Safe releases' },
      body: {
        vi: 'Mỗi thay đổi lên môi trường thử trước, doanh nghiệp duyệt qua đường link rồi mới đưa lên hệ thống chính. Có thể quay về phiên bản trước trong vài phút.',
        en: 'Each change ships to staging first, you approve it through a link, and only then does it reach production. Rolling back takes minutes.',
      },
    },
    {
      icon: 'backup',
      title: { vi: 'Sao lưu và khôi phục', en: 'Backup and recovery' },
      body: {
        vi: 'Sao lưu tự động hằng ngày, kiểm tra khôi phục định kỳ để chắc chắn bản sao lưu dùng được khi cần.',
        en: 'Automatic daily backups, with restores rehearsed regularly so we know they work when needed.',
      },
    },
    {
      icon: 'docs',
      title: { vi: 'Tài liệu vận hành', en: 'Runbooks' },
      body: {
        vi: 'Bàn giao tài liệu kiến trúc, quy trình xử lý sự cố và hướng dẫn vận hành, để đội nội bộ hoặc đơn vị khác có thể tiếp quản.',
        en: 'Architecture docs, incident procedures and runbooks are handed over, so your team or another vendor can take over.',
      },
    },
  ] satisfies (Titled & { icon: OpsIcon })[],
  incident: {
    title: { vi: 'Cam kết xử lý sự cố', en: 'Incident response' },
    sub: { vi: 'Áp dụng trong thời gian bảo hành và gói vận hành', en: 'Applies during warranty and on operations plans' },
    rows: [
      {
        level: 'P1' as const,
        example: { vi: 'Hệ thống ngừng hoạt động, lộ dữ liệu', en: 'System down, data exposure' },
        response: { vi: 'trong 1 giờ', en: 'within 1 hour' },
      },
      {
        level: 'P2' as const,
        example: { vi: 'Một chức năng chính không dùng được', en: 'A core feature is unavailable' },
        response: { vi: 'trong 4 giờ', en: 'within 4 hours' },
      },
      {
        level: 'P3' as const,
        example: { vi: 'Lỗi nhỏ, có cách làm tạm', en: 'Minor issue with a workaround' },
        response: { vi: '1 ngày làm việc', en: '1 business day' },
      },
    ],
  },
  report: {
    title: { vi: 'Báo cáo vận hành hằng tháng', en: 'Monthly operations report' },
    items: [
      { vi: 'Thời gian hoạt động và các sự cố đã xử lý', en: 'Uptime and incidents resolved' },
      { vi: 'Bản vá bảo mật và cập nhật thư viện đã áp dụng', en: 'Security patches and dependency updates applied' },
      { vi: 'Tình trạng sao lưu và lần kiểm tra khôi phục gần nhất', en: 'Backup status and the latest restore test' },
      { vi: 'Đề xuất tối ưu tốc độ và chi phí hạ tầng', en: 'Recommendations on performance and hosting cost' },
    ],
  },
}

export const PROCESS = {
  kicker: { vi: 'Quy trình', en: 'Process' },
  title: {
    vi: 'Từ xác định nhu cầu đến hệ thống vận hành ổn định',
    en: 'From understanding the need to a system running in production',
  },
  lede: {
    vi: 'Mỗi giai đoạn kết thúc bằng một điểm duyệt. Chưa duyệt giai đoạn trước thì chưa bắt đầu giai đoạn sau.',
    en: "Every phase ends with a sign-off. The next phase doesn't start until the previous one is approved.",
  },
  phases: [
    {
      title: { vi: 'Khảo sát nhu cầu', en: 'Discovery' },
      body: { vi: 'Làm việc với lãnh đạo và người dùng thực tế, ghi nhận quy trình hiện tại.', en: 'Sessions with leadership and real users to map current workflows.' },
      gate: { vi: 'Duyệt phạm vi và báo giá', en: 'Scope and quote approved' },
    },
    {
      title: { vi: 'Thiết kế giải pháp', en: 'Solution design' },
      body: { vi: 'Kiến trúc, mô hình dữ liệu, phân quyền và giao diện bấm thử được.', en: 'Architecture, data model, permissions and a clickable prototype.' },
      gate: { vi: 'Duyệt thiết kế', en: 'Design approved' },
    },
    {
      title: { vi: 'Phát triển theo chặng', en: 'Iterative build' },
      body: { vi: 'Mỗi chặng 2 tuần, kết thúc bằng buổi demo trên môi trường thử.', en: 'Two-week sprints, each closing with a demo on staging.' },
      gate: { vi: 'Duyệt sau mỗi chặng', en: 'Approved every sprint' },
    },
    {
      title: { vi: 'Kiểm thử và đánh giá bảo mật', en: 'Testing and security review' },
      body: {
        vi: 'Kiểm thử chức năng, hiệu năng, phân quyền; người dùng thật nghiệm thu.',
        en: 'Functional, performance and permission testing; user acceptance by real users.',
      },
      gate: { vi: 'Biên bản nghiệm thu', en: 'Acceptance signed' },
    },
    {
      title: { vi: 'Triển khai và chuyển giao', en: 'Launch and handover' },
      body: { vi: 'Đưa lên hệ thống chính, chuyển dữ liệu cũ, đào tạo người dùng.', en: 'Go-live, legacy data migration and user training.' },
      gate: { vi: 'Bàn giao đầy đủ', en: 'Full handover' },
    },
    {
      title: { vi: 'Vận hành và bảo trì', en: 'Operate and maintain' },
      body: { vi: 'Giám sát, vá bảo mật, phát triển thêm tính năng theo nhu cầu.', en: 'Monitoring, security patching and new features as needs evolve.' },
      gate: { vi: 'Báo cáo hằng tháng', en: 'Monthly reporting' },
    },
  ] satisfies (Titled & { gate: I18n })[],
  table: {
    head: {
      phase: { vi: 'Giai đoạn', en: 'Phase' },
      receive: { vi: 'Doanh nghiệp nhận được', en: 'What you receive' },
      prepare: { vi: 'Doanh nghiệp cần chuẩn bị', en: 'What we need from you' },
      duration: { vi: 'Thời gian', en: 'Duration' },
    },
    rows: [
      {
        phase: { vi: 'Khảo sát', en: 'Discovery' },
        receive: { vi: 'Tài liệu yêu cầu, phạm vi, báo giá cố định', en: 'Requirements, scope and a fixed quote' },
        prepare: { vi: '2–3 buổi làm việc, mẫu biểu đang dùng', en: '2–3 working sessions, current forms and files' },
        duration: { vi: '1–2 tuần', en: '1–2 weeks' },
      },
      {
        phase: { vi: 'Thiết kế', en: 'Design' },
        receive: { vi: 'Sơ đồ kiến trúc, ma trận phân quyền, bản bấm thử', en: 'Architecture diagram, permission matrix, prototype' },
        prepare: { vi: 'Góp ý trên bản bấm thử', en: 'Feedback on the prototype' },
        duration: { vi: '2–3 tuần', en: '2–3 weeks' },
      },
      {
        phase: { vi: 'Phát triển', en: 'Build' },
        receive: { vi: 'Bản chạy thử cập nhật mỗi chặng, báo cáo tiến độ', en: 'Updated staging build each sprint, progress reports' },
        prepare: { vi: 'Dự demo, phản hồi trong chặng', en: 'Attend demos, give feedback within the sprint' },
        duration: { vi: 'theo phạm vi', en: 'by scope' },
      },
      {
        phase: { vi: 'Kiểm thử', en: 'Testing' },
        receive: { vi: 'Báo cáo kiểm thử và đánh giá bảo mật', en: 'Test report and security review' },
        prepare: { vi: 'Người dùng chính tham gia nghiệm thu', en: 'Key users for acceptance testing' },
        duration: { vi: '1–2 tuần', en: '1–2 weeks' },
      },
      {
        phase: { vi: 'Chuyển giao', en: 'Handover' },
        receive: { vi: 'Mã nguồn, tài liệu, tài khoản quản trị, đào tạo', en: 'Source code, documentation, admin access, training' },
        prepare: { vi: 'Dữ liệu cũ cần chuyển, lịch đào tạo', en: 'Legacy data to migrate, training schedule' },
        duration: { vi: 'khoảng 1 tuần', en: 'about 1 week' },
      },
    ],
  },
}

export const OWNERSHIP = {
  kicker: { vi: 'Quyền sở hữu', en: 'Ownership' },
  title: { vi: 'Doanh nghiệp làm chủ hoàn toàn hệ thống', en: 'You fully own the system' },
  items: [
    {
      title: { vi: 'Mã nguồn', en: 'Source code' },
      body: { vi: 'Kho mã nguồn đứng tên doanh nghiệp, kèm lịch sử thay đổi đầy đủ.', en: 'The repository is in your name, with its full change history.' },
    },
    {
      title: { vi: 'Hạ tầng', en: 'Infrastructure' },
      body: { vi: 'Tài khoản máy chủ, cơ sở dữ liệu, tên miền thuộc doanh nghiệp.', en: 'Hosting, database and domain accounts belong to you.' },
    },
    {
      title: { vi: 'Tài liệu', en: 'Documentation' },
      body: {
        vi: 'Kiến trúc, API, mô hình dữ liệu, quy trình vận hành và xử lý sự cố.',
        en: 'Architecture, API, data model, runbooks and incident procedures.',
      },
    },
    {
      title: { vi: 'Không ràng buộc', en: 'No lock-in' },
      body: {
        vi: 'Dùng công nghệ phổ biến, đội nội bộ hoặc đơn vị khác tiếp quản được.',
        en: 'Mainstream technology that your team or another vendor can take over.',
      },
    },
  ] satisfies Titled[],
}

export const MODELS = {
  kicker: { vi: 'Hình thức hợp tác', en: 'Engagement models' },
  title: { vi: 'Chọn cách làm việc phù hợp giai đoạn của doanh nghiệp', en: 'Pick the model that fits where you are' },
  columns: [
    {
      name: { vi: 'Dự án trọn gói', en: 'Fixed-scope project' },
      fit: { vi: 'Hệ thống có phạm vi rõ ràng', en: 'A system with a clear scope' },
      pricing: { vi: 'Báo giá cố định sau giai đoạn khảo sát', en: 'Fixed quote after discovery' },
      when: { vi: 'Đã biết rõ cần gì, cần chốt ngân sách trước', en: 'Needs are known and the budget must be fixed' },
      includes: { vi: 'Đủ 6 giai đoạn, bảo hành sau nghiệm thu', en: 'All six phases, warranty after acceptance' },
      recommended: false,
    },
    {
      name: { vi: 'Đội phát triển riêng', en: 'Dedicated team' },
      fit: { vi: 'Sản phẩm phát triển liên tục', en: 'A product in continuous development' },
      pricing: { vi: 'Theo tháng, theo quy mô đội', en: 'Monthly, by team size' },
      when: { vi: 'Yêu cầu thay đổi thường xuyên, cần tốc độ', en: 'Requirements evolve often and speed matters' },
      includes: { vi: 'Lập trình, thiết kế, kiểm thử, báo cáo định kỳ', en: 'Engineering, design, QA, regular reporting' },
      recommended: true,
    },
    {
      name: { vi: 'Vận hành và bảo trì', en: 'Operations and maintenance' },
      fit: { vi: 'Hệ thống đã có, cần chạy ổn định', en: 'An existing system that must run reliably' },
      pricing: { vi: 'Theo tháng, theo cam kết xử lý sự cố', en: 'Monthly, by response commitment' },
      when: { vi: 'Hệ thống quan trọng, không được gián đoạn', en: 'The system is critical and must not go down' },
      includes: { vi: 'Giám sát, vá bảo mật, sao lưu, báo cáo tháng', en: 'Monitoring, patching, backups, monthly report' },
      recommended: false,
    },
  ],
  rows: [
    { key: 'pricing' as const, label: { vi: 'Cách tính phí', en: 'Pricing' } },
    { key: 'when' as const, label: { vi: 'Phù hợp khi', en: 'Best when' } },
    { key: 'includes' as const, label: { vi: 'Bao gồm', en: 'Includes' } },
  ],
}

export const STACK = {
  kicker: { vi: 'Công nghệ', en: 'Technology' },
  title: { vi: 'Công nghệ phổ biến, kiểu dữ liệu chặt chẽ', en: 'Mainstream, strongly typed technology' },
  lede: {
    vi: 'Chúng tôi chọn công nghệ có cộng đồng lớn và vòng đời dài, để hệ thống dễ tuyển người và dễ bảo trì trong nhiều năm.',
    en: 'We choose technology with a large community and a long lifespan, so the system stays easy to staff and maintain for years.',
  },
  rows: [
    { layer: { vi: 'Giao diện', en: 'Frontend' }, tech: 'Next.js · React · TypeScript' },
    { layer: { vi: 'Máy chủ', en: 'Backend' }, tech: 'Node.js · TypeScript · REST / Webhook' },
    { layer: { vi: 'Cơ sở dữ liệu', en: 'Database' }, tech: 'PostgreSQL · Row Level Security' },
    { layer: { vi: 'Hạ tầng', en: 'Hosting' }, tech: 'Vercel · Supabase' },
    { layer: { vi: 'Tự động hoá', en: 'Automation' }, tech: 'n8n · Cron · Queue' },
    { layer: { vi: 'AI (khi cần)', en: 'AI (when needed)' }, tech: 'OpenAI · Claude · Gemini' },
  ],
}

export const FAQ = {
  kicker: { vi: 'Câu hỏi thường gặp', en: 'FAQ' },
  title: { vi: 'Những câu hỏi doanh nghiệp thường đặt ra', en: 'Questions businesses usually ask' },
  items: [
    {
      q: { vi: 'Dữ liệu của doanh nghiệp được lưu ở đâu, ai truy cập được?', en: 'Where is our data stored, and who can access it?' },
      a: {
        vi: 'Dữ liệu nằm trên tài khoản hạ tầng của doanh nghiệp, tại vùng máy chủ được thống nhất trong hợp đồng. Đội kỹ thuật chỉ truy cập trong phạm vi công việc, mọi lượt truy cập quản trị đều được ghi nhật ký.',
        en: 'Data lives in infrastructure accounts owned by you, in the region agreed in the contract. Our engineers access it only as the work requires, and every admin access is logged.',
      },
    },
    {
      q: { vi: 'Chi phí được tính như thế nào?', en: 'How is the cost calculated?' },
      a: {
        vi: 'Sau giai đoạn khảo sát, doanh nghiệp nhận tài liệu phạm vi kèm báo giá cố định. Yêu cầu phát sinh ngoài phạm vi được báo giá riêng và chỉ thực hiện khi doanh nghiệp đồng ý.',
        en: 'After discovery you receive a scope document with a fixed quote. Anything outside that scope is quoted separately and only built once you agree.',
      },
    },
    {
      q: { vi: 'Mất bao lâu để có phiên bản đầu tiên?', en: 'How long until the first version?' },
      a: {
        vi: 'Phiên bản đầu tiên với các chức năng cốt lõi thường mất khoảng 6–10 tuần, tuỳ phạm vi. Lộ trình cụ thể được chốt ở giai đoạn thiết kế.',
        en: 'A first version with the core features usually takes around 6–10 weeks, depending on scope. The exact roadmap is agreed during design.',
      },
    },
    {
      q: { vi: 'Nếu ngừng hợp tác, doanh nghiệp có tự vận hành được không?', en: 'If we stop working together, can we run it ourselves?' },
      a: {
        vi: 'Có. Mã nguồn, hạ tầng và tài liệu vận hành đều thuộc doanh nghiệp, công nghệ sử dụng là công nghệ phổ biến nên đội nội bộ hoặc đơn vị khác tiếp quản được.',
        en: 'Yes. The code, infrastructure and runbooks are yours, and the technology is mainstream, so your team or another vendor can take over.',
      },
    },
    {
      q: { vi: 'Doanh nghiệp đã có phần mềm và dữ liệu cũ thì sao?', en: 'What about our existing software and data?' },
      a: {
        vi: 'Hệ thống mới được kết nối với phần mềm đang dùng qua API. Dữ liệu cũ từ Excel, Google Sheets hoặc phần mềm khác được chuyển sang và đối chiếu số lượng trước khi chính thức sử dụng.',
        en: 'The new system connects to your current software through APIs. Legacy data from Excel, Google Sheets or other tools is migrated and reconciled before go-live.',
      },
    },
    {
      q: { vi: 'Đang làm mà muốn thay đổi yêu cầu thì sao?', en: 'What if requirements change mid-project?' },
      a: {
        vi: 'Điều chỉnh nhỏ được xử lý ngay trong chặng. Thay đổi lớn được đánh giá ảnh hưởng đến thời gian và chi phí, doanh nghiệp duyệt rồi mới đưa vào kế hoạch.',
        en: 'Small adjustments are handled within the sprint. Larger changes are assessed for time and cost impact, and added to the plan once you approve.',
      },
    },
  ] satisfies { q: I18n; a: I18n }[],
}

export const FINAL_CTA = {
  title: { vi: 'Trao đổi về hệ thống doanh nghiệp đang cần', en: 'Talk to us about the system you need' },
  body: {
    vi: 'Buổi trao đổi đầu tiên kéo dài 60 phút, không mất phí. Sau buổi này, doanh nghiệp nhận đánh giá sơ bộ về phạm vi, rủi ro và hướng triển khai phù hợp.',
    en: 'The first conversation takes 60 minutes, free of charge. Afterwards you receive an initial view on scope, risks and the right way to proceed.',
  },
}
