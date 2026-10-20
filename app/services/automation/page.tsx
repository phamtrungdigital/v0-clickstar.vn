"use client"

import { useLanguage } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Eyebrow } from '@/components/ui/eyebrow'
import { ServiceBottom } from '@/components/seo/service-answer'
import { Footer } from '@/components/layout/footer'
import Link from '@/components/app-link'
import Image from 'next/image'
import {
  Sparkles,
  Brain, 
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
  Bell,
  MessageSquare,
  BarChart3,
  Workflow,
  RefreshCcw,
  Settings,
  Database,
  Globe,
  Star,
  Rocket,
  FileText,
  Webhook
} from 'lucide-react'
import { AutomationChecklistIllustration, AutomationWorkflowIllustration } from '@/components/illustrations/service-illustrations'

// Hình hero: thẻ danh sách việc tự động (thay robot hoạt hình)
const RobotSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <AutomationChecklistIllustration className={className} />
)

// Sơ đồ luồng: Kích hoạt, nền tảng Click Star, mô hình AI, Hành động
const AutomationFlowSVG = ({ className = "w-full h-full" }: { className?: string }) => {
  const { t } = useLanguage()
  return (
    <AutomationWorkflowIllustration
      className={`${className} !h-auto max-w-[780px] mx-auto`}
      headers={[t('KÍCH HOẠT', 'TRIGGERS'), t('ĐIỀU PHỐI', 'ORCHESTRATION'), t('MÔ HÌNH AI', 'AI MODELS'), t('HÀNH ĐỘNG', 'ACTIONS')]}
      caption={t('Chạy 24/7, không cần thao tác thủ công', 'Runs 24/7 with no manual steps')}
    />
  )
}

// Automation benefits
const automationBenefits = [
  {
    icon: Clock,
    title: { vi: 'Tiết kiệm 80% thời gian', en: 'Save 80% of your time' },
    description: { vi: 'Tự động hóa các tác vụ lặp đi lặp lại: nhập liệu, gửi email, cập nhật CRM, tạo báo cáo...', en: 'Automate the repetitive work: data entry, emails, CRM updates, reporting and more.' }
  },
  {
    icon: Zap,
    title: { vi: 'Phản hồi tức thì 24/7', en: 'Instant response, 24/7' },
    description: { vi: 'Hệ thống tự động xử lý yêu cầu, chăm sóc khách hàng, gửi thông báo không cần can thiệp.', en: 'The system handles requests, nurtures customers and sends notifications — no manual effort needed.' }
  },
  {
    icon: TrendingUp,
    title: { vi: 'Tận dụng xu hướng AI', en: 'Ride the AI wave' },
    description: { vi: 'Kết hợp sức mạnh của Claude, GPT, và các AI hàng đầu vào quy trình kinh doanh.', en: 'Combine the power of Claude, GPT and other leading AI models right inside your business processes.' }
  },
  {
    icon: Shield,
    title: { vi: 'Giảm thiểu sai sót', en: 'Minimise errors' },
    description: { vi: 'Loại bỏ lỗi do con người, đảm bảo quy trình chạy chính xác và nhất quán.', en: 'Eliminate human error and keep every process accurate and consistent.' }
  },
  {
    icon: RefreshCcw,
    title: { vi: 'Tích hợp đa nền tảng', en: 'Cross-platform integration' },
    description: { vi: 'Kết nối tất cả tools: CRM, Email, Social, Analytics... thành một hệ thống thống nhất.', en: 'Connect every tool — CRM, email, social, analytics — into one unified system.' }
  },
  {
    icon: Database,
    title: { vi: 'Data-driven decisions', en: 'Data-driven decisions' },
    description: { vi: 'Tự động thu thập, phân tích dữ liệu và đưa ra insights, đề xuất hành động.', en: 'Automatically collect and analyse data, surface insights and recommend the next action.' }
  }
]

