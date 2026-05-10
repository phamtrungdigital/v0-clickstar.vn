import { TopBanner } from '@/components/layout/top-banner'
import { MainNav } from '@/components/layout/main-nav'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { AboutSection } from '@/components/sections/about-section'
import { StatsSection } from '@/components/sections/stats-section'
import { CaseStudiesSection } from '@/components/sections/case-studies-section'
import { TeamSection } from '@/components/sections/team-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FAQSection } from '@/components/sections/faq-section'
import { BlogSection } from '@/components/sections/blog-section'
import { CTASection } from '@/components/sections/cta-section'
import { Footer } from '@/components/layout/footer'
import { EditModeOverlay } from '@/components/edit-mode-overlay'
import { getPublishedPage } from '@/lib/cms/queries'
import { getSection } from '@/lib/cms/types'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const page = await getPublishedPage('home')
  if (!page) notFound()

  const hero = getSection(page, 'hero')
  const services = getSection(page, 'services')
  const about = getSection(page, 'about')
  const cta = getSection(page, 'cta')

  return (
    <div className="min-h-screen">
      <TopBanner />
      <MainNav />

      {hero && <HeroSection content={hero.content} />}
      {services && <ServicesSection content={services.content} />}
      {about && <AboutSection content={about.content} />}

      {/* Sections still hardcoded — will migrate in Phase 2A.2 */}
      <StatsSection />
      <CaseStudiesSection />
      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />

      {cta && <CTASection content={cta.content} />}

      <Footer />
      <EditModeOverlay />
    </div>
  )
}
