"use client"

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/sections/page-hero'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Sparkles, 
  Brain, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Zap,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Play,

  ChevronRight,
  Bot,
  Cpu,
  Layers,
  Target,
  Lightbulb,
  Rocket,
  Mail,
  Star
} from 'lucide-react'

// AI Tools ecosystem with real logos
const aiEcosystem = [
  {
    name: 'Claude',
    provider: 'Anthropic',
    category: 'LLM',
    description: 'Phân tích dữ liệu, viết content chuyên sâu, reasoning mạnh mẽ',
    logoColor: 'from-[#D97757] to-[#C4653F]',
    features: ['Phân tích báo cáo', 'Viết content dài', 'Tóm tắt tài liệu']
  },
  {
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'LLM',
    description: 'Đa năng, sáng tạo nội dung marketing, multimodal',
    logoColor: 'from-[#10A37F] to-[#0D8F6F]',
    features: ['Viết quảng cáo', 'Chatbot', 'Brainstorm ý tưởng']
  },
  {
    name: 'Gemini',
    provider: 'Google',
    category: 'LLM',
    description: 'Tích hợp Google Workspace, phân tích đa phương tiện',
    logoColor: 'from-[#4285F4] via-[#EA4335] to-[#FBBC04]',
    features: ['Phân tích video', 'Google Sheets AI', 'Research']
  },
  {
    name: 'Midjourney',
    provider: 'Midjourney',
    category: 'Hình ảnh',
    description: 'Tạo hình ảnh nghệ thuật, banner quảng cáo chất lượng cao',
    logoColor: 'from-[#1A1A2E] to-[#16162A]',
    features: ['Banner ads', 'Social media', 'Brand visuals']
  },
  {
    name: 'DALL-E 3',
    provider: 'OpenAI',
    category: 'Hình ảnh',
    description: 'Tạo hình ảnh từ mô tả chi tiết, product mockup',
    logoColor: 'from-[#10A37F] to-[#0D8F6F]',
    features: ['Product mockup', 'Illustrations', 'Thumbnails']
  },
  {
    name: 'Runway',
    provider: 'Runway ML',
    category: 'Video',
    description: 'Tạo và chỉnh sửa video bằng AI, Gen-3 Alpha',
    logoColor: 'from-[#FF3366] to-[#FF6B6B]',
    features: ['Video ads', 'Motion graphics', 'Video editing']
  },
  {
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    category: 'Audio',
    description: 'Tạo giọng nói AI tự nhiên, voice cloning',
    logoColor: 'from-[#000000] to-[#333333]',
    features: ['Voiceover', 'Podcast', 'Ads audio']
  },
  {
    name: 'Sora',
    provider: 'OpenAI',
    category: 'Video',
    description: 'Tạo video chất lượng điện ảnh từ text',
    logoColor: 'from-[#10A37F] to-[#0D8F6F]',
    features: ['Short videos', 'Reels/TikTok', 'Cinematic']
  }
]

// AI use cases
const useCases = [
  {
    icon: FileText,
    title: 'Content Marketing',
    description: 'Tạo bài viết blog, social media posts, email marketing với tốc độ nhanh gấp 10 lần',
    stats: '10x',
    statsLabel: 'Nhanh hơn',
    features: ['Blog posts tự động', 'Social captions', 'Email sequences', 'Ad copy']
  },
  {
    icon: ImageIcon,
    title: 'Thiết kế hình ảnh',
    description: 'Tạo banner, thumbnail, product images mà không cần designer',
    stats: '80%',
    statsLabel: 'Tiết kiệm chi phí',
    features: ['Banner quảng cáo', 'Social media images', 'Product photos', 'Brand assets']
  },
  {
    icon: Video,
    title: 'Sản xuất Video',
    description: 'Video ads, reels, TikTok content với thời gian sản xuất tối thiểu',
    stats: '5x',
    statsLabel: 'Hiệu quả hơn',
    features: ['Video ads 15-60s', 'Reels/TikTok', 'Explainer videos', 'Product demos']
  },
  {
    icon: BarChart3,
    title: 'Phân tích dữ liệu',
    description: 'AI phân tích data từ nhiều nguồn, đưa ra insights và đề xuất chiến lược',
    stats: '24/7',
    statsLabel: 'Theo dõi liên tục',
    features: ['Report tự động', 'Anomaly detection', 'Trend analysis', 'Predictions']
  },
  {
    icon: MessageSquare,
    title: 'Chatbot & Support',
    description: 'Chatbot thông minh trả lời khách hàng 24/7, tích hợp đa kênh',
    stats: '90%',
    statsLabel: 'Tự động hóa',
    features: ['Website chatbot', 'Messenger bot', 'Zalo bot', 'Email auto-reply']
  },
  {
    icon: Target,
    title: 'Tối ưu quảng cáo',
    description: 'AI tối ưu bid, targeting, creative testing tự động',
    stats: '35%',
    statsLabel: 'Giảm CPA',
    features: ['Auto bidding', 'Audience AI', 'Creative testing', 'Budget allocation']
  }
]

