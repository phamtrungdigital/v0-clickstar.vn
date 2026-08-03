import nextDynamic from 'next/dynamic'
import { TopBanner } from '@/components/layout/top-banner'
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
import { TechPipeline } from '@/components/sections/tech-pipeline'
import { AiServiceRouter } from '@/components/sections/ai-service-router'
import { Footer } from '@/components/layout/footer'
// EditModeOverlay moved to app/layout.tsx — covers all pages now
import { getPublishedPage } from '@/lib/cms/queries'
import type { Section } from '@/lib/cms/types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const CaseStudiesSection = nextDynamic(() =>
  import('@/components/sections/case-studies-section').then((m) => m.CaseStudiesSection),
)
const TestimonialsSection = nextDynamic(() =>
  import('@/components/sections/testimonials-section').then((m) => m.TestimonialsSection),
)

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage('home')
  if (!page) return { title: 'ClickStar' }
  const title = page.seo_title?.vi || page.title
  const description = page.seo_description?.vi || ''
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page.og_image ? [page.og_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: page.og_image ? [page.og_image] : [],
    },
  }
}

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
    case 'client_logos':
      return <ClientLogos key={section.id} content={section.content} />
    case 'tech_pipeline':
      return <TechPipeline key={section.id} content={section.content} />
  }
}

export default async function Home() {
  const page = await getPublishedPage('home')
  if (!page) notFound()

  return (
    <div className="min-h-screen">
      <TopBanner />
      <MainNav />

      {page.sections.map((section, idx) => (
        <div key={section.id}>
          {renderSection(section)}
          {idx === 0 && <AiServiceRouter />}
        </div>
      ))}

      <Footer />
    </div>
  )
}
