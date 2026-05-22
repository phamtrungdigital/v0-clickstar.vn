import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, ArrowRight, ExternalLink, Briefcase } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getPublishedCaseStudyBySlug, getPublishedCaseStudies } from '@/lib/cms/case-studies'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = await getPublishedCaseStudyBySlug(slug)
  if (!p) return { title: 'Không tìm thấy dự án' }
  return {
    title: `${p.title_vi} — Click Star`,
    description: p.summary_vi ?? undefined,
    openGraph: {
      title: p.title_vi,
      description: p.summary_vi ?? undefined,
      images: p.cover_image ? [p.cover_image] : [],
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPublishedCaseStudyBySlug(slug)
  if (!project) notFound()

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
      <MainNav />

      {/* Hero */}
      <section className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 bg-gradient-to-br from-secondary/40 via-background to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tất cả dự án
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {project.industry_vi && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                <Briefcase className="w-3 h-3" />
                {project.industry_vi}
              </span>
            )}
            {project.client_name && (
              <span className="text-sm text-muted-foreground">
                Khách hàng: <span className="font-semibold text-foreground">{project.client_name}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-5 text-balance">
            {project.title_vi}
          </h1>

          {project.summary_vi && (
            <p className="text-lg text-muted-foreground max-w-3xl">{project.summary_vi}</p>
          )}

          {/* Metrics row */}
          {project.metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 max-w-3xl">
              {project.metrics.map((m, i) => (
                <div key={i} className="bg-white border border-border/50 rounded-xl p-4 lg:p-5 shadow-sm">
                  <div className="text-2xl lg:text-3xl font-extrabold text-primary mb-1">{m.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{m.label_vi}</div>
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
              <Image
                src={project.cover_image}
                alt={project.title_vi}
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
      {project.body_vi && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-relaxed prose-img:rounded-xl prose-a:text-primary hover:prose-a:underline">
              <ReactMarkdown>{project.body_vi}</ReactMarkdown>
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
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              Truy cập website khách hàng
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-foreground mb-8">Dự án liên quan</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {p.cover_image && (
                      <Image
                        src={p.cover_image}
                        alt={p.title_vi}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    {p.client_name && (
                      <p className="text-xs text-muted-foreground uppercase mb-1">{p.client_name}</p>
                    )}
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {p.title_vi}
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
            Quan tâm đến giải pháp tương tự?
          </h2>
          <p className="text-white/70 mb-6">Đặt lịch tư vấn miễn phí với đội ngũ Click Star</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-lg"
          >
            Nhận tư vấn ngay
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
