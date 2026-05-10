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

export default function Home() {
  return (
    <div className="min-h-screen">
      <TopBanner />
      <MainNav />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* About + Video Section */}
      <AboutSection />

      {/* Stats Counter Section */}
      <StatsSection />

      {/* Case Studies Section */}
      <CaseStudiesSection />

      {/* Team Section */}
      <TeamSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
