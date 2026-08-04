"use client"

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
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
    category: { vi: 'LLM', en: 'LLM' },
    description: { vi: 'Phân tích dữ liệu, viết content chuyên sâu, reasoning mạnh mẽ', en: 'In-depth data analysis, long-form content and powerful reasoning' },
    logo: '/images/ai-tools/claude.svg',
    features: [
      { vi: 'Phân tích báo cáo', en: 'Report analysis' },
      { vi: 'Viết content dài', en: 'Long-form content' },
      { vi: 'Tóm tắt tài liệu', en: 'Document summaries' }
    ]
  },
  {
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: { vi: 'LLM', en: 'LLM' },
    description: { vi: 'Đa năng, sáng tạo nội dung marketing, multimodal', en: 'Versatile, creative marketing content, fully multimodal' },
    logo: '/images/ai-tools/openai.svg',
    features: [
      { vi: 'Viết quảng cáo', en: 'Ad copywriting' },
      { vi: 'Chatbot', en: 'Chatbots' },
      { vi: 'Brainstorm ý tưởng', en: 'Idea brainstorming' }
    ]
  },
  {
    name: 'Gemini',
    provider: 'Google',
    category: { vi: 'LLM', en: 'LLM' },
    description: { vi: 'Tích hợp Google Workspace, phân tích đa phương tiện', en: 'Google Workspace integration, multimedia analysis' },
    logo: '/images/ai-tools/gemini.svg',
    features: [
      { vi: 'Phân tích video', en: 'Video analysis' },
      { vi: 'Google Sheets AI', en: 'Google Sheets AI' },
      { vi: 'Research', en: 'Research' }
    ]
  },
  {
    name: 'Midjourney',
    provider: 'Midjourney',
    category: { vi: 'Hình ảnh', en: 'Image' },
    description: { vi: 'Tạo hình ảnh nghệ thuật, banner quảng cáo chất lượng cao', en: 'Artistic imagery and high-quality ad banners' },
    logo: '/images/ai-tools/midjourney.svg',
    features: [
      { vi: 'Banner ads', en: 'Banner ads' },
      { vi: 'Social media', en: 'Social media' },
      { vi: 'Brand visuals', en: 'Brand visuals' }
    ]
  },
  {
    name: 'DALL-E 3',
    provider: 'OpenAI',
    category: { vi: 'Hình ảnh', en: 'Image' },
    description: { vi: 'Tạo hình ảnh từ mô tả chi tiết, product mockup', en: 'Images from detailed prompts, product mockups' },
    logo: '/images/ai-tools/openai.svg',
    features: [
      { vi: 'Product mockup', en: 'Product mockup' },
      { vi: 'Illustrations', en: 'Illustrations' },
      { vi: 'Thumbnails', en: 'Thumbnails' }
    ]
  },
  {
    name: 'Runway',
    provider: 'Runway ML',
    category: { vi: 'Video', en: 'Video' },
    description: { vi: 'Tạo và chỉnh sửa video bằng AI, Gen-3 Alpha', en: 'AI video generation and editing with Gen-3 Alpha' },
    logo: '/images/ai-tools/runway.svg',
    features: [
      { vi: 'Video ads', en: 'Video ads' },
      { vi: 'Motion graphics', en: 'Motion graphics' },
      { vi: 'Video editing', en: 'Video editing' }
    ]
  },
  {
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    category: { vi: 'Audio', en: 'Audio' },
    description: { vi: 'Tạo giọng nói AI tự nhiên, voice cloning', en: 'Natural AI voices and voice cloning' },
    logo: '/images/ai-tools/elevenlabs.svg',
    features: [
      { vi: 'Voiceover', en: 'Voiceover' },
      { vi: 'Podcast', en: 'Podcast' },
      { vi: 'Ads audio', en: 'Ads audio' }
    ]
  },
  {
    name: 'Sora',
    provider: 'OpenAI',
    category: { vi: 'Video', en: 'Video' },
    description: { vi: 'Tạo video chất lượng điện ảnh từ text', en: 'Cinematic-quality video straight from text' },
    logo: '/images/ai-tools/openai.svg',
    features: [
      { vi: 'Short videos', en: 'Short videos' },
      { vi: 'Reels/TikTok', en: 'Reels/TikTok' },
      { vi: 'Cinematic', en: 'Cinematic' }
    ]
  }
]

