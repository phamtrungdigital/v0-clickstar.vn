'use client'

/**
 * Trang tổng hợp dịch vụ — /services
 * Trước đây link "Xem tất cả dịch vụ" ở trang chủ trỏ vào đây nhưng route không
 * tồn tại (404). Trang này vừa vá link hỏng, vừa là nơi liên kết nội bộ tới cả
 * 7 trang dịch vụ.
 */

import Link from 'next/link'
import {
  Megaphone,
  Globe,
  BarChart3,
  Sparkles,
  Workflow,
  Database,
  AudioLines,
  ArrowRight,
} from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { useLanguage } from '@/contexts/language-context'

export default function ServicesIndexPage() {
  const { t } = useLanguage()

  const services = [
    {
      href: '/services/digital-marketing',
      icon: <Megaphone className="w-7 h-7" />,
      title: t('Digital Marketing', 'Digital Marketing'),
      desc: t(
        'SEO, Google Ads, Facebook Ads, TikTok Ads và chiến lược đa kênh để tạo dòng khách hàng tiềm năng đều đặn.',
        'SEO, Google Ads, Facebook Ads, TikTok Ads and multi-channel strategy for a steady flow of qualified leads.'
      ),
      color: 'from-blue-500 to-blue-600',
      soft: 'from-blue-50 to-blue-100 text-blue-600',
    },
    {
      href: '/services/website',
      icon: <Globe className="w-7 h-7" />,
      title: t('Thiết kế Website', 'Website Design'),
      desc: t(
        'Website chuẩn SEO, tối ưu tốc độ và tỷ lệ chuyển đổi, từ landing page tới thương mại điện tử.',
        'SEO-ready websites optimised for speed and conversion, from landing pages to e-commerce.'
      ),
      color: 'from-purple-500 to-purple-600',
      soft: 'from-purple-50 to-purple-100 text-purple-600',
    },
    {
      href: '/services/dashboard',
      icon: <BarChart3 className="w-7 h-7" />,
      title: t('Dashboard dữ liệu', 'Data Dashboard'),
      desc: t(
        'Gom dữ liệu rời rạc về một chỗ, báo cáo thời gian thực và theo dõi KPI cho ban lãnh đạo.',
        'Unify scattered data, deliver real-time reporting and KPI tracking for leadership.'
      ),
      color: 'from-emerald-500 to-emerald-600',
      soft: 'from-emerald-50 to-emerald-100 text-emerald-600',
    },
    {
      href: '/services/ai-integration',
      icon: <Sparkles className="w-7 h-7" />,
      title: t('Tích hợp AI', 'AI Integration'),
      desc: t(
        'Đưa AI vào quy trình sẵn có: chatbot, phân tích dữ liệu, trợ lý nội bộ cho từng phòng ban.',
        'Bring AI into existing workflows: chatbots, data analysis and internal assistants per department.'
      ),
      color: 'from-amber-500 to-amber-600',
      soft: 'from-amber-50 to-amber-100 text-amber-600',
    },
    {
      href: '/services/automation',
      icon: <Workflow className="w-7 h-7" />,
      title: t('AI Automation', 'AI Automation'),
      desc: t(
        'Tự động hoá quy trình lặp lại: chăm sóc lead, email theo hành vi, luồng phê duyệt nội bộ.',
        'Automate repetitive work: lead nurturing, behaviour-based email and internal approval flows.'
      ),
      color: 'from-rose-500 to-rose-600',
      soft: 'from-rose-50 to-rose-100 text-rose-600',
    },
    {
      href: '/services/crm-cdp',
      icon: <Database className="w-7 h-7" />,
      title: t('CRM & CDP', 'CRM & CDP'),
      desc: t(
        'Quản lý khách hàng tập trung, hợp nhất hồ sơ đa kênh và cá nhân hoá theo hành trình mua hàng.',
        'Centralised customer management, unified cross-channel profiles and journey-based personalisation.'
      ),
      color: 'from-indigo-500 to-indigo-600',
      soft: 'from-indigo-50 to-indigo-100 text-indigo-600',
    },
    {
      href: '/services/speech-insight-ai',
      icon: <AudioLines className="w-7 h-7" />,
      title: t('Phân tích cuộc gọi AI', 'AI Call Analytics'),
      desc: t(
        'Bóc băng 100% cuộc gọi, chấm điểm chất lượng theo kịch bản riêng và tự động điền dữ liệu vào CRM. Không phải đổi tổng đài.',
        'Transcribe 100% of calls, score them against your own playbook and auto-fill your CRM. No phone system change required.'
      ),
      color: 'from-cyan-500 to-teal-500',
      soft: 'from-cyan-50 to-teal-100 text-cyan-600',
      badge: t('MỚI', 'NEW'),
    },
  ]

  return (
    <>
      <MainNav />
      <main>
        <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6">
              {t('Giải pháp ', 'Solutions for ')}
              <span className="text-primary">{t('chuyển đổi số toàn diện', 'end-to-end digital growth')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Bảy dịch vụ kết nối thành một hệ thống: thu hút khách hàng, chuyển đổi, quản lý dữ liệu và tối ưu liên tục bằng AI.',
                'Seven services that connect into one system: attract customers, convert them, manage the data and keep optimising with AI.'
              )}
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group relative bg-white rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {s.badge && (
                    <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                      {s.badge}
                    </span>
                  )}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.soft} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    {s.icon}
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{s.title}</h2>
                  <p className="text-muted-foreground text-sm flex-1">{s.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary mt-5 group-hover:gap-3 transition-all">
                    {t('Xem chi tiết', 'Learn more')}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                {t('Nhận tư vấn miễn phí', 'Get a free consultation')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
