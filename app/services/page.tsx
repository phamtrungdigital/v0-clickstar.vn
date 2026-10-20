'use client'

/**
 * Trang tổng hợp dịch vụ — /services
 * Trước đây link "Xem tất cả dịch vụ" ở trang chủ trỏ vào đây nhưng route không
 * tồn tại (404). Trang này vừa vá link hỏng, vừa là nơi liên kết nội bộ tới cả
 * 7 trang dịch vụ.
 */

import Link from '@/components/app-link'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { useLanguage } from '@/contexts/language-context'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema } from '@/lib/seo/schema'

export default function ServicesIndexPage() {
  const { t, language } = useLanguage()

  const services = [
    {
      href: '/services/digital-marketing',
      title: t('Digital Marketing', 'Digital Marketing'),
      desc: t(
        'SEO, Google Ads, Facebook Ads, TikTok Ads và chiến lược đa kênh để tạo dòng khách hàng tiềm năng đều đặn.',
        'SEO, Google Ads, Facebook Ads, TikTok Ads and multi-channel strategy for a steady flow of qualified leads.'
      ),
    },
    {
      href: '/services/website',
      title: t('Thiết kế Website', 'Website Design'),
      desc: t(
        'Website chuẩn SEO, tối ưu tốc độ và tỷ lệ chuyển đổi, từ landing page tới thương mại điện tử.',
        'SEO-ready websites optimised for speed and conversion, from landing pages to e-commerce.'
      ),
    },
    {
      href: '/services/dashboard',
      title: t('Dashboard dữ liệu', 'Data Dashboard'),
      desc: t(
        'Gom dữ liệu rời rạc về một chỗ, báo cáo thời gian thực và theo dõi KPI cho ban lãnh đạo.',
        'Unify scattered data, deliver real-time reporting and KPI tracking for leadership.'
      ),
    },
    {
      href: '/services/ai-integration',
      title: t('Tích hợp AI', 'AI Integration'),
      desc: t(
        'Đưa AI vào quy trình sẵn có: chatbot, phân tích dữ liệu, trợ lý nội bộ cho từng phòng ban.',
        'Bring AI into existing workflows: chatbots, data analysis and internal assistants per department.'
      ),
    },
    {
      href: '/services/automation',
      title: t('AI Automation', 'AI Automation'),
      desc: t(
        'Tự động hoá quy trình lặp lại: chăm sóc lead, email theo hành vi, luồng phê duyệt nội bộ.',
        'Automate repetitive work: lead nurturing, behaviour-based email and internal approval flows.'
      ),
    },
    {
      href: '/services/crm-cdp',
      title: t('CRM & CDP', 'CRM & CDP'),
      desc: t(
        'Quản lý khách hàng tập trung, hợp nhất hồ sơ đa kênh và cá nhân hoá theo hành trình mua hàng.',
        'Centralised customer management, unified cross-channel profiles and journey-based personalisation.'
      ),
    },
    {
      href: '/services/speech-insight-ai',
      title: t('Phân tích cuộc gọi AI', 'AI Call Analytics'),
      desc: t(
        'Call to Text: chuyển 100% cuộc gọi thành văn bản, chấm điểm chất lượng theo kịch bản riêng và tự động điền dữ liệu vào CRM. Không phải đổi tổng đài.',
        'Call to Text: turn 100% of calls into text, score them against your own playbook and auto-fill your CRM. No phone system change required.'
      ),
      badge: t('MỚI', 'NEW'),
    },
    {
      href: '/services/custom-software',
      title: t('Phần mềm theo yêu cầu', 'Custom Software'),
      desc: t(
        'Thiết kế, lập trình và vận hành phần mềm riêng theo nghiệp vụ: bảo mật theo OWASP, môi trường thử tách biệt, bàn giao 100% mã nguồn.',
        'Software designed, built and operated around your workflows: OWASP-grade security, separate staging, 100% of the source code handed over.'
      ),
      badge: t('MỚI', 'NEW'),
    },
  ]

  return (
    <div className="theme-apple">
      <JsonLd data={breadcrumbSchema([{ name: t('Trang chủ', 'Home'), path: '/' }, { name: t('Dịch vụ', 'Services'), path: '/services' }], language)} />
      <MainNav />
      <main>
        {/* Khối sáng: tiêu đề */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h1 className="ap-hero-title">
                {t('Dịch vụ chuyển đổi số', 'Digital growth services')}
              </h1>
              <p className="ap-lead max-w-[760px]">
                {t(
                  '8 dịch vụ, một hệ thống tăng trưởng.',
                  '8 services. One growth system.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Khối xám nhạt: lưới dịch vụ */}
        <section className="ap-tile ap-parchment" style={{ paddingTop: 'clamp(32px, 5vw, 56px)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group bg-white border border-border rounded-[18px] p-6 flex flex-col gap-1.5 h-full min-w-0 text-left transition-colors hover:border-[#1e6dda]"
                >
                  <h2 className="text-[21px] leading-tight font-semibold tracking-[0.01em] text-foreground flex items-center gap-2">
                    {s.title}
                    {s.badge && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#1e6dda] text-white">
                        {s.badge}
                      </span>
                    )}
                  </h2>
                  <p className="text-[17px] leading-[1.47] text-foreground mt-1 flex-1">{s.desc}</p>
                  <span className="ap-link text-[15px] pt-3">{t('Xem chi tiết', 'Learn more')}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Khối tối: kêu gọi hành động */}
        <section className="ap-tile ap-dark">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <h2 className="ap-display">{t('Chưa biết bắt đầu từ đâu?', 'Not sure where to start?')}</h2>
              <p className="ap-lead max-w-[680px]">
                {t(
                  'Kể cho chúng tôi mục tiêu của anh/chị, chúng tôi sẽ đề xuất dịch vụ phù hợp.',
                  'Tell us your goal and we will recommend the right service.'
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href="/contact" className="ap-btn ap-btn-primary">
                  {t('Nhận tư vấn miễn phí', 'Get a free consultation')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