// AI use cases
const useCases = [
  {
    icon: FileText,
    title: { vi: 'Content Marketing', en: 'Content Marketing' },
    description: { vi: 'Tạo bài viết blog, social media posts, email marketing với tốc độ nhanh gấp 10 lần', en: 'Create blog posts, social content and marketing emails 10x faster' },
    stats: '10x',
    statsLabel: { vi: 'Nhanh hơn', en: 'Faster' },
    features: [
      { vi: 'Blog posts tự động', en: 'Automated blog posts' },
      { vi: 'Social captions', en: 'Social captions' },
      { vi: 'Email sequences', en: 'Email sequences' },
      { vi: 'Ad copy', en: 'Ad copy' }
    ]
  },
  {
    icon: ImageIcon,
    title: { vi: 'Thiết kế hình ảnh', en: 'Visual Design' },
    description: { vi: 'Tạo banner, thumbnail, product images mà không cần designer', en: 'Banners, thumbnails and product images — no designer needed' },
    stats: '80%',
    statsLabel: { vi: 'Tiết kiệm chi phí', en: 'Cost savings' },
    features: [
      { vi: 'Banner quảng cáo', en: 'Ad banners' },
      { vi: 'Social media images', en: 'Social media images' },
      { vi: 'Product photos', en: 'Product photos' },
      { vi: 'Brand assets', en: 'Brand assets' }
    ]
  },
  {
    icon: Video,
    title: { vi: 'Sản xuất Video', en: 'Video Production' },
    description: { vi: 'Video ads, reels, TikTok content với thời gian sản xuất tối thiểu', en: 'Video ads, reels and TikTok content in a fraction of the time' },
    stats: '5x',
    statsLabel: { vi: 'Hiệu quả hơn', en: 'More efficient' },
    features: [
      { vi: 'Video ads 15-60s', en: 'Video ads 15-60s' },
      { vi: 'Reels/TikTok', en: 'Reels/TikTok' },
      { vi: 'Explainer videos', en: 'Explainer videos' },
      { vi: 'Product demos', en: 'Product demos' }
    ]
  },
  {
    icon: BarChart3,
    title: { vi: 'Phân tích dữ liệu', en: 'Data Analysis' },
    description: { vi: 'AI phân tích data từ nhiều nguồn, đưa ra insights và đề xuất chiến lược', en: 'AI analyzes data from every source, surfacing insights and strategic recommendations' },
    stats: '24/7',
    statsLabel: { vi: 'Theo dõi liên tục', en: 'Always-on monitoring' },
    features: [
      { vi: 'Report tự động', en: 'Automated reports' },
      { vi: 'Anomaly detection', en: 'Anomaly detection' },
      { vi: 'Trend analysis', en: 'Trend analysis' },
      { vi: 'Predictions', en: 'Predictions' }
    ]
  },
  {
    icon: MessageSquare,
    title: { vi: 'Chatbot & Support', en: 'Chatbot & Support' },
    description: { vi: 'Chatbot thông minh trả lời khách hàng 24/7, tích hợp đa kênh', en: 'Smart chatbots answer customers 24/7 across every channel' },
    stats: '90%',
    statsLabel: { vi: 'Tự động hóa', en: 'Automated' },
    features: [
      { vi: 'Website chatbot', en: 'Website chatbot' },
      { vi: 'Messenger bot', en: 'Messenger bot' },
      { vi: 'Zalo bot', en: 'Zalo bot' },
      { vi: 'Email auto-reply', en: 'Email auto-reply' }
    ]
  },
  {
    icon: Target,
    title: { vi: 'Tối ưu quảng cáo', en: 'Ad Optimization' },
    description: { vi: 'AI tối ưu bid, targeting, creative testing tự động', en: 'AI automates bidding, targeting and creative testing' },
    stats: '35%',
    statsLabel: { vi: 'Giảm CPA', en: 'Lower CPA' },
    features: [
      { vi: 'Auto bidding', en: 'Auto bidding' },
      { vi: 'Audience AI', en: 'Audience AI' },
      { vi: 'Creative testing', en: 'Creative testing' },
      { vi: 'Budget allocation', en: 'Budget allocation' }
    ]
  }
]