// Automation use cases
const automationUseCases = [
  {
    icon: MessageSquare,
    title: { vi: 'Chăm sóc khách hàng tự động', en: 'Automated customer care' },
    description: { vi: 'Chatbot AI trả lời 24/7, phân loại ticket, escalate khi cần thiết', en: 'AI chatbot answers 24/7, triages tickets and escalates when needed' },
    flow: [
      { vi: 'Khách hàng nhắn tin', en: 'Customer messages in' },
      { vi: 'AI phân tích intent', en: 'AI detects intent' },
      { vi: 'Trả lời hoặc chuyển đến nhân viên', en: 'Reply or hand off to an agent' },
      { vi: 'Lưu vào CRM', en: 'Log to CRM' }
    ],
    stats: '90%',
    statsLabel: { vi: 'Tự động hóa', en: 'Automated' }
  },
  {
    icon: Bell,
    title: { vi: 'Thông báo & Alerts thông minh', en: 'Smart notifications & alerts' },
    description: { vi: 'Nhận thông báo quan trọng từ mọi nguồn, AI lọc và ưu tiên', en: 'Get the alerts that matter from every source — AI filters and prioritises them' },
    flow: [
      { vi: 'Monitor đa kênh', en: 'Monitor all channels' },
      { vi: 'AI đánh giá mức độ', en: 'AI scores severity' },
      { vi: 'Gửi thông báo phù hợp', en: 'Send the right alert' },
      { vi: 'Đề xuất hành động', en: 'Suggest next steps' }
    ],
    stats: '24/7',
    statsLabel: { vi: 'Giám sát', en: 'Monitoring' }
  },
  {
    icon: FileText,
    title: { vi: 'Content Workflow', en: 'Content Workflow' },
    description: { vi: 'Tự động tạo, review, publish content theo lịch', en: 'Automatically create, review and publish content on schedule' },
    flow: [
      { vi: 'Lên ý tưởng AI', en: 'AI ideation' },
      { vi: 'Viết draft', en: 'Draft writing' },
      { vi: 'Review & edit', en: 'Review & edit' },
      { vi: 'Auto publish', en: 'Auto publish' }
    ],
    stats: '10x',
    statsLabel: { vi: 'Nhanh hơn', en: 'Faster' }
  },
  {
    icon: BarChart3,
    title: { vi: 'Báo cáo & Analytics tự động', en: 'Automated reporting & analytics' },
    description: { vi: 'Thu thập data từ mọi nguồn, AI phân tích và gửi insights', en: 'Collect data from every source — AI analyses it and delivers the insights' },
    flow: [
      { vi: 'Collect data', en: 'Collect data' },
      { vi: 'AI phân tích', en: 'AI analysis' },
      { vi: 'Tạo báo cáo', en: 'Build the report' },
      { vi: 'Gửi định kỳ', en: 'Send on schedule' }
    ],
    stats: '100%',
    statsLabel: { vi: 'Tự động', en: 'Automated' }
  }
]

// Automation tools ecosystem
const automationTools = [
  {
    name: 'Click Star Automation',
    category: 'Workflow Engine',
    description: { vi: 'Nền tảng automation do Click Star tự phát triển, vận hành và bảo trì', en: 'Automation platform built, run and maintained in-house by Click Star' },
    logo: null,
    icon: Workflow,
  },
  {
    name: 'Claude',
    category: 'AI Agent',
    description: { vi: 'Xử lý ngôn ngữ tự nhiên, phân tích sâu', en: 'Natural-language processing and deep analysis' },
    logo: '/images/ai-tools/claude.svg',
    icon: null,
  },
  {
    name: 'GPT-4o',
    category: 'AI Agent',
    description: { vi: 'Sáng tạo content, đa năng', en: 'Creative content, all-round capability' },
    logo: '/images/ai-tools/openai.svg',
    icon: null,
  },
  {
    name: 'Zapier',
    category: 'Integration',
    description: { vi: 'Kết nối 5000+ ứng dụng', en: 'Connects 5,000+ apps' },
    logo: '/images/automation/zapier.svg',
    icon: null,
  },
  {
    name: 'Make',
    category: 'Integration',
    description: { vi: 'Visual automation builder', en: 'Visual automation builder' },
    logo: '/images/automation/make.svg',
    icon: null,
  },
  {
    name: 'Webhook',
    category: 'Trigger',
    description: { vi: 'Real-time event triggers', en: 'Real-time event triggers' },
    logo: null, // không có brand logo nên dùng icon lucide
    icon: Webhook,
  }
]

