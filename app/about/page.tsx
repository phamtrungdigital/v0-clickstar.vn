'use client'

import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { AboutHero } from './_components/about-hero'
import { StatsSection } from '@/components/sections/stats-section'
import { TeamSection } from '@/components/sections/team-section'
import { CTASection } from '@/components/sections/cta-section'
import { AboutStorySection } from '@/components/sections/about-story'
import { AboutValuesSection } from '@/components/sections/about-values'
import { AboutTimelineSection } from '@/components/sections/about-timeline'
import { AboutWhyChooseUsSection } from '@/components/sections/about-why-choose-us'
import { usePageSection } from '@/lib/cms/page-data-context'

export default function AboutPage() {
  const statsSection = usePageSection('stats')
  const storySection = usePageSection('about_story')
  const valuesSection = usePageSection('about_values')
  const timelineSection = usePageSection('about_timeline')
  const teamSection = usePageSection('team')
  const whyChooseUsSection = usePageSection('about_why_choose_us')
  const ctaSection = usePageSection('cta')

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      {/* All sections CMS-driven via pages.about + PageDataProvider in layout.tsx */}
      <AboutHero />
      {statsSection && <StatsSection content={statsSection.content} />}
      {storySection && <AboutStorySection content={storySection.content} />}
      {valuesSection && <AboutValuesSection content={valuesSection.content} />}
      {timelineSection && <AboutTimelineSection content={timelineSection.content} />}
      {teamSection && <TeamSection content={teamSection.content} />}
      {whyChooseUsSection && <AboutWhyChooseUsSection content={whyChooseUsSection.content} />}
      {ctaSection && <CTASection content={ctaSection.content} />}

      <Footer />
    </div>
  )
}
