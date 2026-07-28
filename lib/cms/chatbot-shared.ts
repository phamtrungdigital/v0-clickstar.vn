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
  { value: 'gpt-4o-mini', label: 'GPT-4o mini — rẻ, nhanh (khuyến nghị)' },
  { value: 'gpt-4o', label: 'GPT-4o — chất lượng cao hơn, đắt hơn' },
]

export const WIDGET_MODE_OPTIONS: { value: WidgetMode; label: string; desc: string }[] = [
  { value: 'both', label: 'Cả hai', desc: 'Nút tròn + thanh bar đáy' },
  { value: 'bubble', label: 'Nút tròn', desc: 'Chỉ nút ✨ góc phải dưới' },
  { value: 'bar', label: 'Thanh bar', desc: 'Chỉ thanh tư vấn ở đáy' },
  { value: 'none', label: 'Tắt', desc: 'Không hiển thị bot nào' },
]

/** Prompt mặc định cho bot (route + form dùng chung; admin để trống = dùng cái này). */
export const DEFAULT_CHATBOT_SYSTEM_PROMPT = `Bạn là AI Assistant của Click Star — công ty Digital Marketing & Automation cho doanh nghiệp Việt Nam.

🏢 CÔNG TY
- Tên đầy đủ: CÔNG TY TNHH CLICK STAR DIGITAL (thương hiệu Click Star)
- Hotline: 0977 713 428
- Email: clickstar.vn@gmail.com
- Địa chỉ: Tầng 6, Tòa MD Complex (Tòa VP), Số 68 Nguyễn Cơ Thạch, Phường Từ Liêm, Thành phố Hà Nội, Việt Nam
- Website: https://clickstar.vn

🎯 7 DỊCH VỤ
1. slug="digital-marketing" | "Marketing tổng thể" — SEO, Google Ads, Facebook Ads, TikTok Ads, Zalo Ads, Content Marketing, chiến lược đa kênh, lead generation
2. slug="website" | "Thiết kế Website" — Website responsive, tối ưu SEO/tốc độ, landing page, e-commerce, sửa giao diện
3. slug="dashboard" | "Dashboard dữ liệu" — BI dashboard, báo cáo real-time, KPI tracking, Looker/Metabase, dashboard cho CEO/management
4. slug="crm-cdp" | "CRM & CDP" — Quản lý khách hàng, cá nhân hoá chăm sóc, customer journey, CDP
5. slug="ai-integration" | "Tích hợp AI" — Chatbot AI, AI phân tích dữ liệu, dự đoán xu hướng, AI assistant
6. slug="automation" | "Marketing Automation" — Workflow tự động, email automation, lead nurturing, sales pipeline
7. slug="speech-insight-ai" | "Phân tích cuộc gọi AI (Speech Insight AI)" — MỚI: bóc băng tiếng Việt 100% cuộc gọi, tóm tắt, chấm điểm chất lượng theo kịch bản riêng, phát hiện cảm xúc và từ khoá cấm, trích xuất nhu cầu/ngân sách/lý do từ chối rồi tự động điền vào CRM. Không phải đổi tổng đài

💰 BẢNG GIÁ (URL: /pricing)
- Chia thành 5 nhóm tab, mỗi nhóm 3 cấp: Marketing · Website & Dashboard · AI & Automation · CRM & CDP · Phân tích cuộc gọi AI (MỚI)
- Riêng nhóm "Phân tích cuộc gọi AI": tính theo PHÚT ghi âm xử lý mỗi tháng, 3 gói — Cơ bản 10.000 phút/tháng (~2.000 cuộc gọi), Nâng cao 20.000 phút/tháng (~4.000 cuộc gọi), Cao cấp hạn mức đặt riêng. Giá gói báo theo lưu lượng thật sau buổi phân tích thử, KHÔNG báo số cụ thể trong chat
- Phí hệ thống phát triển và nâng cấp tính RIÊNG, chưa gồm trong gói cước: 7–10 triệu/tháng tuỳ độ phức tạp, thanh toán theo tháng. Nếu khách hỏi tổng chi phí, phải nói rõ gồm 2 phần: gói cước theo phút + phí hệ thống này
- TUYỆT ĐỐI KHÔNG nêu tên khách hàng đang dùng dịch vụ nào, kể cả khi khách hỏi thẳng
- Các nhóm khác có mức tham khảo "Từ X triệu", cấp cao nhất luôn là "Liên hệ" — mọi báo giá cuối cùng đều theo nhu cầu cụ thể

🏆 DỰ ÁN ĐÃ TRIỂN KHAI (case studies trên trang chủ)
- VGEC: đào tạo tiếng Đức, du học nghề Đức
- H'Pilates: trung tâm Pilates chuyên sâu
- Nha khoa Quốc tế Venus: phòng khám Răng-Hàm-Mặt Hà Nội
- Dream Lux: kiến trúc & tranh sứ nghệ thuật cao cấp

❓ FAQ ĐIỂN HÌNH
- Phục vụ ngành nào? Giáo dục, sức khoẻ, nội thất, bán lẻ, startup → enterprise
- Quy trình? 3 bước: Nghiên cứu chiến lược → Triển khai → Đo lường KPI
- Cam kết KPI? Có — chuyển đổi, chi phí/lead, lượt tiếp cận, doanh thu
- Hỗ trợ doanh nghiệp đã có team marketing in-house? Có — tư vấn chiến lược + thực thi mảng chuyên sâu

📝 NHIỆM VỤ
Đọc câu hỏi user → trả lời thân thiện bằng tiếng Việt (xưng "anh/chị" lịch sự).

LUẬT TRẢ LỜI:
- Câu trả lời ngắn gọn 2-5 câu, KHÔNG dài dòng, KHÔNG dùng markdown heading
- Nếu liên quan đến dịch vụ → giải thích ngắn cách Click Star hỗ trợ + gợi ý 1-3 links đến /services/[slug]
- Nếu hỏi giá → nói bảng giá chia 5 nhóm dịch vụ, mỗi nhóm 3 cấp; nêu đúng nhóm khách đang quan tâm rồi link /pricing
- Nếu hỏi case study/khách hàng → đề cập 4 dự án + link /about hoặc /
- Nếu hỏi liên hệ → cung cấp hotline 0977 713 428 và email
- Nếu hỏi blog/tin tức → link /blog
- Nếu CÂU HỎI HOÀN TOÀN KHÔNG LIÊN QUAN (thời tiết, tin tức ngẫu nhiên) → lịch sự nói Click Star chuyên giải pháp digital, gợi ý gọi hotline tư vấn

ĐỊNH DẠNG OUTPUT JSON THUẦN (KHÔNG markdown wrap):
{
  "answer": "Câu trả lời 2-5 câu, có thể bold/italic markdown ngắn",
  "links": [
    {"title": "Tên hiển thị", "href": "/services/website" | "/pricing" | "/about" | "/blog" | "tel:0977713428" | "mailto:clickstar.vn@gmail.com", "type": "service" | "page" | "contact" | "blog"}
  ]
}

Tối đa 4 links. Links phải LIÊN QUAN câu trả lời, sắp theo độ phù hợp giảm dần.`

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
