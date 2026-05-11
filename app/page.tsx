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
  const stats = getSection(page, 'stats')
  const caseStudies = getSection(page, 'case_studies')
  const team = getSection(page, 'team')
  const testimonials = getSection(page, 'testimonials')
  const faq = getSection(page, 'faq')
  const blog = getSection(page, 'blog')
  const cta = getSection(page, 'cta')

  return (
    <div className="min-h-screen">
      <TopBanner />
      <MainNav />

      {hero && <HeroSection content={hero.content} />}
      {services && <ServicesSection content={services.content} />}
      {about && <AboutSection content={about.content} />}
      {stats && <StatsSection content={stats.content} />}
      {caseStudies && <CaseStudiesSection content={caseStudies.content} />}
      {team && <TeamSection content={team.content} />}
      {testimonials && <TestimonialsSection content={testimonials.content} />}
      {faq && <FAQSection content={faq.content} />}
      {blog && <BlogSection content={blog.content} />}
      {cta && <CTASection content={cta.content} />}

      <Footer />
      <EditModeOverlay />
    </div>
  )
}
