import type { Metadata } from 'next'
import Link from '@/components/app-link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, ArrowRight, ExternalLink, Briefcase } from 'lucide-react'
import { MarkdownLink } from '@/components/markdown-link'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedCaseStudyBySlug, getPublishedCaseStudies } from '@/lib/cms/case-studies'
import { makeT } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'
import { caseStudyHasEnglish, clientLabel } from '@/lib/cms/case-studies-types'
import { buildMetadata, fitTitle } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema } from '@/lib/seo/schema'

/** Metadata của một dự án ở ngôn ngữ `lang` (dùng cho cả /projects/<slug> và /en/projects/<slug>). */
export async function projectMetadata({ slug, lang }: { slug: string; lang: Lang }): Promise<Metadata> {
  const p = await getPublishedCaseStudyBySlug(slug)
  if (!p) return { title: lang === 'en' ? 'Project not found | Click Star' : 'Không tìm thấy dự án | Click Star' }
  const en = lang === 'en'
  // Tiêu đề dự án thường dài (70 đến 110 ký tự): rút còn vừa khung hiển thị của Google (tối đa khoảng 60 ký tự gồm cả thương hiệu).
  return buildMetadata({
    title: fitTitle((en && p.title_en) || p.title_vi, 46),
    description: (en && p.summary_en) || p.summary_vi,
    path: `/projects/${slug}`,
    lang,
    // Dự án chưa có bản tiếng Anh đủ nội dung: /en/projects/<slug> noindex và không khai báo hreflang
    hasEn: caseStudyHasEnglish(p),
    images: await ogImageOr(p.cover_image),
  })
}

/** Nội dung một dự án ở ngôn ngữ `lang`. */
export async function ProjectDetailView({ slug, lang }: { slug: string; lang: Lang }) {
  const project = await getPublishedCaseStudyBySlug(slug)
  if (!project) notFound()

  const t = makeT(lang)
  // Chữ hiển thị theo ngôn ngữ: bản /en dùng trường *_en (thiếu thì rơi về tiếng Việt)
  const L = (vi: string | null | undefined, en: string | null | undefined) => (lang === 'en' ? en || vi : vi) || ''
  const title = L(project.title_vi, project.title_en)
  const summary = L(project.summary_vi, project.summary_en)
  const industry = L(project.industry_vi, project.industry_en)
  const body = L(project.body_vi, project.body_en)
  const client = clientLabel(lang, project.client_name)

  // Related projects: cùng industry hoặc share tag
  const allPublished = await getPublishedCaseStudies(20)
  const related = allPublished
    .filter((p) => p.id !== project.id)
    .filter(
      (p) =>
        (project.industry_vi && p.industry_vi === project.industry_vi) ||
        p.tags.some((t) => project.tags.includes(t)),
    )
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: t('Trang chủ', 'Home'), path: '/' },
            { name: t('Dự án', 'Projects'), path: '/projects' },
            { name: title, path: `/projects/${slug}` },
          ],
          lang
        )}
      />
      <MainNav />

      {/* Hero */}
      <section className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Tất cả dự án', 'All projects')}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {industry && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-[#144c97] text-xs font-semibold px-3 py-1.5 rounded-full">
                <Briefcase className="w-3 h-3" />
                {industry}
              </span>
            )}
            {client && (
              <span className="text-sm text-muted-foreground">
                {t('Khách hàng:', 'Client:')} <span className="font-semibold text-foreground">{client}</span>
              </span>
            )}
          </div>

          <h1 className="text-[26px] sm:text-3xl lg:text-[32px] font-bold text-foreground leading-[1.25] tracking-tight mb-5 text-balance">
            {title}
          </h1>

          {summary && (
            <p className="text-lg text-muted-foreground max-w-3xl">{summary}</p>
          )}

          {/* Metrics row */}
          {project.metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 max-w-3xl">
              {project.metrics.map((m, i) => (
                <div key={i} className="bg-white border border-border/50 rounded-xl p-4 lg:p-5 shadow-sm">
                  <div className="text-2xl lg:text-3xl font-extrabold text-[#1859b8] mb-1">{m.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{L(m.label_vi, m.label_en)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cover image */}
      {project.cover_image && (
        <section className="py-8 lg:py-12 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
              <Image quality={95}
                src={project.cover_image}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </section>
      )}

      {/* Body markdown */}
      {body && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl lg:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg lg:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-justify prose-li:text-justify prose-p:hyphens-auto prose-li:hyphens-auto prose-img:rounded-xl prose-a:text-primary hover:prose-a:underline">
              <ReactMarkdown components={{ a: ({ node: _n, ...props }) => <MarkdownLink {...props} /> }}>{body}</ReactMarkdown>
            </article>
          </div>
        </section>
      )}

      {/* External link button if project_url */}
      {project.project_url && (
        <section className="pb-12 lg:pb-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-[#1859b8] font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              {t('Truy cập website khách hàng', 'Visit the live website')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-foreground mb-8">{t('Dự án liên quan', 'Related projects')}</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {p.cover_image && (
                      <Image quality={95}
                        src={p.cover_image}
                        alt={L(p.title_vi, p.title_en)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    {clientLabel(lang, p.client_name) && (
                      <p className="text-xs text-muted-foreground uppercase mb-1">{clientLabel(lang, p.client_name)}</p>
                    )}
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {L(p.title_vi, p.title_en)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {t('Quan tâm đến giải pháp tương tự?', 'Interested in a similar solution?')}
          </h2>
          <p className="text-white/70 mb-6">
            {t('Đặt lịch tư vấn miễn phí với đội ngũ Click Star', 'Book a free consultation with the Click Star team')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-lg"
          >
            {t('Nhận tư vấn ngay', 'Get in touch now')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
