import type { Lang } from '@/lib/i18n/locale'

/**
 * Nhãn chủ đề (tag) của bài viết/dự án là chuỗi một thứ tiếng nhập trong admin. Bản /en dịch các nhãn tiếng Việt
 * đã dùng; nhãn khác (AI, CRM, SEO, Claude...) giữ nguyên. Thêm nhãn tiếng Việt mới thì thêm vào bảng này.
 */
const TAGS_EN: Record<string, string> = {
  'công nghệ': 'Technology',
  'bảo mật': 'Security',
  'kỹ năng': 'Skills',
  'pháp lý': 'Legal',
  'tin tức': 'News',
  'thiết kế website': 'Website design',
  'dashboard dữ liệu': 'Data dashboard',
}

export function tagLabel(lang: Lang, tag: string): string {
  if (lang !== 'en') return tag
  return TAGS_EN[tag.trim().toLowerCase()] || tag
}
