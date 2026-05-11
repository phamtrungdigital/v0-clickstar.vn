import { cookies } from 'next/headers'
import type { I18n } from '@/lib/cms/types'

export type Lang = 'vi' | 'en'

/** Read the cs-lang cookie on the server. Defaults to 'vi'. */
export async function getServerLang(): Promise<Lang> {
  const store = await cookies()
  return store.get('cs-lang')?.value === 'en' ? 'en' : 'vi'
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
