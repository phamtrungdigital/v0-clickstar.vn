import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import { SiteBrandingProvider, type SiteBranding } from '@/contexts/site-branding-context'
import { TeamMembersProvider } from '@/contexts/team-members-context'
import { getSiteSettings } from '@/lib/cms/settings'
import { getActiveTeamMembers } from '@/lib/cms/team-members'
import { getChatbotSettings, toPublicConfig } from '@/lib/cms/chatbot'
import { getWebContent, normalizeWebContent } from '@/lib/cms/web-content'
import { ChatbotWidgets } from '@/components/chatbot-widgets'
import { WebContentProvider } from '@/contexts/web-content-context'
import { EditModeOverlay } from '@/components/edit-mode-overlay'
import { PersonalizeBanner } from '@/components/personalize-banner'
import { CapabilityPopup } from '@/components/capability-popup'
import { FloatingContact } from '@/components/floating-contact'
import { TrackingCode } from '@/components/tracking-scripts'
import { SITE_URL, BRAND } from '@/lib/seo/site'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

// Inter: phông thay thế SF Pro trên thiết bị không phải Apple (theme-apple của trang chủ).
// Có subset vietnamese để dấu tiếng Việt hiển thị đúng.
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  weight: ['300', '400', '600'],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const favicon = settings?.favicon_url
  const ogImage = settings?.default_og_image

  const icons = favicon
    ? { icon: favicon, apple: favicon }
    : {
        icon: [
          { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
          { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
          { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        apple: '/apple-icon.png',
      }

  return {
    // metadataBase: biến đường dẫn tương đối (canonical, og:url, ảnh) thành địa chỉ tuyệt đối.
    metadataBase: new URL(settings?.site_url || SITE_URL),
    title: `${BRAND} | Chuyển đổi số, Marketing và AI cho doanh nghiệp`,
    description:
      settings?.default_seo_description?.vi ||
      'Digital Marketing, Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, Automation, CRM/CDP, Phân tích cuộc gọi AI (Call to Text) và Phần mềm theo yêu cầu cho doanh nghiệp Việt Nam',
    // Mặc định canonical là chính đường dẫn của trang (bỏ tham số ?utm...). Từng trang có thể đặt canonical riêng.
    alternates: { canonical: './' },
    icons,
    openGraph: { siteName: BRAND, locale: 'vi_VN', type: 'website', images: ogImage ? [ogImage] : undefined },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Static-friendly: KHÔNG đọc cookie ở layout (cookie → ép dynamic toàn site).
  // Ngôn ngữ mặc định lấy từ Cài đặt (site_settings.default_language, hiện là 'vi'). LanguageProvider đọc cookie cs-lang
  // ở client khi mount để đổi sang ngôn ngữ khách đã chọn. Bản HTML Google thấy (không cookie) là ngôn ngữ mặc định.
  const [settings, teamMembers, chatbot, webContent] = await Promise.all([
    getSiteSettings(),
    getActiveTeamMembers(),
    getChatbotSettings(),
    getWebContent(),
  ])
  const defaultLang = settings?.default_language === 'en' ? 'en' : 'vi'
  const chatbotConfig = toPublicConfig(chatbot)
  const { footer: footerContent, service_ctas: serviceCtas } = normalizeWebContent(webContent)
  const branding: SiteBranding = {
    logoUrl: settings?.logo_url || '/images/logo-clickstar.png',
    faviconUrl: settings?.favicon_url || null,
    siteName: settings?.site_name?.vi || 'ClickStar',
    zaloUrl: settings?.zalo_url || null,
    contactPhone: settings?.contact_phone || null,
    contactEmail: settings?.contact_email || null,
  }

  return (
    <html lang={defaultLang} className="bg-background">
      <body className={`${plusJakarta.variable} ${inter.variable} font-sans antialiased`}>
        {/* Tracking code — vị trí "Header" (đầu body, sát head): GTM, GA4, FB Pixel */}
        <TrackingCode code={settings?.head_code} />
        {/* Tracking code — vị trí "Body" (đầu trang): GTM noscript, chat widget */}
        <TrackingCode code={settings?.body_start_code} />

        <SiteBrandingProvider branding={branding}>
          <TeamMembersProvider members={teamMembers}>
            <LanguageProvider initialLang={defaultLang}>
              <WebContentProvider value={{ footer: footerContent, serviceCtas }}>
                {children}
              </WebContentProvider>
              <ChatbotWidgets config={chatbotConfig} />
              <EditModeOverlay />
              <PersonalizeBanner />
              <CapabilityPopup />
              <FloatingContact />
            </LanguageProvider>
          </TeamMembersProvider>
        </SiteBrandingProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}

        {/* Tracking code — vị trí "Footer" (cuối body): script defer, remarketing */}
        <TrackingCode code={settings?.body_end_code} />
      </body>
    </html>
  )
}