// AI transformation stats
const transformationStats = [
  { value: '73%', label: { vi: 'Doanh nghiệp đã áp dụng AI', en: 'Businesses already using AI' }, desc: { vi: 'Theo McKinsey 2026', en: 'McKinsey, 2026' } },
  { value: '40%', label: { vi: 'Tăng năng suất trung bình', en: 'Average productivity gain' }, desc: { vi: 'Khi tích hợp AI vào workflow', en: 'With AI built into the workflow' } },
  { value: '2.5x', label: { vi: 'ROI cao hơn', en: 'Higher ROI' }, desc: { vi: 'So với phương pháp truyền thống', en: 'Versus traditional methods' } },
  { value: '60%', label: { vi: 'Giảm thời gian xử lý', en: 'Less processing time' }, desc: { vi: 'Các tác vụ lặp đi lặp lại', en: 'On repetitive tasks' } }
]

// Latest AI articles
const aiArticles = [
  {
    title: { vi: 'Claude 4.7: Bước đột phá mới trong AI phân tích dữ liệu', en: 'Claude 4.7: A new breakthrough in AI-powered data analysis' },
    excerpt: { vi: 'Anthropic vừa ra mắt Claude 4.7 với khả năng phân tích dữ liệu nâng cao, hỗ trợ doanh nghiệp đưa ra quyết định chính xác hơn.', en: "Anthropic's Claude 4.7 brings advanced data analysis, helping businesses make sharper decisions." },
    date: '05/05/2026',
    category: 'LLM',
    readTime: { vi: '5 phút', en: '5 min read' },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80'
  },
  {
    title: { vi: 'Sora OpenAI: Cách mạng hóa sản xuất video marketing', en: 'Sora by OpenAI: Revolutionizing video marketing production' },
    excerpt: { vi: 'Sora cho phép tạo video chất lượng cao từ text, mở ra kỷ nguyên mới cho video marketing với chi phí thấp.', en: 'Sora turns text into high-quality video, opening a new era of low-cost video marketing.' },
    date: '28/04/2026',
    category: 'Video AI',
    readTime: { vi: '7 phút', en: '7 min read' },
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop&q=80'
  },
  {
    title: { vi: 'Tích hợp AI vào CRM: Tăng 50% tỷ lệ chuyển đổi', en: 'AI-powered CRM: 50% higher conversion rates' },
    excerpt: { vi: 'Nghiên cứu cho thấy doanh nghiệp tích hợp AI vào CRM có tỷ lệ chuyển đổi cao hơn đáng kể.', en: 'Research shows businesses that bring AI into their CRM convert significantly better.' },
    date: '20/04/2026',
    category: 'AI Business',
    readTime: { vi: '6 phút', en: '6 min read' },
    image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1200&h=800&fit=crop&q=80'
  },
  {
    title: { vi: 'Midjourney V7: Tạo hình ảnh quảng cáo chuyên nghiệp', en: 'Midjourney V7: Professional-grade ad imagery' },
    excerpt: { vi: 'Phiên bản mới của Midjourney với khả năng render text và tạo hình ảnh realistic cho marketing.', en: 'The latest Midjourney renders text and creates realistic imagery for marketing.' },
    date: '15/04/2026',
    category: 'Image AI',
    readTime: { vi: '4 phút', en: '4 min read' },
    image: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=1200&h=800&fit=crop&q=80'
  }
]

