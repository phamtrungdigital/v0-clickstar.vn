import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import { LanguageProvider, type Language } from '@/contexts/language-context'
import { SiteBrandingProvider, type SiteBranding } from '@/contexts/site-branding-context'
import { TeamMembersProvider } from '@/contexts/team-members-context'
import { getSiteSettings } from '@/lib/cms/settings'
import { getActiveTeamMembers } from '@/lib/cms/team-members'
import { getChatbotSettings, toPublicConfig } from '@/lib/cms/chatbot'
import { ChatbotWidgets } from '@/components/chatbot-widgets'
import { EditModeOverlay } from '@/components/edit-mode-overlay'
import { PersonalizeBanner } from '@/components/personalize-banner'
import { TrackingCode } from '@/components/tracking-scripts'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const favicon = settings?.favicon_url
  const ogImage = settings?.default_og_image
  const siteName = settings?.site_name?.vi || 'ClickStar'

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
    title: `${siteName} - Giải pháp chuyển đổi số toàn diện`,
    description:
      settings?.default_seo_description?.vi ||
      'Digital Marketing, Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, Automation và CRM/CDP cho doanh nghiệp Việt Nam',
    generator: 'v0.app',
    icons,
    openGraph: ogImage ? { images: [ogImage] } : undefined,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('cs-lang')?.value
  const initialLang: Language = langCookie === 'en' ? 'en' : 'vi'

  const [settings, teamMembers, chatbot] = await Promise.all([
    getSiteSettings(),
    getActiveTeamMembers(),
    getChatbotSettings(),
  ])
  const chatbotConfig = toPublicConfig(chatbot)
  const branding: SiteBranding = {
    logoUrl: settings?.logo_url || '/images/logo-clickstar.png',
    faviconUrl: settings?.favicon_url || null,
    siteName: settings?.site_name?.vi || 'ClickStar',
    zaloUrl: settings?.zalo_url || null,
    contactPhone: settings?.contact_phone || null,
    contactEmail: settings?.contact_email || null,
  }

  return (
    <html lang={initialLang} className="bg-background">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {/* Tracking code — vị trí "Header" (đầu body, sát head): GTM, GA4, FB Pixel */}
        <TrackingCode code={settings?.head_code} />
        {/* Tracking code — vị trí "Body" (đầu trang): GTM noscript, chat widget */}
        <TrackingCode code={settings?.body_start_code} />

        <SiteBrandingProvider branding={branding}>
          <TeamMembersProvider members={teamMembers}>
            <LanguageProvider initialLang={initialLang}>
              {children}
              <ChatbotWidgets config={chatbotConfig} />
              <EditModeOverlay />
              <PersonalizeBanner />
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
