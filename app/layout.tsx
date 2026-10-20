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
import { WebContentProvider } from '@/contexts/web-content-context'
import { DeferredWidgets } from '@/components/deferred-widgets'
import { FloatingContact } from '@/components/floating-contact'
import { HtmlRoot } from '@/components/html-root'
import { BodyCode, HeadCode } from '@/components/site-code'
import { getEnabledSnippets } from '@/lib/cms/code-snippets'
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
    // Mã xác minh Google Search Console (thẻ meta google-site-verification trong <head> mọi trang).
    verification: { google: '3XLcxIwkMb0I8ERCa4pzHUBLYVEIXUl0dv15959zpx4' },
    icons,
    openGraph: { siteName: BRAND, locale: 'vi_VN', type: 'website', images: ogImage ? [ogImage] : undefined },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Static-friendly: KHÔNG đọc cookie/header ở layout (sẽ ép mọi trang render động).
  // Ngôn ngữ suy ra từ ĐỊA CHỈ (/en/... là tiếng Anh, còn lại tiếng Việt): HtmlRoot đặt <html lang> và LanguageProvider
  // chọn ngôn ngữ theo đường dẫn, nên cả HTML tĩnh lẫn client đều đúng ngôn ngữ ngay từ đầu.
  const [settings, teamMembers, chatbot, webContent, snippets] = await Promise.all([
    getSiteSettings(),
    getActiveTeamMembers(),
    getChatbotSettings(),
    getWebContent(),
    getEnabledSnippets(),
  ])
  const codeAt = (p: 'head' | 'body_start' | 'body_end') => snippets.filter((s) => s.placement === p)
  const chatbotConfig = toPublicConfig(chatbot)
  const { footer: footerContent, service_ctas: serviceCtas } = normalizeWebContent(webContent)
  const branding: SiteBranding = {
    logoUrl: settings?.logo_url || '/images/logo-clickstar.png',
    faviconUrl: settings?.favicon_url || null,
    siteName: settings?.site_name?.vi || 'Click Star',
    zaloUrl: settings?.zalo_url || null,
    contactPhone: settings?.contact_phone || null,
    contactEmail: settings?.contact_email || null,
  }

  return (
    <HtmlRoot
      htmlClassName="bg-background"
      bodyClassName={`${plusJakarta.variable} ${inter.variable} font-sans antialiased`}
      // Mã tuỳ chỉnh "Đầu trang" (Cài đặt → Mã tuỳ chỉnh) nằm thật sự trong <head>. head_code là ô Header cũ,
      // còn dùng cho khối Google Analytics 4 do mục SEO ghi vào.
      head={<HeadCode items={codeAt('head')} legacy={settings?.head_code} />}
    >
      {/* Mã tuỳ chỉnh "Đầu thân trang": thẻ noscript của GTM, widget chat. body_start_code cũ đã chuyển sang bảng mới. */}
      <BodyCode items={codeAt('body_start')} />

      <SiteBrandingProvider branding={branding}>
        <TeamMembersProvider members={teamMembers}>
          <LanguageProvider>
            <WebContentProvider value={{ footer: footerContent, serviceCtas }}>
              {children}
            </WebContentProvider>
            {/* Chatbot, popup hồ sơ, banner cá nhân hoá, lớp sửa trực quan: tải sau khi trang đã hiện. */}
            <DeferredWidgets chatbot={chatbotConfig} />
            <FloatingContact />
          </LanguageProvider>
        </TeamMembersProvider>
      </SiteBrandingProvider>
      {process.env.NODE_ENV === 'production' && <Analytics />}

      {/* Mã tuỳ chỉnh "Cuối trang": remarketing, công cụ phụ. body_end_code cũ đã chuyển sang bảng mới. */}
      <BodyCode items={codeAt('body_end')} />
    </HtmlRoot>
  )
}
