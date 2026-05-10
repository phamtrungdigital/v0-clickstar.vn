// Bilingual string
export type I18n = { vi: string; en: string }

// Section types we currently support in CMS.
// Other section types still render hardcoded — will migrate later.
export type SectionType = 'hero' | 'services' | 'about' | 'cta'

export type HeroContent = {
  badge: I18n
  // Heading is segmented for highlights:
  // <lead> <span class="primary">{number}</span> <middle> <span class="primary">{highlight}</span> <tail>
  heading_lead: I18n
  heading_number: string
  heading_middle: I18n
  heading_highlight: I18n
  heading_tail: I18n
  description: I18n
  cta_label: I18n
  cta_href: string
  support_label: I18n
  support_phone: string
  image_src: string
  image_alt: I18n
}

export type ServiceItem = {
  icon: string // lucide-react icon name (e.g. 'Megaphone', 'Globe')
  title: I18n
  description: I18n
  tag: I18n
  color: 'blue' | 'purple' | 'pink' | 'amber' | 'emerald' | 'cyan'
}

export type ServicesContent = {
  eyebrow: I18n
  // <lead> <span class="primary">{highlight}</span>
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  services: ServiceItem[]
  footer_link_prefix: I18n
  footer_link_label: I18n
  footer_link_href: string
  pipeline_eyebrow: I18n
  pipeline_heading: I18n
  pipeline_subtitle: I18n
  pipeline_image_src: string
  pipeline_image_alt: I18n
}

export type AboutContent = {
  eyebrow: I18n
  // <lead> <span class="primary">{highlight}</span>
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  stat1_value: string
  stat1_label: I18n
  stat2_value: string
  stat2_label: I18n
  stat3_value: string
  stat3_label: I18n
  cta_label: I18n
  cta_href: string
  thumbnail_src: string
  video_embed_url: string
  video_duration: string
}

export type CtaContent = {
  eyebrow: I18n
  // <lead> <span class="primary">{highlight}</span>
  heading_lead: I18n
  heading_highlight: I18n
  cta_label: I18n
  cta_href: string
  phone_label: I18n
  phone: string
  trust_label: I18n
  partner_names: string[]
}

// Discriminated union of section data
export type Section =
  | { id: string; type: 'hero'; enabled: boolean; content: HeroContent }
  | { id: string; type: 'services'; enabled: boolean; content: ServicesContent }
  | { id: string; type: 'about'; enabled: boolean; content: AboutContent }
  | { id: string; type: 'cta'; enabled: boolean; content: CtaContent }

export type Page = {
  id: string
  slug: string
  title: string
  sections: Section[]
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

// Convenience: typed lookup for a specific section type within a Page
export function getSection<T extends SectionType>(
  page: Page | null,
  type: T
): Extract<Section, { type: T }> | null {
  if (!page) return null
  return (page.sections.find((s) => s.type === type && s.enabled) ?? null) as
    | Extract<Section, { type: T }>
    | null
}
