import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, MessageCircle, Sparkles } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { getSiteSettings } from '@/lib/cms/settings'
import { getServerLang, makeT, pickI18n } from '@/lib/i18n/server'
import { ContactForm } from './_components/contact-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Liên hệ — Click Star Digital',
  description:
    'Liên hệ Click Star Digital để được tư vấn miễn phí các dịch vụ Digital Marketing, Thiết kế Website, AI Integration, CRM/CDP. Gọi 0977 713 428 hoặc gửi yêu cầu qua form.',
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const settings = await getSiteSettings()
  const params = await searchParams
  const lang = await getServerLang()
  const t = makeT(lang)

  const phone = settings?.contact_phone || '0977 713 428'
  const email = settings?.contact_email || 'clickstar.vn@gmail.com'
  const address =
    pickI18n(lang, settings?.address) ||
    t(
      'Tầng 6, Tòa MD Complex (Tòa VP), Số 68 Nguyễn Cơ Thạch, Phường Từ Liêm, TP Hà Nội',
      '6th Floor, MD Complex Building (Office Tower), 68 Nguyen Co Thach, Tu Liem Ward, Hanoi',
    )
  const zaloUrl = settings?.zalo_url || null

  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`
  const emailHref = `mailto:${email}`
  const mapsQuery = encodeURIComponent(address)
  const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed`

  return (
    <div className="min-h-screen">
      <MainNav />

      {/* Hero */}
      <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(27,123,255,0.08),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              {t('Tư vấn miễn phí', 'Free consultation')}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance">
              {t('Để Click Star đồng hành', 'Let Click Star power')}{' '}
              <span className="text-primary">{t('cùng bạn chuyển đổi số', 'your digital transformation')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t(
                'Điền form bên dưới hoặc liên hệ trực tiếp qua hotline, Zalo. Đội ngũ chuyên gia sẽ phản hồi trong vòng 24 giờ làm việc.',
                'Fill in the form below or reach us directly via hotline or Zalo. Our experts will get back to you within 24 business hours.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main content: form + sidebar */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            {/* Form */}
            <div>
              <div className="bg-secondary/30 rounded-2xl p-6 lg:p-10 border border-border/50">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('Gửi yêu cầu tư vấn', 'Request a consultation')}
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  {t(
                    'Càng chi tiết, chúng tôi càng có thể chuẩn bị giải pháp phù hợp nhất.',
                    'The more details you share, the better we can tailor the right solution for you.',
                  )}
                </p>
                <ContactForm defaultService={params.service} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Contact info card */}
              <div className="bg-foreground text-background rounded-2xl p-7">
                <h3 className="text-lg font-bold mb-5">{t('Thông tin liên hệ', 'Contact information')}</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </span>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">Hotline</div>
                      <a href={phoneHref} className="font-semibold hover:text-primary transition-colors">
                        {phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </span>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">Email</div>
                      <a href={emailHref} className="font-semibold hover:text-primary transition-colors break-all">
                        {email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </span>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">{t('Văn phòng', 'Office')}</div>
                      <p className="text-sm leading-relaxed">{address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </span>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">{t('Giờ làm việc', 'Working hours')}</div>
                      <p className="text-sm">{t('Thứ 2 – Thứ 6: 8:30 – 18:00', 'Mon – Fri: 8:30 AM – 6:00 PM')}</p>
                      <p className="text-sm text-white/60">{t('Thứ 7: 8:30 – 12:00', 'Sat: 8:30 AM – 12:00 PM')}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Zalo quick contact — chỉ hiển thị khi admin đã setup URL */}
              {zaloUrl && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-[#0068FF] hover:bg-[#0055d4] text-white font-semibold rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-[#0068FF]/25"
                >
                  <span className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-white/80">{t('Tư vấn nhanh qua', 'Chat with us on')}</div>
                    <div className="text-lg font-bold">Zalo Click Star</div>
                  </div>
                  <span className="text-2xl">→</span>
                </a>
              )}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                <iframe
                  src={mapsEmbed}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('Bản đồ văn phòng Click Star', 'Click Star office map')}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
