import nextDynamic from 'next/dynamic'
import { MainNav } from '@/components/layout/main-nav'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { AboutSection } from '@/components/sections/about-section'
import { StatsSection } from '@/components/sections/stats-section'
import { TeamSection } from '@/components/sections/team-section'
import { FAQSection } from '@/components/sections/faq-section'
import { BlogSection } from '@/components/sections/blog-section'
import { CTASection } from '@/components/sections/cta-section'
import { ClientLogos } from '@/components/sections/client-logos'
import { LogoMarquee } from '@/components/sections/logo-marquee'
import { Footer } from '@/components/layout/footer'
import { Reveal } from '@/components/ui/reveal'
// EditModeOverlay moved to app/layout.tsx — covers all pages now
import { getPublishedPage } from '@/lib/cms/queries'
import { getLatestPosts, type LatestPost } from '@/lib/cms/posts'
import { getSection, type AboutTimelineItem, type I18n, type Section } from '@/lib/cms/types'
import { notFound } from 'next/navigation'
import type { Lang } from '@/lib/i18n/locale'
import { JsonLd } from '@/components/seo/json-ld'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import { getSiteSettings } from '@/lib/cms/settings'

const CaseStudiesSection = nextDynamic(() =>
  import('@/components/sections/case-studies-section').then((m) => m.CaseStudiesSection),
)
const TestimonialsSection = nextDynamic(() =>
  import('@/components/sections/testimonials-section').then((m) => m.TestimonialsSection),
)

type AboutExtra = { timeline?: AboutTimelineItem[]; industries?: I18n[] }

function renderSection(section: Section, extra: AboutExtra, latestPosts: LatestPost[]) {
  if (!section.enabled) return null
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} content={section.content} />
    case 'services':
      return <ServicesSection key={section.id} content={section.content} />
    case 'about':
      return <AboutSection key={section.id} content={section.content} timeline={extra.timeline} industries={extra.industries} />
    case 'stats':
      return <StatsSection key={section.id} content={section.content} />
    case 'case_studies':
      return <CaseStudiesSection key={section.id} content={section.content} />
    case 'team':
      return <TeamSection key={section.id} content={section.content} />
    case 'testimonials':
      return <TestimonialsSection key={section.id} content={section.content} />
    case 'faq':
      return <FAQSection key={section.id} content={section.content} />
    case 'blog':
      return <BlogSection key={section.id} content={section.content} posts={latestPosts} />
    case 'cta':
      return <CTASection key={section.id} content={section.content} />
    case 'client_logos':
      return <ClientLogos key={section.id} content={section.content} />
    case 'logo_marquee':
      return <LogoMarquee key={section.id} content={section.content} />
    case 'code_terminal':
      // Khối terminal không nằm trong thiết kế mới của trang chủ
      return null
  }
}

/**
 * Khối Tin tức đứng thứ 3 trên trang chủ: ngay sau thanh logo (khối thứ 2), trước Dịch vụ.
 * Không có thanh logo thì đứng ngay sau khối đầu trang.
 */
function orderNewsAfterLogos(sections: Section[]): Section[] {
  const news = sections.filter((s) => s.type === 'blog')
  if (news.length === 0) return sections
  const rest = sections.filter((s) => s.type !== 'blog')
  const logoIdx = rest.findIndex((s) => s.type === 'logo_marquee')
  const at = logoIdx >= 0 ? logoIdx + 1 : Math.min(1, rest.length)
  return [...rest.slice(0, at), ...news, ...rest.slice(at)]
}

/** Nội dung trang chủ, dùng cho cả bản tiếng Việt (app/page.tsx) và bản /en (app/en/page.tsx). */
export async function HomeView({ lang = 'vi' }: { lang?: Lang }) {
  const [page, aboutPage, latestPosts, settings] = await Promise.all([getPublishedPage('home'), getPublishedPage('about'), getLatestPosts(4), getSiteSettings()])
  if (!page) notFound()
  // Khối About ở trang chủ dùng lại mốc phát triển và ngành nghề của trang Giới thiệu (một nguồn nhập liệu)
  const extra: AboutExtra = {
    timeline: getSection(aboutPage, 'about_timeline')?.content.items,
    industries: getSection(aboutPage, 'about_story')?.content.industries,
  }

  return (
    <div className="min-h-screen theme-apple">
      <JsonLd data={[organizationSchema(settings, lang), websiteSchema(settings, lang)]} />
      {/* Theo mockup Apple: bỏ banner khuyến mãi, ô hỏi AI giữa trang và khối terminal khỏi dòng chính.
          AI vẫn có nút nổi (FloatingAiServiceRouter); muốn bật lại banner/ô AI chỉ cần thêm lại 2 dòng này. */}
      <MainNav />

      {orderNewsAfterLogos(page.sections).map((section) => {
        const node = renderSection(section, extra, latestPosts)
        if (!node) return <div key={section.id} />
        // Hiện dần khi cuộn tới. Không bọc: hero (có hiệu ứng vào riêng), thanh logo/công nghệ và khối dịch vụ, FAQ (đã tự có hiệu ứng bên trong).
        const own = ['hero', 'logo_marquee', 'services', 'faq'].includes(section.type)
        return <div key={section.id}>{own ? node : <Reveal>{node}</Reveal>}</div>
      })}

      <Footer />
    </div>
  )
}
