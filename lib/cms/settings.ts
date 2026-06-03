import { createClient } from '@/lib/supabase/server'
import type { I18n } from './types'

export type SiteSettings = {
  id: number
  site_name: I18n
  tagline: I18n
  site_url: string
  contact_email: string
  contact_phone: string
  address: I18n
  default_language: 'vi' | 'en'
  timezone: string
  facebook_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
  youtube_url: string | null
  zalo_url: string | null
  default_seo_title: I18n | null
  default_seo_description: I18n | null
  default_og_image: string | null
  logo_url: string | null
  favicon_url: string | null
  // Tracking / custom code — anh tự paste GTM, GA4, FB Pixel, verification meta...
  head_code: string | null
  body_start_code: string | null
  body_end_code: string | null
  updated_at: string
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  return (data as unknown as SiteSettings) || null
}
