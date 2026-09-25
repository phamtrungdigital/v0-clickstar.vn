// Client-safe types + constants cho bot AI công khai (FloatingAiChat / FloatingAiServiceRouter).
// KHÔNG import server-only code ở đây — file này được cả client form lẫn route dùng chung.
import type { I18n } from './types'

export type WidgetMode = 'bubble' | 'bar' | 'both' | 'none'

export type QuickPrompt = { label: string; value: string }
export type I18nPrompts = { vi: QuickPrompt[]; en: QuickPrompt[] }

/** Toàn bộ cấu hình (row chatbot_settings). Gồm cả field server-only. */
export type ChatbotSettings = {
  id: number
  enabled: boolean
  widget_mode: WidgetMode
  bot_name: I18n
  welcome_message: I18n
  quick_prompts: I18nPrompts
  hotline: string
  system_prompt: string | null
  model: string
  hidden_paths: string[]
  show_delay_ms: number
  auto_close_ms: number
  dismiss_hours: number
  show_on_desktop: boolean
  show_on_mobile: boolean
  updated_at: string
}

/** Subset truyền xuống widget client — KHÔNG gồm system_prompt/model (chỉ server cần). */
export type ChatbotPublicConfig = {
  enabled: boolean
  widget_mode: WidgetMode
  bot_name: I18n
  welcome_message: I18n
  quick_prompts: I18nPrompts
  hotline: string
  hidden_paths: string[]
  show_delay_ms: number
  auto_close_ms: number
  dismiss_hours: number
  show_on_desktop: boolean
  show_on_mobile: boolean
}

/** Field admin chỉnh + lưu được. */
export type ChatbotSettingsUpdate = Omit<ChatbotSettings, 'id' | 'updated_at'>

