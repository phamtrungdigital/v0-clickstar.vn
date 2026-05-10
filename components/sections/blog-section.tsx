'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage, type Language } from '@/contexts/language-context'

const blogPostsData: Record<Language, { id: number; title: string; image: string; tags: string[]; date: string; slug: string }[]> = {
  vi: [
    { id: 1, title: "5 xu hướng AI trong Marketing không thể bỏ qua năm 2024", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop", tags: ["AI", "Marketing"], date: "15/01/2024", slug: "/blog/ai-marketing-trends-2024" },
    { id: 2, title: "Xây dựng Dashboard dữ liệu hiệu quả cho doanh nghiệp", image: "https://images.unsplash.com/photo-1553484771-047a44eee27a?w=800&h=450&fit=crop", tags: ["Dashboard", "Data"], date: "12/01/2024", slug: "/blog/data-dashboard-guide" },
    { id: 3, title: "CRM vs CDP: Lựa chọn nào phù hợp cho doanh nghiệp của bạn?", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop", tags: ["CRM", "CDP"], date: "08/01/2024", slug: "/blog/crm-vs-cdp-comparison" }
  ],
  en: [
    { id: 1, title: "5 AI Trends in Marketing You Can't Miss in 2024", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop", tags: ["AI", "Marketing"], date: "Jan 15, 2024", slug: "/blog/ai-marketing-trends-2024" },
    { id: 2, title: "Building an Effective Data Dashboard for Businesses", image: "https://images.unsplash.com/photo-1553484771-047a44eee27a?w=800&h=450&fit=crop", tags: ["Dashboard", "Data"], date: "Jan 12, 2024", slug: "/blog/data-dashboard-guide" },
    { id: 3, title: "CRM vs CDP: Which is Right for Your Business?", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop", tags: ["CRM", "CDP"], date: "Jan 08, 2024", slug: "/blog/crm-vs-cdp-comparison" }
  ]
}

const tagColors: Record<string, string> = {
  "AI": "bg-primary/10 text-primary",
  "Marketing": "bg-emerald-100 text-emerald-700",
  "Dashboard": "bg-purple-100 text-purple-700",
  "Data": "bg-amber-100 text-amber-700",
  "CRM": "bg-rose-100 text-rose-700",
  "CDP": "bg-cyan-100 text-cyan-700",
  "Website": "bg-indigo-100 text-indigo-700"
}

export function BlogSection() {
  const { language, t } = useLanguage()
  const blogPosts = blogPostsData[language]

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t('Tin tức & Bài viết', 'News & Articles')}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-4 text-balance">
            {t('Kiến thức', 'Knowledge on')}{' '}
            <span className="text-primary">{t('chuyển đổi số', 'digital transformation')}</span>
          </h2>

          <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
            {t('Cập nhật xu hướng, mẹo hay và insight từ các chuyên gia của ClickStar', 'Stay updated with trends, tips and insights from ClickStar experts')}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <Link href={post.slug} className="block relative aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Tags Overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
                        tagColors[tag] || 'bg-white/90 text-foreground'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Date */}
                <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-foreground">
                  {post.date}
                </span>
              </Link>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-foreground leading-snug mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  <Link href={post.slug}>
                    {post.title}
                  </Link>
                </h3>

                <Link
                  href={post.slug}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm group/link"
                >
                  {t('Đọc thêm', 'Read more')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-full hover:bg-foreground/90 transition-all duration-200 group"
          >
            {t('Xem tất cả bài viết', 'View all articles')}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
