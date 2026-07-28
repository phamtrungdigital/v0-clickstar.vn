import type { I18n } from '@/lib/cms/types'

/**
 * FAQ dùng CHUNG cho 2 nơi — viết 1 lần, tránh lệch nội dung:
 *  - page.tsx  → render accordion (theo ngôn ngữ người dùng)
 *  - layout.tsx → sinh JSON-LD FAQPage cho Google rich result
 *
 * LƯU Ý: JSON-LD sinh ở layout (server, static) nên chỉ xuất bản .vi —
 * đây là chủ đích, không phải bug.
 */
export type FaqItem = { q: I18n; a: I18n }

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: {
      vi: 'Chi phí dịch vụ tính như thế nào?',
      en: 'How is the service priced?',
    },
    a: {
      vi: 'Chi phí tính theo lượng phút ghi âm được xử lý mỗi tháng, cộng phí triển khai ban đầu (kết nối tổng đài, hiệu chỉnh bộ tiêu chí chấm điểm và từ điển riêng). Doanh nghiệp gọi ít không phải trả như doanh nghiệp gọi nhiều. Sau buổi phân tích thử, chúng tôi báo giá đúng theo lưu lượng thật của bạn.',
      en: 'Pricing is based on the volume of recorded minutes processed each month, plus a one-time setup fee (call system integration, scorecard and custom dictionary tuning). You only pay for what your team actually calls. After the trial analysis, we quote based on your real volume.',
    },
  },
  {
    q: {
      vi: 'Dữ liệu cuộc gọi của chúng tôi có an toàn không?',
      en: 'Is our call data secure?',
    },
    a: {
      vi: 'Dữ liệu được mã hoá khi truyền và khi lưu trữ, phân quyền theo vai trò (nhân viên chỉ xem cuộc gọi của mình, quản lý xem đội mình), thời gian lưu trữ cấu hình được và có nhật ký truy cập đầy đủ. Thông tin nhạy cảm trong bản bóc băng được tự động che. Việc ghi âm và phân tích cuộc gọi tại Việt Nam thuộc phạm vi Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân — chúng tôi bàn giao kèm mẫu thông báo ghi âm và điều khoản đồng ý để doanh nghiệp triển khai đúng ngay từ đầu.',
      en: 'Data is encrypted in transit and at rest, access is role-based (staff see only their own calls, managers see their team), retention is configurable and every access is logged. Sensitive details in transcripts are automatically masked. Call recording and analysis in Vietnam falls under Decree 13/2023/ND-CP on personal data protection — we hand over recording notice and consent templates so you deploy compliantly from day one.',
    },
  },
  {
    q: {
      vi: 'Bóc băng tiếng Việt có chuẩn không? Giọng miền Trung, miền Nam thì sao?',
      en: 'How accurate is Vietnamese transcription across regional accents?',
    },
    a: {
      vi: 'Độ chính xác phụ thuộc nhiều nhất vào chất lượng thu âm của tổng đài (tách kênh hay trộn kênh, codec, tạp âm), chứ không chỉ vào mô hình AI. Phần khó nhất luôn là tên riêng và thuật ngữ ngành — chúng tôi xử lý bằng cách nạp từ điển riêng của doanh nghiệp (tên sản phẩm, dự án, khoá học). Cách trả lời trung thực nhất: chúng tôi chạy thử trên chính cuộc gọi thật của bạn và đưa ra số đo cụ thể, trước khi bạn ký bất cứ thứ gì.',
      en: 'Accuracy depends most on your call system’s recording quality (separate vs mixed channels, codec, background noise), not just the AI model. The hardest part is always proper nouns and industry jargon — we handle that by loading your own dictionary (product names, projects, courses). The honest answer: we run a trial on your real calls and give you measured results before you sign anything.',
    },
  },
  {
    q: {
      vi: 'Tích hợp được với tổng đài nào?',
      en: 'Which phone systems can you integrate with?',
    },
    a: {
      vi: 'Bất kỳ tổng đài nào cho phép lấy file ghi âm kèm thông tin cuộc gọi (số máy, nhân viên, thời lượng, mã khách) qua API, webhook, SFTP hoặc đồng bộ thư mục cloud. Bao gồm tổng đài IP/Cloud Contact Center, tổng đài mã nguồn mở tự dựng (Asterisk, FreePBX, Issabel, 3CX), ghi âm cuộc họp online (Google Meet, Zoom, Teams) và cả ứng dụng ghi âm trên máy nhân viên.',
      en: 'Any system that lets us pull recordings plus call metadata (extension, agent, duration, customer ID) via API, webhook, SFTP or cloud folder sync. That includes IP/Cloud contact centers, self-hosted open-source PBX (Asterisk, FreePBX, Issabel, 3CX), online meeting recordings (Google Meet, Zoom, Teams) and even mobile call-recording apps.',
    },
  },
  {
    q: {
      vi: 'Chúng tôi có phải đổi tổng đài không?',
      en: 'Do we have to replace our phone system?',
    },
    a: {
      vi: 'Không. Bạn giữ nguyên tổng đài, giữ nguyên số hotline và giữ nguyên cách đội sale đang gọi. Speech Insight AI nằm ở lớp sau cuộc gọi — chỉ đọc file ghi âm đã có sẵn. Nhân viên không phải cài thêm phần mềm nào trên máy.',
      en: 'No. You keep your existing phone system, hotline numbers and the way your sales team already calls. Speech Insight AI sits in the layer after the call — it only reads recordings you already have. Your staff install nothing.',
    },
  },
  {
    q: {
      vi: 'Triển khai mất bao lâu, chúng tôi cần chuẩn bị gì?',
      en: 'How long does deployment take and what do we prepare?',
    },
    a: {
      vi: 'Giai đoạn chạy thử cho một phòng ban thường khoảng 1–2 tuần. Bạn chỉ cần chuẩn bị 3 thứ: một tập ghi âm mẫu, kịch bản hoặc checklist đánh giá đang dùng, và danh sách trường dữ liệu trong CRM muốn được điền tự động. Phần kết nối kỹ thuật do đội Clickstar làm.',
      en: 'A pilot for one department typically takes 1–2 weeks. You only need three things: a sample set of recordings, the call script or QA checklist you already use, and the list of CRM fields you want filled automatically. Clickstar handles the technical integration.',
    },
  },
  {
    q: {
      vi: 'Nhân viên có phản ứng vì cảm thấy bị giám sát không?',
      en: 'Will staff resist feeling monitored?',
    },
    a: {
      vi: 'Có — nếu triển khai bí mật. Chúng tôi khuyến nghị làm ngược lại: công bố với đội ngay từ đầu, công khai bộ tiêu chí chấm điểm trước khi bắt đầu chấm, và định vị đây là công cụ kèm cặp chứ không phải công cụ bắt lỗi. Trên thực tế nhân viên mới thường là nhóm hưởng lợi nhiều nhất, vì họ nhận được phản hồi cụ thể theo từng cuộc gọi thay vì góp ý chung chung.',
      en: 'Yes — if you roll it out secretly. We recommend the opposite: announce it to the team upfront, publish the scorecard before you start scoring, and position it as coaching rather than fault-finding. In practice new hires benefit most, because they get concrete per-call feedback instead of vague advice.',
    },
  },
]
