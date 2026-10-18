/**
 * Công tắc module AI trong admin: viết hộ từng ô, tạo cả bài, ảnh bìa AI, dịch, và phần cấu hình khoá AI.
 *
 * MẶC ĐỊNH TẮT. Muốn bật lại: đặt NEXT_PUBLIC_AI_MODULE_ENABLED=true rồi build lại (biến NEXT_PUBLIC được gói lúc build).
 * Khi tắt:
 *  - mọi nút AI trong trình soạn thảo bị ẩn, mục menu chỉ còn "Chatbot website"
 *  - trang /admin-cls/ai không nạp khoá AI từ DB nên khoá không còn xuống trình duyệt
 *  - các API /api/admin/ai/* và server action AI trả lỗi, kể cả khi bị gọi thẳng
 * Không ảnh hưởng chatbot website và tính năng cá nhân hoá phía khách (đọc khoá bằng service role ở server).
 */
export const AI_MODULE_ENABLED = process.env.NEXT_PUBLIC_AI_MODULE_ENABLED === 'true'

export const AI_MODULE_OFF_MESSAGE = 'Module AI đang tắt.'

/** Phản hồi cho API route khi module AI tắt. */
export function aiModuleOffResponse(): Response {
  return Response.json({ error: AI_MODULE_OFF_MESSAGE }, { status: 404 })
}
