// Bilingual string
export type I18n = { vi: string; en: string }

export type SectionType =
  | 'hero'
  | 'page_hero'
  | 'services'
  | 'about'
  | 'stats'
  | 'case_studies'
  | 'team'
  | 'testimonials'
  | 'faq'
  | 'blog'
  | 'cta'
  | 'pricing_tiers'
  | 'problems_grid'
  | 'feature_grid'
  | 'process_steps'
  | 'about_story'
  | 'about_values'
  | 'about_timeline'
  | 'about_why_choose_us'
  | 'pricing_tabs_nav'
  | 'pricing_setup_addons'
  | 'pricing_grouped_tiers'
  | 'ads_hub_screenshots'
  | 'client_logos'

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

// ---------- Page Hero (for sub-pages: about, pricing, services/*) ----------
// Simpler hero than home — text-only, no image, single heading line.
export type PageHeroContent = {
  badge: I18n
  heading: I18n  // full heading (may include highlighted span via {} convention later)
  description: I18n
  cta_label: I18n
  cta_href: string
}

// ---------- Services ----------
export type ServiceItem = {
  icon: string
  title: I18n
  description: I18n
  tag: I18n
  color: 'blue' | 'purple' | 'pink' | 'amber' | 'emerald' | 'cyan' | 'teal'
  href?: string
  /** Nhãn nhỏ góc phải thẻ (vd "MỚI"/"NEW") — để trống thì không hiện */
  badge?: I18n
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

// ---------- Pricing Tiers ----------
export type PricingTierItem = {
  name: I18n
  description: I18n
  price: I18n
  price_period?: I18n // e.g. "/tháng" or "Liên hệ"
  popular: boolean
  features: I18n[] // array of feature strings (bilingual)
  cta_label: I18n
  cta_href: string
}

export type PricingTiersContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  tiers: PricingTierItem[]
  disclaimer?: I18n // "Tất cả gói có thể tùy chỉnh..."
}

// ---------- Problems & Solutions Grid ----------
export type ProblemItem = {
  icon: string // lucide-react icon
  problem: I18n
  solution: I18n
  color: 'blue' | 'purple' | 'pink' | 'amber' | 'emerald' | 'cyan' | 'rose'
}

export type ProblemsGridContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  items: ProblemItem[]
}

// ---------- Generic Feature Grid (4-6 cards) ----------
export type FeatureItem = {
  icon: string
  title: I18n
  description: I18n
  color: 'blue' | 'purple' | 'pink' | 'amber' | 'emerald' | 'cyan' | 'rose'
}

export type FeatureGridContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  items: FeatureItem[]
  // 'cards-3': 3 columns, 'cards-2': 2 columns
  columns?: 2 | 3 | 4
}

// ---------- Process Steps Timeline ----------
export type ProcessStepItem = {
  step_number: string // "01", "02", ...
  title: I18n
  description: I18n
  duration?: I18n // e.g. "1-2 tuần"
}

export type ProcessStepsContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  steps: ProcessStepItem[]
  dark_theme?: boolean // some pages have dark bg for this section
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

// ---------- About Page custom sections ----------
// (unique to /about — Story image + paragraphs + industries pills)
export type AboutStoryContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  image: string
  image_alt: I18n
  paragraphs: I18n[] // 1-5 paragraphs
  industries_label: I18n
  industries: I18n[] // chip list
  stat_value: string // e.g. "10+"
  stat_label: I18n
}

// Values: 4 cards with icon + title + description
export type AboutValueItem = {
  icon: string // lucide-react icon name
  title: I18n
  description: I18n
}
export type AboutValuesContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  items: AboutValueItem[]
}

// Timeline: 5 milestones year + title + description (dark theme)
export type AboutTimelineItem = {
  year: string
  title: I18n
  description: I18n
}
export type AboutTimelineContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  items: AboutTimelineItem[]
}

// Why Choose Us: heading + checkmark list + image gallery (2x2 staggered)
export type AboutWhyChooseUsImage = {
  src: string
  alt: I18n
  aspect: '4/3' | '4/5'
}
export type AboutWhyChooseUsContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  features: I18n[] // checkmark list
  cta_label: I18n
  cta_href: string
  images: AboutWhyChooseUsImage[] // 4 images
}

// ---------- Pricing Tabs Nav (sticky scroll-spy nav) ----------
export type PricingTabItem = {
  label: I18n
  anchor: string // CSS selector id of target pricing_tiers section, e.g. "marketing-pricing"
}
export type PricingTabsNavContent = {
  tabs: PricingTabItem[]
  hint?: I18n // small text dưới tabs (optional)
}

// ---------- Pricing Setup Add-ons (one-time costs table) ----------
export type PricingAddonItem = {
  name: I18n
  description: I18n
  price: I18n // "Từ 20tr" hoặc "Liên hệ"
  duration?: I18n // "2-4 tuần"
}
export type PricingSetupAddonsContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  items: PricingAddonItem[]
}