// Process steps
const automationProcess = [
  {
    step: '01',
    title: { vi: 'Phân tích quy trình', en: 'Process analysis' },
    description: { vi: 'Xác định các tác vụ lặp lại, thủ công có thể tự động hóa', en: 'Identify the repetitive manual tasks ready for automation' },
    duration: { vi: '1 tuần', en: '1 week' }
  },
  {
    step: '02',
    title: { vi: 'Thiết kế workflow', en: 'Workflow design' },
    description: { vi: 'Vẽ sơ đồ automation, chọn tools và AI phù hợp', en: 'Map the automation and pick the right tools and AI' },
    duration: { vi: '1 tuần', en: '1 week' }
  },
  {
    step: '03',
    title: { vi: 'Xây dựng & Kết nối', en: 'Build & Connect' },
    description: { vi: 'Triển khai trên nền tảng Click Star, tích hợp AI, kết nối các nền tảng', en: 'Deploy on the Click Star platform, integrate AI and connect your platforms' },
    duration: { vi: '2-3 tuần', en: '2-3 weeks' }
  },
  {
    step: '04',
    title: { vi: 'Test & Tối ưu', en: 'Test & Optimise' },
    description: { vi: 'Chạy thử, fix bugs, tối ưu performance liên tục', en: 'Trial runs, bug fixes and continuous performance tuning' },
    duration: { vi: 'Liên tục', en: 'Ongoing' }
  }
]

