import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { listPublishedPosts } from '@/lib/cms/posts'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tin tức & Bài viết — ClickStar',
  description: 'Cập nhật xu hướng, mẹo hay và insight từ các chuyên gia của ClickStar',
}

export default async function BlogList() {
  const posts = await listPublishedPosts()

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Tin tức & Bài viết
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 text-balance">
              Kiến thức <span className="text-primary">chuyển đổi số</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cập nhật xu hướng, mẹo hay và insight từ các chuyên gia của ClickStar
            </p>
          </div>

          {/* Grid */}
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">Chưa có bài viết nào</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title.vi}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>

                  <div className="p-6">
                    {post.published_at && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_at).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                    <h3 className="font-bold text-lg text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      <Link href={`/blog/${post.slug}`}>{post.title.vi}</Link>
                    </h3>
                    {post.excerpt.vi && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt.vi}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold text-sm group/link"
                    >
                      Đọc thêm
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