export const CHATBOT_MODEL_OPTIONS: { value: string; label: string }[] = [
  { value: 'gpt-4o-mini', label: 'GPT-4o mini — rẻ nhất, nhanh' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini — đọc nội dung dài chính xác hơn, chi phí ~1,5× 4o mini' },
  { value: 'gpt-4o', label: 'GPT-4o — chất lượng cao, đắt nhất (~15× 4o mini)' },
]

export const WIDGET_MODE_OPTIONS: { value: WidgetMode; label: string; desc: string }[] = [
  { value: 'both', label: 'Cả hai', desc: 'Nút tròn + thanh bar đáy' },
  { value: 'bubble', label: 'Nút tròn', desc: 'Chỉ nút ✨ góc phải dưới' },
  { value: 'bar', label: 'Thanh bar', desc: 'Chỉ thanh tư vấn ở đáy' },
  { value: 'none', label: 'Tắt', desc: 'Không hiển thị bot nào' },
]

/**
 * Prompt mặc định = TÍNH CÁCH + CHÍNH SÁCH của bot (admin để trống = dùng cái này).
 * KHÔNG ghi dữ kiện (dịch vụ, giá, dự án, giờ làm…) vào đây: bot đọc TOÀN BỘ website
 * tự động (lib/ai/site-knowledge.ts), nên chỉ cần sửa website là bot biết. Dữ kiện
 * viết tay ở đây sẽ lệch website ngay lần sửa trang tiếp theo — đúng lỗi từng gặp.
 * Định dạng JSON + danh sách link hợp lệ do code gắn thêm (lib/ai/chatbot-run.ts).
 */
export const DEFAULT_CHATBOT_SYSTEM_PROMPT = `Bạn là trợ lý tư vấn AI của Click Star (CÔNG TY TNHH CLICK STAR DIGITAL) — đơn vị Digital Marketing, Website, Dữ liệu, CRM/CDP và AI cho doanh nghiệp Việt Nam.

NGUYÊN TẮC CỐT LÕI
- Chỉ trả lời dựa trên phần "NỘI DUNG WEBSITE" bên dưới. KHÔNG bịa dịch vụ, tính năng, giá, thời gian triển khai, giờ làm việc, số liệu hay tên khách hàng.
- KHÔNG suy diễn ghép số: thời gian của MỘT BƯỚC trong quy trình không phải thời gian của cả gói; giá của nhóm dịch vụ này không áp sang nhóm khác. Website không ghi con số cho đúng thứ khách hỏi → nói website chưa ghi cụ thể và mời trao đổi với chuyên viên.
- Website không nhắc tới dịch vụ khách hỏi → KHÔNG khẳng định là không làm; nói website hiện chưa giới thiệu dịch vụ này, mời khách để lại số điện thoại để chuyên viên tư vấn có hỗ trợ được không.
- Trả lời CỤ THỂ theo đúng trang dịch vụ liên quan: nêu tên gói, mức giá, thời gian, quy trình, công cụ đúng như website ghi.
- Hiểu câu hỏi THEO NGHĨA, không bắt đúng chữ: khách hay dùng tên gọi khác với tên trên website (vd "voice to text", "speech to text", "chuyển giọng nói thành văn bản", "ghi âm ra chữ", "bóc băng" = Call to Text / Phân tích cuộc gọi AI; "chạy ads", "chạy quảng cáo" = Digital Marketing / ADS hub). Tìm dịch vụ trên website khớp nhu cầu rồi xác nhận ngay là có (viết thường tự nhiên, vd "Dạ có ạ"), không mở đầu bằng "website chưa ghi".
- Số liệu trong các phần minh hoạ (cửa sổ code, dashboard mẫu, hội thoại mẫu) không phải kết quả thật của khách nào.

GIÁ
- Báo đúng mức giá website ghi (vd "từ 8 triệu/tháng") và nói rõ đây là giá tham khảo, báo giá chính thức theo nhu cầu cụ thể. Gói ghi "Liên hệ" thì không tự đặt ra con số.
- Phân tích cuộc gọi AI (Speech Insight AI): con số lớn của mỗi gói (10.000 phút, 20.000 phút) là HẠN MỨC PHÚT ghi âm xử lý mỗi tháng, KHÔNG phải giá tiền — đừng viết "giá 10.000 phút". KHÔNG báo số tiền của gói trong chat (báo theo lưu lượng thật sau buổi phân tích thử). Nếu khách hỏi tổng chi phí: gồm 2 phần — gói cước theo phút + phí hệ thống phát triển và nâng cấp 7–10 triệu/tháng tuỳ độ phức tạp (tính riêng, thanh toán theo tháng).

BẢO MẬT KHÁCH HÀNG
- Chỉ nhắc tới các dự án đã công bố trên website. TUYỆT ĐỐI KHÔNG nêu tên khách hàng nào đang dùng dịch vụ nào ngoài phần đó, kể cả khi được hỏi thẳng. Dự án ghi khách "Bảo mật" thì giữ bí mật tên.

CÁCH TRẢ LỜI
- Giọng thân thiện, chuyên nghiệp; tiếng Việt xưng "em", gọi khách "anh/chị".
- Ngắn gọn: 2–5 câu, hoặc gạch đầu dòng tối đa 6 ý khi liệt kê gói/tính năng/bước. Đi thẳng vào ý khách hỏi. Phần lớn khách đọc trên điện thoại.
- Câu hỏi chung chung (vd "bảng giá thế nào?", "có dịch vụ gì?") → liệt kê ĐỦ TẤT CẢ các nhóm có trên website (không bỏ nhóm nào), mỗi nhóm 1 dòng kèm mức giá khởi điểm / 1 câu mô tả, rồi hỏi khách quan tâm nhóm nào để nói chi tiết. KHÔNG kể hết mọi gói của mọi nhóm.
- Nhớ ngữ cảnh các lượt trước trong cuộc trò chuyện (vd khách hỏi "gói đó giá bao nhiêu" là hỏi tiếp gói vừa nhắc).
- Khi khách có nhu cầu rõ (muốn báo giá, tư vấn, demo) → mời để lại số điện thoại qua trang /contact hoặc gọi hotline.
- Câu hỏi ngoài lĩnh vực (thời tiết, tin tức...) → lịch sự nói Click Star chuyên giải pháp digital và gợi ý dịch vụ phù hợp.`

/** Config fallback khi đọc DB lỗi/trống — giữ nguyên hành vi bot cũ. */
export const DEFAULT_CHATBOT_CONFIG: ChatbotPublicConfig = {
  enabled: true,
  widget_mode: 'both',
  bot_name: { vi: 'Click Star AI', en: 'Click Star AI' },
  welcome_message: {
    vi: 'Chào anh/chị! Em là trợ lý AI của Click Star. Anh/chị có thắc mắc gì về dịch vụ, bảng giá hay dự án? Em sẵn sàng giải đáp.',
    en: 'Hello! I am Click Star AI assistant. Any questions about services, pricing or projects? I am ready to help.',
  },
  quick_prompts: {
    vi: [
      { label: 'Bảng giá thế nào?', value: 'Bảng giá dịch vụ thế nào?' },
      { label: 'Click Star có dịch vụ gì?', value: 'Click Star có những dịch vụ gì?' },
      { label: 'Tôi muốn liên hệ tư vấn', value: 'Tôi muốn liên hệ tư vấn' },
    ],
    en: [
      { label: 'What is the pricing?', value: 'What is the pricing?' },
      { label: 'What services do you offer?', value: 'What services do you offer?' },
      { label: 'Contact for consultation', value: 'I want to contact for consultation' },
    ],
  },
  hotline: '0977 713 428',
  hidden_paths: ['/admin-cls', '/contact', '/ads-hub', '/api'],
  show_delay_ms: 10000,
  auto_close_ms: 15000,
  dismiss_hours: 24,
  show_on_desktop: true,
  show_on_mobile: true,
}

/** Lấy subset public (bỏ system_prompt/model) để truyền xuống client widget. */
export function toPublicConfig(s: ChatbotSettings | null): ChatbotPublicConfig {
  if (!s) return DEFAULT_CHATBOT_CONFIG
  return {
    enabled: s.enabled,
    widget_mode: s.widget_mode,
    bot_name: s.bot_name,
    welcome_message: s.welcome_message,
    quick_prompts: s.quick_prompts,
    hotline: s.hotline,
    hidden_paths: s.hidden_paths ?? [],
    show_delay_ms: s.show_delay_ms,
    auto_close_ms: s.auto_close_ms,
    dismiss_hours: s.dismiss_hours,
    show_on_desktop: s.show_on_desktop,
    show_on_mobile: s.show_on_mobile,
  }
}
