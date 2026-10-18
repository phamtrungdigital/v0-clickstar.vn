'use client'

import { AdsHubInterfaceDemo } from '@/components/ads-hub-demo'
import { useLanguage } from '@/contexts/language-context'
import type { AdsHubScreenshotsContent } from '@/lib/cms/types'

export function AdsHubScreenshots({ content }: { content: AdsHubScreenshotsContent }) {
  const { t } = useLanguage()
  return (
    <section
      data-cms-section="ads_hub_screenshots"
      className="py-20 lg:py-28 bg-[#f5f5f7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-[#144c97] font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}
            <span className="text-[#1859b8]">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p data-cms-field="description" className="text-muted-foreground text-lg">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {/* Demo giao diện chạy thật (React), thay cho dãy ảnh chụp màn hình */}
        <AdsHubInterfaceDemo items={content.items} />
      </div>
    </section>
  )
}
