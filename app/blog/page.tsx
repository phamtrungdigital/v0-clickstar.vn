'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Search, Eye, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useLanguage, type Language } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  authorImage: string
  date: string
  readTime: string
  views?: number
  featured?: boolean
}

const blogPostsData: Record<Language, BlogPost[]> = {
  vi: [
    {
      id: 1,
      slug: 'ai-marketing-trends-2024',
      title: '5 xu hướng AI trong Marketing không thể bỏ qua năm 2024',
      excerpt: 'Khám phá những xu hướng AI đang thay đổi cách các doanh nghiệp tiếp cận marketing và tương tác với khách hàng.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
      category: 'AI & Marketing',
      author: 'Nguyễn Văn Minh',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: '15/01/2024',
      readTime: '8 phút',
      views: 2450,
      featured: true
    },
    {
      id: 2,
      slug: 'data-dashboard-guide',
      title: 'Xây dựng Dashboard dữ liệu hiệu quả cho doanh nghiệp',
      excerpt: 'Hướng dẫn chi tiết cách thiết kế và triển khai dashboard giúp theo dõi KPI và ra quyết định nhanh chóng.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
      category: 'Data Analytics',
      author: 'Trần Thị Hương',
      authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      date: '12/01/2024',
      readTime: '10 phút',
      views: 1820,
      featured: true
    },
    {
      id: 3,
      slug: 'crm-vs-cdp-comparison',
      title: 'CRM vs CDP: Lựa chọn nào phù hợp cho doanh nghiệp của bạn?',
      excerpt: 'So sánh chi tiết hai hệ thống quản lý dữ liệu khách hàng phổ biến nhất hiện nay.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      category: 'CRM & CDP',
      author: 'Lê Hoàng Nam',
      authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: '08/01/2024',
      readTime: '12 phút',
      views: 1340
    },
    {
      id: 4,
      slug: 'website-optimization-tips',
      title: '10 mẹo tối ưu tốc độ website giúp tăng conversion rate',
      excerpt: 'Những kỹ thuật đơn giản nhưng hiệu quả để cải thiện hiệu suất website và trải nghiệm người dùng.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=450&fit=crop',
      category: 'Website',
      author: 'Phạm Thị Lan',
      authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      date: '05/01/2024',
      readTime: '7 phút',
      views: 980
    },
    {
      id: 5,
      slug: 'chatbot-ai-business',
      title: 'Triển khai Chatbot AI: Bài học từ 50+ doanh nghiệp Việt Nam',
      excerpt: 'Chia sẻ kinh nghiệm thực tế từ các dự án chatbot AI đã triển khai thành công.',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=450&fit=crop',
      category: 'AI Automation',
      author: 'Nguyễn Văn Minh',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: '02/01/2024',
      readTime: '15 phút',
      views: 2100
    },
    {
      id: 6,
      slug: 'digital-marketing-roi',
      title: 'Cách đo lường ROI trong Digital Marketing một cách chính xác',
      excerpt: 'Phương pháp và công cụ giúp bạn đánh giá hiệu quả thực sự của các chiến dịch marketing.',
      image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=450&fit=crop',
      category: 'Digital Marketing',
      author: 'Trần Thị Hương',
      authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      date: '28/12/2023',
      readTime: '9 phút',
      views: 760
    },
    {
      id: 7,
      slug: 'automation-workflow-guide',
      title: 'Hướng dẫn xây dựng Workflow tự động hóa cho team Marketing',
      excerpt: 'Cách thiết lập các quy trình tự động giúp tiết kiệm thời gian và tăng hiệu suất làm việc.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop',
      category: 'AI Automation',
      author: 'Lê Hoàng Nam',
      authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: '25/12/2023',
      readTime: '11 phút',
      views: 890
    },
    {
      id: 8,
      slug: 'seo-2024-strategies',
      title: 'Chiến lược SEO 2024: Những thay đổi quan trọng cần biết',
      excerpt: 'Cập nhật các thuật toán mới và chiến lược SEO hiệu quả cho năm 2024.',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=450&fit=crop',
      category: 'Digital Marketing',
      author: 'Phạm Thị Lan',
      authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      date: '20/12/2023',
      readTime: '13 phút',
      views: 1560
    }
  ],
  en: [
    {
      id: 1,
      slug: 'ai-marketing-trends-2024',
      title: '5 AI Trends in Marketing You Cannot Miss in 2024',
      excerpt: 'Discover the AI trends that are changing how businesses approach marketing and customer engagement.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
      category: 'AI & Marketing',
      author: 'Nguyen Van Minh',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: 'Jan 15, 2024',
      readTime: '8 min',
      views: 2450,
      featured: true
    },
    {
      id: 2,
      slug: 'data-dashboard-guide',
      title: 'Building an Effective Data Dashboard for Your Business',
      excerpt: 'A detailed guide on how to design and implement dashboards that help track KPIs and make quick decisions.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
      category: 'Data Analytics',
      author: 'Tran Thi Huong',
      authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      date: 'Jan 12, 2024',
      readTime: '10 min',
      views: 1820,
      featured: true
    },
    {
      id: 3,
      slug: 'crm-vs-cdp-comparison',
      title: 'CRM vs CDP: Which is Right for Your Business?',
      excerpt: 'A detailed comparison of the two most popular customer data management systems today.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      category: 'CRM & CDP',
      author: 'Le Hoang Nam',
      authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: 'Jan 08, 2024',
      readTime: '12 min',
      views: 1340
    },
    {
      id: 4,
      slug: 'website-optimization-tips',
      title: '10 Website Speed Optimization Tips to Increase Conversion Rate',
      excerpt: 'Simple but effective techniques to improve website performance and user experience.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=450&fit=crop',
      category: 'Website',
      author: 'Pham Thi Lan',
      authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      date: 'Jan 05, 2024',
      readTime: '7 min',
      views: 980
    },
    {
      id: 5,
      slug: 'chatbot-ai-business',
      title: 'Deploying AI Chatbot: Lessons from 50+ Vietnamese Businesses',
      excerpt: 'Real experience sharing from successfully deployed AI chatbot projects.',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=450&fit=crop',
      category: 'AI Automation',
      author: 'Nguyen Van Minh',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: 'Jan 02, 2024',
      readTime: '15 min',
      views: 2100
    },
    {
      id: 6,
      slug: 'digital-marketing-roi',
      title: 'How to Accurately Measure ROI in Digital Marketing',
      excerpt: 'Methods and tools to help you evaluate the real effectiveness of marketing campaigns.',
      image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=450&fit=crop',
      category: 'Digital Marketing',
      author: 'Tran Thi Huong',
      authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      date: 'Dec 28, 2023',
      readTime: '9 min',
      views: 760
    },
    {
      id: 7,
      slug: 'automation-workflow-guide',
      title: 'Guide to Building Automation Workflows for Marketing Teams',
      excerpt: 'How to set up automated processes that save time and increase work efficiency.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop',
      category: 'AI Automation',
      author: 'Le Hoang Nam',
      authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: 'Dec 25, 2023',
      readTime: '11 min',
      views: 890
    },
    {
      id: 8,
      slug: 'seo-2024-strategies',
      title: 'SEO Strategy 2024: Important Changes You Need to Know',
      excerpt: 'Update on new algorithms and effective SEO strategies for 2024.',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=450&fit=crop',
      category: 'Digital Marketing',
      author: 'Pham Thi Lan',
      authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      date: 'Dec 20, 2023',
      readTime: '13 min',
      views: 1560
    }
  ]
}

