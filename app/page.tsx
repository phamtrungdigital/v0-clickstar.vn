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
import type { Section } from '@/lib/cms/types'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

function renderSection(section: Section) {
  if (!section.enabled) return null
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} content={section.content} />
    case 'services':
      return <ServicesSection key={section.id} content={section.content} />
    case 'about':
      return <AboutSection key={section.id} content={section.content} />
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
      return <BlogSection key={section.id} content={section.content} />
    case 'cta':
      return <CTASection key={section.id} content={section.content} />
  }
}

export default async function Home() {
  const page = await getPublishedPage('home')
  if (!page) notFound()

  return (
    <div className="min-h-screen">
      <TopBanner />
      <MainNav />

      {page.sections.map((section) => renderSection(section))}

      <Footer />
      <EditModeOverlay />
    </div>
  )
}
