"use client"

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { AiWorkspaceIllustration } from '@/components/illustrations/ai-service-illustrations'
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
    <div className="theme-apple">
      <MainNav />
      <main>
        {/* Hero: khối trắng, căn giữa, ảnh sản phẩm là cửa sổ làm việc với AI */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <p className="text-sm uppercase tracking-[-0.016em] text-[#515154]">
                {t('Công nghệ AI tiên tiến nhất 2026', 'The most advanced AI technology of 2026')}
              </p>
              <h1 className="ap-hero-title">{t('Tích hợp AI', 'Integrate AI')}</h1>
              <p className="ap-lead max-w-[760px]">
                {t('AI cho marketing, nội dung và phân tích dữ liệu.', 'AI for marketing, content and data analysis.')}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="#consultation" className="ap-btn ap-btn-primary">
                  {t('Nhận tư vấn 1-1 miễn phí', 'Get a free 1-on-1 consultation')}
                </Link>
                <Link href="#use-cases" className="ap-btn ap-btn-ghost">
                  {t('Xem use cases', 'Explore use cases')}
                </Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { v: '40%', l: t('Tăng năng suất', 'Productivity gain') },
                { v: '500+', l: t('Doanh nghiệp', 'Businesses served') },
                { v: '4.9/5', l: t('Đánh giá', 'Rating') },
              ].map((x) => (
                <div key={x.l}>
                  <div className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums text-[#1d1d1f]">{x.v}</div>
                  <div className="mt-1 text-[15px] text-[#515154]">{x.l}</div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-14 max-w-[620px]">
              <AiWorkspaceIllustration t={t} />
            </div>
          </div>
        </section>

        {/* Số liệu chuyển đổi: khối xám nhạt */}
        <section className="py-14 lg:py-16 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {transformationStats.map((stat, index) => (
                <div key={index} className="rounded-[18px] border border-[#d2d2d7] bg-white p-6 text-center">
                  <p className="text-[40px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[#1859b8]">{stat.value}</p>
                  <p className="mt-3 text-[15px] font-semibold leading-snug text-[#1d1d1f]">{t(stat.label.vi, stat.label.en)}</p>
                  <p className="mt-1 text-[13px] leading-snug text-[#515154]">{t(stat.desc.vi, stat.desc.en)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tại sao cần AI: khối tối */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#d2d2d7]">
                <Zap className="h-4 w-4" />
                {t('TẠI SAO CẦN AI', 'WHY AI')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-white sm:text-4xl lg:text-5xl">
                {t('AI đang thay đổi', 'AI is changing')} <span className="text-[#7db8ff]">{t('cuộc chơi', 'the game')}</span> {t('kinh doanh', 'in business')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#d2d2d7]">
                {t(
                  'Doanh nghiệp không tích hợp AI sẽ bị tụt hậu. AI không thay thế con người, nhưng người dùng AI sẽ thay thế những người không dùng.',
                  "Businesses that skip AI will fall behind. AI won't replace people — but people who use AI will replace those who don't."
                )}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {whyAIBenefits.map((item, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-white">{t(item.title.vi, item.title.en)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#d2d2d7]">{t(item.description.vi, item.description.en)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ứng dụng AI: khối trắng */}
        <section id="use-cases" className="py-16 lg:py-24 bg-white scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                <Sparkles className="h-4 w-4" />
                {t('Ứng dụng AI', 'AI in action')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('AI có thể làm gì cho doanh nghiệp bạn?', 'What can AI do for your business?')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#515154]">
                {t('ClickStar tích hợp AI vào mọi khía cạnh của hoạt động marketing và kinh doanh', 'ClickStar brings AI into every corner of your marketing and business operations')}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                      <useCase.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#1859b8]">{useCase.stats}</p>
                      <p className="mt-1 text-[13px] text-[#515154]">{t(useCase.statsLabel.vi, useCase.statsLabel.en)}</p>
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-[#1d1d1f]">{t(useCase.title.vi, useCase.title.en)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{t(useCase.description.vi, useCase.description.en)}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {useCase.features.map((feature, i) => (
                      <span key={i} className="rounded-full bg-[#eaf2fd] px-3 py-1 text-[13px] font-medium text-[#1859b8]">
                        {t(feature.vi, feature.en)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hệ sinh thái AI: khối tối, logo trên ô trắng */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#d2d2d7]">
                <Brain className="h-4 w-4" />
                {t('HỆ SINH THÁI AI', 'THE AI ECOSYSTEM')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-white sm:text-4xl lg:text-5xl">
                {t('Công cụ AI', "The world's")} <span className="text-[#7db8ff]">{t('hàng đầu', 'leading')}</span> {t('thế giới', 'AI tools')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#d2d2d7]">
                {t('ClickStar làm việc với các nền tảng AI mạnh nhất để mang lại kết quả tối ưu cho doanh nghiệp', 'ClickStar works with the most powerful AI platforms to deliver the best results for your business')}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
              {aiEcosystem.map((tool, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-white p-2">
                      <Image quality={95} src={tool.logo} alt={tool.name} width={28} height={28} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold leading-tight text-white">{tool.name}</h3>
                      <p className="text-[13px] text-[#d2d2d7]">{tool.provider}</p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex w-fit rounded-full border border-white/30 px-2.5 py-0.5 text-xs font-medium text-white">
                    {t(tool.category.vi, tool.category.en)}
                  </span>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#d2d2d7]">{t(tool.description.vi, tool.description.en)}</p>
                  <ul className="mt-auto space-y-2 pt-5">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[14px] text-white">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1e6dda]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        </span>
                        {t(feature.vi, feature.en)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                <Layers className="h-4 w-4" />
                {t('Quy trình', 'Our process')}
              </span>
              <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Quy trình tích hợp AI', 'The AI integration process')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#515154]">
                {t('4 bước đơn giản để đưa AI vào hoạt động kinh doanh của bạn', '4 simple steps to bring AI into your business')}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
              {integrationProcess.map((step, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e6dda] text-[15px] font-semibold text-white">{step.step}</span>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-[#1d1d1f]">{t(step.title.vi, step.title.en)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{t(step.description.vi, step.description.en)}</p>
                  <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eaf2fd] px-3 py-1 text-[13px] font-medium text-[#1859b8]">
                    <Clock className="h-3.5 w-3.5" />
                    {t(step.duration.vi, step.duration.en)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bài viết mới: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                  <FileText className="h-4 w-4" />
                  {t('TIN TỨC AI', 'AI NEWS')}
                </span>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl">
                  {t('Bài viết', 'Our')} <span className="text-[#1859b8]">{t('mới nhất', 'latest')}</span> {t('về AI', 'AI articles')}
                </h2>
              </div>
              <Link href="/blog" className="ap-link hidden items-center gap-2 font-semibold md:inline-flex">
                {t('Xem tất cả', 'View all')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
              {aiArticles.map((article, index) => (
                <article key={index} className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d2d2d7] bg-white">
                  <div className="relative aspect-video overflow-hidden">
                    <Image quality={95} src={article.image} alt={t(article.title.vi, article.title.en)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#1859b8]">{article.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2.5 text-[13px] text-[#515154]">
                      <span>{article.date}</span>
                      <span className="h-1 w-1 rounded-full bg-[#86868b]" />
                      <span>{t(article.readTime.vi, article.readTime.en)}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-[17px] font-semibold leading-snug text-[#1d1d1f]">{t(article.title.vi, article.title.en)}</h3>
                    <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-[#515154]">{t(article.excerpt.vi, article.excerpt.en)}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/blog" className="ap-link inline-flex items-center gap-2 font-semibold">
                {t('Xem tất cả bài viết', 'View all articles')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Kêu gọi hành động: khối tối */}
        <section id="consultation" className="ap-tile ap-dark scroll-mt-16">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display max-w-[820px]">{t('Sẵn sàng bứt phá với AI?', 'Ready to break through with AI?')}</h2>
              <p className="ap-lead max-w-[680px]">
                {t(
                  'Đừng để đối thủ đi trước. Bắt đầu hành trình chuyển đổi AI ngay hôm nay với sự hỗ trợ từ đội ngũ chuyên gia ClickStar.',
                  "Don't let competitors get ahead. Start your AI transformation today with the support of ClickStar's expert team."
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">{t('Bắt đầu ngay', 'Get started')}</Link>
                <Link href="/pricing" className="ap-btn ap-btn-ghost">{t('Xem bảng giá', 'View pricing')}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
