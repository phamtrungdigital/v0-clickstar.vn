import type { Metadata } from 'next'
import Link from '@/components/app-link'
import Image from 'next/image'
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedCaseStudies } from '@/lib/cms/case-studies'
import { makeT } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'
import { caseStudyHasEnglish, clientLabel } from '@/lib/cms/case-studies-types'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema } from '@/lib/seo/schema'

/** Metadata của trang danh sách dự án ở ngôn ngữ `lang`. */
export async function projectsListMetadata(lang: Lang): Promise<Metadata> {
  const t = makeT(lang)
  return buildMetadata({
    title: t('Dự án đã triển khai: Website, CRM, Dashboard, AI', 'Delivered projects: websites, CRM, dashboards and AI'),
    description: t(
      'Tổng hợp các dự án Digital Marketing, Thiết kế Website, AI Integration, CRM/CDP mà Click Star đã triển khai cho khách hàng.',
      'A selection of the Digital Marketing, Website Design, AI Integration and CRM/CDP projects Click Star has delivered for clients.'
    ),
    path: '/projects',
    lang,
    images: await ogImageOr(),
  })
}

/** Danh sách dự án ở ngôn ngữ `lang`. Bản /en chỉ liệt kê dự án đã có bản tiếng Anh đủ nội dung. */
export async function ProjectsListView({ lang }: { lang: Lang }) {
  const all = await getPublishedCaseStudies()
  const projects = lang === 'en' ? all.filter(caseStudyHasEnglish) : all
  const t = makeT(lang)
  // Chữ hiển thị theo ngôn ngữ: bản /en dùng trường *_en (thiếu thì rơi về tiếng Việt)
  const L = (vi: string | null | undefined, en: string | null | undefined) => (lang === 'en' ? en || vi : vi) || ''

  return (
    <div className="min-h-screen">
      <JsonLd data={breadcrumbSchema([{ name: t('Trang chủ', 'Home'), path: '/' }, { name: t('Dự án', 'Projects'), path: '/projects' }], lang)} />
      <MainNav />

      {/* Hero */}
      <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-16 bg-[#f5f5f7] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(30,109,218,0.08),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-[#144c97] font-semibold text-sm px-4 py-2 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Case Studies
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance">
              {t('Dự án', 'Featured')}{' '}
              <span className="text-[#1859b8]">{t('tiêu biểu', 'projects')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t(
                'E-commerce, Giáo dục, Y tế và F&B.',
                'E-commerce, education, healthcare and F&B.',
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
              {projects.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {p.cover_image ? (
                      <Image quality={95}
                        src={p.cover_image}
                        alt={L(p.title_vi, p.title_en)}
                        fill
                        // Ảnh dự án đầu là phần tử lớn nhất màn hình đầu (LCP) trên điện thoại; 3 dự án đầu nằm trong màn hình đầu trên máy tính
                        priority={i === 0}
                        loading={i > 0 && i < 3 ? 'eager' : undefined}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f7]">
                        <Briefcase className="w-12 h-12 text-[#1859b8]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {L(p.industry_vi, p.industry_en) && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full">
                        {L(p.industry_vi, p.industry_en)}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    {clientLabel(lang, p.client_name) && (
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {clientLabel(lang, p.client_name)}
                      </p>
                    )}
                    <h2 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {L(p.title_vi, p.title_en)}
                    </h2>
                    {L(p.summary_vi, p.summary_en) && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{L(p.summary_vi, p.summary_en)}</p>
                    )}

                    {p.metrics.length > 0 && (
                      <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                        {p.metrics.slice(0, 3).map((m, i) => (
                          <div key={i}>
                            <div className="text-lg font-bold text-[#1859b8]">{m.value}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {L(m.label_vi, m.label_en)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1859b8] pt-2">
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
            <span className="text-[#1859b8]">{t('tăng trưởng đột phá', 'breakthrough growth')}</span>?
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
