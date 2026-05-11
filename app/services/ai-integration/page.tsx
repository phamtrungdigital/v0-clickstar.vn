import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/sections/page-hero'
import { ProblemsGrid } from '@/components/sections/problems-grid'
import { FeatureGrid } from '@/components/sections/feature-grid'
import { ProcessSteps } from '@/components/sections/process-steps'
import { CTASectionDynamic } from '@/components/sections/cta-section-dynamic'

export default function AiIntegrationPage() {
  return (
    <div className="min-h-screen">
      <MainNav />
      <PageHero />
      <ProblemsGrid />
      <FeatureGrid />
      <ProcessSteps />
      <CTASectionDynamic />
      <Footer />
    </div>
  )
}
