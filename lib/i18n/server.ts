import type { I18n } from '@/lib/cms/types'
import type { Lang } from '@/lib/i18n/locale'

export type { Lang }

/**
 * Ngôn ngữ của trang KHÔNG đọc từ cookie nữa: do địa chỉ quyết định (/en/... là tiếng Anh, còn lại tiếng Việt, xem
 * lib/i18n/locale.ts). Mỗi route /en có file riêng và truyền `lang` xuống view, nên các trang đều có thể render tĩnh.
 */

/** Build a `t(vi, en)` function for a given language. */
export function makeT(lang: Lang) {
  return (vi: string, en: string) => (lang === 'vi' ? vi : en)
}

/** Pick a field from an i18n value for a given language (thiếu bản dịch thì dùng tiếng Việt). */
export function pickI18n(lang: Lang, value: I18n | undefined | null): string {
  if (!value) return ''
  return value[lang] || value.vi || ''
}

export const LOCALES: Record<Lang, string> = {
  vi: 'vi-VN',
  en: 'en-US',
}
