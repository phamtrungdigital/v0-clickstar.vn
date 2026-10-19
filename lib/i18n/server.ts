import { cookies } from 'next/headers'
import type { I18n } from '@/lib/cms/types'
import { getSiteSettings } from '@/lib/cms/settings'
import { DEFAULT_LANG } from '@/lib/seo/site'

export type Lang = 'vi' | 'en'

/**
 * Ngôn ngữ của khách trên server: cookie cs-lang nếu khách đã chọn, nếu chưa thì dùng ngôn ngữ mặc định của
 * website (site_settings.default_language, hiện là 'vi'). Công cụ tìm kiếm không có cookie nên luôn thấy bản mặc định.
 */
export async function getServerLang(): Promise<Lang> {
  const store = await cookies()
  const saved = store.get('cs-lang')?.value
  if (saved === 'vi' || saved === 'en') return saved
  const settings = await getSiteSettings()
  return settings?.default_language === 'en' ? 'en' : DEFAULT_LANG
}

/** Build a `t(vi, en)` function for a given language. */
export function makeT(lang: Lang) {
  return (vi: string, en: string) => (lang === 'vi' ? vi : en)
}

/** Pick a field from an i18n value for a given language. */
export function pickI18n(lang: Lang, value: I18n | undefined | null): string {
  if (!value) return ''
  return value[lang] || value.vi || ''
}

export const LOCALES: Record<Lang, string> = {
  vi: 'vi-VN',
  en: 'en-US',
}
