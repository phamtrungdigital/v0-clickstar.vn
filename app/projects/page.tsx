import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedCaseStudies } from '@/lib/cms/case-studies'
import { getServerLang, makeT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dự án — Click Star Digital',
  description:
    'Tổng hợp các dự án Digital Marketing, Thiết kế Website, AI Integration, CRM/CDP mà Click Star đã triển khai cho khách hàng.',
}

export default async function ProjectsPage() {
  const projects = await getPublishedCaseStudies()
  const lang = await getServerLang()
  const t = makeT(lang)

  return (
    <div className="min-h-screen">
      <MainNav />

      {/* Hero */}
      <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,123,255,0.08),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Case Studies
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance">
              {t('Những dự án', 'Success stories')}{' '}
              <span className="text-primary">{t('Click Star đã đồng hành', 'Click Star has delivered')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t(
                'Từ E-commerce, Giáo dục đến Y tế và F&B — chúng tôi giúp doanh nghiệp đạt kết quả thực tế qua chuyển đổi số toàn diện.',
                'From e-commerce and education to healthcare and F&B — we help businesses achieve real results through end-to-end digital transformation.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {t('Chưa có dự án nào được đăng. Hãy quay lại sau!', 'No projects have been published yet — check back soon!')}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {p.cover_image ? (
                      <Image quality={95}
                        src={p.cover_image}
                        alt={p.title_vi}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <Briefcase className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {p.industry_vi && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full">
                        {p.industry_vi}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    {p.client_name && (
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {p.client_name}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {p.title_vi}
                    </h3>
                    {p.summary_vi && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{p.summary_vi}</p>
                    )}

                    {p.metrics.length > 0 && (
                      <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                        {p.metrics.slice(0, 3).map((m, i) => (
                          <div key={i}>
                            <div className="text-lg font-bold text-primary">{m.value}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {m.label_vi}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary pt-2">
                      {t('Xem chi tiết', 'View case study')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
            {t('Doanh nghiệp của anh/chị muốn', 'Ready for')}{' '}
            <span className="text-primary">{t('tăng trưởng đột phá', 'breakthrough growth')}</span>?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t(
              'Liên hệ Click Star để được tư vấn miễn phí giải pháp phù hợp với ngành nghề và quy mô.',
              'Talk to Click Star for a free consultation tailored to your industry and scale.',
            )}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            {t('Nhận tư vấn miễn phí', 'Get a free consultation')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