// ---------- Pricing Grouped Tiers (tabs in 1 section, only 1 group visible at a time) ----------
export type PricingTierGroup = {
  id: string // unique within section, used as tab key
  label: I18n // tab label
  badge?: I18n // optional small text badge on tab (e.g. "Phổ biến")
  tiers: PricingTierItem[]
  disclaimer?: I18n // hint text dưới group tiers (e.g. "Phí ads tính riêng...")
}

export type PricingGroupedTiersContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  groups: PricingTierGroup[]
}

// ---------- ADS Hub Screenshots Gallery (grid với image + title + caption) ----------
export type AdsHubScreenshotItem = {
  image: string
  title: I18n
  caption: I18n
}
export type AdsHubScreenshotsContent = {
  eyebrow: I18n
  heading_lead: I18n
  heading_highlight: I18n
  description: I18n
  items: AdsHubScreenshotItem[]
}

// ---------- Client Logos (dải logo khách hàng — bằng chứng uy tín) ----------
/**
 * ⚠️ Logo ở đây là của DOANH NGHIỆP KHÁC. Chỉ đăng khi khách đã đồng ý cho dùng
 * nhãn hiệu (điều khoản hợp đồng hoặc email xác nhận) — anh Trung nắm phần này.
 * `name` KHÔNG hiển thị trên giao diện, nó là alt text cho trình đọc màn hình
 * và cho trường hợp ảnh lỗi, nên vẫn phải điền.
 */
export type ClientLogoItem = {
  logo: string // URL ảnh, upload trong admin (Supabase Storage)
  name: I18n // tên khách — dùng làm alt, bắt buộc điền
  href?: string // link website khách (tuỳ chọn)
}

/**
 * Cỡ logo. Với logo VUÔNG thì CHIỀU CAO ô quyết định logo to hay bé —
 * `object-contain` co ảnh vừa cạnh ngắn nhất, nên nới chiều rộng không ăn thua.
 * Cỡ càng lớn thì số cột càng giảm để logo có chỗ thở.
 */
export type ClientLogoSize = 'md' | 'lg' | 'xl'

export type ClientLogosContent = {
  eyebrow: I18n // dòng chữ nhỏ phía trên, vd "ĐƯỢC TIN DÙNG BỞI"
  size?: ClientLogoSize // thiếu field = 'lg' (mặc định), không cần sửa DB cũ
  items: ClientLogoItem[]
}

// ---------- Discriminated union ----------
export type Section =
  | { id: string; type: 'hero'; enabled: boolean; content: HeroContent }
  | { id: string; type: 'page_hero'; enabled: boolean; content: PageHeroContent }
  | { id: string; type: 'services'; enabled: boolean; content: ServicesContent }
  | { id: string; type: 'about'; enabled: boolean; content: AboutContent }
  | { id: string; type: 'stats'; enabled: boolean; content: StatsContent }
  | { id: string; type: 'case_studies'; enabled: boolean; content: CaseStudiesContent }
  | { id: string; type: 'team'; enabled: boolean; content: TeamContent }
  | { id: string; type: 'testimonials'; enabled: boolean; content: TestimonialsContent }
  | { id: string; type: 'faq'; enabled: boolean; content: FaqContent }
  | { id: string; type: 'blog'; enabled: boolean; content: BlogContent }
  | { id: string; type: 'cta'; enabled: boolean; content: CtaContent }
  | { id: string; type: 'pricing_tiers'; enabled: boolean; content: PricingTiersContent }
  | { id: string; type: 'problems_grid'; enabled: boolean; content: ProblemsGridContent }
  | { id: string; type: 'feature_grid'; enabled: boolean; content: FeatureGridContent }
  | { id: string; type: 'process_steps'; enabled: boolean; content: ProcessStepsContent }
  | { id: string; type: 'about_story'; enabled: boolean; content: AboutStoryContent }
  | { id: string; type: 'about_values'; enabled: boolean; content: AboutValuesContent }
  | { id: string; type: 'about_timeline'; enabled: boolean; content: AboutTimelineContent }
  | { id: string; type: 'about_why_choose_us'; enabled: boolean; content: AboutWhyChooseUsContent }
  | { id: string; type: 'pricing_tabs_nav'; enabled: boolean; content: PricingTabsNavContent }
  | { id: string; type: 'pricing_setup_addons'; enabled: boolean; content: PricingSetupAddonsContent }
  | { id: string; type: 'pricing_grouped_tiers'; enabled: boolean; content: PricingGroupedTiersContent }
  | { id: string; type: 'client_logos'; enabled: boolean; content: ClientLogosContent }
  | { id: string; type: 'ads_hub_screenshots'; enabled: boolean; content: AdsHubScreenshotsContent }

export type Page = {
  id: string
  slug: string
  title: string
  sections: Section[]
  seo_title: I18n | null
  seo_description: I18n | null
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
