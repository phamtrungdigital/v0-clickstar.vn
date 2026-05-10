'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, User, Search, TrendingUp, Bookmark, Eye } from 'lucide-react'
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
  trending?: boolean
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
      featured: true,
      trending: true
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
      views: 1340,
      trending: true
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
      featured: true,
      trending: true
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
      views: 1340,
      trending: true
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

const categoriesData: Record<Language, { name: string; count: number }[]> = {
  vi: [
    { name: 'Tất cả', count: 8 },
    { name: 'AI & Marketing', count: 1 },
    { name: 'Data Analytics', count: 1 },
    { name: 'CRM & CDP', count: 1 },
    { name: 'Website', count: 1 },
    { name: 'AI Automation', count: 2 },
    { name: 'Digital Marketing', count: 2 }
  ],
  en: [
    { name: 'All', count: 8 },
    { name: 'AI & Marketing', count: 1 },
    { name: 'Data Analytics', count: 1 },
    { name: 'CRM & CDP', count: 1 },
    { name: 'Website', count: 1 },
    { name: 'AI Automation', count: 2 },
    { name: 'Digital Marketing', count: 2 }
  ]
}

export default function BlogPage() {
  const { language, t } = useLanguage()
  const blogPosts = blogPostsData[language]
  const categories = categoriesData[language]
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name)
  const [searchQuery, setSearchQuery] = useState('')

  const featuredPost = blogPosts.find(post => post.featured)
  const trendingPosts = blogPosts.filter(post => post.trending).slice(0, 3)
  const latestPosts = blogPosts.filter(post => !post.featured).slice(0, 4)
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === categories[0].name || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <MainNav />
      <main className="min-h-screen bg-background">
        {/* Hero Section - Featured Post */}
        <section className="pt-8 pb-12 lg:pt-12 lg:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb & Search Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
                  {t('Tin tức & Bài viết', 'News & Articles')}
                </h1>
                <p className="text-muted-foreground">
                  {t('Cập nhật xu hướng và kiến thức chuyển đổi số', 'Stay updated with digital transformation trends')}
                </p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('Tìm kiếm...', 'Search...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Main Featured + Sidebar Layout */}
            {!searchQuery && selectedCategory === categories[0].name && featuredPost && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Featured Post */}
                <div className="lg:col-span-2">
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                            {t('Nổi bật', 'Featured')}
                          </span>
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                            {featuredPost.category}
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary-foreground/90 transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-white/80 text-sm sm:text-base mb-6 line-clamp-2 max-w-2xl">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={featuredPost.authorImage}
                              alt={featuredPost.author}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-white/30"
                            />
                            <div>
                              <p className="text-white font-medium text-sm">{featuredPost.author}</p>
                              <p className="text-white/60 text-xs">{featuredPost.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-white/60 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {featuredPost.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {featuredPost.views?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Sidebar - Trending */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">{t('Xu hướng', 'Trending')}</h3>
                  </div>
                  {trendingPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Quick Links */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-bold text-foreground mb-4">{t('Danh mục', 'Categories')}</h3>
                    <div className="space-y-2">
                      {categories.slice(1).map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-secondary/50 transition-colors group"
                        >
                          <span className="text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{cat.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Latest Posts Section */}
        {!searchQuery && selectedCategory === categories[0].name && (
          <section className="py-12 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">{t('Bài viết mới nhất', 'Latest Articles')}</h2>
                <Link href="#all-posts" className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                  {t('Xem tất cả', 'View all')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-background rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section id="all-posts" className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter - Horizontal Scroll */}
            <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat.name
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {cat.name}
                    <span className="ml-1.5 text-xs opacity-60">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <p className="text-muted-foreground mb-6">
                {t(`Tìm thấy ${filteredPosts.length} kết quả cho "${searchQuery}"`, `Found ${filteredPosts.length} results for "${searchQuery}"`)}
              </p>
            )}

            {/* Posts Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Bookmark Button */}
                      <button 
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                        onClick={(e) => { e.preventDefault(); }}
                      >
                        <Bookmark className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                    
                    <div className="p-5">
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      
                      {/* Author & Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={post.authorImage}
                            alt={post.author}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <span className="text-sm text-foreground font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{post.date}</span>
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
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-2">
                  {t('Không tìm thấy bài viết', 'No articles found')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t('Thử tìm kiếm với từ khóa khác', 'Try searching with different keywords')}
                </p>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length >= 6 && (
              <div className="text-center mt-12">
                <button className="inline-flex items-center gap-2 border-2 border-foreground text-foreground font-semibold px-8 py-3 rounded-full hover:bg-foreground hover:text-background transition-all duration-200 group">
                  {t('Tải thêm bài viết', 'Load more articles')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 lg:py-20 bg-foreground text-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 font-medium text-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t('Cập nhật mỗi tuần', 'Weekly updates')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('Đăng ký nhận bài viết mới', 'Subscribe to new articles')}
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              {t(
                'Nhận thông báo về các bài viết mới nhất về chuyển đổi số, AI và công nghệ mỗi tuần.',
                'Get weekly notifications about the latest articles on digital transformation, AI and technology.'
              )}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('Nhập email của bạn', 'Enter your email')}
                className="flex-1 px-5 py-3.5 rounded-full bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 py-3.5 rounded-full transition-all duration-200 whitespace-nowrap"
              >
                {t('Đăng ký ngay', 'Subscribe now')}
              </button>
            </form>
            <p className="text-white/50 text-xs mt-4">
              {t('Không spam. Hủy đăng ký bất cứ lúc nào.', 'No spam. Unsubscribe anytime.')}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
