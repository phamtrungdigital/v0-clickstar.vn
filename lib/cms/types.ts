// Bilingual string
export type I18n = { vi: string; en: string }

export type SectionType =
  | 'hero'
  | 'services'
  | 'about'
  | 'stats'
  | 'case_studies'
  | 'team'
  | 'testimonials'
  | 'faq'
  | 'blog'
  | 'cta'

// ---------- Hero ----------
export type HeroContent = {
  badge: I18n
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

// ---------- Services ----------
export type ServiceItem = {
  icon: string
  title: I18n
  description: I18n
  tag: I18n
  color: 'blue' | 'purple' | 'pink' | 'amber' | 'emerald' | 'cyan'
  href?: string
}

export type ServicesContent = {
  eyebrow: I18n
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

// ---------- About ----------
export type AboutContent = {
  eyebrow: I18n
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

// ---------- Stats ----------
export type StatItem = {
  value: number
  suffix: string
  label: I18n
}

export type StatsContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  items: StatItem[]
}

// ---------- Case Studies ----------
export type CaseStudyItem = {
  title: I18n
  image: string
  tags: string[]
  category: I18n
  href?: string
}

export type CaseStudiesContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  view_all_label: I18n
  view_all_href: string
  items: CaseStudyItem[]
}

// ---------- Team ----------
export type TeamMemberItem = {
  name: string
  role: I18n
  image: string
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
}

export type TeamContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  cta_label: I18n
  cta_href: string
  members: TeamMemberItem[]
}

// ---------- Testimonials ----------
export type TestimonialItem = {
  rating: number // 1-5
  quote: I18n
  name: string
  avatar: string
  source: I18n
}

export type TestimonialsContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  subtitle: I18n
  items: TestimonialItem[]
}

// ---------- FAQ ----------
export type FaqItem = {
  question: I18n
  answer: I18n
}

export type FaqContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  view_more_label: I18n
  view_more_href: string
  items: FaqItem[]
}

// ---------- Blog ----------
export type BlogPostItem = {
  title: I18n
  image: string
  tags: string[]
  date: I18n
  slug: string
}

export type BlogContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  subtitle: I18n
  read_more_label: I18n
  view_all_label: I18n
  view_all_href: string
  posts: BlogPostItem[]
}

// ---------- CTA ----------
export type CtaContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  cta_label: I18n
  cta_href: string
  phone_label: I18n
  phone: string
  trust_label: I18n
  partner_names: string[]
}

// ---------- Discriminated union ----------
export type Section =
  | { id: string; type: 'hero'; enabled: boolean; content: HeroContent }
  | { id: string; type: 'services'; enabled: boolean; content: ServicesContent }
  | { id: string; type: 'about'; enabled: boolean; content: AboutContent }
  | { id: string; type: 'stats'; enabled: boolean; content: StatsContent }
  | { id: string; type: 'case_studies'; enabled: boolean; content: CaseStudiesContent }
  | { id: string; type: 'team'; enabled: boolean; content: TeamContent }
  | { id: string; type: 'testimonials'; enabled: boolean; content: TestimonialsContent }
  | { id: string; type: 'faq'; enabled: boolean; content: FaqContent }
  | { id: string; type: 'blog'; enabled: boolean; content: BlogContent }
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

export function getSection<T extends SectionType>(
  page: Page | null,
  type: T
): Extract<Section, { type: T }> | null {
  if (!page) return null
  return (page.sections.find((s) => s.type === type && s.enabled) ?? null) as
    | Extract<Section, { type: T }>
    | null
}