// AI transformation stats
const transformationStats = [
  { value: '73%', label: 'Doanh nghiệp đã áp dụng AI', desc: 'Theo McKinsey 2026' },
  { value: '40%', label: 'Tăng năng suất trung bình', desc: 'Khi tích hợp AI vào workflow' },
  { value: '2.5x', label: 'ROI cao hơn', desc: 'So với phương pháp truyền thống' },
  { value: '60%', label: 'Giảm thời gian xử lý', desc: 'Các tác vụ lặp đi lặp lại' }
]

// Latest AI articles
const aiArticles = [
  {
    title: 'Claude 4.7: Bước đột phá mới trong AI phân tích dữ liệu',
    excerpt: 'Anthropic vừa ra mắt Claude 4.7 với khả năng phân tích dữ liệu nâng cao, hỗ trợ doanh nghiệp đưa ra quyết định chính xác hơn.',
    date: '05/05/2026',
    category: 'LLM',
    readTime: '5 phút'
  },
  {
    title: 'Sora OpenAI: Cách mạng hóa sản xuất video marketing',
    excerpt: 'Sora cho phép tạo video chất lượng cao từ text, mở ra kỷ nguyên mới cho video marketing với chi phí thấp.',
    date: '28/04/2026',
    category: 'Video AI',
    readTime: '7 phút'
  },
  {
    title: 'Tích hợp AI vào CRM: Tăng 50% tỷ lệ chuyển đổi',
    excerpt: 'Nghiên cứu cho thấy doanh nghiệp tích hợp AI vào CRM có tỷ lệ chuyển đổi cao hơn đáng kể.',
    date: '20/04/2026',
    category: 'AI Business',
    readTime: '6 phút'
  },
  {
    title: 'Midjourney V7: Tạo hình ảnh quảng cáo chuyên nghiệp',
    excerpt: 'Phiên bản mới của Midjourney với khả năng render text và tạo hình ảnh realistic cho marketing.',
    date: '15/04/2026',
    category: 'Image AI',
    readTime: '4 phút'
  }
]

// Integration process
const integrationProcess = [
  {
    step: '01',
    title: 'Khảo sát & Đánh giá',
    description: 'Phân tích quy trình hiện tại, xác định cơ hội tích hợp AI',
    duration: '1-2 tuần'
  },
  {
    step: '02',
    title: 'Thiết kế giải pháp',
    description: 'Đề xuất công cụ AI phù hợp, thiết kế workflow mới',
    duration: '1 tuần'
  },
  {
    step: '03',
    title: 'Triển khai & Tích hợp',
    description: 'Setup tools, kết nối API, training team sử dụng',
    duration: '2-4 tuần'
  },
  {
    step: '04',
    title: 'Tối ưu & Scale',
    description: 'Đo lường hiệu quả, fine-tune và mở rộng ứng dụng',
    duration: 'Liên tục'
  }
]

// Why AI benefits
const whyAIBenefits = [
  {
    icon: Zap,
    title: 'Tăng tốc độ xử lý',
    description: 'Những việc mất hàng giờ giờ chỉ mất vài phút. Tạo content, phân tích data, thiết kế - tất cả được tăng tốc đáng kể.'
  },
  {
    icon: TrendingUp,
    title: 'Nâng cao chất lượng',
    description: 'AI học từ hàng triệu examples, đưa ra output chất lượng cao, nhất quán và có thể cải thiện liên tục.'
  },
  {
    icon: Clock,
    title: 'Hoạt động 24/7',
    description: 'AI không nghỉ. Chatbot trả lời khách hàng, hệ thống phân tích data, automation chạy xuyên suốt.'
  },
  {
    icon: Shield,
    title: 'Giảm sai sót',
    description: 'AI xử lý chính xác, không bị ảnh hưởng bởi cảm xúc hay mệt mỏi. Đảm bảo tính nhất quán trong mọi output.'
  },
  {
    icon: Users,
    title: 'Cá nhân hóa quy mô lớn',
    description: 'Cá nhân hóa trải nghiệm cho từng khách hàng ở quy mô hàng nghìn, hàng triệu người dùng.'
  },
  {
    icon: Lightbulb,
    title: 'Insights sâu sắc',
    description: 'AI phát hiện patterns, trends mà con người khó nhận ra. Đưa ra predictions và đề xuất chiến lược.'
  }
]