// Integration process
const integrationProcess = [
  {
    step: '01',
    title: { vi: 'Khảo sát & Đánh giá', en: 'Discovery & Assessment' },
    description: { vi: 'Phân tích quy trình hiện tại, xác định cơ hội tích hợp AI', en: 'Analyze current workflows and identify AI opportunities' },
    duration: { vi: '1-2 tuần', en: '1-2 weeks' }
  },
  {
    step: '02',
    title: { vi: 'Thiết kế giải pháp', en: 'Solution Design' },
    description: { vi: 'Đề xuất công cụ AI phù hợp, thiết kế workflow mới', en: 'Recommend the right AI tools and design the new workflow' },
    duration: { vi: '1 tuần', en: '1 week' }
  },
  {
    step: '03',
    title: { vi: 'Triển khai & Tích hợp', en: 'Deployment & Integration' },
    description: { vi: 'Setup tools, kết nối API, training team sử dụng', en: 'Set up the tools, connect APIs and train your team' },
    duration: { vi: '2-4 tuần', en: '2-4 weeks' }
  },
  {
    step: '04',
    title: { vi: 'Tối ưu & Scale', en: 'Optimize & Scale' },
    description: { vi: 'Đo lường hiệu quả, fine-tune và mở rộng ứng dụng', en: 'Measure results, fine-tune and expand use cases' },
    duration: { vi: 'Liên tục', en: 'Ongoing' }
  }
]

// Why AI benefits
const whyAIBenefits = [
  {
    icon: Zap,
    title: { vi: 'Tăng tốc độ xử lý', en: 'Faster execution' },
    description: { vi: 'Những việc mất hàng giờ giờ chỉ mất vài phút. Tạo content, phân tích data, thiết kế - tất cả được tăng tốc đáng kể.', en: 'Tasks that took hours now take minutes. Content, data analysis, design — all dramatically accelerated.' }
  },
  {
    icon: TrendingUp,
    title: { vi: 'Nâng cao chất lượng', en: 'Higher quality' },
    description: { vi: 'AI học từ hàng triệu examples, đưa ra output chất lượng cao, nhất quán và có thể cải thiện liên tục.', en: 'AI learns from millions of examples, delivering consistent, high-quality output that keeps improving.' }
  },
  {
    icon: Clock,
    title: { vi: 'Hoạt động 24/7', en: 'Works 24/7' },
    description: { vi: 'AI không nghỉ. Chatbot trả lời khách hàng, hệ thống phân tích data, automation chạy xuyên suốt.', en: 'AI never sleeps. Chatbots answer customers, analytics keep running and automations flow around the clock.' }
  },
  {
    icon: Shield,
    title: { vi: 'Giảm sai sót', en: 'Fewer errors' },
    description: { vi: 'AI xử lý chính xác, không bị ảnh hưởng bởi cảm xúc hay mệt mỏi. Đảm bảo tính nhất quán trong mọi output.', en: 'AI works with precision, unaffected by fatigue or emotion — consistent output every time.' }
  },
  {
    icon: Users,
    title: { vi: 'Cá nhân hóa quy mô lớn', en: 'Personalization at scale' },
    description: { vi: 'Cá nhân hóa trải nghiệm cho từng khách hàng ở quy mô hàng nghìn, hàng triệu người dùng.', en: 'Tailor the experience for every customer — across thousands or millions of users.' }
  },
  {
    icon: Lightbulb,
    title: { vi: 'Insights sâu sắc', en: 'Deep insights' },
    description: { vi: 'AI phát hiện patterns, trends mà con người khó nhận ra. Đưa ra predictions và đề xuất chiến lược.', en: 'AI spots patterns and trends people miss, delivering predictions and strategic recommendations.' }
  }
]

