'use client'

import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { AdsHubHero } from '@/components/sections/ads-hub-hero'
import { FeatureGrid } from '@/components/sections/feature-grid'
import { AdsHubScreenshots } from '@/components/sections/ads-hub-screenshots'
import { PricingGroupedTiers } from '@/components/sections/pricing-grouped-tiers'
import { FAQSection } from '@/components/sections/faq-section'
import { CTASection } from '@/components/sections/cta-section'
import { usePageSection } from '@/lib/cms/page-data-context'

export default function AdsHubPage() {
  const screenshots = usePageSection('ads_hub_screenshots')
  const pricing = usePageSection('pricing_grouped_tiers')
  const faq = usePageSection('faq')
  const cta = usePageSection('cta')

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <AdsHubHero />
      <div id="features">
        <FeatureGrid />
      </div>
      {screenshots && <AdsHubScreenshots content={screenshots.content} />}
      {pricing && <PricingGroupedTiers content={pricing.content} />}
      {faq && <FAQSection content={faq.content} />}
      {cta && <CTASection content={cta.content} />}

      <Footer />
    </div>
  )
}