export default function AIIntegrationPage() {
  const { t } = useLanguage()

  return (
    <>
      <MainNav />
      <main>
      <PageHero />

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {transformationStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-foreground font-medium mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why AI Section - Dark theme */}
        <section className="py-16 lg:py-20 bg-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4 backdrop-blur">
                <Zap className="w-4 h-4" />
                TẠI SAO CẦN AI
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                AI đang thay đổi <span className="text-primary">cuộc chơi</span> kinh doanh
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Doanh nghiệp không tích hợp AI sẽ bị tụt hậu. AI không thay thế con người, 
                nhưng người dùng AI sẽ thay thế những người không dùng.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyAIBenefits.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-all">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                Ứng dụng AI
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                AI có thể làm gì cho doanh nghiệp bạn?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ClickStar tích hợp AI vào mọi khía cạnh của hoạt động marketing và kinh doanh
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-secondary to-white rounded-2xl p-6 hover:shadow-lg transition-all border border-primary/10 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all">
                      <useCase.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{useCase.stats}</p>
                      <p className="text-xs text-muted-foreground">{useCase.statsLabel}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{useCase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Ecosystem Section - Dark theme */}
        <section className="py-16 lg:py-20 bg-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4 backdrop-blur">
                <Brain className="w-4 h-4" />
                HỆ SINH THÁI AI
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Công cụ AI <span className="text-primary">hàng đầu</span> thế giới
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                ClickStar làm việc với các nền tảng AI mạnh nhất để mang lại kết quả tối ưu cho doanh nghiệp
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiEcosystem.map((tool, index) => (
                <div key={index} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Real AI Logos */}
                    <div className={`w-10 h-10 bg-gradient-to-br ${tool.logoColor} rounded-lg flex items-center justify-center`}>
                      {tool.name === 'Claude' && <span className="text-white font-bold text-sm">C</span>}
                      {tool.name === 'GPT-4o' && <span className="text-white font-bold text-xs">GPT</span>}
                      {tool.name === 'Gemini' && <span className="text-white font-bold text-sm">G</span>}
                      {tool.name === 'Midjourney' && <span className="text-white font-bold text-sm">MJ</span>}
                      {tool.name === 'DALL-E 3' && <span className="text-white font-bold text-xs">D-E</span>}
                      {tool.name === 'Runway' && <span className="text-white font-bold text-sm">R</span>}
                      {tool.name === 'ElevenLabs' && <span className="text-white font-bold text-xs">11</span>}
                      {tool.name === 'Sora' && <span className="text-white font-bold text-sm">S</span>}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <p className="text-xs text-gray-400">{tool.provider}</p>
                    </div>
                  </div>
                  <span className="inline-block text-xs bg-primary/20 text-primary px-2 py-0.5 rounded mb-3">
                    {tool.category}
                  </span>
                  <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                  <ul className="space-y-1">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section - Light style like hero */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-br from-secondary via-white to-background-soft overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-primary/15 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-[250px] h-[250px] bg-gradient-to-br from-primary-dark/10 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                Quy trình
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quy trình tích hợp AI
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                4 bước đơn giản để đưa AI vào hoạt động kinh doanh của bạn
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationProcess.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-all">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                    <div className="pt-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  {index < integrationProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-6 h-6 text-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest AI Articles - Dark theme */}
        <section className="py-16 lg:py-20 bg-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4 backdrop-blur">
                  <FileText className="w-4 h-4" />
                  TIN TỨC AI
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Bài viết <span className="text-primary">mới nhất</span> về AI
                </h2>
              </div>
              <Link 
                href="/blog"
                className="hidden md:inline-flex items-center gap-2 text-white hover:text-primary font-medium"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiArticles.map((article, index) => (
                <article key={index} className="bg-white/5 backdrop-blur rounded-xl overflow-hidden hover:bg-white/10 transition-all group border border-white/10">
                  <div className="aspect-video bg-gradient-to-br from-primary to-primary-dark relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-white/30" />
                    </div>
                    <span className="absolute top-3 left-3 text-xs bg-white text-primary font-medium px-2 py-1 rounded shadow-sm">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span>{article.date}</span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full" />
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-white hover:text-primary font-medium"
              >
                Xem tất cả bài viết
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA - Light style like hero */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sẵn sàng bứt phá với AI?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Đừng để đối thủ đi trước. Bắt đầu hành trình chuyển đổi AI ngay hôm nay 
              với sự hỗ trợ từ đội ngũ chuyên gia ClickStar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white text-foreground font-medium px-8 py-4 rounded-full hover:bg-secondary transition-all border border-border shadow-sm"
              >
                Xem bảng giá
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