export default function AIIntegrationPage() {
  const { t } = useLanguage()

  return (
    <>
      <MainNav />
      <main>
        {/* Hero Section - Blue theme matching homepage */}
        <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          {/* Blue gradient orbs - matching banner */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-br from-primary/15 to-primary-dark/10 rounded-full blur-2xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full mb-6 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('Công nghệ AI tiên tiến nhất 2026', 'The most advanced AI technology of 2026')}</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                  {t('Tích hợp', 'Integrate')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                    AI
                  </span>{' '}
                  {t('vào Hoạt động Kinh doanh', 'into Your Business Operations')}
                </h1>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {t('AI đang thay đổi cách doanh nghiệp vận hành. ClickStar giúp bạn tích hợp AI vào marketing, content, phân tích dữ liệu - tăng hiệu suất gấp nhiều lần với chi phí tối ưu.', 'AI is transforming how businesses run. ClickStar helps you bring AI into marketing, content and data analysis — multiplying output at an optimized cost.')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    href="#consultation"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 text-white font-semibold px-8 py-4 rounded-full transition-all"
                  >
                    {t('Nhận tư vấn 1-1 miễn phí', 'Get a free 1-on-1 consultation')}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#use-cases"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-secondary text-primary font-medium px-8 py-4 rounded-full transition-all border border-primary/20 shadow-sm"
                  >
                    <Play className="w-5 h-5" />
                    {t('Xem use cases', 'Explore use cases')}
                  </Link>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">40%</p>
                      <p className="text-xs text-muted-foreground">{t('Tăng năng suất', 'Productivity gain')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">500+</p>
                      <p className="text-xs text-muted-foreground">{t('Doanh nghiệp', 'Businesses served')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">4.9/5</p>
                      <p className="text-xs text-muted-foreground">{t('Đánh giá', 'Rating')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - AI Applications Grid */}
              <div className="relative">
                <div className="bg-white/70 backdrop-blur-sm border border-primary/10 rounded-3xl p-6 shadow-xl">
                  <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">AI Applications</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Content', icon: FileText, color: 'from-primary to-primary-dark' },
                      { name: t('Hình ảnh', 'Images'), icon: ImageIcon, color: 'from-accent to-pink-400' },
                      { name: 'Video', icon: Video, color: 'from-red-500 to-orange-400' },
                      { name: t('Dữ liệu', 'Data'), icon: BarChart3, color: 'from-emerald-500 to-teal-400' },
                      { name: 'Chatbot', icon: MessageSquare, color: 'from-violet-500 to-purple-400' },
                      { name: t('Quảng cáo', 'Ads'), icon: Target, color: 'from-amber-500 to-yellow-400' },
                      { name: 'Email', icon: Mail, color: 'from-primary-dark to-primary' },
                      { name: 'CRM', icon: Users, color: 'from-indigo-500 to-blue-400' }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">AI Powered</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">AI Ready</p>
                      <p className="text-[10px] text-muted-foreground">{t('Triển khai nhanh', 'Fast deployment')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {transformationStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-foreground font-medium mt-1">{t(stat.label.vi, stat.label.en)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t(stat.desc.vi, stat.desc.en)}</p>
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
                {t('TẠI SAO CẦN AI', 'WHY AI')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('AI đang thay đổi', 'AI is changing')} <span className="text-primary">{t('cuộc chơi', 'the game')}</span> {t('kinh doanh', 'in business')}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {t('Doanh nghiệp không tích hợp AI sẽ bị tụt hậu. AI không thay thế con người, nhưng người dùng AI sẽ thay thế những người không dùng.', "Businesses that skip AI will fall behind. AI won't replace people — but people who use AI will replace those who don't.")}
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
                  <h3 className="text-lg font-bold text-white mb-2">{t(item.title.vi, item.title.en)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t(item.description.vi, item.description.en)}</p>
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
                {t('Ứng dụng AI', 'AI in action')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('AI có thể làm gì cho doanh nghiệp bạn?', 'What can AI do for your business?')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('ClickStar tích hợp AI vào mọi khía cạnh của hoạt động marketing và kinh doanh', 'ClickStar brings AI into every corner of your marketing and business operations')}
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
                      <p className="text-xs text-muted-foreground">{t(useCase.statsLabel.vi, useCase.statsLabel.en)}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t(useCase.title.vi, useCase.title.en)}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{t(useCase.description.vi, useCase.description.en)}</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full">
                        {t(feature.vi, feature.en)}
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
                {t('HỆ SINH THÁI AI', 'THE AI ECOSYSTEM')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('Công cụ AI', "The world's")} <span className="text-primary">{t('hàng đầu', 'leading')}</span> {t('thế giới', 'AI tools')}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {t('ClickStar làm việc với các nền tảng AI mạnh nhất để mang lại kết quả tối ưu cho doanh nghiệp', 'ClickStar works with the most powerful AI platforms to deliver the best results for your business')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiEcosystem.map((tool, index) => (
                <div key={index} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Real AI Logos */}
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm shrink-0">
                      <Image quality={95}
                        src={tool.logo}
                        alt={tool.name}
                        width={28}
                        height={28}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <p className="text-xs text-gray-400">{tool.provider}</p>
                    </div>
                  </div>
                  <span className="inline-block text-xs bg-primary/20 text-primary px-2 py-0.5 rounded mb-3">
                    {t(tool.category.vi, tool.category.en)}
                  </span>
                  <p className="text-sm text-gray-400 mb-4">{t(tool.description.vi, tool.description.en)}</p>
                  <ul className="space-y-1">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        {t(feature.vi, feature.en)}
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
                {t('Quy trình', 'Our process')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('Quy trình tích hợp AI', 'The AI integration process')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('4 bước đơn giản để đưa AI vào hoạt động kinh doanh của bạn', '4 simple steps to bring AI into your business')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {integrationProcess.map((step, index) => (
                <div key={index} className="relative h-full">
                  <div className="bg-white border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-all">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                    <div className="pt-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">{t(step.title.vi, step.title.en)}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{t(step.description.vi, step.description.en)}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {t(step.duration.vi, step.duration.en)}
                      </span>
                    </div>
                  </div>
                  {index < integrationProcess.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center absolute top-0 -right-5 h-full w-10 z-10 pointer-events-none">
                      <ChevronRight className="w-6 h-6 text-primary/40" />
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
                  {t('TIN TỨC AI', 'AI NEWS')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {t('Bài viết', 'Our')} <span className="text-primary">{t('mới nhất', 'latest')}</span> {t('về AI', 'AI articles')}
                </h2>
              </div>
              <Link 
                href="/blog"
                className="hidden md:inline-flex items-center gap-2 text-white hover:text-primary font-medium"
              >
                {t('Xem tất cả', 'View all')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiArticles.map((article, index) => (
                <article key={index} className="bg-white/5 backdrop-blur rounded-xl overflow-hidden hover:bg-white/10 transition-all group border border-white/10">
                  <div className="relative aspect-video overflow-hidden">
                    <Image quality={95}
                      src={article.image}
                      alt={t(article.title.vi, article.title.en)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-xs bg-white text-primary font-medium px-2 py-1 rounded shadow-sm">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span>{article.date}</span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full" />
                      <span>{t(article.readTime.vi, article.readTime.en)}</span>
                    </div>
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {t(article.title.vi, article.title.en)}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {t(article.excerpt.vi, article.excerpt.en)}
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
                {t('Xem tất cả bài viết', 'View all articles')}
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
              {t('Sẵn sàng bứt phá với AI?', 'Ready to break through with AI?')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('Đừng để đối thủ đi trước. Bắt đầu hành trình chuyển đổi AI ngay hôm nay với sự hỗ trợ từ đội ngũ chuyên gia ClickStar.', "Don't let competitors get ahead. Start your AI transformation today with the support of ClickStar's expert team.")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                {t('Bắt đầu ngay', 'Get started')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white text-foreground font-medium px-8 py-4 rounded-full hover:bg-secondary transition-all border border-border shadow-sm"
              >
                {t('Xem bảng giá', 'View pricing')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
