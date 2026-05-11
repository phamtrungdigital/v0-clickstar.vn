import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/sections/page-hero'
import { PricingTiers } from '@/components/sections/pricing-tiers'
import { CTASectionDynamic } from '@/components/sections/cta-section-dynamic'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <MainNav />
      <PageHero />
      <PricingTiers />
      <CTASectionDynamic />
      <Footer />
    </div>
  )
}
