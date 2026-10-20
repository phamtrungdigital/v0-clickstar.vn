'use client'

import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/sections/page-hero'
import { PricingTiers } from '@/components/sections/pricing-tiers'
import { PricingTabsNav } from '@/components/sections/pricing-tabs-nav'
import { PricingGroupedTiers } from '@/components/sections/pricing-grouped-tiers'
import { PricingSetupAddons } from '@/components/sections/pricing-setup-addons'
import { FAQSection } from '@/components/sections/faq-section'
import { CTASectionDynamic } from '@/components/sections/cta-section-dynamic'
import { usePageData } from '@/lib/cms/page-data-context'
import type { Section } from '@/lib/cms/types'

export default function PricingPage() {
  const page = usePageData()
  const sections = page?.sections.filter((s) => s.enabled) ?? []

  return (
    <div className="min-h-screen">
      <MainNav />
      {sections.map((s) => renderSection(s))}
      <Footer />
    </div>
  )
}

function renderSection(section: Section) {
  switch (section.type) {
    case 'page_hero':
      return <PageHero key={section.id} />
    case 'pricing_tabs_nav':
      return <PricingTabsNav key={section.id} content={section.content} />
    case 'pricing_tiers':
      return <PricingTiers key={section.id} content={section.content} sectionId={section.id} />
    case 'pricing_grouped_tiers':
      return <PricingGroupedTiers key={section.id} content={section.content} />
    case 'pricing_setup_addons':
      return <PricingSetupAddons key={section.id} content={section.content} />
    case 'faq':
      return <FAQSection key={section.id} content={section.content} />
    case 'cta':
      return <CTASectionDynamic key={section.id} />
    default:
      return null
  }
}