const categoriesData: Record<Language, string[]> = {
  vi: ['Tất cả', 'AI & Marketing', 'Data Analytics', 'CRM & CDP', 'Website', 'AI Automation', 'Digital Marketing'],
  en: ['All', 'AI & Marketing', 'Data Analytics', 'CRM & CDP', 'Website', 'AI Automation', 'Digital Marketing']
}

export default function BlogPage() {
  const { language, t } = useLanguage()
  const blogPosts = blogPostsData[language]
  const categories = categoriesData[language]
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [searchQuery, setSearchQuery] = useState('')

  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2)
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === categories[0] || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <>
      <MainNav />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary/15 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-primary-dark/10 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium text-sm px-4 py-2 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Blog
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {t('Tin tức & Bài viết', 'News & Articles')}
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('Cập nhật xu hướng công nghệ, AI và chuyển đổi số mới nhất', 'Stay updated with the latest technology, AI and digital transformation trends')}
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('Tìm kiếm bài viết...', 'Search articles...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-full border border-border bg-white text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Featured Posts - 2 column */}
            {!searchQuery && selectedCategory === categories[0] && featuredPosts.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className="group relative rounded-2xl overflow-hidden bg-foreground"
                  >
                    <div className="aspect-[16/10] relative">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-white/70 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-lg lg:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-3">
                        <Image
                          src={post.authorImage}
                          alt={post.author}
                          width={28}
                          height={28}
                          className="rounded-full border border-white/30"
                        />
                        <span className="text-white/80 text-sm">{post.author}</span>
                        <span className="text-white/50 text-xs">{post.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Category Filter & Posts */}
        <section className="py-10 lg:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <p className="text-muted-foreground mb-6 text-sm">
                {t(`Tìm thấy ${filteredPosts.length} kết quả cho "${searchQuery}"`, `Found ${filteredPosts.length} results for "${searchQuery}"`)}
              </p>
            )}

            {/* Posts Grid - Compact cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(searchQuery || selectedCategory !== categories[0] ? filteredPosts : regularPosts).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Image
                          src={post.authorImage}
                          alt={post.author}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        {post.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  {t('Không tìm thấy bài viết', 'No articles found')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t('Thử tìm kiếm với từ khóa khác', 'Try searching with different keywords')}
                </p>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length >= 6 && (
              <div className="text-center mt-10">
                <button className="inline-flex items-center gap-2 bg-foreground text-background font-medium px-6 py-3 rounded-full hover:bg-foreground/90 transition-all group">
                  {t('Xem thêm bài viết', 'Load more articles')}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter - Compact */}
        <section className="py-12 lg:py-16 bg-foreground">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {t('Đăng ký nhận tin', 'Subscribe to newsletter')}
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              {t('Nhận bài viết mới về AI và chuyển đổi số mỗi tuần', 'Get weekly updates on AI and digital transformation')}
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('Email của bạn', 'Your email')}
                className="flex-1 px-4 py-3 rounded-full bg-white text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary-dark text-white font-medium px-6 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all whitespace-nowrap text-sm"
              >
                {t('Đăng ký', 'Subscribe')}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
