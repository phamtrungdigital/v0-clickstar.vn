'use client'

import { useLanguage } from '@/contexts/language-context'
import { usePageSection } from '@/lib/cms/page-data-context'

export function ProcessSteps() {
  const { t } = useLanguage()
  const section = usePageSection('process_steps')
  if (!section) return null
  const content = section.content
  const isDark = !!content.dark_theme

  return (
    <section
      data-cms-section="process_steps"
      className={isDark ? 'py-20 lg:py-28 bg-foreground text-background' : 'py-20 lg:py-28 bg-background'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span data-cms-field="eyebrow" className={`inline-flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-full mb-6 ${
            isDark ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-white' : 'bg-primary'}`} />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2 data-cms-field="heading" className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-balance ${
            isDark ? 'text-background' : 'text-foreground'
          }`}>
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p data-cms-field="description" className={`text-lg leading-relaxed ${isDark ? 'text-background/70' : 'text-muted-foreground'}`}>
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {content.steps.map((step, idx) => (
            <div
              key={idx}
              data-cms-field="step"
              data-cms-item-index={idx}
              className={`relative rounded-2xl p-6 ${
                isDark ? 'bg-background/5 border border-background/10' : 'bg-card border border-border'
              }`}
            >
              <div className={`absolute -top-4 left-6 inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                isDark ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'
              }`}>
                {step.step_number}
              </div>

              <div className="pt-4">
                <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-background' : 'text-foreground'}`}>
                  {t(step.title.vi, step.title.en)}
                </h3>
                <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {t(step.description.vi, step.description.en)}
                </p>
                {step.duration?.vi && (
                  <span className={`inline-block text-[10px] uppercase font-semibold px-2 py-1 rounded ${
                    isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                  }`}>
                    {t(step.duration.vi, step.duration.en)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
