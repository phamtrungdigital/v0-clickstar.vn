import type { I18n } from './types'

/** Nội dung tiếng Anh tối thiểu (ký tự) để bản /en của bài viết được coi là đã dịch đủ. Bản giữ chỗ ngắn không đạt. */
export const EN_MIN_CONTENT = 600

/**
 * Bài viết có bản tiếng Anh đủ nội dung chưa (tiêu đề + nội dung). Chưa có thì /en/blog/<slug> noindex.
 * Thuần (không import server) nên dùng được cả trong component client của admin.
 */
export function postHasEnglish(post: { title?: I18n | null; content?: I18n | null }): boolean {
  return !!post.title?.en?.trim() && (post.content?.en || '').trim().length >= EN_MIN_CONTENT
}