export default function AIAutomationPage() {
  const { t } = useLanguage()

  return (
    <div className="theme-apple">
      <MainNav />
      <main className="[counter-reset:eyebrow]">
        {/* Hero: khối trắng, căn giữa, thẻ danh sách việc tự động làm ảnh sản phẩm */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <Eyebrow numbered={false} className="mb-4">AI Automation 2026</Eyebrow>
              <h1 className="ap-hero-title">AI Automation</h1>
              <p className="ap-lead max-w-[760px]">
                {t('Tự động hóa quy trình với nền tảng Click Star, Claude và GPT.', 'Automate your workflows with the Click Star platform, Claude and GPT.')}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">
                  {t('Tư vấn miễn phí', 'Free consultation')}
                </Link>
                <Link href="#workflow" className="ap-btn ap-btn-ghost">
                  {t('Xem workflow', 'See the workflow')}
                </Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { v: '80%', l: t('Tiết kiệm thời gian', 'Time saved') },
                { v: '24/7', l: t('Hoạt động liên tục', 'Always on') },
                { v: '100+', l: t('Workflows đã triển khai', 'Workflows deployed') },
              ].map((x) => (
                <div key={x.l}>
                  <div className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums text-[#1d1d1f]">{x.v}</div>
                  <div className="mt-1 text-[15px] text-[#515154]">{x.l}</div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-14 max-w-[560px]">
              <RobotSVG className="h-auto w-full" />
            </div>
          </div>
        </section>

        {/* Tại sao cần automation: khối tối */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <Eyebrow dark className="mb-3">
                <Bot className="h-4 w-4" />
                {t('TẠI SAO CẦN AUTOMATION', 'WHY AUTOMATION')}
              </Eyebrow>
              <h2 className="text-3xl font-semibold leading-[1.22] tracking-[-0.005em] text-white sm:text-4xl lg:text-5xl">
                {t('Tự động hóa là', 'Automation is')} <span className="text-[#7db8ff]">{t('xu hướng tất yếu', 'the inevitable next step')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#d2d2d7]">
                {t(
                  'Doanh nghiệp không tự động hóa sẽ lãng phí thời gian vào các tác vụ lặp lại, bỏ lỡ cơ hội tận dụng sức mạnh của công nghệ AI.',
                  "Businesses that don't automate waste time on repetitive work — and miss the chance to harness the power of AI."
                )}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {automationBenefits.map((item, index) => (
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

        {/* Sơ đồ automation: khối xám nhạt */}
        <section id="workflow" className="py-16 lg:py-24 bg-[#f5f5f7] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <Eyebrow className="mb-3">
                <Workflow className="h-4 w-4" />
                Workflow Automation
              </Eyebrow>
              <h2 className="text-3xl font-semibold leading-[1.22] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Sơ đồ Automation với AI', 'The AI automation flow')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#515154]">
                {t('Nền tảng Click Star kết hợp Claude, GPT và các công cụ khác thành một hệ thống tự động hóa hoàn chỉnh', 'The Click Star platform combines Claude, GPT and more into one complete automation system')}
              </p>
            </div>

            <div className="mb-8 overflow-x-auto rounded-[18px] border border-[#d2d2d7] bg-white p-4 sm:p-8">
              <div className="min-w-[560px]">
                <AutomationFlowSVG className="w-full h-auto" />
              </div>
            </div>

            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Globe, title: 'Input Triggers', desc: 'Webhook, Schedule, Events' },
                { icon: Brain, title: 'AI Processing', desc: t('Claude + GPT phân tích', 'Claude + GPT analysis') },
                { icon: Workflow, title: 'Click Star Orchestration', desc: t('Điều phối workflow', 'Workflow orchestration') },
                { icon: Rocket, title: 'Auto Actions', desc: t('Thực thi tự động', 'Automated execution') },
              ].map((item, i) => (
                <div key={i} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#1d1d1f]">{item.title}</h3>
                  <p className="mt-1 text-[15px] text-[#515154]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ứng dụng: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <Eyebrow className="mb-3">
                <Sparkles className="h-4 w-4" />
                Use Cases
              </Eyebrow>
              <h2 className="text-3xl font-semibold leading-[1.22] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Ứng dụng AI Automation', 'AI Automation in action')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#515154]">
                {t('Các trường hợp sử dụng phổ biến của AI Automation trong doanh nghiệp', 'The most common AI automation use cases for business')}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:gap-6">
              {automationUseCases.map((useCase, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda]">
                      <useCase.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-[32px] font-semibold leading-none tracking-[-0.02em] text-[#1859b8]">{useCase.stats}</p>
                      <p className="mt-1 text-[13px] text-[#515154]">{t(useCase.statsLabel.vi, useCase.statsLabel.en)}</p>
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-[#1d1d1f]">{t(useCase.title.vi, useCase.title.en)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{t(useCase.description.vi, useCase.description.en)}</p>

                  <ol className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-2 pt-6">
                    {useCase.flow.map((step, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="rounded-full bg-[#eaf2fd] px-3 py-1 text-[13px] font-medium text-[#1859b8]">{t(step.vi, step.en)}</span>
                        {i < useCase.flow.length - 1 && <ChevronRight className="h-4 w-4 text-[#86868b]" aria-hidden />}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Công nghệ: khối tối */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <Eyebrow dark className="mb-3">
                <Layers className="h-4 w-4" />
                TECH STACK
              </Eyebrow>
              <h2 className="text-3xl font-semibold leading-[1.22] tracking-[-0.005em] text-white sm:text-4xl lg:text-5xl">
                {t('Công nghệ', 'Our')} <span className="text-[#7db8ff]">{t('Automation', 'Automation stack')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#d2d2d7]">
                {t('Bộ công cụ automation và AI hàng đầu được Click Star sử dụng', 'The leading automation and AI toolkit Click Star builds with')}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {automationTools.map((tool, index) => (
                <div key={index} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-white p-2">
                      {tool.logo ? (
                        <Image quality={95} src={tool.logo} alt={tool.name} width={28} height={28} className="h-full w-full object-contain" />
                      ) : tool.icon ? (
                        <tool.icon className="h-6 w-6 text-[#1859b8]" />
                      ) : null}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold leading-tight text-white">{tool.name}</h3>
                      <p className="text-[13px] text-[#d2d2d7]">{tool.category}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#d2d2d7]">{t(tool.description.vi, tool.description.en)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:mb-14">
              <Eyebrow className="mb-3">
                <Settings className="h-4 w-4" />
                {t('Quy trình', 'Our process')}
              </Eyebrow>
              <h2 className="text-3xl font-semibold leading-[1.22] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl lg:text-5xl">
                {t('Triển khai AI Automation', 'Deploying AI Automation')}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#515154]">
                {t('4 bước để xây dựng hệ thống automation cho doanh nghiệp', '4 steps to build your business automation system')}
              </p>
            </div>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
              {automationProcess.map((step, index) => (
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

        <ServiceBottom slug="automation" />

        {/* Kêu gọi hành động: khối tối */}
        <section className="ap-tile ap-dark">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display max-w-[820px]">{t('Sẵn sàng tự động hóa?', 'Ready to automate?')}</h2>
              <p className="ap-lead max-w-[680px]">
                {t(
                  'Để AI và automation làm việc thay bạn. Liên hệ ngay để được tư vấn giải pháp phù hợp với doanh nghiệp.',
                  'Let AI and automation do the work for you. Get in touch for a solution tailored to your business.'
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">{t('Bắt đầu ngay', 'Get started')}</Link>
                <Link href="/services/ai-integration" className="ap-btn ap-btn-ghost">{t('Xem dịch vụ AI', 'Explore AI services')}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
